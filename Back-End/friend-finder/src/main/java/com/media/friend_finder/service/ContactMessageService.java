package com.media.friend_finder.service;

import com.media.friend_finder.dto.ContactRequest;
import com.media.friend_finder.dto.ContactResponse;
import com.media.friend_finder.dto.ReplyRequest;
import com.media.friend_finder.entity.ContactMessage;
import com.media.friend_finder.entity.ContactStatus;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ContactMessageRepository;
import com.media.friend_finder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {

    private final ContactMessageRepository contactRepository;
    private final ProfileRepository profileRepository;


    /*
     * ============================
     * User
     * ============================
     */

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

        contactRepository.save(message);

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

    public void reply(Long id, ReplyRequest request) {

        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Message not found"));

        message.setAdminReply(request.getAdminReply());

        message.setStatus(ContactStatus.REPLIED);

        message.setRepliedAt(LocalDateTime.now());

        contactRepository.save(message);

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