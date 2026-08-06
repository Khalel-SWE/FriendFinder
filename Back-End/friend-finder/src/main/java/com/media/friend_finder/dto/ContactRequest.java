package com.media.friend_finder.dto;

import com.media.friend_finder.entity.ContactType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ContactRequest {

    @NotNull
    private ContactType type;

    @NotBlank
    private String message;

}