package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import com.media.friend_finder.entity.User;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    // هتحتاج الدالة دي بعدين في الـ Feed عشان تجيب بوستات يوزر معين بترتيب الأحدث للأقدم
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    // بتجيب بوستات مجموعة من اليوزرز (أنا وأصدقائي) مترتبة بالأحدث
    List<Post> findByUserInOrderByCreatedAtDesc(List<User> users);
}