package com.media.friend_finder.service;

import com.media.friend_finder.dto.AdminUserResponse;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
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
    private final UserRepository userRepository; // ضفنا ده

    public Page<AdminUserResponse> getAllUsers(int page, int size) {
        // بنجيب الداتا بالصفحات وبدون N+1
        Page<Profile> profilesPage = profileRepository.findAllProfilesWithUsers(PageRequest.of(page, size));

        // بنحول الـ Entity لـ DTO
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

        // بنمنع الأدمن إنه يحظر نفسه أو يحظر أدمن تاني بالغلط
        if (user.getRole().equals("ADMIN")) {
            throw new RuntimeException("Cannot ban an Admin account");
        }

        // بنعكس الحالة: لو شغال نقفله، ولو مقفول نشغله
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);

        return user.isEnabled() ? "User Unbanned Successfully" : "User Banned Successfully";
    }
}