package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
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
    private Map<String, Integer> reactionsCount;
    private String currentUserReaction;
    private int commentsCount; // 👈 ضفنا العداد الحقيقي
    private List<CommentResponse> comments; // 👈 ضفنا لستة التعليقات عشان السيرش الفوري في الفرونت إند
}