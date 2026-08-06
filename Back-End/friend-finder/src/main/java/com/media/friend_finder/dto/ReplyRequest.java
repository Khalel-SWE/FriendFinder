package com.media.friend_finder.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReplyRequest {

    @NotBlank
    private String adminReply;

}