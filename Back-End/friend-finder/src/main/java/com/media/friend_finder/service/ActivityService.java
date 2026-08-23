//package com.media.friend_finder.service;
//
//import com.media.friend_finder.dto.ActivityResponse;
//import com.media.friend_finder.entity.*;
//import com.media.friend_finder.repository.CommentRepository;
//import com.media.friend_finder.repository.FriendshipRepository;
//import com.media.friend_finder.repository.PostRepository;
//import com.media.friend_finder.repository.UserActivityRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class ActivityService {
//
//    private final UserActivityRepository activityRepository;
//    private final PostRepository postRepository;
//    private final CommentRepository commentRepository;
//    private final FriendshipRepository friendshipRepository;
//
//
//    // =====================================================
//    // SAVE ACTIVITY
//    // =====================================================
//
//    public void saveActivity(
//            User user,
//            ActivityType type,
//            Long referenceId
//    ) {
//
//        UserActivity activity = new UserActivity();
//
//        activity.setUser(user);
//        activity.setActivityType(type);
//        activity.setReferenceId(referenceId);
//
//        activityRepository.save(activity);
//    }
//
//
//    // =====================================================
//    // GET USER ACTIVITIES
//    // =====================================================
//
//    public List<ActivityResponse> getUserActivities(User user) {
//
//        return activityRepository
//                .findByUserOrderByCreatedAtDesc(user)
//                .stream()
//                .map(activity -> ActivityResponse.builder()
//                        .id(activity.getId())
//                        .activityType(
//                                activity.getActivityType().name()
//                        )
//                        .referenceId(
//                                activity.getReferenceId()
//                        )
//                        .targetName(
//                                resolveTargetName(activity)
//                        )
//                        .createdAt(
//                                activity.getCreatedAt()
//                        )
//                        .build()
//                )
//                .toList();
//    }
//
//
//    // =====================================================
//    // RESOLVE TARGET NAME
//    // =====================================================
//
//    private String resolveTargetName(UserActivity activity) {
//
//        if (activity.getReferenceId() == null) {
//            return null;
//        }
//
//        switch (activity.getActivityType()) {
//
//            // =================================================
//            // POST CREATED
//            // =================================================
//            //
//            // referenceId = Post ID
//            //
//            // لكن صاحب النشاط هو نفسه صاحب البوست،
//            // لذلك لا نحتاج targetName هنا.
//            //
//            case POST_CREATED:
//
//                return null;
//
//
//            // =================================================
//            // COMMENT CREATED
//            // =================================================
//            //
//            // referenceId = Comment ID
//            //
//            // نجيب التعليق
//            // ثم البوست
//            // ثم صاحب البوست
//            //
//            case COMMENT_CREATED:
//
//                return commentRepository
//                        .findById(activity.getReferenceId())
//                        .map(Comment::getPost)
//                        .map(Post::getUser)
//                        .map(this::buildFullName)
//                        .orElse(null);
//
//
//            // =================================================
//            // REACTION ADDED
//            // =================================================
//            //
//            // referenceId = Post ID
//            //
//            // نجيب البوست
//            // ثم صاحب البوست
//            //
//            case REACTION_ADDED:
//
//                return postRepository
//                        .findById(activity.getReferenceId())
//                        .map(Post::getUser)
//                        .map(this::buildFullName)
//                        .orElse(null);
//
//
//            // =================================================
//            // FRIEND ADDED
//            // =================================================
//            //
//            // referenceId = Friendship ID
//            //
//            // نجيب الـ Friendship
//            // ثم نحدد الطرف الآخر
//            //
//            case FRIEND_ADDED:
//
//                return friendshipRepository
//                        .findById(activity.getReferenceId())
//                        .map(friendship -> {
//
//                            User activityUser =
//                                    activity.getUser();
//
//                            User friendUser;
//
//                            if (friendship.getRequester()
//                                    .equals(activityUser)) {
//
//                                friendUser =
//                                        friendship.getAddressee();
//
//                            } else {
//
//                                friendUser =
//                                        friendship.getRequester();
//                            }
//
//                            return buildFullName(friendUser);
//                        })
//                        .orElse(null);
//
//
//            default:
//
//                return null;
//        }
//    }
//
//
//    // =====================================================
//    // BUILD FULL NAME
//    // =====================================================
//
//    private String buildFullName(User user) {
//
//        if (user == null) {
//            return null;
//        }
//
//        /*
//         * User نفسه عندنا مش هو المكان اللي فيه
//         * firstName / lastName.
//         *
//         * الـ Profile هو اللي شايل الاسم.
//         *
//         * لذلك في الوضع الحالي مش هنقدر
//         * نبني الاسم من User مباشرة.
//         */
//
//        return user.getEmail();
//    }
//
//}

