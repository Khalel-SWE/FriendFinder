package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String userEmail;
    private String userFirstName;
    private String userLastName;
    private String content;
    private String mediaUrl;
    private String mediaType;
    private LocalDateTime createdAt;
}