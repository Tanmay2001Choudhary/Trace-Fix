package com.newgen.bugtracking.dao;

import com.newgen.bugtracking.dto.TicketDTO;
import com.newgen.bugtracking.entities.Module;
import com.newgen.bugtracking.entities.Priority;
import com.newgen.bugtracking.entities.Status;
import com.newgen.bugtracking.entities.Ticket;
import com.newgen.bugtracking.entities.User;
import com.newgen.bugtracking.repository.ModuleRepository;
import com.newgen.bugtracking.repository.TicketRepository;
import com.newgen.bugtracking.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Slf4j
public class TicketDao {

    @Autowired
    TicketRepository ticketRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ModuleRepository moduleRepository;

    @Autowired
    ModuleDao moduleDao;

    @Autowired
    UserDao userDao;

    @Transactional
    public TicketDTO assignTicket(TicketDTO ticketDto, MultipartFile file) throws IOException {
        Ticket ticket = convertToEntity(ticketDto);
        Module module;
        log.info("Module: {}", ticketDto.getModule());
        if (ticketDto.getModule() != null) {
            String moduleInput = ticketDto.getModule();
            log.info("Module is id: {}", isNumeric(moduleInput));
            if (isNumeric(moduleInput)) {
                long moduleId = Long.parseLong(moduleInput);
                module = moduleRepository.findById(moduleId).orElse(null);
                if (module == null) {
                    throw new RuntimeException("Module not found for ID: " + moduleId);
                }
            } else {
                log.info("Module input is not a valid ID, treating as custom module name: {}", moduleInput);
                module = moduleRepository.findByName(moduleInput).orElse(null);
                if (module == null) {
                    log.info("Custom module not found, creating a new one.");
                    module = new Module();
                    module.setName(moduleInput);
                    module = moduleRepository.save(module);
                    log.info("Created new custom module with ID: {}", module.getId());
                }
            }
        } else {
            throw new RuntimeException("Module information is missing in the request.");
        }
        ticket.setModule(module);
        if (file != null && !file.isEmpty()) {
            ticket.setBugImage(file.getBytes());
        }
        User assignedDeveloper;
        if ("true".equalsIgnoreCase(ticketDto.getAssignedTo())) {
            List<User> developers = userRepository.findDevelopersWithLowestTickets();
            if (developers.isEmpty()) {
                throw new RuntimeException("No developers available to assign the ticket");
            }
            assignedDeveloper = developers.get(0);
        } else {
            long userId = Long.parseLong(ticketDto.getAssignedTo());
            assignedDeveloper = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
        }
        ticket.setAssignedDeveloper(assignedDeveloper);

        // Synchronize the assigned ticket with the user
        assignedDeveloper.getAssignedTickets().add(ticket);

        long userId = Long.parseLong(ticketDto.getCreatedBy());
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
        ticket.setCreatedBy(creator);

        // Synchronize the created ticket with the user
        creator.getCreatedTickets().add(ticket);

        LocalDateTime currentTime = LocalDateTime.now();
        ticket.setCreatedAt(currentTime);
        ticket.setUpdatedAt(currentTime);

        ticket.setPriority(Priority.valueOf(ticketDto.getPriority().toUpperCase()));
        ticket.setStatus(Status.OPEN);
        Ticket ticketEntity = ticketRepository.save(ticket);
        return convertToDTO(ticketEntity);
    }

