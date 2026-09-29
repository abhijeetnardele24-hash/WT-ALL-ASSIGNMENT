package com.cricket.score;

import com.cricket.score.model.Match;
import com.cricket.score.repository.MatchRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import java.time.LocalDateTime;
import java.util.List;

@SpringBootApplication
public class CricketScoreApplication {

    public static void main(String[] args) {
        SpringApplication.run(CricketScoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(MatchRepository matchRepository) {
        return args -> {
            if (matchRepository.count() == 0) {
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
                
                Match m3 = new Match();
                m3.setSeriesName("Asia Cup 2026");
                m3.setMatchType("ODI");
                m3.setTeam1("Pakistan");
                m3.setTeam2("Sri Lanka");
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
            }
        };
    }
}
