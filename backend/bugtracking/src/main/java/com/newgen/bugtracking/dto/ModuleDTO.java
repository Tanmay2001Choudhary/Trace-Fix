package com.newgen.bugtracking.dto;

import lombok.Data;

@Data
public class ModuleDTO {
    private Long id;
    private String name;
    private TicketDTO ticketDTO;
}
