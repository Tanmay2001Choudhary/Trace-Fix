// package com.newgen.bugtracking.dao;
//
// import org.springframework.stereotype.Component;
//
// import com.newgen.bugtracking.dto.PriorityDTO;
// import com.newgen.bugtracking.entities.Priority;
//
// @Component
// public class PriorityDao {
//
//     public PriorityDTO convertToDTO(Priority priority) {
//         return PriorityDTO.builder()
//                 .id(priority.getId())
//                 .name(priority.getName())
//                 .build();
//     }
//
//     public Priority convertToEntity(PriorityDTO priorityDTO) {
//         Priority priority = new Priority();
//         priority.setName(priorityDTO.getName());
//         return priority;
//     }
// }
