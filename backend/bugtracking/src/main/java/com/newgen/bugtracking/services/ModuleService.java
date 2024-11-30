package com.newgen.bugtracking.services;

import com.newgen.bugtracking.dao.ModuleDao;
import com.newgen.bugtracking.dto.ModuleDTO;
import com.newgen.bugtracking.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleService {

    @Autowired
    ModuleRepository moduleRepository;

    @Autowired
    ModuleDao moduleDao;

    public List<ModuleDTO> getAllModules() {
        return moduleDao.getAllModules();
    }

    public ModuleDTO getModuleById(Long id) {
        return moduleDao.getModuleById(id);
    }

    public ModuleDTO createModule(String moduleName) {
        return moduleDao.createModule(moduleName);
    }

    public ModuleDTO updateModule(Long id, ModuleDTO moduleDTO) {
        return moduleDao.updateModule(id, moduleDTO);
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }
}
