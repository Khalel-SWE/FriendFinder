package com.media.friend_finder.service;

import com.media.friend_finder.dto.NotificationResponse;
import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.Notification;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ContactMessageRepository;
import com.media.friend_finder.repository.FriendshipRepository;
import com.media.friend_finder.repository.NotificationRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final FriendshipRepository friendshipRepository;


    // =====================================================
    // CREATE NOTIFICATION
    // =====================================================

    public void createNotification(
            User user,
            String message,
            Notification.NotificationType type,
            Long relatedId
    ) {

        createNotification(
                user,
                message,
                type,
                relatedId,
                null
        );
    }


    // =====================================================
    // CREATE NOTIFICATION WITH ACTOR
    // =====================================================

    public void createNotification(
            User user,
            String message,
            Notification.NotificationType type,
            Long relatedId,
            User actor
    ) {

        Notification notification =
                new Notification();

        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedId(relatedId);

        /*
         * Admin is not a social actor.
         *
         * Therefore Admin notifications keep actorId = null.
         */
        if (actor != null
                && !"ADMIN".equalsIgnoreCase(actor.getRole())) {

            notification.setActorId(
                    actor.getId()
            );
        }

        notificationRepository.save(
                notification
        );
    }


    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    public List<NotificationResponse> getNotifications(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // MARK SINGLE
    // =====================================================

    public void markAsRead(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(
                notification
        );
    }


    // =====================================================
    // MARK ALL
    // =====================================================

    @Transactional
    public void markAllAsRead(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        notificationRepository
                .markAllAsReadByUser(user);
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteNotification(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository
                        .findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification
                .getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to delete this notification"
            );
        }

        notificationRepository.delete(
                notification
        );
    }


    // =====================================================
    // UNREAD COUNT
    // =====================================================

    public long getUnreadCount(
            String email
    ) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        return notificationRepository
                .countByUserAndIsReadFalse(user);
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        User actor = null;

        Long actorId =
                notification.getActorId();


        // =================================================
        // 1. NEW NOTIFICATIONS
        // =================================================

        if (actorId != null) {

            actor =
                    userRepository
                            .findById(actorId)
                            .orElse(null);

            if (actor != null
                    && "ADMIN".equalsIgnoreCase(
                    actor.getRole()
            )) {

                actor = null;
                actorId = null;
            }
        }


        // =================================================
        // 2. OLD NOTIFICATIONS
        // =================================================

        if (actor == null) {

            actor =
                    resolveLegacyActor(
                            notification
                    );

            if (actor != null
                    && "ADMIN".equalsIgnoreCase(
                    actor.getRole()
            )) {

                actor = null;
            }

            if (actor != null) {
                actorId = actor.getId();
            }
        }


        // =================================================
        // 3. ACTOR DISPLAY DATA
        // =================================================

        String actorName = null;

        String actorProfilePicture = null;


        if (actor != null) {

            Profile profile =
                    profileRepository
                            .findByUser(actor)
                            .orElse(null);

            if (profile != null) {

                String firstName =
                        profile.getFirstName() == null
                                ? ""
                                : profile
                                .getFirstName()
                                .trim();

                String lastName =
                        profile.getLastName() == null
                                ? ""
                                : profile
                                .getLastName()
                                .trim();

                actorName =
                        (firstName + " "
                                + lastName)
                                .trim();

                actorProfilePicture =
                        profile.getProfilePicture();
            }

            if (actorName == null
                    || actorName.isBlank()) {

                actorName =
                        actor.getEmail();
            }
        }


        // =================================================
        // 4. BUILD RESPONSE
        // =================================================

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .relatedId(
                        notification.getRelatedId()
                )
                .actorId(actorId)
                .actorName(actorName)
                .actorProfilePicture(
                        actorProfilePicture
                )
                .isRead(
                        notification.isRead()
                )
                .createdAt(
                        notification.getCreatedAt()
                )
                .build();
    }


    // =====================================================
    // LEGACY ACTOR RESOLUTION
    // =====================================================

    private User resolveLegacyActor(
            Notification notification
    ) {

        Long relatedId =
                notification.getRelatedId();


        // =================================================
        // FRIEND REQUEST
        // =================================================

        if (notification.getType()
                == Notification.NotificationType.FRIEND_REQUEST) {

            /*
             * First try the friendship record.
             */
            if (relatedId != null) {

                User actor =
                        friendshipRepository
                                .findById(relatedId)
                                .map(Friendship::getRequester)
                                .orElse(null);

                if (actor != null) {
                    return actor;
                }
            }

            /*
             * If the old friendship was deleted,
             * recover actor from the notification message.
             */
            return resolveActorFromMessage(
                    notification.getMessage()
            );
        }


        // =================================================
        // ACCEPT FRIEND REQUEST
        // =================================================

        if (notification.getType()
                == Notification.NotificationType.ACCEPT_FRIEND_REQUEST) {

            /*
             * First try the friendship record.
             */
            if (relatedId != null) {

                User actor =
                        friendshipRepository
                                .findById(relatedId)
                                .map(Friendship::getAddressee)
                                .orElse(null);

                if (actor != null) {
                    return actor;
                }
            }

            /*
             * If the friendship was later deleted,
             * recover actor from message.
             */
            return resolveActorFromMessage(
                    notification.getMessage()
            );
        }


        // =================================================
        // CONTACT MESSAGE
        // =================================================

        if (notification.getType()
                == Notification.NotificationType.NEW_CONTACT_MESSAGE) {

            if (relatedId == null) {
                return null;
            }

            return contactMessageRepository
                    .findById(relatedId)
                    .map(ContactMessage::getUser)
                    .orElse(null);
        }


        // =================================================
        // ADMIN REPLY
        // =================================================

        if (notification.getType()
                == Notification.NotificationType.ADMIN_REPLY) {

            /*
             * Admin is intentionally not exposed
             * as a social actor.
             */
            return null;
        }


        // =================================================
        // LIKE / COMMENT
        // =================================================

        if (notification.getType()
                == Notification.NotificationType.LIKE
                ||
                notification.getType()
                        == Notification.NotificationType.COMMENT) {

            return resolveActorFromMessage(
                    notification.getMessage()
            );
        }


        return null;
    }


    // =====================================================
    // RESOLVE ACTOR FROM OLD MESSAGE
    // =====================================================

    private User resolveActorFromMessage(
            String message
    ) {

        if (message == null
                || message.isBlank()) {

            return null;
        }

        /*
         * Old notification examples:
         *
         * "dunia@gmail.com sent you a friend request"
         * "dada@test.com accepted your friend request"
         * "dada@test.com reacted to your post"
         * "dada@test.com commented on your post"
         */

        String email =
                message.trim();


        // Friend request
        email = email.replace(
                " sent you a friend request",
                ""
        );


        // Friend accepted
        email = email.replace(
                " accepted your friend request",
                ""
        );


        // Like
        email = email.replace(
                " reacted to your post",
                ""
        );


        // Comment
        email = email.replace(
                " commented on your post",
                ""
        );


        // Contact message
        email = email.replace(
                " sent a contact message",
                ""
        );


        email = email.trim();


        if (!email.contains("@")) {
            return null;
        }


        return userRepository
                .findByEmail(email)
                .orElse(null);
    }
}