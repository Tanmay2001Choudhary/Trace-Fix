// package com.newgen.bugtracking.services;
//
// import java.util.List;
// import java.util.stream.Collectors;
//
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
//
// import com.newgen.bugtracking.dao.PriorityDao;
// import com.newgen.bugtracking.dto.PriorityDTO;
// import com.newgen.bugtracking.entities.Priority;
// import com.newgen.bugtracking.repository.PriorityRepository;
//
// @Service
// public class PriorityService {
//
//     @Autowired
//     private PriorityRepository priorityRepository;
//
//     @Autowired
//     private PriorityDao priorityDao;
//
//     public List<PriorityDTO> getAllPriorities() {
//         return priorityRepository.findAll().stream()
//                 .map(priorityDao::convertToDTO)
//                 .collect(Collectors.toList());
//     }
//
//     public PriorityDTO getPriorityById(Long id) {
//         Priority priority = priorityRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Priority not found"));
//         return priorityDao.convertToDTO(priority);
//     }
//
//     public PriorityDTO createPriority(PriorityDTO priorityDTO) {
//         Priority priority = priorityDao.convertToEntity(priorityDTO);
//         priorityRepository.save(priority);
//         return priorityDao.convertToDTO(priority);
//     }
//
//     public PriorityDTO updatePriority(Long id, PriorityDTO priorityDTO) {
//         Priority priority = priorityRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Priority not found"));
//         priority.setName(priorityDTO.getName());
//         priorityRepository.save(priority);
//         return priorityDao.convertToDTO(priority);
//     }
//
//     public void deletePriority(Long id) {
//         priorityRepository.deleteById(id);
//     }
// }