package com.media.friend_finder.service;

import com.media.friend_finder.dto.AdminPostResponse;
import com.media.friend_finder.dto.AdminUserResponse;
import com.media.friend_finder.dto.DashboardStatsResponse;
import com.media.friend_finder.entity.Post;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    // ضفنا التلاتة دول عشان نستخدمهم في الإحصائيات
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final ReactionRepository reactionRepository;
    private final FriendshipRepository friendshipRepository;

    public Page<AdminUserResponse> getAllUsers(int page, int size) {
        Page<Profile> profilesPage = profileRepository.findAllProfilesWithUsers(PageRequest.of(page, size));

        return profilesPage.map(profile -> AdminUserResponse.builder()
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .profilePicture(profile.getProfilePicture())
                .joinedAt(profile.getUser().getCreatedAt())
                .enabled(profile.getUser().isEnabled())
                .build());
    }

    public String toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Cannot ban an Admin account");
        }

        user.setEnabled(!user.isEnabled());
        userRepository.save(user);

        return user.isEnabled() ? "User Unbanned Successfully" : "User Banned Successfully";
    }

    public DashboardStatsResponse getSystemStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalPosts(postRepository.count())
                .totalComments(commentRepository.count())
                .activeFriendships(friendshipRepository.countByStatus("ACCEPTED"))
                .build();
    }

    public Page<AdminPostResponse> getAllPosts(int page, int size) {

        Page<Post> postsPage = postRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size)
        );

        return postsPage.map(post -> {

            Profile profile = profileRepository.findByUser(post.getUser())
                    .orElseThrow(() -> new RuntimeException("Profile not found"));

            return AdminPostResponse.builder()
                    .postId(post.getId())
                    .userId(post.getUser().getId())
                    .firstName(profile.getFirstName())
                    .lastName(profile.getLastName())
                    .email(post.getUser().getEmail())
                    .profilePicture(profile.getProfilePicture())
                    .content(post.getContent())
                    .mediaUrl(post.getMediaUrl())
                    .mediaType(post.getMediaType())
                    .createdAt(post.getCreatedAt())
                    .build();
        });
    }

    @Transactional
    public void deletePost(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        reactionRepository.deleteByPost(post);

        commentRepository.deleteByPost(post);

        postRepository.delete(post);
    }
}