package com.media.friend_finder.service;

import com.media.friend_finder.dto.PostResponse;
import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.PostRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    // مسار حفظ الملفات على جهازك (جوه فولدر المشروع)
    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/posts/";

    public PostResponse createPost(String email, String content, MultipartFile file) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);

        // لو اليوزر رافع ملف (صورة أو فيديو)
        if (file != null && !file.isEmpty()) {
            // 1. تأكيد إن الفولدر موجود
            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // 2. عمل اسم فريد للملف عشان الاسم ميتكررش
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // 3. حفظ الملف حركياً على الهارد ديسك
            Files.copy(file.getInputStream(), filePath);

            // 4. سيف الـ URL ونوع الميديا
            post.setMediaUrl("/uploads/posts/" + fileName);

            String contentType = file.getContentType();
            if (contentType != null && contentType.startsWith("video")) {
                post.setMediaType("VIDEO");
            } else {
                post.setMediaType("IMAGE");
            }
        }

        postRepository.save(post);

        // نجيب بروفايل اليوزر عشان نرجع الاسم الأول والأخير في الـ Response
        Profile profile = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        return PostResponse.builder()
                .id(post.getId())
                .userEmail(user.getEmail())
                .userFirstName(profile.getFirstName())
                .userLastName(profile.getLastName())
                .content(post.getContent())
                .mediaUrl(post.getMediaUrl())
                .mediaType(post.getMediaType())
                .createdAt(post.getCreatedAt())
                .build();
    }
}