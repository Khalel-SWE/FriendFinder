package com.media.friend_finder.repository;

import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.ContactStatus;
import com.media.friend_finder.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByUserOrderByCreatedAtDesc(User user);

    Page<ContactMessage> findAllByOrderByCreatedAtDesc(Pageable pageable);

    List<ContactMessage> findByStatusOrderByCreatedAtDesc(ContactStatus status);

}