package com.media.friend_finder.service;

import com.media.friend_finder.dto.NotificationResponse;
import com.media.friend_finder.entity.Notification;
import com.media.friend_finder.entity.Notification.NotificationType;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.NotificationRepository;
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

    // 1. دالة إنشاء الإشعار (اتعدلت عشان تاخد Enum بدل String)
    public void createNotification(User user, String message, NotificationType type, Long relatedId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type); // الإيرور هيختفي من هنا
        notification.setRelatedId(relatedId);
        notificationRepository.save(notification);
    }

    // 2. Get Notifications
    public List<NotificationResponse> getNotifications(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // 3. Mark As Read (Single)
    public void markAsRead(String email, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        // التأكد إن الإشعار يخص اليوزر ده
        if (notification.getUser().getEmail().equals(email)) {
            notification.setRead(true);
            notificationRepository.save(notification);
        } else {
            throw new RuntimeException("Unauthorized to update this notification");
        }
    }

    // 4. Mark All As Read (The Optimized Way)
    @Transactional // لازم نحط دي عشان بننفذ Custom Update Query في الداتا بيز
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // سطر واحد بس صاروخي بدل ما كنا بنجيب الداتا كلها ونعملها فلتر لوب!
        notificationRepository.markAllAsReadByUser(user);
    }

    // 5. Delete Notification
    public void deleteNotification(String email, Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (notification.getUser().getEmail().equals(email)) {
            notificationRepository.delete(notification);
        } else {
            throw new RuntimeException("Unauthorized to delete this notification");
        }
    }

    // 6. جلب عدد الإشعارات غير المقروءة
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return notificationRepository.countByUserAndIsReadFalse(user);
    }

    // Mappers
    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .type(notification.getType())
                .relatedId(notification.getRelatedId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}