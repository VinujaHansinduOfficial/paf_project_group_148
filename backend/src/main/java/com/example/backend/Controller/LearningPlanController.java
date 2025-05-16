package net.learn.learn.controller;



import net.learn.learn.model.LearningPlan;
import net.learn.learn.repository.LearningPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/learning-plans")
public class LearningPlanController {

    @Autowired
    private LearningPlanRepository repository;

    @GetMapping
    public List<LearningPlan> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public LearningPlan create(@RequestBody LearningPlan plan) {
        return repository.save(plan);
    }
}

