package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private String content;
    private String userEmail;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}