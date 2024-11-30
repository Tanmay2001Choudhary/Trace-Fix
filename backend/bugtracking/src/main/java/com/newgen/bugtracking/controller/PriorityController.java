// package com.newgen.bugtracking.controller;
//
// import java.util.List;
//
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
// import org.springframework.web.bind.annotation.PutMapping;
// import org.springframework.web.bind.annotation.RequestBody;
// import org.springframework.web.bind.annotation.RequestMapping;
// import org.springframework.web.bind.annotation.RestController;
//
// import com.newgen.bugtracking.dto.PriorityDTO;
// import com.newgen.bugtracking.services.PriorityService;
//
// @RestController
// @RequestMapping("/api/priorities")
// public class PriorityController {
//
// @Autowired
// private PriorityService priorityService;
//
// @GetMapping
// public ResponseEntity<List<PriorityDTO>> getAllPriorities() {
// return ResponseEntity.ok(priorityService.getAllPriorities());
// }
//
// @GetMapping("/{id}")
// public ResponseEntity<PriorityDTO> getPriorityById(@PathVariable Long id) {
// return ResponseEntity.ok(priorityService.getPriorityById(id));
// }
//
// @PostMapping
// public ResponseEntity<PriorityDTO> createPriority(@RequestBody PriorityDTO
// priority) {
// return ResponseEntity.ok(priorityService.createPriority(priority));
// }
//
// @PutMapping("/{id}")
// public ResponseEntity<PriorityDTO> updatePriority(@PathVariable Long id,
// @RequestBody PriorityDTO priority) {
// return ResponseEntity.ok(priorityService.updatePriority(id, priority));
// }
//
// @DeleteMapping("/{id}")
// public ResponseEntity<Void> deletePriority(@PathVariable Long id) {
// priorityService.deletePriority(id);
// return ResponseEntity.noContent().build();
// }
// }