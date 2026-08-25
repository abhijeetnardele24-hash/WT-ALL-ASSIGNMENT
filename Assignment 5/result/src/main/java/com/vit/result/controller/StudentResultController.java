package com.vit.result.controller;

import com.vit.result.model.StudentResult;
import com.vit.result.service.StudentResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "*") // Allow frontend to fetch data
public class StudentResultController {

    @Autowired
    private StudentResultService service;

    @GetMapping
    public List<StudentResult> getAllResults() {
        return service.getAllResults();
    }

    @PostMapping
    public ResponseEntity<StudentResult> addResult(@RequestBody StudentResult result) {
        StudentResult savedResult = service.saveResult(result);
        return ResponseEntity.ok(savedResult);
    }
}