package com.media.friend_finder.service;

import com.media.friend_finder.dto.ActivityResponse;
import com.media.friend_finder.entity.*;
import com.media.friend_finder.repository.CommentRepository;
import com.media.friend_finder.repository.FriendshipRepository;
import com.media.friend_finder.repository.PostRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final UserActivityRepository activityRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FriendshipRepository friendshipRepository;
    private final ProfileRepository profileRepository;


    // =====================================================
    // SAVE ACTIVITY
    // =====================================================

    public void saveActivity(
            User user,
            ActivityType type,
            Long referenceId
    ) {

        UserActivity activity = new UserActivity();

        activity.setUser(user);
        activity.setActivityType(type);
        activity.setReferenceId(referenceId);

        activityRepository.save(activity);
    }


    // =====================================================
    // GET USER ACTIVITIES
    // =====================================================

    public List<ActivityResponse> getUserActivities(User user) {

        return activityRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .activityType(
                                activity.getActivityType().name()
                        )
                        .referenceId(
                                activity.getReferenceId()
                        )
                        .targetName(
                                resolveTargetName(activity)
                        )
                        .createdAt(
                                activity.getCreatedAt()
                        )
                        .build()
                )
                .toList();
    }


    // =====================================================
    // RESOLVE TARGET NAME
    // =====================================================

    private String resolveTargetName(UserActivity activity) {

        if (activity.getReferenceId() == null) {
            return null;
        }

        switch (activity.getActivityType()) {

            // =================================================
            // POST CREATED
            // =================================================

            case POST_CREATED:

                return null;


            // =================================================
            // COMMENT CREATED
            // =================================================
            //
            // referenceId = Comment ID
            //
            // Comment
            //   ↓
            // Post
            //   ↓
            // Post Owner
            //   ↓
            // Profile
            //   ↓
            // Name
            //

            case COMMENT_CREATED:

                return commentRepository
                        .findById(activity.getReferenceId())
                        .map(Comment::getPost)
                        .map(Post::getUser)
                        .map(this::getUserDisplayName)
                        .orElse(null);


            // =================================================
            // REACTION ADDED
            // =================================================
            //
            // referenceId = Post ID
            //
            // Post
            //   ↓
            // Post Owner
            //   ↓
            // Profile
            //   ↓
            // Name
            //

            case REACTION_ADDED:

                return postRepository
                        .findById(activity.getReferenceId())
                        .map(Post::getUser)
                        .map(this::getUserDisplayName)
                        .orElse(null);


            // =================================================
            // FRIEND ADDED
            // =================================================
            //
            // referenceId = Friendship ID
            //
            // Friendship
            //   ↓
            // Requester / Addressee
            //   ↓
            // الطرف الآخر
            //   ↓
            // Profile
            //   ↓
            // Name
            //

            case FRIEND_ADDED:

                return friendshipRepository
                        .findById(activity.getReferenceId())
                        .map(friendship -> {

                            User activityUser =
                                    activity.getUser();

                            User friendUser;

                            if (friendship.getRequester()
                                    .equals(activityUser)) {

                                friendUser =
                                        friendship.getAddressee();

                            } else {

                                friendUser =
                                        friendship.getRequester();
                            }

                            return getUserDisplayName(friendUser);
                        })
                        .orElse(null);


            default:

                return null;
        }
    }


    // =====================================================
    // GET USER DISPLAY NAME
    // =====================================================

    private String getUserDisplayName(User user) {

        if (user == null) {
            return null;
        }

        return profileRepository
                .findByUser(user)
                .map(profile -> {

                    String firstName =
                            profile.getFirstName() == null
                                    ? ""
                                    : profile.getFirstName().trim();

                    String lastName =
                            profile.getLastName() == null
                                    ? ""
                                    : profile.getLastName().trim();

                    String fullName =
                            (firstName + " " + lastName).trim();

                    return fullName.isBlank()
                            ? user.getEmail()
                            : fullName;
                })
                .orElse(user.getEmail());
    }

    // =====================================================
// GET RECENT 5 USER ACTIVITIES
// =====================================================

    public List<ActivityResponse> getRecentUserActivities(User user) {

        return activityRepository
                .findTop5ByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(activity -> ActivityResponse.builder()
                        .id(activity.getId())
                        .activityType(
                                activity.getActivityType().name()
                        )
                        .referenceId(
                                activity.getReferenceId()
                        )
                        .targetName(
                                resolveTargetName(activity)
                        )
                        .createdAt(
                                activity.getCreatedAt()
                        )
                        .build()
                )
                .toList();
    }

}
