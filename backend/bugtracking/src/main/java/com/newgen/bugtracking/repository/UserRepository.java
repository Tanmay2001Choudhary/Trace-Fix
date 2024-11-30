package com.newgen.bugtracking.repository;

import com.newgen.bugtracking.entities.Role;
import com.newgen.bugtracking.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(Role role);

    @Query("SELECT u from User u WHERE u.role = 1 ORDER BY SIZE(u.assignedTickets) ASC")
    List<User> findDevelopersWithLowestTickets();
}
