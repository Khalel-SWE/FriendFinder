//package com.media.friend_finder.controller;
//
//import com.media.friend_finder.dto.FriendSuggestionResponse;
//import com.media.friend_finder.dto.ProfileResponse;
//import com.media.friend_finder.dto.UpdateProfileRequest;
//import com.media.friend_finder.service.ProfileService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/friend-finder/profiles")
//@RequiredArgsConstructor
//public class ProfileController {
//
//    private final ProfileService profileService;
//
//    @GetMapping("/me")
//    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
//        return ResponseEntity.ok(profileService.getMyProfile(authentication.getName()));
//    }
//
//    @PutMapping("/me")
//    public ResponseEntity<ProfileResponse> updateMyProfile(
//            Authentication authentication,
//            @RequestBody UpdateProfileRequest request) {
//        return ResponseEntity.ok(profileService.updateMyProfile(authentication.getName(), request));
//    }
//
//    // في ProfileController.java
//    @GetMapping("/suggestions")
//    public ResponseEntity<List<FriendSuggestionResponse>> getSuggestions(Authentication authentication) {
//        return ResponseEntity.ok(userService.getFriendSuggestions(authentication.getName()));
//    }
//}

package com.media.friend_finder.controller;

import com.media.friend_finder.dto.FriendSuggestionResponse; // ضيف ده
import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.service.ProfileService;
import com.media.friend_finder.service.UserService; // ضيف ده
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/friend-finder/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    // 👇 السطر ده هو اللي كان ناقص عشان يحل الإيرور 👇
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(Authentication authentication) {
        return ResponseEntity.ok(profileService.getMyProfile(authentication.getName()));
    }

    @PutMapping("/me")
    public ResponseEntity<ProfileResponse> updateMyProfile(
            Authentication authentication,
            @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(profileService.updateMyProfile(authentication.getName(), request));
    }

    // الدالة الجديدة بتاعت المقترحات
    @GetMapping("/suggestions")
    public ResponseEntity<List<FriendSuggestionResponse>> getSuggestions(Authentication authentication) {
        return ResponseEntity.ok(userService.getFriendSuggestions(authentication.getName()));
    }
}