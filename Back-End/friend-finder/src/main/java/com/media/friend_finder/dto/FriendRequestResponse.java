package com.media.friend_finder.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FriendRequestResponse {
    private Long requestId;
    private String requesterEmail;
    private String requesterFirstName;
    private String requesterLastName;
    private String status;
}