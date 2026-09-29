package com.cricket.score.controller;

import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "*")
public class NewsController {

    @GetMapping("/latest")
    public List<Map<String, String>> getLatestNews() {
        return Arrays.asList(
            Map.of("title", "Inside Conrad's push to bring Nortje back to the Test fold", "time", "1h ago"),
            Map.of("title", "RCB release Grace Harris, Linsey Smith ahead of WPL 2027 Auction", "time", "3h ago"),
            Map.of("title", "ICC Meeting: Champions Trophy schedule to be finalized next week", "time", "5h ago"),
            Map.of("title", "Vaibhav Suryavanshi: The workings of a 14-year-old prodigy", "time", "6h ago"),
            Map.of("title", "Bumrah rested for upcoming T20 series against Sri Lanka", "time", "8h ago")
        );
    }

    @GetMapping("/featured")
    public Map<String, String> getFeaturedNews() {
        return Map.of(
            "title", "RCB release Grace Harris, Linsey Smith ahead of WPL 2027 Auction",
            "description", "UP Warriorz have released Deandra Dottin and Sneh Rana along with seven others in a major overhaul.",
            "imageUrl", "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            "category", "WPL 2027 AUCTION"
        );
    }

    @GetMapping("/sidebar")
    public List<Map<String, String>> getSidebarNews() {
        return Arrays.asList(
            Map.of("title", "The duality of IPL fielding: Spectacular highlights, shaky basics", "description", "From spectacular catches to data-driven preparation, fielding has transformed.", "imageUrl", "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60"),
            Map.of("title", "India vs New Zealand, 3rd ODI: Pitch report and stats", "description", "Holkar Stadium is known for high-scoring encounters.", "imageUrl", "https://images.unsplash.com/photo-1624526267942-ab0f0b580615?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60")
        );
    }
}
