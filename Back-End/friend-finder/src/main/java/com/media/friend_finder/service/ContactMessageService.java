package com.media.friend_finder.service;

import com.media.friend_finder.dto.ContactRequest;
import com.media.friend_finder.dto.ContactResponse;
import com.media.friend_finder.dto.ReplyRequest;
import com.media.friend_finder.entity.*;
import com.media.friend_finder.repository.ContactMessageRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactRepository;
    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;


    /*
     * ============================
     * User
     * ============================
     */

    @Transactional
    public void sendMessage(User user, ContactRequest request) {

        ContactMessage message = new ContactMessage();

        message.setUser(user);

        Profile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        message.setSenderName(
                profile.getFirstName() + " " + profile.getLastName()
        );

        message.setSenderEmail(user.getEmail());

        message.setType(request.getType());
        message.setMessage(request.getMessage());

        message.setStatus(ContactStatus.OPEN);

        ContactMessage savedMessage = contactRepository.save(message);


        // ============================
        // Notification -> Admin
        // ============================

        User admin = userRepository.findFirstByRole("ADMIN")
                .orElseThrow(() -> new RuntimeException("Admin user not found"));

        notificationService.createNotification(
                admin,
                "New contact message from " + message.getSenderName(),
                Notification.NotificationType.NEW_CONTACT_MESSAGE,
                savedMessage.getId()
        );
    }
    public List<ContactResponse> getMyMessages(User user) {

        return contactRepository.findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::mapToResponse)
                .toList();

    }

    /*
     * ============================
     * Admin
     * ============================
     */

    public Page<ContactResponse> getAllMessages(int page, int size) {

        return contactRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(page, size))
                .map(this::mapToResponse);
    }

    @Transactional
    public void reply(Long id, ReplyRequest request) {

        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setAdminReply(request.getAdminReply());

        message.setStatus(ContactStatus.REPLIED);

        message.setRepliedAt(LocalDateTime.now());

        contactRepository.save(message);


        // ============================
        // Notification -> User
        // ============================

        notificationService.createNotification(
                message.getUser(),
                "Admin replied to your message",
                Notification.NotificationType.ADMIN_REPLY,
                message.getId()
        );
    }

    public void close(Long id) {

        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setStatus(ContactStatus.CLOSED);

        contactRepository.save(message);

    }

    /*
     * ============================
     * Mapper
     * ============================
     */

    private ContactResponse mapToResponse(ContactMessage message) {

        return ContactResponse.builder()
                .id(message.getId())
                .senderName(message.getSenderName())
                .senderEmail(message.getSenderEmail())
                .type(message.getType())
                .message(message.getMessage())
                .adminReply(message.getAdminReply())
                .status(message.getStatus())
                .createdAt(message.getCreatedAt())
                .repliedAt(message.getRepliedAt())
                .build();

    }

}