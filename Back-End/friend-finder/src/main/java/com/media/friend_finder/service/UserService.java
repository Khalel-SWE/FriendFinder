package com.media.friend_finder.service;

import com.media.friend_finder.dto.FriendSuggestionResponse;
import com.media.friend_finder.entity.Profile;
import com.media.friend_finder.entity.User;
import com.media.friend_finder.repository.ProfileRepository;
import com.media.friend_finder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
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

        // هنجيب أعلى 5 مقترحات كحد أقصى عشان الديزاين
        List<Profile> suggestedProfiles = profileRepository.findSuggestedFriends(currentUser, PageRequest.of(0, 5));

        return suggestedProfiles.stream().map(p -> {
            String initials = (p.getFirstName().substring(0,1) + p.getLastName().substring(0,1)).toUpperCase();
            return FriendSuggestionResponse.builder()
                    .id(p.getId())
                    .email(p.getUser().getEmail())
                    .firstName(p.getFirstName())
                    .lastName(p.getLastName())
                    .profilePicture(p.getProfilePicture())
                    .initials(initials)
                    .build();
        }).collect(Collectors.toList());
    }
}