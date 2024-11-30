package com.newgen.bugtracking.dao;

import com.newgen.bugtracking.dto.ModuleDTO;
import com.newgen.bugtracking.entities.Module;
import com.newgen.bugtracking.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ModuleDao {

    @Autowired
    ModuleRepository moduleRepository;

    public ModuleDTO createModule(String moduleName) {
        if (moduleName == null || moduleName.trim().isEmpty()) {
            throw new IllegalArgumentException("Module name cannot be null or empty");
        }
        Module module = new Module();
        module.setName(moduleName);
        Module moduleEntity = moduleRepository.save(module);
        return convertToDTO(moduleEntity);
    }

    public ModuleDTO updateModule(Long moduleId, ModuleDTO moduleDto) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        module.setName(moduleDto.getName());
        return convertToDTO(moduleRepository.save(module));
    }

    public ModuleDTO getModuleById(Long moduleId) {
        Module module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new RuntimeException("Module not found"));
        return convertToDTO(module);
    }

    public List<ModuleDTO> getAllModules() {
        List<Module> modules = moduleRepository.findAll();
        return modules.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    public ModuleDTO convertToDTO(Module module) {
        ModuleDTO moduleDTO = new ModuleDTO();
        moduleDTO.setId(module.getId());
        moduleDTO.setName(module.getName());
        return moduleDTO;
    }

    public Module convertToEntity(ModuleDTO moduleDTO) {
        Module module = new Module();
        module.setName(moduleDTO.getName());
        return module;
    }
}