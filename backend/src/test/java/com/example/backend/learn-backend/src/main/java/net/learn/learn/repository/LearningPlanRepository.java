// net.learn.learn.repository.LearningPlanRepository.java
package net.learn.learn.repository;

import net.learn.learn.model.LearningPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface LearningPlanRepository extends JpaRepository<LearningPlan, UUID> {
    List<LearningPlan> findByUsername(String username);
}
