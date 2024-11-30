package com.newgen.bugtracking.dto;

import com.newgen.bugtracking.entities.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private byte[] profileImage;
}
