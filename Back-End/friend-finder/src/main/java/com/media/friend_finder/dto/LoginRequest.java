package com.media.friend_finder.dto;

import lombok.Data;

@Data
public class LoginRequest {

    private String email;
    private String password;
}
