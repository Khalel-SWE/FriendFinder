package com.media.friend_finder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.media.friend_finder.dto.FriendSuggestionResponse;
import com.media.friend_finder.dto.ProfileResponse;
import com.media.friend_finder.dto.PublicProfileResponse;
import com.media.friend_finder.dto.UpdateProfileRequest;
import com.media.friend_finder.service.ProfileService;
import com.media.friend_finder.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/friend-finder/profiles")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;
    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                profileService.getMyProfile(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<PublicProfileResponse> getPublicProfile(
            Authentication authentication,
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                profileService.getPublicProfile(
                        authentication.getName(),
                        userId
                )
        );
    }

    @PutMapping(
            value = "/update",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestPart("profile") String profileJson,
            @RequestPart(
                    value = "avatar",
                    required = false
            ) MultipartFile avatar,
            @RequestPart(
                    value = "cover",
                    required = false
            ) MultipartFile cover
    ) {

        try {

            ObjectMapper mapper =
                    new ObjectMapper();

            UpdateProfileRequest request =
                    mapper.readValue(
                            profileJson,
                            UpdateProfileRequest.class
                    );

            return ResponseEntity.ok(
                    profileService.updateMyProfileWithMedia(
                            authentication.getName(),
                            request,
                            avatar,
                            cover
                    )
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Error processing profile update",
                    e
            );
        }
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<FriendSuggestionResponse>>
    getSuggestions(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                userService.getFriendSuggestions(
                        authentication.getName()
                )
        );
    }
}