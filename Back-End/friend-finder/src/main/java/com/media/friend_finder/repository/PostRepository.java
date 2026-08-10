package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // هتحتاج الدالة دي بعدين في الـ Feed عشان تجيب بوستات يوزر معين بترتيب الأحدث للأقدم
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    // بتجيب بوستات مجموعة من اليوزرز (أنا وأصدقائي) مترتبة بالأحدث
    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);

    long count();
}