 package com.newgen.bugtracking.dto;

 import com.newgen.bugtracking.entities.Ticket;

 import lombok.Builder;
 import lombok.Data;

 @Data
 @Builder
 public class TicketAssignmentDTO {
     private Long id;
     private Ticket ticket;
     private UserDTO assignedTo;
 }
