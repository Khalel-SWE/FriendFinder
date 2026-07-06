package com.media.friend_finder.service;

import com.media.friend_finder.dto.PostResponse;
import com.media.friend_finder.entity.Friendship;
import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.FriendshipRepository;
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
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final FriendshipRepository friendshipRepository; // ضفنا ده عشان نجيب الأصدقاء

    private final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads/posts/";

    // ==========================================
    // 1. دالة إنشاء البوست (محمية ومؤمنة)
    // ==========================================
    public PostResponse createPost(String email, String content, MultipartFile file) throws IOException {
        // المشكلة السادسة: منع البوست الفاضي
        boolean hasText = (content != null && !content.trim().isEmpty());
        boolean hasFile = (file != null && !file.isEmpty());

        if (!hasText && !hasFile) {
            throw new RuntimeException("Post cannot be empty. Please provide text or a media file.");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);

        if (hasFile) {
            // المشكلة الأولى: التحقق من نوع الملف (Security)
            String contentType = file.getContentType();
            if (contentType == null || !(contentType.equals("image/jpeg") || contentType.equals("image/png") || contentType.equals("image/jpg") || contentType.equals("video/mp4"))) {
                throw new RuntimeException("Invalid file type. Only JPG, PNG, and MP4 are allowed.");
            }

            File directory = new File(UPLOAD_DIR);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            // المشكلة الثالثة: منع تعارض الملفات
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            post.setMediaUrl("/uploads/posts/" + fileName);
            post.setMediaType(contentType.startsWith("video") ? "VIDEO" : "IMAGE");
        }

        postRepository.save(post);

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

    // ==========================================
    // 2. دالة الـ Feed (أنا وأصدقائي فقط + بدون N+1)
    // ==========================================
    public List<PostResponse> getFeed(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. نجمع اليوزرز اللي هنجيب بوستاتهم (أنا + أصدقائي)
        List<User> feedUsers = new ArrayList<>();
        feedUsers.add(currentUser); // نضيف نفسي الأول

        List<Friendship> friends = friendshipRepository.findAcceptedFriendships(currentUser);
        for (Friendship f : friends) {
            if (f.getRequester().equals(currentUser)) {
                feedUsers.add(f.getAddressee());
            } else {
                feedUsers.add(f.getRequester());
            }
        }

        // 2. نجيب البوستات لليوزرز دول بس (المشكلة الرابعة اتحلت)
        List<Post> posts = postRepository.findByUserInOrderByCreatedAtDesc(feedUsers);

        // 3. نجيب كل بروفايلات اليوزرز دول في Query واحدة بس!! (المشكلة الثامنة اتحلت N+1)
        List<Profile> profiles = profileRepository.findByUserIn(feedUsers);

        // نعمل Map سريع نربط فيه الايميل بالبروفايل بتاعه في الميموري (O(1) Access)
        Map<String, Profile> profileMap = profiles.stream()
                .collect(Collectors.toMap(p -> p.getUser().getEmail(), p -> p));

        // 4. نرجع النتيجة النهائية بسرعة الصاروخ
        return posts.stream().map(post -> {
            Profile profile = profileMap.get(post.getUser().getEmail());
            return PostResponse.builder()
                    .id(post.getId())
                    .userEmail(post.getUser().getEmail())
                    .userFirstName(profile.getFirstName())
                    .userLastName(profile.getLastName())
                    .content(post.getContent())
                    .mediaUrl(post.getMediaUrl())
                    .mediaType(post.getMediaType())
                    .createdAt(post.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }
}