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

    @GetMapping("/recent")
    public List<Match> getRecentMatches() {
        return matchRepository.findByMatchStatus("RECENT");
    }

    @GetMapping("/upcoming")
    public List<Match> getUpcomingMatches() {
        return matchRepository.findByMatchStatus("UPCOMING");
    }

    @PostMapping
    public Match createMatch(@RequestBody Match match) {
        if(match.getStartTime() == null) {
            match.setStartTime(LocalDateTime.now());
        }
        return matchRepository.save(match);
    }

    // Endpoint for simulating detailed Cricbuzz-like matches
    @PostMapping("/simulate")
    public String simulateMatches() {
        matchRepository.deleteAll(); // clear old

        // 1. LIVE MATCH
        Match m1 = new Match();
        m1.setSeriesName("India tour of Australia, 2026");
        m1.setMatchType("Test");
        m1.setTeam1("IND");
        m1.setTeam2("AUS");
        m1.setTeam1Score("345/6");
        m1.setTeam1Overs("89.4");
        m1.setTeam2Score("280");
        m1.setTeam2Overs("75.0");
        m1.setMatchStatus("LIVE");
        m1.setVenue("MCG, Melbourne");
        m1.setSummary("Day 3: 3rd Session - India lead by 65 runs.");
        m1.setToss("India won the toss and elected to bat");
        m1.setRunRate("CRR: 3.86");
        m1.setStartTime(LocalDateTime.now());
        
        // 2. LIVE MATCH T20
        Match m2 = new Match();
        m2.setSeriesName("T20 World Cup 2026");
        m2.setMatchType("T20I");
        m2.setTeam1("ENG");
        m2.setTeam2("SA");
        m2.setTeam1Score("185/5");
        m2.setTeam1Overs("20.0");
        m2.setTeam2Score("140/3");
        m2.setTeam2Overs("15.2");
        m2.setMatchStatus("LIVE");
        m2.setVenue("Wanderers, Johannesburg");
        m2.setSummary("South Africa need 46 runs in 28 balls.");
        m2.setToss("South Africa won the toss and elected to bowl");
        m2.setRunRate("CRR: 9.13 | REQ: 9.85");
        m2.setStartTime(LocalDateTime.now());

        // 3. RECENT MATCH
        Match m3 = new Match();
        m3.setSeriesName("Asia Cup 2026");
        m3.setMatchType("ODI");
        m3.setTeam1("PAK");
        m3.setTeam2("SL");
        m3.setTeam1Score("290/8");
        m3.setTeam1Overs("50.0");
        m3.setTeam2Score("291/4");
        m3.setTeam2Overs("48.3");
        m3.setMatchStatus("RECENT");
        m3.setVenue("Dubai International Stadium");
        m3.setSummary("Sri Lanka won by 6 wickets");
        m3.setToss("Pakistan won the toss and elected to bat");
        m3.setRunRate("CRR: 6.00");
        m3.setStartTime(LocalDateTime.now().minusDays(1));

        // 4. UPCOMING MATCH
        Match m4 = new Match();
        m4.setSeriesName("IPL 2026");
        m4.setMatchType("T20");
        m4.setTeam1("CSK");
        m4.setTeam2("MI");
        m4.setTeam1Score("");
        m4.setTeam1Overs("");
        m4.setTeam2Score("");
        m4.setTeam2Overs("");
        m4.setMatchStatus("UPCOMING");
        m4.setVenue("Wankhede Stadium, Mumbai");
        m4.setSummary("Match starts at 07:30 PM IST");
        m4.setToss("Toss yet to happen");
        m4.setRunRate("");
        m4.setStartTime(LocalDateTime.now().plusHours(5));

        matchRepository.saveAll(List.of(m1, m2, m3, m4));

        return "Simulated Cricbuzz matches added!";
    }
}
