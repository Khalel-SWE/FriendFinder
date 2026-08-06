package com.media.friend_finder.repository;

import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.ContactStatus;
import com.media.friend_finder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    // جميع رسائل مستخدم معين
    List<ContactMessage> findByUserOrderByCreatedAtDesc(User user);

    // جميع الرسائل للأدمن
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    // فلترة حسب الحالة
    List<ContactMessage> findByStatusOrderByCreatedAtDesc(ContactStatus status);

}