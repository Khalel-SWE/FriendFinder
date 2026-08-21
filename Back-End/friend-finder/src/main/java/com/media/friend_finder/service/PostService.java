package com.media.friend_finder.service;

import com.media.friend_finder.dto.CommentResponse;
import com.media.friend_finder.dto.PostResponse;
import com.media.friend_finder.entity.*;
import com.media.friend_finder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final FriendshipRepository friendshipRepository;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final ActivityService activityService;

    private final String UPLOAD_DIR =
            System.getProperty("user.dir") + "/uploads/posts/";


    public PostResponse createPost(
            String email,
            String content,
            MultipartFile file
    ) throws IOException {

        boolean hasText =
                content != null &&
                        !content.trim().isEmpty();

        boolean hasFile =
                file != null &&
                        !file.isEmpty();

        if (!hasText && !hasFile) {

            throw new RuntimeException(
                    "Post cannot be empty. Please provide text or a media file."
            );

        }


        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        Post post = new Post();

        post.setUser(user);

        post.setContent(content);


        if (hasFile) {

            String contentType =
                    file.getContentType();

            if (
                    contentType == null ||
                            !(
                                    contentType.equals("image/jpeg") ||
                                            contentType.equals("image/png") ||
                                            contentType.equals("image/jpg") ||
                                            contentType.equals("video/mp4")
                            )
            ) {

                throw new RuntimeException(
                        "Invalid file type. Only JPG, PNG, and MP4 are allowed."
                );

            }


            File directory =
                    new File(UPLOAD_DIR);

            if (!directory.exists()) {
                directory.mkdirs();
            }


            String fileName =
                    UUID.randomUUID() +
                            "_" +
                            file.getOriginalFilename();


            Path filePath =
                    Paths.get(
                            UPLOAD_DIR + fileName
                    );


            Files.copy(
                    file.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );


            post.setMediaUrl(
                    "/uploads/posts/" + fileName
            );

            post.setMediaType(
                    contentType.startsWith("video")
                            ? "VIDEO"
                            : "IMAGE"
            );

        }


        postRepository.save(post);


        activityService.saveActivity(
                user,
                ActivityType.POST_CREATED,
                post.getId()
        );


        Profile profile =
                profileRepository
                        .findByUserEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"
                                )
                        );


        return PostResponse.builder()

                .id(post.getId())

                .userEmail(user.getEmail())

                .userFirstName(profile.getFirstName())

                .userLastName(profile.getLastName())

                .profilePicture(
                        profile.getProfilePicture()
                )

                .content(post.getContent())

                .mediaUrl(post.getMediaUrl())

                .mediaType(post.getMediaType())

                .createdAt(post.getCreatedAt())

                .reactionsCount(Map.of())

                .currentUserReaction(null)

                .commentsCount(0)

                .comments(new ArrayList<>())

                .build();
    }


    public List<PostResponse> getFeed(
            String email
    ) {

        User currentUser =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );


        List<User> feedUsers =
                new ArrayList<>();

        feedUsers.add(currentUser);


        List<Friendship> friends =
                friendshipRepository
                        .findAcceptedFriendships(
                                currentUser
                        );


        for (Friendship f : friends) {

            if (
                    f.getRequester()
                            .equals(currentUser)
            ) {

                feedUsers.add(
                        f.getAddressee()
                );

            } else {

                feedUsers.add(
                        f.getRequester()
                );

            }

        }


        List<Post> posts =
                postRepository
                        .findByUserInOrderByCreatedAtDesc(
                                feedUsers
                        );


        if (posts.isEmpty()) {
            return new ArrayList<>();
        }


        /*
         * ==============================
         * Comments
         * ==============================
         */

        List<Comment> allComments =
                commentRepository
                        .findByPostIn(posts);


        /*
         * نجمع كل المستخدمين:
         *
         * أصحاب البوستات
         * +
         * أصحاب التعليقات
         *
         * عشان نجيب صورهم وأسمائهم.
         */

        List<User> usersToFetchProfiles =
                new ArrayList<>(
                        feedUsers
                );


        allComments.forEach(comment -> {

            if (
                    !usersToFetchProfiles
                            .contains(comment.getUser())
            ) {

                usersToFetchProfiles.add(
                        comment.getUser()
                );

            }

        });


        List<Profile> profiles =
                profileRepository
                        .findByUserIn(
                                usersToFetchProfiles
                        );


        Map<String, Profile> profileMap =
                profiles.stream()
                        .collect(
                                Collectors.toMap(
                                        p ->
                                                p.getUser()
                                                        .getEmail(),
                                        p -> p
                                )
                        );


        Map<Long, List<Comment>>
                commentsByPostMap =
                allComments.stream()
                        .collect(
                                Collectors.groupingBy(
                                        c ->
                                                c.getPost()
                                                        .getId()
                                )
                        );


        /*
         * ==============================
         * Reactions
         * ==============================
         */

        List<Reaction> allReactions =
                reactionRepository
                        .findByPostIn(posts);


        Map<Long, Map<String, Integer>>
                reactionsByPostMap =
                allReactions.stream()
                        .collect(
                                Collectors.groupingBy(
                                        r ->
                                                r.getPost()
                                                        .getId(),

                                        Collectors.groupingBy(
                                                r ->
                                                        r.getType()
                                                                .name(),

                                                Collectors.summingInt(
                                                        r -> 1
                                                )
                                        )
                                )
                        );


        List<Reaction>
                currentUserReactions =
                reactionRepository
                        .findByUserAndPostIn(
                                currentUser,
                                posts
                        );


        Map<Long, String>
                currentUserReactionMap =
                currentUserReactions.stream()
                        .collect(
                                Collectors.toMap(
                                        r ->
                                                r.getPost()
                                                        .getId(),

                                        r ->
                                                r.getType()
                                                        .name(),

                                        (existing, replacement) ->
                                                existing
                                )
                        );


        /*
         * ==============================
         * Build Response
         * ==============================
         */

        return posts.stream()

                .map(post -> {

                    Profile profile =
                            profileMap.get(
                                    post.getUser()
                                            .getEmail()
                            );


                    Map<String, Integer>
                            postReactions =
                            reactionsByPostMap
                                    .getOrDefault(
                                            post.getId(),
                                            Map.of()
                                    );


                    String userReactionType =
                            currentUserReactionMap
                                    .get(post.getId());


                    List<Comment>
                            postComments =
                            commentsByPostMap
                                    .getOrDefault(
                                            post.getId(),
                                            new ArrayList<>()
                                    );


                    List<CommentResponse>
                            mappedComments =
                            postComments.stream()
                                    .map(comment -> {

                                        Profile commentProfile =
                                                profileMap.get(
                                                        comment.getUser()
                                                                .getEmail()
                                                );


                                        CommentResponse dto =
                                                new CommentResponse();

                                        dto.setId(
                                                comment.getId()
                                        );

                                        dto.setContent(
                                                comment.getContent()
                                        );

                                        dto.setUserEmail(
                                                comment.getUser()
                                                        .getEmail()
                                        );

                                        dto.setUserFirstName(
                                                commentProfile != null
                                                        ? commentProfile.getFirstName()
                                                        : "User"
                                        );

                                        dto.setUserLastName(
                                                commentProfile != null
                                                        ? commentProfile.getLastName()
                                                        : ""
                                        );

                                        dto.setProfilePictureUrl(
                                                commentProfile != null
                                                        ? commentProfile.getProfilePicture()
                                                        : null
                                        );

                                        dto.setCreatedAt(
                                                comment.getCreatedAt()
                                        );

                                        dto.setUpdatedAt(
                                                comment.getUpdatedAt()
                                        );

                                        return dto;

                                    })
                                    .toList();


                    return PostResponse.builder()

                            .id(post.getId())

                            .userEmail(
                                    post.getUser()
                                            .getEmail()
                            )

                            .userFirstName(
                                    profile.getFirstName()
                            )

                            .userLastName(
                                    profile.getLastName()
                            )

                            .profilePicture(
                                    profile.getProfilePicture()
                            )

                            .content(
                                    post.getContent()
                            )

                            .mediaUrl(
                                    post.getMediaUrl()
                            )

                            .mediaType(
                                    post.getMediaType()
                            )

                            .createdAt(
                                    post.getCreatedAt()
                            )

                            .reactionsCount(
                                    postReactions
                            )

                            .currentUserReaction(
                                    userReactionType
                            )

                            .commentsCount(
                                    mappedComments.size()
                            )

                            .comments(
                                    mappedComments
                            )

                            .build();

                })

                .toList();

    }


    public List<PostResponse> getUserPosts(
            Long targetUserId,
            String currentUserEmail
    ) {

        User currentUser =
                userRepository
                        .findByEmail(currentUserEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current user not found"
                                )
                        );


        List<Post> posts =
                postRepository
                        .findByUserIdOrderByCreatedAtDesc(
                                targetUserId
                        );


        if (posts.isEmpty()) {
            return new ArrayList<>();
        }


        User targetUser =
                userRepository
                        .findById(targetUserId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Target user not found"
                                )
                        );


        Profile targetProfile =
                profileRepository
                        .findByUserEmail(
                                targetUser.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"
                                )
                        );


        List<Comment> allComments =
                commentRepository
                        .findByPostIn(posts);


        List<Reaction> allReactions =
                reactionRepository
                        .findByPostIn(posts);


        Map<Long, List<Comment>>
                commentsByPostMap =
                allComments.stream()
                        .collect(
                                Collectors.groupingBy(
                                        c ->
                                                c.getPost()
                                                        .getId()
                                )
                        );


        Map<Long, Map<String, Integer>>
                reactionsByPostMap =
                allReactions.stream()
                        .collect(
                                Collectors.groupingBy(
                                        r ->
                                                r.getPost()
                                                        .getId(),

                                        Collectors.groupingBy(
                                                r ->
                                                        r.getType()
                                                                .name(),

                                                Collectors.summingInt(
                                                        r -> 1
                                                )
                                        )
                                )
                        );


        List<Reaction>
                currentUserReactions =
                reactionRepository
                        .findByUserAndPostIn(
                                currentUser,
                                posts
                        );


        Map<Long, String>
                currentUserReactionMap =
                currentUserReactions.stream()
                        .collect(
                                Collectors.toMap(
                                        r ->
                                                r.getPost()
                                                        .getId(),

                                        r ->
                                                r.getType()
                                                        .name(),

                                        (existing, replacement) ->
                                                existing
                                )
                        );


        List<User> usersToFetchProfiles =
                new ArrayList<>();

        usersToFetchProfiles.add(
                targetUser
        );


        allComments.forEach(comment -> {

            if (
                    !usersToFetchProfiles
                            .contains(comment.getUser())
            ) {

                usersToFetchProfiles.add(
                        comment.getUser()
                );

            }

        });


        List<Profile> profiles =
                profileRepository
                        .findByUserIn(
                                usersToFetchProfiles
                        );


        Map<String, Profile> profileMap =
                profiles.stream()
                        .collect(
                                Collectors.toMap(
                                        p ->
                                                p.getUser()
                                                        .getEmail(),
                                        p -> p
                                )
                        );


        return posts.stream()

                .map(post -> {

                    Map<String, Integer>
                            postReactions =
                            reactionsByPostMap
                                    .getOrDefault(
                                            post.getId(),
                                            Map.of()
                                    );


                    String userReactionType =
                            currentUserReactionMap
                                    .get(post.getId());


                    List<Comment>
                            postComments =
                            commentsByPostMap
                                    .getOrDefault(
                                            post.getId(),
                                            new ArrayList<>()
                                    );


                    List<CommentResponse>
                            mappedComments =
                            postComments.stream()
                                    .map(comment -> {

                                        Profile commentProfile =
                                                profileMap.get(
                                                        comment.getUser()
                                                                .getEmail()
                                                );


                                        CommentResponse dto =
                                                new CommentResponse();

                                        dto.setId(
                                                comment.getId()
                                        );

                                        dto.setContent(
                                                comment.getContent()
                                        );

                                        dto.setUserEmail(
                                                comment.getUser()
                                                        .getEmail()
                                        );

                                        dto.setUserFirstName(
                                                commentProfile != null
                                                        ? commentProfile.getFirstName()
                                                        : "User"
                                        );

                                        dto.setUserLastName(
                                                commentProfile != null
                                                        ? commentProfile.getLastName()
                                                        : ""
                                        );

                                        dto.setProfilePictureUrl(
                                                commentProfile != null
                                                        ? commentProfile.getProfilePicture()
                                                        : null
                                        );

                                        dto.setCreatedAt(
                                                comment.getCreatedAt()
                                        );

                                        dto.setUpdatedAt(
                                                comment.getUpdatedAt()
                                        );

                                        return dto;

                                    })
                                    .toList();


                    return PostResponse.builder()

                            .id(post.getId())

                            .userEmail(
                                    targetUser.getEmail()
                            )

                            .userFirstName(
                                    targetProfile.getFirstName()
                            )

                            .userLastName(
                                    targetProfile.getLastName()
                            )

                            .profilePicture(
                                    targetProfile.getProfilePicture()
                            )

                            .content(
                                    post.getContent()
                            )

                            .mediaUrl(
                                    post.getMediaUrl()
                            )

                            .mediaType(
                                    post.getMediaType()
                            )

                            .createdAt(
                                    post.getCreatedAt()
                            )

                            .reactionsCount(
                                    postReactions
                            )

                            .currentUserReaction(
                                    userReactionType
                            )

                            .commentsCount(
                                    mappedComments.size()
                            )

                            .comments(
                                    mappedComments
                            )

                            .build();

                })

                .toList();

    }

}