package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // الترتيب من الأقدم للأحدث (زي ما طلبت)
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);
}