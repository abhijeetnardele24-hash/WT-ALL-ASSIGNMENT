package com.vit.result.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResult {
    private String subjectCode;
    private String subjectName;
    private int credits;
    private BigDecimal mseMarks;
    private BigDecimal eseMarks;
    private double totalMarks;
    private String letterGrade;
    private int gradePoint;
}
