package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

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
    private Map<String, Integer> reactionsCount; // زي: {"LIKE": 5, "LOVE": 2}
    private String currentUserReaction; // لو اليوزر ده عامل رياكت، يرجع نوعه (عشان الفرونت يعلمه)
}