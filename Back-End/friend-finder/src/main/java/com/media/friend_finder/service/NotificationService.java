//package com.media.friend_finder.service;
//
//import com.media.friend_finder.dto.NotificationResponse;
//import com.media.friend_finder.entity.Notification;
//import com.media.friend_finder.entity.Notification.NotificationType;
//import com.media.friend_finder.entity.User;
//import com.media.friend_finder.repository.NotificationRepository;
//import com.media.friend_finder.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class NotificationService {
//
//    private final NotificationRepository notificationRepository;
//    private final UserRepository userRepository;
//
//    // 1. دالة إنشاء الإشعار (اتعدلت عشان تاخد Enum بدل String)
//    public void createNotification(User user, String message, NotificationType type, Long relatedId) {
//        Notification notification = new Notification();
//        notification.setUser(user);
//        notification.setMessage(message);
//        notification.setType(type); // الإيرور هيختفي من هنا
//        notification.setRelatedId(relatedId);
//        notificationRepository.save(notification);
//    }
//
//    // 2. Get Notifications
//    public List<NotificationResponse> getNotifications(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
//                .stream()
//                .map(this::mapToResponse)
//                .collect(Collectors.toList());
//    }
//
//    // 3. Mark As Read (Single)
//    public void markAsRead(String email, Long notificationId) {
//        Notification notification = notificationRepository.findById(notificationId)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        // التأكد إن الإشعار يخص اليوزر ده
//        if (notification.getUser().getEmail().equals(email)) {
//            notification.setRead(true);
//            notificationRepository.save(notification);
//        } else {
//            throw new RuntimeException("Unauthorized to update this notification");
//        }
//    }
//
//    // 4. Mark All As Read (The Optimized Way)
//    @Transactional // لازم نحط دي عشان بننفذ Custom Update Query في الداتا بيز
//    public void markAllAsRead(String email) {
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        // سطر واحد بس صاروخي بدل ما كنا بنجيب الداتا كلها ونعملها فلتر لوب!
//        notificationRepository.markAllAsReadByUser(user);
//    }
//
//    // 5. Delete Notification
//    public void deleteNotification(String email, Long notificationId) {
//        Notification notification = notificationRepository.findById(notificationId)
//                .orElseThrow(() -> new RuntimeException("Notification not found"));
//
//        if (notification.getUser().getEmail().equals(email)) {
//            notificationRepository.delete(notification);
//        } else {
//            throw new RuntimeException("Unauthorized to delete this notification");
//        }
//    }
//
//    // 6. جلب عدد الإشعارات غير المقروءة
//    public long getUnreadCount(String email) {
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//        return notificationRepository.countByUserAndIsReadFalse(user);
//    }
//
//    // Mappers
//    private NotificationResponse mapToResponse(Notification notification) {
//        return NotificationResponse.builder()
//                .id(notification.getId())
//                .message(notification.getMessage())
//                .type(notification.getType())
//                .relatedId(notification.getRelatedId())
//                .isRead(notification.isRead())
//                .createdAt(notification.getCreatedAt())
//                .build();
//    }
//}

package com.media.friend_finder.service;

import com.media.friend_finder.dto.NotificationResponse;
import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.Notification;
import com.media.friend_finder.entity.Notification.NotificationType;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ContactMessageRepository;
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


    // ================= CREATE =================

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


    // ================= GET =================

    public List<NotificationResponse> getNotifications(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        return notificationRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // ================= MARK SINGLE =================

    public void markAsRead(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found")
                        );

        if (!notification.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }


    // ================= MARK ALL =================

    @Transactional
    public void markAllAsRead(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        notificationRepository.markAllAsReadByUser(user);
    }


    // ================= DELETE =================

    public void deleteNotification(
            String email,
            Long notificationId
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found")
                        );

        if (!notification.getUser().getEmail().equals(email)) {

            throw new RuntimeException(
                    "Unauthorized to delete this notification"
            );
        }

        notificationRepository.delete(notification);
    }


    // ================= UNREAD COUNT =================

    public long getUnreadCount(String email) {

        User user =
                userRepository.findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException("User not found")
                        );

        return notificationRepository
                .countByUserAndIsReadFalse(user);
    }


    // ================= MAPPING =================

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        User actor = resolveActor(notification);

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
                                : profile.getFirstName();

                String lastName =
                        profile.getLastName() == null
                                ? ""
                                : profile.getLastName();

                actorName =
                        (firstName + " " + lastName).trim();

                actorProfilePicture =
                        profile.getProfilePicture();
            }

            if (actorName == null || actorName.isBlank()) {
                actorName = actor.getEmail();
            }
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .relatedId(notification.getRelatedId())
                .actorName(actorName)
                .actorProfilePicture(actorProfilePicture)
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }


    // ================= ACTOR RESOLUTION =================

    private User resolveActor(Notification notification) {

        Long relatedId = notification.getRelatedId();

        if (relatedId == null) {
            return null;
        }

        switch (notification.getType()) {

            case NEW_CONTACT_MESSAGE:

                return contactMessageRepository
                        .findById(relatedId)
                        .map(ContactMessage::getUser)
                        .orElse(null);


            case ADMIN_REPLY:

                return userRepository
                        .findByEmail("admin@friendfinder.com")
                        .orElse(null);


            case FRIEND_REQUEST:

            case ACCEPT_FRIEND_REQUEST:

                /*
                 * هنا نفترض أن relatedId هو User ID
                 * الخاص بالشخص الذي قام بالفعل.
                 */
                return userRepository
                        .findById(relatedId)
                        .orElse(null);


            default:

                /*
                 * LIKE / COMMENT
                 *
                 * سنربط actor بشكل أدق لما نعمل
                 * نظام الإشعارات الكامل للـ reactions/comments.
                 */
                return null;
        }
    }
}
