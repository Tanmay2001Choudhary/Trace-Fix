package com.newgen.bugtracking.dto;

import com.newgen.bugtracking.entities.Role;

import lombok.Data;

@Data
public class SignUpDTO {
    private String name;
    private String email;
    private String password;
    private Role role;
}
