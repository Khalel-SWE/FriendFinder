package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String bio;
    private String jobTitle;
    private String location;
    private String profilePicture;
    private String coverPhoto;
    private String interests;
    private String languages;
}