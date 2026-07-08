package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Notification;
import com.media.friend_finder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // جلب إشعارات اليوزر مترتبة من الأحدث للأقدم
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    // عد الإشعارات اللي لسه متقرتش (عشان رقم الـ Badge الأحمر اللي بيظهر فوق أيقونة الإشعارات)
    long countByUserAndIsReadFalse(User user);
}