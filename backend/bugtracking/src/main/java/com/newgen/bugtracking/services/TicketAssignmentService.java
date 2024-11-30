 package com.newgen.bugtracking.services;

 import java.util.List;
 import java.util.stream.Collectors;

 import org.springframework.beans.factory.annotation.Autowired;
 import org.springframework.stereotype.Service;

 import com.newgen.bugtracking.dao.TicketAssignmentDao;
 import com.newgen.bugtracking.dto.TicketAssignmentDTO;
 import com.newgen.bugtracking.entities.TicketAssignment;
 import com.newgen.bugtracking.repository.TicketAssignmentRepository;

 @Service
 public class TicketAssignmentService {

     @Autowired
     private TicketAssignmentRepository ticketAssignmentRepository;

     @Autowired
     private TicketAssignmentDao ticketAssignmentDao;

     public List<TicketAssignmentDTO> getAllAssignments() {
         return ticketAssignmentRepository.findAll().stream()
                 .map(ticketAssignmentDao::convertToDTO)
                 .collect(Collectors.toList());
     }

     public TicketAssignmentDTO getAssignmentById(Long id) {
         TicketAssignment assignment = ticketAssignmentRepository.findById(id)
                 .orElseThrow(() -> new RuntimeException("Assignment not found"));
         return ticketAssignmentDao.convertToDTO(assignment);
     }

     public TicketAssignmentDTO assignTicket(TicketAssignmentDTO assignmentDTO) {
         TicketAssignment assignment = ticketAssignmentDao.convertToEntity(assignmentDTO);
         ticketAssignmentRepository.save(assignment);
         return ticketAssignmentDao.convertToDTO(assignment);
     }

     public void deleteAssignment(Long id) {
         ticketAssignmentRepository.deleteById(id);
     }
 }