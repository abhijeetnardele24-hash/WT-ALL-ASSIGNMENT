package com.cricket.score.controller;

import com.cricket.score.model.Match;
import com.cricket.score.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Arrays;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    @Autowired
    private MatchRepository matchRepository;

    @GetMapping
    public List<Match> getAllMatches() {
        return matchRepository.findAll();
    }

    @GetMapping("/live")
    public List<Match> getLiveMatches() {
        return matchRepository.findByMatchStatus("LIVE");
    }

    @GetMapping("/recent")
    public List<Match> getRecentMatches() {
        return matchRepository.findByMatchStatus("RECENT");
    }

    @GetMapping("/upcoming")
    public List<Match> getUpcomingMatches() {
        return matchRepository.findByMatchStatus("UPCOMING");
    }

    @GetMapping("/{id}/scorecard")
    public ResponseEntity<Map<String, Object>> getMatchScorecard(@PathVariable Long id) {
        // Massive mocked detailed scorecard for the requested match
        Map<String, Object> scorecard = new HashMap<>();
        
        // India Batsmen
        List<Map<String, String>> indBatsmen = Arrays.asList(
            Map.of("name", "Rohit Sharma", "runs", "45", "balls", "28", "fours", "6", "sixes", "2", "sr", "160.71", "status", "c Smith b Starc"),
            Map.of("name", "Virat Kohli", "runs", "82", "balls", "50", "fours", "8", "sixes", "3", "sr", "164.00", "status", "batting"),
            Map.of("name", "Suryakumar Yadav", "runs", "15", "balls", "8", "fours", "2", "sixes", "1", "sr", "187.50", "status", "batting")
        );
        
        // Australia Bowlers
        List<Map<String, String>> ausBowlers = Arrays.asList(
            Map.of("name", "Mitchell Starc", "overs", "4.0", "maidens", "0", "runs", "35", "wickets", "1", "econ", "8.75"),
            Map.of("name", "Pat Cummins", "overs", "4.0", "maidens", "0", "runs", "42", "wickets", "0", "econ", "10.50"),
            Map.of("name", "Adam Zampa", "overs", "3.0", "maidens", "0", "runs", "28", "wickets", "0", "econ", "9.33")
        );

        scorecard.put("battingTeam", "India");
        scorecard.put("batsmen", indBatsmen);
        scorecard.put("bowlingTeam", "Australia");
        scorecard.put("bowlers", ausBowlers);
        scorecard.put("currentPartnership", "45(22)");
        scorecard.put("lastWicket", "Rohit Sharma 45(28)");
        
        return ResponseEntity.ok(scorecard);
    }

    @PostMapping("/simulate")
    public String simulateMatches() {
        matchRepository.deleteAll(); // clear old schema data
        
        Match m1 = new Match();
        m1.setSeriesName("India tour of Australia, 2026");
        m1.setMatchType("T20I");
        m1.setTeam1("India");
        m1.setTeam2("Australia");
        m1.setTeam1Score("155/2");
        m1.setTeam1Overs("14.2");
        m1.setTeam2Score("0/0");
        m1.setTeam2Overs("0.0");
        m1.setMatchStatus("LIVE");
        m1.setVenue("MCG, Melbourne");
        m1.setSummary("India elected to bat");
        m1.setToss("India won the toss");
        m1.setRunRate("CRR: 10.91");
        m1.setStartTime(LocalDateTime.now());
        
        Match m2 = new Match();
        m2.setSeriesName("T20 World Cup 2026");
        m2.setMatchType("T20I");
        m2.setTeam1("England");
        m2.setTeam2("South Africa");
        m2.setTeam1Score("185/5");
        m2.setTeam1Overs("20.0");
        m2.setTeam2Score("140/3");
        m2.setTeam2Overs("15.2");
        m2.setMatchStatus("LIVE");
        m2.setVenue("Wanderers, Johannesburg");
        m2.setSummary("South Africa need 46 runs in 28 balls");
        m2.setToss("South Africa won the toss");
        m2.setRunRate("CRR: 9.13 | REQ: 9.85");
        m2.setStartTime(LocalDateTime.now());

        matchRepository.saveAll(List.of(m1, m2));
        return "Detailed matches simulated!";
    }
}
