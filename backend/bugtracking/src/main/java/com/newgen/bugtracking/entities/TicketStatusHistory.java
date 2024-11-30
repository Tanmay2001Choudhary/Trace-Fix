 package com.newgen.bugtracking.entities;

 import java.time.LocalDateTime;

 import jakarta.persistence.Entity;
 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
 import jakarta.persistence.JoinColumn;
 import jakarta.persistence.ManyToOne;
 import jakarta.persistence.Table;
 import lombok.AllArgsConstructor;
 import lombok.Data;
 import lombok.NoArgsConstructor;

 @Data
 @NoArgsConstructor
 @AllArgsConstructor
 @Entity
 @Table(name = "ticket_status_history")
 public class TicketStatusHistory {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     @ManyToOne
     @JoinColumn(name = "ticket_id")
     private Ticket ticket;

     private String status;

     @ManyToOne
     @JoinColumn(name = "updated_by")
     private User updatedBy;

     private LocalDateTime updatedAt;
 }
