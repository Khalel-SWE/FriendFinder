package com.media.friend_finder.controller;

import com.media.friend_finder.dto.*;
import com.media.friend_finder.service.AdminService;
import com.media.friend_finder.service.ContactMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/friend-finder/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ContactMessageService contactMessageService;

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(adminService.getAllUsers(page, size));
    }

    @PatchMapping("/users/{userId}/status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.toggleUserStatus(userId));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

//    *****************************************************************

    @GetMapping("/posts")
    public ResponseEntity<Page<AdminPostResponse>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                adminService.getAllPosts(page, size)
        );
    }


    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(
            @PathVariable Long postId
    ) {

        adminService.deletePost(postId);

        return ResponseEntity.ok("Post deleted successfully");
    }


//    *********************************************************************

    @GetMapping("/contacts")
    public ResponseEntity<Page<ContactResponse>> getAllContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                contactMessageService.getAllMessages(page, size)
        );
    }

    @PatchMapping("/contacts/{id}/reply")
    public ResponseEntity<String> reply(
            @PathVariable Long id,
            @RequestBody ReplyRequest request
    ) {

        contactMessageService.reply(id, request);

        return ResponseEntity.ok("Reply sent successfully");
    }

    @PatchMapping("/contacts/{id}/close")
    public ResponseEntity<String> close(
            @PathVariable Long id
    ) {

        contactMessageService.close(id);

        return ResponseEntity.ok("Contact closed");
    }

}