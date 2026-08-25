package com.vit.result.controller;

import com.vit.result.dto.ResultResponse;
import com.vit.result.service.ResultService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('STUDENT')")
    public ResultResponse getMyResult(Authentication authentication) {
        String prnNumber = authentication.getName();
        return resultService.getResultByPrn(prnNumber);
    }

    @GetMapping("/{prnNumber}")
    @PreAuthorize("hasRole('FACULTY')")
    public ResultResponse getResultByPrn(@PathVariable String prnNumber) {
        return resultService.getResultByPrn(prnNumber);
    }
}
