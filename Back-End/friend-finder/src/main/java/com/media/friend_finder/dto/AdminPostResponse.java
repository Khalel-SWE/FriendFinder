package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminPostResponse {

    private Long postId;

    private Long userId;

    private String firstName;
    private String lastName;

    private String email;

    private String profilePicture;

    private String content;

    private String mediaUrl;

    private String mediaType;

    private LocalDateTime createdAt;
}