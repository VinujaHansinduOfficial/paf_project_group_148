package net.learn.learn.model;


import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlan {

    @Id
    @GeneratedValue
    private UUID id;

    private String title;

    private String description;

    private String username; // to associate plans with the user
}

