package com.media.friend_finder.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // الشخص اللي كتب البوست

    @Column(length = 4000) // عشان يسمح بنصوص طويلة للبوست
    private String content;

    @Column(name = "media_url")
    private String mediaUrl; // مسار الصورة أو الفيديو المرفوع

    @Column(name = "media_type")
    private String mediaType; // عشان نعرف ده (IMAGE) ولا (VIDEO)

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}