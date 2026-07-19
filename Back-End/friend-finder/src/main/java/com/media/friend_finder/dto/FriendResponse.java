package com.media.friend_finder.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendResponse {
    private Long id;
    private String name;
    private String initials;
    private String gradient;
    private int mutualCount;
}