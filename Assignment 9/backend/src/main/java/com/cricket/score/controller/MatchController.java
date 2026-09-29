package com.cricket.score.controller;

import com.cricket.score.model.Match;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final String API_KEY = "1150e10d-04b8-4f8e-bea1-631552a7382e";
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    private List<Match> fetchCricApiMatches() {
        List<Match> matches = new ArrayList<>();
        try {
            String url = "https://api.cricapi.com/v1/currentMatches?apikey=" + API_KEY + "&offset=0";
            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = mapper.readTree(response);
            JsonNode dataNode = root.path("data");

            if (dataNode.isArray()) {
                long id = 1;
                for (JsonNode node : dataNode) {
                    Match m = new Match();
                    m.setId(id++);
                    
                    // Parse teams
                    JsonNode teams = node.path("teams");
                    m.setTeam1(teams.size() > 0 ? teams.get(0).asText() : "TBD");
                    m.setTeam2(teams.size() > 1 ? teams.get(1).asText() : "TBD");

                    m.setSeriesName(node.path("name").asText());
                    m.setMatchType(node.path("matchType").asText().toUpperCase());
                    m.setMatchStatus(node.path("matchStarted").asBoolean() ? "LIVE" : "UPCOMING");
                    m.setSummary(node.path("status").asText());
                    m.setVenue(node.path("venue").asText());
                    
                    // Default score to blank
                    m.setTeam1Score("");
                    m.setTeam2Score("");

                    // Parse detailed score array
                    JsonNode scores = node.path("score");
                    if (scores.isArray()) {
                        for (JsonNode scoreNode : scores) {
                            String inning = scoreNode.path("inning").asText();
                            String scoreString = scoreNode.path("r").asText() + "/" + scoreNode.path("w").asText() + " (" + scoreNode.path("o").asText() + " ov)";
                            
                            if (inning.contains(m.getTeam1())) {
                                m.setTeam1Score(scoreString);
                            } else if (inning.contains(m.getTeam2())) {
                                m.setTeam2Score(scoreString);
                            } else {
                                // Fallback
                                if(m.getTeam1Score().isEmpty()) m.setTeam1Score(scoreString);
                                else m.setTeam2Score(scoreString);
                            }
                        }
                    }

                    matches.add(m);
                    if (matches.size() >= 15) break; // Limit to 15 to keep UI fast
                }
            }
        } catch (Exception e) {
            Match err = new Match();
            err.setId(99L);
            err.setSeriesName("CricAPI Fetch Failed");
            err.setSummary(e.getMessage());
            matches.add(err);
        }
        return matches;
    }

    @GetMapping("/live")
    public List<Match> getLiveMatches() {
        return fetchCricApiMatches();
    }

    @GetMapping("/recent")
    public List<Match> getRecentMatches() {
        return fetchCricApiMatches();
    }

    @GetMapping("/upcoming")
    public List<Match> getUpcomingMatches() {
        return fetchCricApiMatches();
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return fetchCricApiMatches();
    }

    @GetMapping("/{id}/scorecard")
    public Map<String, Object> getMatchScorecard(@PathVariable String id) {
        // Detailed scorecard fallback (CricAPI full scorecard endpoint is heavy, we'll use a detailed realistic mock for now)
        Map<String, Object> scorecard = new HashMap<>();
        scorecard.put("battingTeam", "Current Batting Team");
        scorecard.put("batsmen", Arrays.asList(
            Map.of("name", "Virat Kohli", "runs", "82", "balls", "53", "fours", "6", "sixes", "4", "sr", "154.7", "status", "not out"),
            Map.of("name", "Hardik Pandya", "runs", "40", "balls", "37", "fours", "1", "sixes", "2", "sr", "108.1", "status", "c Babar b Nawaz")
        ));
        scorecard.put("bowlingTeam", "Current Bowling Team");
        scorecard.put("bowlers", Arrays.asList(
            Map.of("name", "Shaheen Afridi", "overs", "4.0", "maidens", "0", "runs", "34", "wickets", "0", "econ", "8.50"),
            Map.of("name", "Haris Rauf", "overs", "4.0", "maidens", "0", "runs", "36", "wickets", "2", "econ", "9.00")
        ));
        return scorecard;
    }
}
