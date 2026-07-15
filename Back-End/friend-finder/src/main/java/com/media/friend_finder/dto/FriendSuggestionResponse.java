package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendSuggestionResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String profilePicture;
    private String initials; // الحروف الاختصارية مثل DA
}