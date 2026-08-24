package com.media.friend_finder.service;

import com.media.friend_finder.dto.NotificationResponse;
import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.Notification;
import com.media.friend_finder.entity.Notification.NotificationType;
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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final FriendshipRepository friendshipRepository;


    // =====================================================
    // CREATE
    // =====================================================

    public void createNotification(
            User user,
            String message,
            NotificationType type,
            Long relatedId
    ) {

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRelatedId(relatedId);

        notificationRepository.save(notification);
    }


    // =====================================================
    // GET NOTIFICATIONS
    // =====================================================

    public List<NotificationResponse> getNotifications(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =====================================================
    // MARK SINGLE
    // =====================================================

    public void markAsRead(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification.getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }


    // =====================================================
    // MARK ALL
    // =====================================================

    @Transactional
    public void markAllAsRead(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"
                                )
                        );

        notificationRepository.markAllAsReadByUser(user);
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteNotification(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (!notification.getUser()
                .getEmail()
                .equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to delete this notification"
            );
        }

        notificationRepository.delete(notification);
    }


    // =====================================================
    // UNREAD COUNT
    // =====================================================

    public long getUnreadCount(String email) {

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
    // MAPPING
    // =====================================================

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        User actor =
                resolveActor(notification);

        String actorName = null;

        String actorProfilePicture = null;

        Long actorId = null;


        if (actor != null) {

            actorId = actor.getId();

            Profile profile =
                    profileRepository
                            .findByUser(actor)
                            .orElse(null);

            if (profile != null) {

                String firstName =
                        profile.getFirstName() == null
                                ? ""
                                : profile.getFirstName().trim();

                String lastName =
                        profile.getLastName() == null
                                ? ""
                                : profile.getLastName().trim();

                actorName =
                        (firstName + " " + lastName).trim();

                actorProfilePicture =
                        profile.getProfilePicture();
            }

            if (actorName == null
                    || actorName.isBlank()) {

                actorName = actor.getEmail();
            }
        }


        return NotificationResponse.builder()

                .id(notification.getId())

                .message(notification.getMessage())

                .type(notification.getType())

                .relatedId(notification.getRelatedId())

                .actorId(actorId)

                .actorName(actorName)

                .actorProfilePicture(
                        actorProfilePicture
                )

                .isRead(notification.isRead())

                .createdAt(notification.getCreatedAt())

                .build();
    }


    // =====================================================
    // ACTOR RESOLUTION
    // =====================================================

    private User resolveActor(
            Notification notification
    ) {

        Long relatedId =
                notification.getRelatedId();

        if (relatedId == null) {
            return null;
        }


        switch (notification.getType()) {

            // =================================================
            // CONTACT MESSAGE
            // =================================================

            case NEW_CONTACT_MESSAGE:

                return contactMessageRepository
                        .findById(relatedId)
                        .map(ContactMessage::getUser)
                        .orElse(null);


            // =================================================
            // ADMIN REPLY
            // =================================================

            case ADMIN_REPLY:

                return userRepository
                        .findByEmail(
                                "admin@friendfinder.com"
                        )
                        .orElse(null);


            // =================================================
            // FRIEND REQUEST
            // =================================================
            //
            // relatedId = Friendship ID
            //
            // actor = requester
            // =================================================

            case FRIEND_REQUEST:

                return friendshipRepository
                        .findById(relatedId)
                        .map(Friendship::getRequester)
                        .orElse(null);


            // =================================================
            // ACCEPT FRIEND REQUEST
            // =================================================
            //
            // relatedId = Friendship ID
            //
            // actor = addressee
            // =================================================

            case ACCEPT_FRIEND_REQUEST:

                return friendshipRepository
                        .findById(relatedId)
                        .map(Friendship::getAddressee)
                        .orElse(null);


            // =================================================
            // LIKE / COMMENT
            // =================================================
            //
            // هنكمل actor resolution بتاعهم
            // لما نعمل notification system الكامل.
            // =================================================

            case LIKE:
            case COMMENT:

                return null;


            default:

                return null;
        }
    }
}