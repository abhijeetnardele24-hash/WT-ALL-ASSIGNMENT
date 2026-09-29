package com.cricket.score.controller;

import com.cricket.score.model.Match;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private List<Match> scrapeRssMatches() {
        List<Match> matches = new ArrayList<>();
        try {
            // Using Cricinfo Live Scores RSS which is robust and not blocked by anti-bot walls
            Document doc = Jsoup.connect("http://static.cricinfo.com/rss/livescores.xml")
                    .userAgent("Mozilla/5.0")
                    .timeout(10000)
                    .get();

            Elements items = doc.select("item");
            long id = 1;
            for (Element item : items) {
                String title = item.select("title").text(); 
                // Format: "TeamA 200/5 v TeamB 195/10 *"
                
                Match m = new Match();
                m.setId(id++);
                m.setSeriesName("International & Domestic Matches");
                m.setMatchType("LIVE");
                
                if (title.contains(" v ")) {
                    String[] parts = title.split(" v ");
                    m.setTeam1(parts[0].trim());
                    m.setTeam2(parts[1].trim());
                } else {
                    m.setTeam1(title);
                    m.setTeam2("TBD");
                }
                
                m.setMatchStatus("LIVE");
                m.setSummary(item.select("description").text());
                m.setTeam1Score("Details in Summary");
                m.setTeam2Score("");
                matches.add(m);
                
                if(matches.size() >= 10) break; // Limit to 10 latest live/recent matches
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
        return scrapeRssMatches(); // The RSS has upcoming schedules too if live is empty
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
