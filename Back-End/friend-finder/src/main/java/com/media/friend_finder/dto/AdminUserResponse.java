package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserResponse {
    private Long userId;
    private String email;
    private String role;
    private String firstName;
    private String lastName;
    private LocalDateTime joinedAt;
}