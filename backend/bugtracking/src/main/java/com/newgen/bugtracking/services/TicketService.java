package com.newgen.bugtracking.services;

import com.newgen.bugtracking.dao.TicketDao;
import com.newgen.bugtracking.dto.TicketDTO;
import com.newgen.bugtracking.entities.Priority;
import com.newgen.bugtracking.entities.Ticket;
import com.newgen.bugtracking.repository.TicketRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TicketService {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    TicketDao ticketDao;

    public List<TicketDTO> getAllTickets() {
        log.info("Fetching all tickets");
        List<TicketDTO> tickets = ticketRepository.findAll().stream()
                .map(ticketDao::convertToDTO)
                .collect(Collectors.toList());
        log.info("Retrieved {} tickets", tickets.size());
        return tickets;
    }

    public TicketDTO getTicketById(Long id) {
        log.info("Fetching ticket with ID: {}", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Ticket with ID: {} not found", id);
                    return new RuntimeException("Ticket not found");
                });
        log.info("Retrieved ticket: {}", ticket.getId());
        return ticketDao.convertToDTO(ticket);
    }

    public List<Ticket> getTicketsAssignedToDeveloper(Long developerId) {
        log.info("Fetching tickets assigned to developer ID: {}", developerId);
        List<Ticket> tickets = ticketDao.getTicketsAssignedToDeveloper(developerId);
        log.info("Retrieved {} tickets assigned to developer ID: {}", tickets.size(), developerId);
        return tickets;
    }

    public List<Ticket> getTicketsByPriority(Priority priority) {
        log.info("Fetching tickets with priority: {}", priority);
        List<Ticket> tickets = ticketDao.getTicketsByPriority(priority);
        log.info("Retrieved {} tickets with priority: {}", tickets.size(), priority);
        return tickets;
    }

    public List<TicketDTO> getTicketsByModule(Long moduleId) {
        log.info("Fetching tickets for module ID: {}", moduleId);
        List<TicketDTO> tickets = ticketDao.getTicketsByModule(moduleId);
        log.info("Retrieved {} tickets for module ID: {}", tickets.size(), moduleId);
        return tickets;
    }

    public TicketDTO assignTicket(TicketDTO ticketDTO, MultipartFile file) throws IOException {
        log.info("Creating a new ticket with title: {}", ticketDTO.getTitle());
        TicketDTO createdTicket = ticketDao.assignTicket(ticketDTO, file);
        log.info("Ticket created with ID: {}", createdTicket.getId());
        return createdTicket;
    }

    public TicketDTO updateTicket(Long id, TicketDTO ticketDTO, MultipartFile file) throws IOException {
        return ticketDao.updateTicket(id, ticketDTO, file);
    }

    public void deleteTicket(Long id) {
        log.info("Deleting ticket with ID: {}", id);
        if (!ticketRepository.existsById(id)) {
            log.error("Cannot delete. Ticket with ID: {} not found", id);
            throw new RuntimeException("Ticket not found");
        }
        ticketRepository.deleteById(id);
        log.info("Ticket with ID: {} deleted successfully", id);
    }
}
