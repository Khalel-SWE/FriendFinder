package com.media.friend_finder.service;

import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.PublicProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.FriendshipStatus;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.FriendshipRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final ActivityService activityService;


    // =====================================================
    // MY PROFILE
    // =====================================================

    public ProfileResponse getMyProfile(String email) {

        Profile p =
                profileRepository.findByUserEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Profile not found"
                                )
                        );

        return ProfileResponse.builder()
                .id(p.getUser().getId())
                .email(p.getUser().getEmail())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .bio(p.getBio())
                .jobTitle(p.getJobTitle())
                .location(p.getLocation())
                .interests(p.getInterests())
                .languages(p.getLanguages())
                .profilePicture(p.getProfilePicture())
                .coverPhoto(p.getCoverPhoto())
                .createdAt(p.getUser().getCreatedAt())
                .build();
    }


    // =====================================================
    // PUBLIC PROFILE
    // =====================================================

    public PublicProfileResponse getPublicProfile(
            String currentUserEmail,
            Long profileUserId
    ) {

        // -------------------------------------------------
        // CURRENT USER
        // -------------------------------------------------

        User currentUser =
                userRepository.findByEmail(currentUserEmail)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Current user not found"
                                )
                        );


        // -------------------------------------------------
        // TARGET USER
        // -------------------------------------------------

        User profileUser =
                userRepository.findById(profileUserId)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Profile user not found"
                                )
                        );


        // -------------------------------------------------
        // PROFILE
        // -------------------------------------------------

        Profile profile =
                profileRepository.findByUser(profileUser)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Profile not found"
                                )
                        );


        // -------------------------------------------------
        // SELF
        // -------------------------------------------------

        if (currentUser.getId().equals(profileUser.getId())) {

            return PublicProfileResponse.builder()
                    .id(profileUser.getId())
                    .firstName(profile.getFirstName())
                    .lastName(profile.getLastName())
                    .bio(profile.getBio())
                    .jobTitle(profile.getJobTitle())
                    .location(profile.getLocation())
                    .profilePicture(profile.getProfilePicture())
                    .coverPhoto(profile.getCoverPhoto())
                    .interests(profile.getInterests())
                    .languages(profile.getLanguages())
                    .createdAt(profileUser.getCreatedAt())
                    .relationshipStatus("SELF")
                    .pendingRequestId(null)
                    .canViewPosts(true)
                    .recentActivities(
                            activityService
                                    .getRecentUserActivities(profileUser)
                    )
                    .build();
        }


        // -------------------------------------------------
        // FIND RELATIONSHIP
        // -------------------------------------------------

        var friendshipOptional =
                friendshipRepository.findFriendshipBetweenUsers(
                        currentUser,
                        profileUser
                );


        // Default state
        String relationshipStatus = "NONE";

        Long pendingRequestId = null;

        boolean canViewPosts = false;


        if (friendshipOptional.isPresent()) {

            Friendship friendship =
                    friendshipOptional.get();

            String status =
                    friendship.getStatus();


            // =================================================
            // ACCEPTED
            // =================================================

            if (FriendshipStatus.ACCEPTED.name()
                    .equalsIgnoreCase(status)) {

                relationshipStatus = "FRIEND";

                canViewPosts = true;
            }


            // =================================================
            // PENDING
            // =================================================

            else if (FriendshipStatus.PENDING.name()
                    .equalsIgnoreCase(status)) {

                /*
                 * هل الـ target user هو اللي بعت الطلب؟
                 *
                 * currentUser -> profileUser
                 * = OUTGOING
                 *
                 * profileUser -> currentUser
                 * = INCOMING
                 */

                if (friendship.getRequester()
                        .getId()
                        .equals(currentUser.getId())) {

                    relationshipStatus = "OUTGOING_PENDING";

                } else {

                    relationshipStatus = "INCOMING_PENDING";

                    pendingRequestId =
                            friendship.getId();
                }
            }


            // =================================================
            // REJECTED
            // =================================================

            else if (FriendshipStatus.REJECTED.name()
                    .equalsIgnoreCase(status)) {

                /*
                 * REJECTED = no active relationship.
                 *
                 * الشخص يرجع يظهر كـ NONE.
                 */

                relationshipStatus = "NONE";
            }
        }


        // -------------------------------------------------
        // BUILD RESPONSE
        // -------------------------------------------------

        return PublicProfileResponse.builder()
                .id(profileUser.getId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .bio(profile.getBio())
                .jobTitle(profile.getJobTitle())
                .location(profile.getLocation())
                .profilePicture(profile.getProfilePicture())
                .coverPhoto(profile.getCoverPhoto())
                .interests(profile.getInterests())
                .languages(profile.getLanguages())
                .createdAt(profileUser.getCreatedAt())
                .relationshipStatus(relationshipStatus)
                .pendingRequestId(pendingRequestId)
                .canViewPosts(canViewPosts)
                .recentActivities(
                        activityService
                                .getRecentUserActivities(profileUser)
                )
                .build();
    }


    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    public ProfileResponse updateMyProfileWithMedia(
            String email,
            UpdateProfileRequest request,
            MultipartFile avatar,
            MultipartFile cover
    ) {

        Profile profile =
                profileRepository.findByUserEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Profile not found"
                                )
                        );

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setBio(request.getBio());
        profile.setJobTitle(request.getJobTitle());
        profile.setLocation(request.getLocation());
        profile.setInterests(request.getInterests());
        profile.setLanguages(request.getLanguages());


        // -------------------------------------------------
        // MEDIA
        // -------------------------------------------------

        try {

            String uploadDir =
                    "uploads/profiles/";

            File directory =
                    new File(uploadDir);

            if (!directory.exists()) {
                directory.mkdirs();
            }


            // AVATAR

            if (avatar != null && !avatar.isEmpty()) {

                String avatarName =
                        System.currentTimeMillis()
                                + "_"
                                + avatar.getOriginalFilename();

                Path avatarPath =
                        Paths.get(
                                uploadDir + avatarName
                        );

                Files.copy(
                        avatar.getInputStream(),
                        avatarPath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                profile.setProfilePicture(
                        "/uploads/profiles/"
                                + avatarName
                );
            }


            // COVER

            if (cover != null && !cover.isEmpty()) {

                String coverName =
                        System.currentTimeMillis()
                                + "_"
                                + cover.getOriginalFilename();

                Path coverPath =
                        Paths.get(
                                uploadDir + coverName
                        );

                Files.copy(
                        cover.getInputStream(),
                        coverPath,
                        StandardCopyOption.REPLACE_EXISTING
                );

                profile.setCoverPhoto(
                        "/uploads/profiles/"
                                + coverName
                );
            }

        } catch (IOException e) {

            throw new RuntimeException(
                    "Failed to store media files",
                    e
            );
        }


        profileRepository.save(profile);

        return getMyProfile(email);
    }
}