package com.newgen.bugtracking.dao;

import com.newgen.bugtracking.dto.TicketAssignmentDTO;
import com.newgen.bugtracking.dto.UserDTO;
import com.newgen.bugtracking.entities.TicketAssignment;
import com.newgen.bugtracking.entities.User;
import org.springframework.stereotype.Component;

@Component
public class TicketAssignmentDao {

    public TicketAssignmentDTO convertToDTO(TicketAssignment assignment) {
        return TicketAssignmentDTO.builder()
                .id(assignment.getId())
                .ticket(assignment.getTicket())
                .assignedTo(convertUserToDTO(assignment.getDeveloper()))
                .build();
    }

    public TicketAssignment convertToEntity(TicketAssignmentDTO assignmentDTO) {
        TicketAssignment assignment = new TicketAssignment();
        assignment.setTicket(assignmentDTO.getTicket());
        assignment.setDeveloper(convertDTOToUser(assignmentDTO.getAssignedTo()));
        return assignment;
    }

    private UserDTO convertUserToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build(); // Example mapping from User entity to UserDTO
    }

    private User convertDTOToUser(UserDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        return user;
    }
}
