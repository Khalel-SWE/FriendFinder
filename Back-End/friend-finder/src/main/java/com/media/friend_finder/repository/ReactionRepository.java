package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.Reaction;
import com.media.friend_finder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    List<Reaction> findByPostIn(List<Post> posts);
    List<Reaction> findByUserAndPostIn(User user, List<Post> posts);

    Optional<Reaction> findByPostAndUser(Post post, User user);

    void deleteByPost(Post post);
}
