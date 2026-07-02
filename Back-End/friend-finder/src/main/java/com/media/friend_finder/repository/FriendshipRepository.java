package com.media.friend_finder.repository;

import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepository extends JpaRepository<Friendship, Long> {

    // الدالة دي بتشيك هل في علاقة صداقة أو طلب مبعوت بين اليوزرين دول (في أي اتجاه) عشان نمنع التكرار
    @Query("SELECT f FROM Friendship f WHERE (f.requester = :user1 AND f.addressee = :user2) OR (f.requester = :user2 AND f.addressee = :user1)")
    Optional<Friendship> findFriendshipBetweenUsers(@Param("user1") User user1, @Param("user2") User user2);

    // الدالة دي بتجيب كل طلبات الصداقة (المعلقة) اللي مبعوتة لليوزر ده
    List<Friendship> findByAddresseeAndStatus(User addressee, String status);
}