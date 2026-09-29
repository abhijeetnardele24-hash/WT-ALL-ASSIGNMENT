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
    
    private String seriesName; // e.g. "ICC World Cup 2027"
    private String matchType; // e.g. "T20I", "ODI", "Test"
    
    private String team1;
    private String team2;
    private String team1Score; // e.g. "150/4"
    private String team2Score; // e.g. "145/8"
    private String team1Overs; // e.g. "20.0"
    private String team2Overs; // e.g. "19.2"
    
    private String matchStatus; // LIVE, RECENT, UPCOMING
    private String venue;
    private String summary; // e.g. "India won by 5 runs"
    
    private String toss;
    private String runRate;
    
    private LocalDateTime startTime;
}
