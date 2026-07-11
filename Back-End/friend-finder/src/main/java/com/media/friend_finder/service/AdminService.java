package com.media.friend_finder.service;

import com.media.friend_finder.dto.AdminUserResponse;
import com.media.friend_finder.dto.DashboardStatsResponse;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.CommentRepository;
import com.media.friend_finder.repository.FriendshipRepository;
import com.media.friend_finder.repository.PostRepository;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    // ضفنا التلاتة دول عشان نستخدمهم في الإحصائيات
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final FriendshipRepository friendshipRepository;

    public Page<AdminUserResponse> getAllUsers(int page, int size) {
        Page<Profile> profilesPage = profileRepository.findAllProfilesWithUsers(PageRequest.of(page, size));

        return profilesPage.map(profile -> AdminUserResponse.builder()
                .userId(profile.getUser().getId())
                .email(profile.getUser().getEmail())
                .role(profile.getUser().getRole())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .joinedAt(profile.getUser().getCreatedAt())
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
}