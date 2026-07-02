//package com.media.friend_finder.service;
//
//import com.media.friend_finder.dto.ProfileResponse;
//import com.media.friend_finder.dto.UpdateProfileRequest;
//import com.media.friend_finder.entity.Profile;
//import com.media.friend_finder.repository.ProfileRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class ProfileService {
//
//    private final ProfileRepository profileRepository;
//
//    public ProfileResponse getMyProfile(String email) {
//        // بنبحث عن البروفايل المرتبط بالايميل (الذي يأتي من الـ SecurityContext)
//        return profileRepository.findAll().stream()
//                .filter(p -> p.getUser().getEmail().equals(email))
//                .findFirst()
//                .map(p -> ProfileResponse.builder()
//                        .email(p.getUser().getEmail())
//                        .firstName(p.getFirstName())
//                        .lastName(p.getLastName())
//                        .bio(p.getBio())
//                        .jobTitle(p.getJobTitle())
//                        .location(p.getLocation())
//                        .interests(p.getInterests())   // ضيف ده
//                        .languages(p.getLanguages())   // وضيف ده
//                        .profilePicture(p.getProfilePicture()) // وضيف ده
//                        .coverPhoto(p.getCoverPhoto())  // و ضيف ده
//                        .build())
//                .orElseThrow(() -> new UsernameNotFoundException("Profile not found"));
//    }
//
//    public ProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {
//        // بنجيب البروفايل بتاع اليوزر
//        Profile profile = profileRepository.findAll().stream()
//                .filter(p -> p.getUser().getEmail().equals(email))
//                .findFirst()
//                .orElseThrow(() -> new RuntimeException("Profile not found"));
//
//        // بنعدل البيانات
//        profile.setFirstName(request.getFirstName());
//        profile.setLastName(request.getLastName());
//        profile.setBio(request.getBio());
//        profile.setJobTitle(request.getJobTitle());
//        profile.setLocation(request.getLocation());
//        profile.setInterests(request.getInterests());
//        profile.setLanguages(request.getLanguages());
//
//        // بنحفظ التعديلات في الداتا بيز
//        profileRepository.save(profile);
//
//        // بنرجعله البروفايل بعد ما اتعدل
//        return getMyProfile(email);
//    }
//}

package com.media.friend_finder.service;

import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileResponse getMyProfile(String email) {
        // Query واحدة نظيفة بتجيب المطلوب مباشرة بناءً على الإيميل
        Profile p = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Profile not found"));

        return ProfileResponse.builder()
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
                .build();
    }

    public ProfileResponse updateMyProfile(String email, UpdateProfileRequest request) {
        // نفس الـ Query السريعة هنا لمنع الـ Full Table Scan
        Profile profile = profileRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        // تعديل البيانات بالكامل
        profile.setFirstName(request.getFirstName());
        profile.setLastName(request.getLastName());
        profile.setBio(request.getBio());
        profile.setJobTitle(request.getJobTitle());
        profile.setLocation(request.getLocation());
        profile.setInterests(request.getInterests());
        profile.setLanguages(request.getLanguages());

        // بنحفظ التعديلات في الداتا بيز
        profileRepository.save(profile);

        // بنرجعله البروفايل بعد ما اتعدل
        return getMyProfile(email);
    }
}