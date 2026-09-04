package com.media.friend_finder.service;

import com.media.friend_finder.dto.CommentResponse;
import com.media.friend_finder.entity.*;
import com.media.friend_finder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionService {

    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final ProfileRepository profileRepository;
    private final NotificationService notificationService;
    private final ActivityService activityService;

    public CommentResponse addComment(String email, Long postId, String content) {
        validateContent(content);

        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        checkPrivacy(user, post.getUser());

        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(content);
        comment = commentRepository.save(comment);

        activityService.saveActivity(
                user,
                ActivityType.COMMENT_CREATED,
                comment.getId()
        );

        Profile profile = profileRepository.findByUserEmail(email).orElseThrow();

        if (!user.equals(post.getUser())) {
            notificationService.createNotification(
                    post.getUser(),
                    profile.getFirstName() + " commented on your post",
                    Notification.NotificationType.COMMENT,
                    post.getId(),
                    user
            );
        }

        return mapToCommentResponse(comment, profile);
    }

    public void deleteComment(String email, Long commentId) {
        Comment comment = commentRepository.findById(commentId).orElseThrow();
        User user = userRepository.findByEmail(email).orElseThrow();

        if (comment.getUser().equals(user) || comment.getPost().getUser().equals(user)) {
            commentRepository.delete(comment);
        } else {
            throw new RuntimeException("Unauthorized: Cannot delete this comment");
        }
    }

    public CommentResponse updateComment(String email, Long commentId, String newContent) {
        validateContent(newContent);

        Comment comment = commentRepository.findById(commentId).orElseThrow();
        if (!comment.getUser().getEmail().equals(email)) throw new RuntimeException("Unauthorized");
        if (comment.getCreatedAt().isBefore(LocalDateTime.now().minusHours(24))) {
            throw new RuntimeException("Cannot edit comment after 24 hours");
        }

        comment.setContent(newContent);
        comment = commentRepository.save(comment);

        Profile profile = profileRepository.findByUserEmail(email).orElseThrow();
        return mapToCommentResponse(comment, profile);
    }

    public void reactToPost(String email, Long postId, ReactionType type) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Post post = postRepository.findById(postId).orElseThrow();
        checkPrivacy(user, post.getUser());

        Optional<Reaction> existingReaction = reactionRepository.findByPostAndUser(post, user);

        if (existingReaction.isPresent()) {
            if (existingReaction.get().getType() == type) {
                reactionRepository.delete(existingReaction.get());
            } else {
                existingReaction.get().setType(type);
                reactionRepository.save(existingReaction.get());
            }
        } else {
            Reaction newReaction = new Reaction();
            newReaction.setPost(post);
            newReaction.setUser(user);
            newReaction.setType(type);
            reactionRepository.save(newReaction);

            activityService.saveActivity(
                    user,
                    ActivityType.REACTION_ADDED,
                    post.getId()
            );

            if (!user.equals(post.getUser())) {

                notificationService.createNotification(
                        post.getUser(),
                        user.getEmail() + " reacted to your post",
                        Notification.NotificationType.LIKE,
                        post.getId(),
                        user
                );
            }
        }
    }

    public List<CommentResponse> getComments(Long postId) {
        List<Comment> comments = commentRepository.findByPostIdWithUser(postId);

        List<User> users = comments.stream().map(Comment::getUser).distinct().collect(Collectors.toList());

        List<Profile> profiles = profileRepository.findByUserIn(users);
        Map<String, Profile> profileMap = profiles.stream()
                .collect(Collectors.toMap(p -> p.getUser().getEmail(), p -> p));

        return comments.stream()
                .map(comment -> mapToCommentResponse(comment, profileMap.get(comment.getUser().getEmail())))
                .collect(Collectors.toList());
    }

    private void checkPrivacy(User viewer, User owner) {
        if (!viewer.equals(owner)) {
            boolean isFriend = friendshipRepository.findFriendshipBetweenUsers(viewer, owner).isPresent();
            if (!isFriend) throw new RuntimeException("Access Denied: You are not friends with this user");
        }
    }

    private void validateContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            throw new RuntimeException("Comment content cannot be empty");
        }
    }

    private CommentResponse mapToCommentResponse(Comment comment, Profile profile) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userEmail(comment.getUser().getEmail())
                .userFirstName(profile != null ? profile.getFirstName() : null)
                .userLastName(profile != null ? profile.getLastName() : null)
                .profilePictureUrl(profile != null ? profile.getProfilePicture() : null)
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}