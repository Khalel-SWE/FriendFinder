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

    private String resolveTargetName(UserActivity activity) {

        if (activity.getReferenceId() == null) {
            return null;
        }

        switch (activity.getActivityType()) {

            case POST_CREATED:

                return null;

            case COMMENT_CREATED:

                return commentRepository
                        .findById(activity.getReferenceId())
                        .map(Comment::getPost)
                        .map(Post::getUser)
                        .map(this::getUserDisplayName)
                        .orElse(null);

            case REACTION_ADDED:

                return postRepository
                        .findById(activity.getReferenceId())
                        .map(Post::getUser)
                        .map(this::getUserDisplayName)
                        .orElse(null);

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
