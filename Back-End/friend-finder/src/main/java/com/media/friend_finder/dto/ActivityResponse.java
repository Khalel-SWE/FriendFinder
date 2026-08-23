package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ActivityResponse {

    private Long id;

    private String activityType;

    private Long referenceId;

    private String targetName;

    private LocalDateTime createdAt;
}