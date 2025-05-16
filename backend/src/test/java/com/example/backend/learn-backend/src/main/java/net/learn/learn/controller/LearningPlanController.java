package net.learn.learn.controller;

import net.learn.learn.dto.LearningPlanDTO;
import net.learn.learn.service.LearningPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/learning-plans")
@RequiredArgsConstructor
public class LearningPlanController {

    private final LearningPlanService learningPlanService;

    @GetMapping
    public List<LearningPlanDTO> getAllPlans(@AuthenticationPrincipal Principal principal) {
        return learningPlanService.getPlansByUser(principal.getName());
    }

    @PostMapping
    public ResponseEntity<LearningPlanDTO> createPlan(@Valid @RequestBody LearningPlanDTO dto,
                                                      @AuthenticationPrincipal Principal principal) {
        LearningPlanDTO created = learningPlanService.createPlan(dto, principal.getName());
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlan(@PathVariable UUID id, @AuthenticationPrincipal Principal principal) {
        learningPlanService.deletePlan(id, principal.getName());
        return ResponseEntity.ok("Learning plan deleted");
    }
}
