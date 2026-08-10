//package com.media.friend_finder.repository;
//
//import com.media.friend_finder.entity.Post;
//import com.media.friend_finder.entity.Reaction;
//import com.media.friend_finder.entity.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import java.util.Optional;
//
//public interface ReactionRepository extends JpaRepository<Reaction, Long> {
//    // عشان نضمن اليوزر يعمل تفاعل واحد بس للبوست
//    Optional<Reaction> findByPostAndUser(Post post, User user);
//
//    // عشان نعد التفاعلات (ممكن نستخدمها في الـ Feed لاحقاً)
//    long countByPostId(Long postId);
//}

package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.Reaction;
import com.media.friend_finder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional; // ضيف ده

public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    // الدوال اللي ضفناها قبل كده للفيد
    List<Reaction> findByPostIn(List<Post> posts);
    List<Reaction> findByUserAndPostIn(User user, List<Post> posts);

    // 👇 السطر اللي ناقص عشان الـ InteractionService يشتغل 👇
    Optional<Reaction> findByPostAndUser(Post post, User user);

    void deleteByPost(Post post);
}
