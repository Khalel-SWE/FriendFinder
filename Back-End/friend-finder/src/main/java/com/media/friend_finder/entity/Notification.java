package com.media.friend_finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // الشخص اللي هيستقبل الإشعار
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String message;

    // نوع الإشعار (ممكن يكون: LIKE, COMMENT, FRIEND_REQUEST)
    @Column(nullable = false)
    private String type;

    // الـ ID بتاع الحاجة اللي الإشعار عنها (مثلاً ID البوست أو ID طلب الصداقة) عشان الفرونت إند يعرف يوجه اليوزر لما يدوس عليه
    @Column(name = "related_id")
    private Long relatedId;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}