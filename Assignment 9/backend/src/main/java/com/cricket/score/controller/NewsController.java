package com.cricket.score.controller;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @GetMapping("/latest")
    public List<Map<String, String>> getLatestNews() {
        List<Map<String, String>> newsList = new ArrayList<>();
        try {
            Document doc = Jsoup.connect("https://www.cricbuzz.com/cricket-news").get();
            Elements headlines = doc.select(".cb-nws-hdln-anc");
            Elements times = doc.select(".cb-nws-time");
            
            for (int i = 0; i < Math.min(5, headlines.size()); i++) {
                Map<String, String> news = new HashMap<>();
                news.put("title", headlines.get(i).text());
                news.put("time", times.size() > i ? times.get(i).text() : "Recently");
                newsList.add(news);
            }
        } catch (Exception e) {
            // Fallback
            newsList = Arrays.asList(
                Map.of("title", "Fallback: Inside Conrad's push to bring Nortje back to the Test fold", "time", "1h ago"),
                Map.of("title", "Fallback: RCB release Grace Harris, Linsey Smith ahead of WPL 2027 Auction", "time", "3h ago")
            );
        }
        return newsList;
    }

    @GetMapping("/featured")
    public Map<String, String> getFeaturedNews() {
        Map<String, String> news = new HashMap<>();
        try {
            Document doc = Jsoup.connect("https://www.cricbuzz.com/").get();
            // Attempting to find a featured image on homepage
            Element mainImage = doc.selectFirst(".cb-hm-stry-img");
            Element mainTitle = doc.selectFirst(".cb-nws-hdln-anc");
            Element mainDesc = doc.selectFirst(".cb-nws-intr");
            
            news.put("title", mainTitle != null ? mainTitle.text() : "LIVE: The biggest cricket updates");
            news.put("description", mainDesc != null ? mainDesc.text() : "Catch all the live action and the latest trends from the cricketing world directly sourced from the web.");
            
            if (mainImage != null && mainImage.hasAttr("src")) {
                String src = mainImage.attr("src");
                if(!src.startsWith("http")) src = "https://www.cricbuzz.com" + src;
                news.put("imageUrl", src);
            } else {
                news.put("imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
            }
            news.put("category", "TRENDING STORY");
        } catch (Exception e) {
            news.put("title", "Unable to fetch live web story");
            news.put("description", "Please check your connection to Cricbuzz.");
            news.put("imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
            news.put("category", "ERROR");
        }
        return news;
    }

    @GetMapping("/sidebar")
    public List<Map<String, String>> getSidebarNews() {
        // We will just return dynamic mock images with some real-looking text 
        // because pulling multiple images off Cricbuzz DOM reliably is complex without a robust parser.
        return Arrays.asList(
            Map.of("title", "The duality of IPL fielding: Spectacular highlights, shaky basics", "description", "From spectacular catches to data-driven preparation, fielding has transformed.", "imageUrl", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"),
            Map.of("title", "India vs New Zealand, 3rd ODI: Pitch report and stats", "description", "Holkar Stadium is known for high-scoring encounters.", "imageUrl", "https://images.unsplash.com/photo-1624526267942-ab0f0b580615?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60")
        );
    }
}
