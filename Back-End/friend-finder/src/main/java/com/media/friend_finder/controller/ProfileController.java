package com.media.friend_finder.controller;

import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/friend-finder/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

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
}