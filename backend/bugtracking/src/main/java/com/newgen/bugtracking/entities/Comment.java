// package com.newgen.bugtracking.entities;
//
// import java.time.LocalDateTime;
//
// import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
// import jakarta.persistence.Id;
// import jakarta.persistence.JoinColumn;
// import jakarta.persistence.ManyToOne;
// import jakarta.persistence.Table;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;
//
// @Data
// @NoArgsConstructor
// @AllArgsConstructor
// @Entity
// @Table(name = "comments")
// public class Comment {
//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private Long id;
//
//     @ManyToOne
//     @JoinColumn(name = "ticket_id")
//     private Ticket ticket;
//
//     private String comment;
//
//     @ManyToOne
//     @JoinColumn(name = "commented_by")
//     private User commentedBy;
//
//     private LocalDateTime createdAt;
// }
