package net.learn.learn.service;

import net.learn.learn.dto.LearningPlanDTO;

import java.util.List;
import java.util.UUID;

public interface LearningPlanService {

    List<LearningPlanDTO> getPlansByUser(String username);

    LearningPlanDTO createPlan(LearningPlanDTO dto, String username);

    void deletePlan(UUID id, String username);
}
