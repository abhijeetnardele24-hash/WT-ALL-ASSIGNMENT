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

    private Document fetchRssFeed() throws Exception {
        // BBC Sport Cricket RSS feed is highly reliable and does not block bots
        return Jsoup.connect("https://feeds.bbci.co.uk/sport/cricket/rss.xml")
                .userAgent("Mozilla/5.0")
                .timeout(10000)
                .get();
    }

    @GetMapping("/latest")
    public List<Map<String, String>> getLatestNews() {
        List<Map<String, String>> newsList = new ArrayList<>();
        try {
            Document doc = fetchRssFeed();
            Elements items = doc.select("item");
            
            for (int i = 0; i < Math.min(6, items.size()); i++) {
                Map<String, String> news = new HashMap<>();
                news.put("title", items.get(i).select("title").text());
                // In XML, JSoup selects child tags easily
                news.put("time", items.get(i).select("pubDate").text().replace("+0000", "").replace("GMT", "").trim());
                newsList.add(news);
            }
        } catch (Exception e) {
            newsList.add(Map.of("title", "Real News RSS Feed Failed: " + e.getMessage(), "time", "Error"));
        }
        return newsList;
    }

    @GetMapping("/featured")
    public Map<String, String> getFeaturedNews() {
        Map<String, String> news = new HashMap<>();
        try {
            Document doc = fetchRssFeed();
            Element firstItem = doc.selectFirst("item");
            
            if (firstItem != null) {
                news.put("title", firstItem.select("title").text());
                news.put("description", firstItem.select("description").text());
            }
            // BBC RSS doesn't always have huge images, so we use a very dynamic HD cricket image from Unsplash
            news.put("imageUrl", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
            news.put("category", "LATEST GLOBAL TRENDING");
        } catch (Exception e) {
            news.put("title", "Connection Refused to RSS");
            news.put("description", "Provider is blocking automated requests.");
            news.put("imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3");
            news.put("category", "ERROR");
        }
        return news;
    }

    @GetMapping("/sidebar")
    public List<Map<String, String>> getSidebarNews() {
        List<Map<String, String>> sidebarList = new ArrayList<>();
        try {
            Document doc = fetchRssFeed();
            Elements items = doc.select("item");
            
            // Skip the first one since it's featured, grab 2nd and 3rd
            for (int i = 1; i <= 2 && i < items.size(); i++) {
                Map<String, String> news = new HashMap<>();
                news.put("title", items.get(i).select("title").text());
                news.put("description", items.get(i).select("description").text());
                news.put("imageUrl", i == 1 ? "https://images.unsplash.com/photo-1624526267942-ab0f0b580615?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60" : "https://images.unsplash.com/photo-1589801258579-18e091f4ca26?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60");
                sidebarList.add(news);
            }
        } catch (Exception e) {
            sidebarList.add(Map.of("title", "Sidebar Error", "description", e.getMessage(), "imageUrl", ""));
        }
        return sidebarList;
    }
}
