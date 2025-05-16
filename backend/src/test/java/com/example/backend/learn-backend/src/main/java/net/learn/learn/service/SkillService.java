package net.learn.learn.service;

import net.learn.learn.dto.SkillDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class SkillService {

    public List<SkillDTO> getAllSkills() {
        // Replace with actual DB logic
        return new ArrayList<>();
    }

    public SkillDTO createSkill(SkillDTO skillDto) {
        // create and return logic
        return skillDto;
    }

    public void deleteSkill(UUID id) {
        // delete logic
    }
}
