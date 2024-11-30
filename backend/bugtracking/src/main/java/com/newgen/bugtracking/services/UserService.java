package com.newgen.bugtracking.services;

import com.newgen.bugtracking.dao.ModuleDao;
import com.newgen.bugtracking.dao.UserDao;
import com.newgen.bugtracking.dto.TicketDTO;
import com.newgen.bugtracking.dto.UserDTO;
import com.newgen.bugtracking.entities.Role;
import com.newgen.bugtracking.entities.Ticket;
import com.newgen.bugtracking.entities.User;
import com.newgen.bugtracking.repository.TicketRepository;
import com.newgen.bugtracking.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
public class UserService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserDao userDao;
    @Autowired
    ModuleDao moduleDao;

    @Autowired
    TicketRepository ticketRepository;

    @Override
    public User loadUserByUsername(String email) {
        log.info("Loading user by email: {}", email);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User with email: {} not found", email);
                    return new UsernameNotFoundException("User with email: " + email + " not found");
                });
    }

    public List<UserDTO> getAllUsers() {
        log.info("Fetching all users");
        List<UserDTO> users = userRepository.findAll().stream()
                .map(userDao::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} users", users.size());
        return users;
    }

    @Transactional
    public List<UserDTO> getAllDevelopers() {
        log.info("Fetching all the developers");
        List<User> users = userRepository.findByRole(Role.DEVELOPER);
        if (users.isEmpty()) {
            log.info("No developers are available");
        }
        List<UserDTO> developers = users.stream()
                .map(userDao::convertToDTO)
                .collect(Collectors.toList());
        log.info("Found {} developers", developers.size());
        return developers;
    }

    public UserDTO getUserById(Long id) {
        log.info("Fetching user by ID: {}", id);
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            log.warn("User with ID: {} not found", id);
            return null;
        }
        log.info("User with ID: {} found", id);
        return userDao.convertToDTO(user);
    }

    public User getUserEntityById(Long id) {
        log.info("Fetching user entity by ID: {}", id);
        return userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User with ID: {} not found", id);
                    return new RuntimeException("User not found with ID: " + id);
                });
    }

//    public UserDTO createUser(UserDTO userDTO) {
//        log.info("Creating new user with email: {}", userDTO.getEmail());
//        User user = userDao.convertToUserEntity(userDTO);
//        userRepository.save(user);
//        log.info("User with email: {} successfully created", userDTO.getEmail());
//        return userDao.convertToDTO(user);
//    }

    public UserDTO updateUser(Long id, UserDTO userDTO, MultipartFile file) throws IOException {
        log.info("Updating user with ID: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("User with ID: {} not found", id);
                    return new RuntimeException("User not found");
                });

        user.setName(userDTO.getName());
        user.setEmail(userDTO.getEmail());
        user.setRole(userDTO.getRole());
        if (file != null && !file.isEmpty()) {
            log.info("Updating profile image for user with ID: {}", id);
            user.setProfileImage(file.getBytes());
        }
        userRepository.save(user);
        log.info("User with ID: {} successfully updated", id);
        return userDao.convertToDTO(user);
    }


    public void deleteUser(Long id) {
        log.info("Deleting user with id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Ticket> createdTickets = ticketRepository.findByCreatedBy(user);
        List<Ticket> assignedTickets = ticketRepository.findByAssignedDeveloper(user);
        if (createdTickets.isEmpty()) {
            log.info("No created tickets for the user with id: {}", id);
        } else {
            log.info("Found {} created tickets for the user. Unlinking them.", createdTickets.size());
            createdTickets.forEach(ticket -> ticket.setCreatedBy(null));
            ticketRepository.saveAll(createdTickets);
        }
        if (assignedTickets.isEmpty()) {
            log.info("No assigned tickets for the user with id: {}", id);
        } else {
            log.info("Found {} assigned tickets for the user. Unlinking them.", assignedTickets.size());
            assignedTickets.forEach(ticket -> ticket.setAssignedDeveloper(null));
            ticketRepository.saveAll(assignedTickets);
        }
        userRepository.delete(user);
        log.info("User with id: {} has been successfully deleted.", id);
    }

    public Map<String, List<TicketDTO>> getTicketsForUser(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        List<TicketDTO> createdTickets = ticketRepository.findByCreatedBy(user).stream()
                .map(this::mapToDTO)
                .toList();
        List<TicketDTO> assignedTickets = ticketRepository.findByAssignedDeveloper(user).stream()
                .map(this::mapToDTO)
                .toList();
        return Map.of(
                "createdTickets", createdTickets,
                "assignedTickets", assignedTickets
        );
    }

    private TicketDTO mapToDTO(Ticket ticket) {
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
}
