package com.newgen.bugtracking.controller;

import com.newgen.bugtracking.dto.TicketAssignmentDTO;
import com.newgen.bugtracking.services.TicketAssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class TicketAssignmentController {

    @Autowired
    private TicketAssignmentService ticketAssignmentService;

    @GetMapping
    public ResponseEntity<List<TicketAssignmentDTO>> getAllAssignments() {
        return ResponseEntity.ok(ticketAssignmentService.getAllAssignments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TicketAssignmentDTO> getAssignmentById(@PathVariable
                                                                 Long id) {
        return ResponseEntity.ok(ticketAssignmentService.getAssignmentById(id));
    }

    @PostMapping
    public ResponseEntity<TicketAssignmentDTO> assignTicket(@RequestBody
                                                            TicketAssignmentDTO assignment) {
        return ResponseEntity.ok(ticketAssignmentService.assignTicket(assignment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAssignment(@PathVariable Long id) {
        ticketAssignmentService.deleteAssignment(id);
        return ResponseEntity.noContent().build();
    }
}
