package com.vit.result.service;

import com.vit.result.model.StudentResult;
import com.vit.result.repository.StudentResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentResultService {

    @Autowired
    private StudentResultRepository repository;

    public List<StudentResult> getAllResults() {
        return repository.findAll();
    }

    public StudentResult saveResult(StudentResult result) {
        // Calculate totals for each subject (MSE out of 30, ESE out of 70 => Total out of 100)
        double sub1Total = result.getSub1Mse() + result.getSub1Ese();
        result.setSub1Total(sub1Total);

        double sub2Total = result.getSub2Mse() + result.getSub2Ese();
        result.setSub2Total(sub2Total);

        double sub3Total = result.getSub3Mse() + result.getSub3Ese();
        result.setSub3Total(sub3Total);

        double sub4Total = result.getSub4Mse() + result.getSub4Ese();
        result.setSub4Total(sub4Total);

        // Calculate Grand Total (out of 400)
        double grandTotal = sub1Total + sub2Total + sub3Total + sub4Total;
        result.setGrandTotal(grandTotal);

        // Calculate Percentage
        double percentage = grandTotal / 4.0;
        result.setPercentage(percentage);

        // Assign Grade
        String grade = calculateGrade(percentage);
        result.setGrade(grade);

        return repository.save(result);
    }

    private String calculateGrade(double percentage) {
        if (percentage >= 90) {
            return "O (Outstanding)";
        } else if (percentage >= 80) {
            return "A+ (Excellent)";
        } else if (percentage >= 70) {
            return "A (Very Good)";
        } else if (percentage >= 60) {
            return "B+ (Good)";
        } else if (percentage >= 50) {
            return "B (Above Average)";
        } else if (percentage >= 45) {
            return "C (Average)";
        } else if (percentage >= 40) {
            return "P (Pass)";
        } else {
            return "F (Fail)";
        }
    }
}
