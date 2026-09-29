package com.cricket.score.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "cricket_matches")
public class Match {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String team1;
    private String team2;
    private String matchStatus; // e.g., LIVE, COMPLETED, UPCOMING
    private String score; // e.g., "IND 150/4 (20) - AUS 145/8 (20)"
    private String venue;
    private String summary; // e.g., "India won by 5 runs"
    
    private LocalDateTime startTime;
}
