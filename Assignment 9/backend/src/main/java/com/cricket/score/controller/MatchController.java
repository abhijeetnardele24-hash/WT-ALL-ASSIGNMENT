package com.cricket.score.controller;

import com.cricket.score.model.Match;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private List<Match> scrapeRssMatches() {
        List<Match> matches = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("http://static.cricinfo.com/rss/livescores.xml")
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            Elements items = doc.select("item");
            long id = 1;
            for (Element item : items) {
                String title = item.select("title").text().replace("  ", " ").trim(); 
                
                Match m = new Match();
                m.setId(id++);
                m.setSeriesName("International & Domestic Matches");
                m.setMatchType("LIVE");
                m.setMatchStatus("LIVE");
                
                // Parse "TeamName Score v TeamName Score" using regex or split
                if (title.contains(" v ")) {
                    String[] teams = title.split(" v ");
                    
                    // Parse Team 1
                    String t1 = teams[0].trim();
                    m.setTeam1(extractTeamName(t1));
                    m.setTeam1Score(extractScore(t1));
                    
                    // Parse Team 2
                    String t2 = teams[1].trim();
                    m.setTeam2(extractTeamName(t2));
                    m.setTeam2Score(extractScore(t2));
                    
                    // Cleanup summary text so it's not just a repeat
                    String desc = item.select("description").text();
                    m.setSummary("Match in progress");
                } else {
                    m.setTeam1(title);
                    m.setTeam2("TBD");
                    m.setTeam1Score("");
                    m.setTeam2Score("");
                    m.setSummary(item.select("description").text());
                }
                
                matches.add(m);
                if(matches.size() >= 10) break;
            }
        } catch (Exception e) {
            Match err = new Match();
            err.setId(99L);
            err.setSeriesName("Real Match Feed Failed");
            err.setSummary(e.getMessage());
            matches.add(err);
        }
        return matches;
    }
    
    // Helper to separate letters from scores (e.g. "India Under-19s 494/10" -> "India Under-19s")
    private String extractTeamName(String raw) {
        return raw.replaceAll("[0-9/&\\*]+$", "").trim();
    }
    
    // Helper to extract just the score (e.g. "India Under-19s 494/10" -> "494/10")
    private String extractScore(String raw) {
        String name = extractTeamName(raw);
        return raw.replace(name, "").trim();
    }

    @GetMapping("/live")
    public List<Match> getLiveMatches() {
        return scrapeRssMatches();
    }

    @GetMapping("/recent")
    public List<Match> getRecentMatches() {
        return scrapeRssMatches();
    }

    @GetMapping("/upcoming")
    public List<Match> getUpcomingMatches() {
        return scrapeRssMatches();
    }

    @GetMapping
    public List<Match> getAllMatches() {
        return scrapeRssMatches();
    }

    @GetMapping("/{id}/scorecard")
    public Map<String, Object> getMatchScorecard(@PathVariable Long id) {
        Map<String, Object> scorecard = new HashMap<>();
        scorecard.put("battingTeam", "Current Batting Team");
        scorecard.put("batsmen", Arrays.asList(
            Map.of("name", "Striker", "runs", "45", "balls", "30", "fours", "5", "sixes", "1", "sr", "150.0", "status", "batting"),
            Map.of("name", "Non-Striker", "runs", "22", "balls", "15", "fours", "2", "sixes", "0", "sr", "146.6", "status", "batting")
        ));
        scorecard.put("bowlingTeam", "Current Bowling Team");
        scorecard.put("bowlers", Arrays.asList(
            Map.of("name", "Opening Bowler", "overs", "4.0", "maidens", "0", "runs", "32", "wickets", "2", "econ", "8.00")
        ));
        return scorecard;
    }
}
