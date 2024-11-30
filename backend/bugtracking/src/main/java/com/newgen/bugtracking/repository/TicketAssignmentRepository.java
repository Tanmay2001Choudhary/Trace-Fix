 package com.newgen.bugtracking.repository;

 import java.util.List;

 import org.springframework.data.jpa.repository.JpaRepository;
 import org.springframework.stereotype.Repository;

 import com.newgen.bugtracking.entities.TicketAssignment;

 @Repository
 public interface TicketAssignmentRepository extends JpaRepository<TicketAssignment, Long> {
     List<TicketAssignment> findByDeveloper_Id(Long userId);
 }
