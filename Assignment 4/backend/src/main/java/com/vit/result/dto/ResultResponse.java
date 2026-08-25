package com.vit.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResultResponse {
    private String prnNumber;
    private String studentName;
    private List<SubjectResult> subjects;
    private double overallCgpa;
    private String overallGrade;
}
