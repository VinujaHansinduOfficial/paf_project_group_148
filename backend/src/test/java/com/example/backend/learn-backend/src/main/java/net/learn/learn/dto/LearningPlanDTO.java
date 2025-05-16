package net.learn.learn.dto;



import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningPlanDTO {

    private UUID id;

    @NotBlank
    private String title;

    private String description;
}

