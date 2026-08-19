package com.media.friend_finder.service;

import com.media.friend_finder.dto.FriendSuggestionResponse;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public List<FriendSuggestionResponse> getFriendSuggestions(String email) {

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Profile> suggestedProfiles =
                profileRepository.findSuggestedFriends(
                        currentUser,
                        PageRequest.of(0, 5)
                );

        return suggestedProfiles.stream()

                // الأدمن لا يظهر في Friend Suggestions
                .filter(profile -> !"ADMIN".equals(profile.getUser().getRole()))

                .map(profile -> {

                    String firstName = profile.getFirstName();
                    String lastName = profile.getLastName();

                    String initials = "";

                    if (firstName != null && !firstName.isBlank()) {
                        initials += firstName.charAt(0);
                    }

                    if (lastName != null && !lastName.isBlank()) {
                        initials += lastName.charAt(0);
                    }

                    return FriendSuggestionResponse.builder()

                            // IMPORTANT:
                            // هنا نحتاج User ID وليس Profile ID
                            .id(profile.getUser().getId())

                            .email(profile.getUser().getEmail())

                            .firstName(firstName)

                            .lastName(lastName)

                            .profilePicture(profile.getProfilePicture())

                            .initials(initials.toUpperCase())

                            .build();
                })

                .collect(Collectors.toList());
    }

    public User getCurrentUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}