package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalPosts;
    private long totalComments;
    private long activeFriendships;
}