package com.media.friend_finder.service;

import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileResponse getMyProfile(String email) {

        System.out.println(email);

        Profile p = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found"));

        return ProfileResponse.builder()
                .id(p.getUser().getId())
                .email(p.getUser().getEmail())
                .firstName(p.getFirstName())
                .lastName(p.getLastName())
                .bio(p.getBio())
                .jobTitle(p.getJobTitle())
                .location(p.getLocation())
                .interests(p.getInterests())
                .languages(p.getLanguages())
                .profilePicture(p.getProfilePicture())
                .coverPhoto(p.getCoverPhoto())
                .createdAt(p.getUser().getCreatedAt())
                .build();
    }

    // 👇 دالة التحديث الجديدة بالصور 👇
    public ProfileResponse updateMyProfileWithMedia(String email, UpdateProfileRequest request, MultipartFile avatar, MultipartFile cover) {
        Profile profile = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setBio(request.getBio());
        profile.setJobTitle(request.getJobTitle());
        profile.setLocation(request.getLocation());
        profile.setInterests(request.getInterests());
        profile.setLanguages(request.getLanguages());

        // منطق حفظ الصور في فولدر
        try {
            String uploadDir = "uploads/profiles/";
            File directory = new File(uploadDir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            if (avatar != null && !avatar.isEmpty()) {
                String avatarName = System.currentTimeMillis() + "_" + avatar.getOriginalFilename();
                Path avatarPath = Paths.get(uploadDir + avatarName);
                Files.copy(avatar.getInputStream(), avatarPath, StandardCopyOption.REPLACE_EXISTING);
                profile.setProfilePicture("/uploads/profiles/" + avatarName); // مسار الصورة الشخصية
            }

            if (cover != null && !cover.isEmpty()) {
                String coverName = System.currentTimeMillis() + "_" + cover.getOriginalFilename();
                Path coverPath = Paths.get(uploadDir + coverName);
                Files.copy(cover.getInputStream(), coverPath, StandardCopyOption.REPLACE_EXISTING);
                profile.setCoverPhoto("/uploads/profiles/" + coverName); // مسار صورة الغلاف
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to store media files", e);
        }

        profileRepository.save(profile);
        return getMyProfile(email);
    }
}