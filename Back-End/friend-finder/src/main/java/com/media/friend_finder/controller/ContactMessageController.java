package com.media.friend_finder.controller;

import com.media.friend_finder.dto.ContactRequest;
import com.media.friend_finder.dto.ContactResponse;
import com.media.friend_finder.dto.ReplyRequest;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.service.ContactMessageService;
import com.media.friend_finder.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend-finder")
@RequiredArgsConstructor
public class ContactMessageController {

    private final ContactMessageService contactService;
    private final UserService userService;

    // ================= USER =================

    @PostMapping("/contact")
    public void sendMessage(Authentication authentication,
                            @Valid @RequestBody ContactRequest request) {

        User user = userService.getCurrentUser(authentication);

        contactService.sendMessage(user, request);

    }

    @GetMapping("/contact/my-messages")
    public List<ContactResponse> getMyMessages(Authentication authentication) {

        User user = userService.getCurrentUser(authentication);

        return contactService.getMyMessages(user);

    }

    // ================= ADMIN =================

    @GetMapping("/admin/contact-messages")
    public List<ContactResponse> getAllMessages() {

        return contactService.getAllMessages();

    }

    @PatchMapping("/admin/contact-messages/{id}/reply")
    public void replyMessage(@PathVariable Long id,
                             @Valid @RequestBody ReplyRequest request) {

        contactService.reply(id, request);

    }

    @PatchMapping("/admin/contact-messages/{id}/close")
    public void closeMessage(@PathVariable Long id) {

        contactService.close(id);

    }

}