    @Transactional
    public TicketDTO updateTicket(Long id, TicketDTO ticketDto, MultipartFile file) throws IOException {
        log.info("Updating ticket with ID: {}", id);
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Ticket with ID: {} not found", id);
                    return new RuntimeException("Ticket not found");
                });

        ticket.setTitle(ticketDto.getTitle());
        ticket.setDescription(ticketDto.getDescription());
        Module module;
        log.info("Module: {}", ticketDto.getModule());
        if (ticketDto.getModule() != null) {
            String moduleInput = ticketDto.getModule();
            log.info("Module is id: {}", isNumeric(moduleInput));
            if (isNumeric(moduleInput)) {
                long moduleId = Long.parseLong(moduleInput);
                module = moduleRepository.findById(moduleId).orElse(null);
                if (module == null) {
                    throw new RuntimeException("Module not found for ID: " + moduleId);
                }
            } else {
                log.info("Module input is not a valid ID, treating as custom module name: {}", moduleInput);
                module = moduleRepository.findByName(moduleInput).orElse(null);
                if (module == null) {
                    log.info("Custom module not found, creating a new one.");
                    module = new Module();
                    module.setName(moduleInput);
                    module = moduleRepository.save(module);
                    log.info("Created new custom module with ID: {}", module.getId());
                }
            }
        } else {
            throw new RuntimeException("Module information is missing in the request.");
        }
        ticket.setModule(module);
        if (file != null && !file.isEmpty()) {
            ticket.setBugImage(file.getBytes());
        }
        User assignedDeveloper;
        if ("true".equalsIgnoreCase(ticketDto.getAssignedTo())) {
            List<User> developers = userRepository.findDevelopersWithLowestTickets();
            if (developers.isEmpty()) {
                throw new RuntimeException("No developers available to assign the ticket");
            }
            assignedDeveloper = developers.get(0);
        } else {
            long userId = Long.parseLong(ticketDto.getAssignedTo());
            assignedDeveloper = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
        }
        ticket.setAssignedDeveloper(assignedDeveloper);
        assignedDeveloper.getAssignedTickets().add(ticket);
        long userId = Long.parseLong(ticketDto.getCreatedBy());
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found for ID: " + userId));
        ticket.setCreatedBy(creator);
        creator.getCreatedTickets().add(ticket);
        LocalDateTime currentTime = LocalDateTime.now();
        ticket.setUpdatedAt(currentTime);
        ticket.setStatus(ticketDto.getStatus());
        ticket.setPriority(Priority.valueOf(ticketDto.getPriority().toUpperCase()));
        Ticket ticketEntity = ticketRepository.save(ticket);
        log.info("Ticket with ID: {} updated successfully", id);
        return convertToDTO(ticketEntity);
    }

    public TicketDTO convertToDTO(Ticket ticket) {
        TicketDTO ticketDto = new TicketDTO();
        ticketDto.setId(ticket.getId());
        ticketDto.setTitle(ticket.getTitle());
        ticketDto.setDescription(ticket.getDescription());
        ticketDto.setStatus(ticket.getStatus());
        ticketDto.setPriority(ticket.getPriority().getStringValue());
        ticketDto.setBugImage(ticket.getBugImage());
        if (ticket.getCreatedBy() != null) {
            ticketDto.setCreatedBy(ticket.getCreatedBy().getId().toString());
        }
        if (ticket.getAssignedDeveloper() != null) {
            ticketDto.setAssignedTo(userDao.convertToDTO(ticket.getAssignedDeveloper()).getId().toString());
        }
        if (ticket.getModule() != null) {
            ticketDto.setModule(moduleDao.convertToDTO(ticket.getModule()).getId().toString());
        }
        ticketDto.setCreatedAt(ticket.getCreatedAt());
        ticketDto.setUpdatedAt(ticket.getUpdatedAt());
        return ticketDto;
    }

    public Ticket convertToEntity(TicketDTO ticketDTO) {
        Ticket ticket = new Ticket();
        ticket.setTitle(ticketDTO.getTitle());
        ticket.setDescription(ticketDTO.getDescription());
        ticket.setBugImage(ticketDTO.getBugImage());
        ticket.setStatus(ticketDTO.getStatus());
        ticket.setPriority(Priority.valueOf(ticketDTO.getPriority().toUpperCase()));
        ticket.setCreatedAt(ticketDTO.getCreatedAt());
        ticket.setUpdatedAt(ticketDTO.getUpdatedAt());
        return ticket;
    }

    public List<Ticket> getTicketsAssignedToDeveloper(Long developerId) {
        return ticketRepository.findByAssignedDeveloperId(developerId);
    }

    public List<Ticket> getTicketsByPriority(Priority priority) {
        return ticketRepository.findByPriority(priority);
    }

    public List<TicketDTO> getTicketsByModule(Long moduleId) {
        List<Ticket> tickets = ticketRepository.findByModuleId(moduleId);
        return tickets.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private boolean isNumeric(String str) {
        if (str == null || str.isEmpty()) {
            return false;
        }
        return str.chars().allMatch(Character::isDigit);
    }
}
