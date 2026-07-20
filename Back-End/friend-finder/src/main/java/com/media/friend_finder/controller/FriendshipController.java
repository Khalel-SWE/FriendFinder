package com.media.friend_finder.controller;

import com.media.friend_finder.dto.FriendRequestResponse;
import com.media.friend_finder.dto.FriendResponse;
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

    // إرسال طلب باستخدام الـ ID
    @PostMapping("/request/{receiverId}")
    public ResponseEntity<String> sendFriendRequestById(
            Authentication authentication,
            @PathVariable Long receiverId) {
        return ResponseEntity.ok(friendshipService.sendFriendRequestById(authentication.getName(), receiverId));
    }

    // جلب قائمة الأصدقاء للبروفايل
    @GetMapping("/my-friends")
    public ResponseEntity<List<FriendResponse>> getMyFriends(Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getMyFriends(authentication.getName()));
    }

    // مسح صديق
    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<Void> removeFriend(Authentication authentication, @PathVariable Long friendId) {
        friendshipService.removeFriend(authentication.getName(), friendId);
        return ResponseEntity.ok().build();
    }

}