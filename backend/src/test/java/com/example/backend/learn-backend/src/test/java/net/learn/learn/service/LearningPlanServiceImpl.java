package net.learn.learn.service;

import net.learn.learn.dto.LearningPlanDTO;
import net.learn.learn.model.LearningPlan;
import net.learn.learn.repository.LearningPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LearningPlanServiceImpl implements LearningPlanService {

    private final LearningPlanRepository learningPlanRepository;

    @Override
    public List<LearningPlanDTO> getPlansByUser(String username) {
        return learningPlanRepository.findByUsername(username).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LearningPlanDTO createPlan(LearningPlanDTO dto, String username) {
        LearningPlan plan = LearningPlan.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .username(username)
                .build();
        return mapToDTO(learningPlanRepository.save(plan));
    }

    @Override
    public void deletePlan(UUID id, String username) {
        LearningPlan plan = learningPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        if (!plan.getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }

        learningPlanRepository.deleteById(id);
    }

    private LearningPlanDTO mapToDTO(LearningPlan plan) {
        return LearningPlanDTO.builder()
                .id(plan.getId())
                .title(plan.getTitle())
                .description(plan.getDescription())
                .build();
    }
}
