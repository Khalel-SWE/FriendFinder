package com.media.friend_finder.dto;

import com.media.friend_finder.entity.ContactStatus;
import com.media.friend_finder.entity.ContactType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ContactResponse {

    private Long id;

    private String senderName;

    private String senderEmail;

    private ContactType type;

    private String message;

    private String adminReply;

    private ContactStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime repliedAt;

}