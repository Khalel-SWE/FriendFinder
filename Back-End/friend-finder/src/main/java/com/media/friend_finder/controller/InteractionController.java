package com.media.friend_finder.controller;

import com.media.friend_finder.dto.CommentResponse;
import com.media.friend_finder.entity.ReactionType;
import com.media.friend_finder.service.InteractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend-finder/interactions")
@RequiredArgsConstructor
public class InteractionController {

    private final InteractionService interactionService;

    // 1. إضافة تعليق
    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            Authentication authentication,
            @PathVariable Long postId,
            @RequestParam String content) {
        return ResponseEntity.ok(interactionService.addComment(authentication.getName(), postId, content));
    }

    // 2. عرض تعليقات بوست معين
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(interactionService.getComments(postId));
    }

    // 3. تعديل تعليق
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            Authentication authentication,
            @PathVariable Long commentId,
            @RequestParam String newContent) {
        return ResponseEntity.ok(interactionService.updateComment(authentication.getName(), commentId, newContent));
    }

    // 4. حذف تعليق
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(
            Authentication authentication,
            @PathVariable Long commentId) {
        interactionService.deleteComment(authentication.getName(), commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // 5. إضافة/تغيير رياكشن
    @PostMapping("/posts/{postId}/react")
    public ResponseEntity<String> reactToPost(
            Authentication authentication,
            @PathVariable Long postId,
            @RequestParam ReactionType type) {
        interactionService.reactToPost(authentication.getName(), postId, type);
        return ResponseEntity.ok("Reacted with " + type + " successfully");
    }
}