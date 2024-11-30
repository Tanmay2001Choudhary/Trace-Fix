package com.newgen.bugtracking.repository;

import com.newgen.bugtracking.entities.Priority;
import com.newgen.bugtracking.entities.Ticket;
import com.newgen.bugtracking.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByStatus(String status);

    List<Ticket> findByAssignedDeveloperId(Long developerId);

    List<Ticket> findByModuleId(Long moduleId);

    List<Ticket> findByPriority(Priority priority);

    List<Ticket> findByCreatedBy(User user);

    List<Ticket> findByAssignedDeveloper(User user);
}