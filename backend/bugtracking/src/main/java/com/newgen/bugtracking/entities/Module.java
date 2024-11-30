 package com.newgen.bugtracking.entities;

 import java.util.List;

 import jakarta.persistence.Entity;
 import jakarta.persistence.GeneratedValue;
 import jakarta.persistence.GenerationType;
 import jakarta.persistence.Id;
 import jakarta.persistence.OneToMany;
 import jakarta.persistence.Table;
 import lombok.AllArgsConstructor;
 import lombok.Data;
 import lombok.NoArgsConstructor;

 @Data
 @NoArgsConstructor
 @AllArgsConstructor
 @Entity
 @Table(name = "modules")
 public class Module {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

     private String name;

     @OneToMany(mappedBy = "module")
     private List<Ticket> ticket;
 }
