package com.cricket.score.controller;

import com.cricket.score.model.Match;
import com.cricket.score.repository.MatchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*") // Allows React frontend to access
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

    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        if(match.getStartTime() == null) {
            match.setStartTime(LocalDateTime.now());
        }
        return matchRepository.save(match);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match matchDetails) {
        return matchRepository.findById(id).map(match -> {
            match.setTeam1(matchDetails.getTeam1());
            match.setTeam2(matchDetails.getTeam2());
            match.setMatchStatus(matchDetails.getMatchStatus());
            match.setScore(matchDetails.getScore());
            match.setVenue(matchDetails.getVenue());
            match.setSummary(matchDetails.getSummary());
            return ResponseEntity.ok(matchRepository.save(match));
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint for simulating a live score update (mocked real-time)
    @PostMapping("/simulate")
    public String simulateMatches() {
        Match m1 = new Match();
        m1.setTeam1("India");
        m1.setTeam2("Australia");
        m1.setMatchStatus("LIVE");
        m1.setScore("IND 210/4 (18.2) - AUS 0/0");
        m1.setVenue("Wankhede Stadium");
        m1.setSummary("India is batting");
        m1.setStartTime(LocalDateTime.now());
        
        Match m2 = new Match();
        m2.setTeam1("England");
        m2.setTeam2("South Africa");
        m2.setMatchStatus("COMPLETED");
        m2.setScore("ENG 150/10 (19.5) - SA 151/4 (18.1)");
        m2.setVenue("Lord's Cricket Ground");
        m2.setSummary("South Africa won by 6 wickets");
        m2.setStartTime(LocalDateTime.now().minusHours(4));

        matchRepository.save(m1);
        matchRepository.save(m2);

        return "Simulated matches added!";
    }
}
