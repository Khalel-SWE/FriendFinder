package com.media.friend_finder.controller;

import com.media.friend_finder.dto.FriendRequestResponse;
import com.media.friend_finder.service.FriendshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend-finder/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    // 1. إرسال طلب صداقة
    @PostMapping("/request")
    public ResponseEntity<String> sendFriendRequest(
            Authentication authentication,
            @RequestParam String toEmail) {
        return ResponseEntity.ok(friendshipService.sendFriendRequest(authentication.getName(), toEmail));
    }

    // 2. عرض الطلبات المعلقة
    @GetMapping("/requests/pending")
    public ResponseEntity<List<FriendRequestResponse>> getPendingRequests(Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(authentication.getName()));
    }

    // 3. قبول أو رفض الطلب (الآن يمرر الـ Authentication لحماية الداتا)
    @PutMapping("/requests/{id}")
    public ResponseEntity<String> acceptOrRejectRequest(
            Authentication authentication,
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(friendshipService.acceptOrRejectRequest(authentication.getName(), id, status));
    }
}