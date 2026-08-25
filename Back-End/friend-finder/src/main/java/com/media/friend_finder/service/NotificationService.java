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
         * Therefore:
         *
         * USER -> ADMIN notification
         * can have USER as actor.
         *
         * ADMIN -> USER notification
         * keeps actorId null.
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
        // 2. FALLBACK FOR OLD NOTIFICATIONS
        // =================================================

        if (actor == null) {

            actor =
                    resolveLegacyActor(notification);

            if (actor != null
                    && "ADMIN".equalsIgnoreCase(
                    actor.getRole()
            )) {

                actor = null;
            }

            if (actor != null) {

                actorId =
                        actor.getId();
            }
        }


        // =================================================
        // 3. ACTOR DATA
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

        if (relatedId == null) {
            return null;
        }


        switch (notification.getType()) {

            // =================================================
            // FRIEND REQUEST
            // =================================================

            case FRIEND_REQUEST:

                return friendshipRepository
                        .findById(relatedId)
                        .map(Friendship::getRequester)
                        .orElse(null);


            // =================================================
            // ACCEPT FRIEND REQUEST
            // =================================================

            case ACCEPT_FRIEND_REQUEST:

                return friendshipRepository
                        .findById(relatedId)
                        .map(Friendship::getAddressee)
                        .orElse(null);


            // =================================================
            // ADMIN REPLY
            // =================================================

            case ADMIN_REPLY:

                /*
                 * Admin is intentionally NOT exposed
                 * as a social actor.
                 */
                return null;


            // =================================================
            // CONTACT
            // =================================================

            case NEW_CONTACT_MESSAGE:

                return contactMessageRepository
                        .findById(relatedId)
                        .map(ContactMessage::getUser)
                        .orElse(null);


            // =================================================
            // LIKE / COMMENT
            // =================================================

            case LIKE:
            case COMMENT:

                /*
                 * Old notifications store the post ID
                 * in relatedId.
                 *
                 * The old message contains the actor email,
                 * for example:
                 *
                 * "foo@test.com reacted to your post"
                 *
                 * "foo@test.com commented on your post"
                 *
                 * Therefore we can recover the actor
                 * from that email.
                 */
                return resolveActorFromLegacyMessage(
                        notification.getMessage()
                );


            default:

                return null;
        }
    }


    // =====================================================
    // RESOLVE LEGACY ACTOR FROM MESSAGE
    // =====================================================

    private User resolveActorFromLegacyMessage(
            String message
    ) {

        if (message == null
                || message.isBlank()) {

            return null;
        }

        String email =
                message
                        .replace(
                                " reacted to your post",
                                ""
                        )
                        .replace(
                                " commented on your post",
                                ""
                        )
                        .trim();

        if (email.isBlank()
                || !email.contains("@")) {

            return null;
        }

        return userRepository
                .findByEmail(email)
                .orElse(null);
    }
}