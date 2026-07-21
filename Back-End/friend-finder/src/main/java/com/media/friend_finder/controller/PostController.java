package com.media.friend_finder.controller;

import com.media.friend_finder.dto.PostResponse;
import com.media.friend_finder.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/friend-finder/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping("/create")
    public ResponseEntity<PostResponse> createPost(
            Authentication authentication,
            @RequestParam(required = false) String content,
            @RequestParam(required = false) MultipartFile file) throws IOException {

        return ResponseEntity.ok(postService.createPost(authentication.getName(), content, file));
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostResponse>> getFeed(Authentication authentication) {
        return ResponseEntity.ok(postService.getFeed(authentication.getName()));
    }

    // 👈 الدالة الجديدة اللي الأنجولار كان بيدور عليها ومش لاقيها
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(
            @PathVariable Long userId,
            Authentication authentication) {
        return ResponseEntity.ok(postService.getUserPosts(userId, authentication.getName()));
    }
}