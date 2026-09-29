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

    private Document fetchDocument(String url) throws Exception {
        return Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
                .timeout(10000)
                .get();
    }

    @GetMapping("/latest")
    public List<Map<String, String>> getLatestNews() {
        List<Map<String, String>> newsList = new ArrayList<>();
        try {
            Document doc = fetchDocument("https://www.cricbuzz.com/cricket-news");
            // The DOM for news on Cricbuzz often uses these classes:
            Elements items = doc.select(".cb-nws-hdln-anc");
            
            for (int i = 0; i < Math.min(6, items.size()); i++) {
                Map<String, String> news = new HashMap<>();
                news.put("title", items.get(i).text());
                news.put("time", "Just now");
                newsList.add(news);
            }
            if (newsList.isEmpty()) throw new Exception("No elements found");
        } catch (Exception e) {
            newsList.add(Map.of("title", "Real Live Data Fetch Failed (Blocked by Provider)", "time", "Error"));
        }
        return newsList;
    }

    @GetMapping("/featured")
    public Map<String, String> getFeaturedNews() {
        Map<String, String> news = new HashMap<>();
        try {
            Document doc = fetchDocument("https://www.cricbuzz.com/cricket-news");
            Element mainImage = doc.selectFirst("img[src*='cricbuzz']");
            Element mainTitle = doc.selectFirst("h1, h2");
            
            news.put("title", mainTitle != null ? mainTitle.text() : "Live Cricbuzz Update");
            news.put("description", "Latest update fetched directly from live web source.");
            
            if (mainImage != null && mainImage.hasAttr("src")) {
                news.put("imageUrl", mainImage.attr("src"));
            } else {
                news.put("imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3");
            }
            news.put("category", "CRICBUZZ LIVE");
        } catch (Exception e) {
            news.put("title", "Connection Refused");
            news.put("description", "Provider is blocking automated requests.");
            news.put("imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3");
            news.put("category", "ERROR");
        }
        return news;
    }

    @GetMapping("/sidebar")
    public List<Map<String, String>> getSidebarNews() {
        return Arrays.asList(
            Map.of("title", "Live Updates from Cricbuzz", "description", "Fetching direct feed...", "imageUrl", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3"),
            Map.of("title", "Match Analysis", "description", "Fetching direct feed...", "imageUrl", "https://images.unsplash.com/photo-1624526267942-ab0f0b580615?ixlib=rb-4.0.3")
        );
    }
}
