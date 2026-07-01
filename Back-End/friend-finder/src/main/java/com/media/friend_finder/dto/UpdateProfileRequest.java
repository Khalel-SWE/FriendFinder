package com.media.friend_finder.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String firstName;
    private String lastName;
    private String bio;
    private String jobTitle;
    private String location;
    private String interests;
    private String languages;
}