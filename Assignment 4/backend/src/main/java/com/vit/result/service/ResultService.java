package com.vit.result.service;

import com.vit.result.dto.ResultResponse;
import com.vit.result.dto.SubjectResult;
import com.vit.result.entity.Marks;
import com.vit.result.entity.Student;
import com.vit.result.repository.MarksRepository;
import com.vit.result.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResultService {

    private final StudentRepository studentRepository;
    private final MarksRepository marksRepository;

    public ResultService(StudentRepository studentRepository, MarksRepository marksRepository) {
        this.studentRepository = studentRepository;
        this.marksRepository = marksRepository;
    }

    public ResultResponse getResultByPrn(String prnNumber) {
        Student student = studentRepository.findByPrnNumber(prnNumber)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Marks> allMarks = marksRepository.findByStudent(student);
        if (allMarks.isEmpty()) {
            throw new RuntimeException("Marks not found for this student");
        }

        List<SubjectResult> subjectResults = new ArrayList<>();
        double totalGradePoints = 0;
        int totalCredits = 0;

        for (Marks mark : allMarks) {
            double mse = mark.getMse().doubleValue();
            double ese = mark.getEse().doubleValue();

            // Total = (MSE/50)*30 + (ESE/100)*70
            double total = (mse / 50.0) * 30.0 + (ese / 100.0) * 70.0;
            
            // Grades: S 90+, A 80+, B 70+, C 60+, D 55+, E 50+, F below
            String letterGrade;
            int gradePoint;
            
            if (total >= 90) { letterGrade = "S"; gradePoint = 10; }
            else if (total >= 80) { letterGrade = "A"; gradePoint = 9; }
            else if (total >= 70) { letterGrade = "B"; gradePoint = 8; }
            else if (total >= 60) { letterGrade = "C"; gradePoint = 7; }
            else if (total >= 55) { letterGrade = "D"; gradePoint = 6; }
            else if (total >= 50) { letterGrade = "E"; gradePoint = 5; }
            else { letterGrade = "F"; gradePoint = 0; }

            SubjectResult sr = new SubjectResult(
                    mark.getSubject().getCode(),
                    mark.getSubject().getName(),
                    mark.getSubject().getCredits(),
                    mark.getMse(),
                    mark.getEse(),
                    Math.round(total * 100.0) / 100.0,
                    letterGrade,
                    gradePoint
            );
            subjectResults.add(sr);

            totalGradePoints += (gradePoint * mark.getSubject().getCredits());
            totalCredits += mark.getSubject().getCredits();
        }

        double cgpa = totalCredits > 0 ? (totalGradePoints / totalCredits) : 0;
        cgpa = Math.round(cgpa * 100.0) / 100.0; // 2 decimal places

        String overallGrade = getOverallGrade(cgpa);

        return new ResultResponse(
                student.getPrnNumber(),
                student.getName(),
                subjectResults,
                cgpa,
                overallGrade
        );
    }
    
    private String getOverallGrade(double cgpa) {
        if (cgpa >= 9.0) return "S";
        if (cgpa >= 8.0) return "A";
        if (cgpa >= 7.0) return "B";
        if (cgpa >= 6.0) return "C";
        if (cgpa >= 5.5) return "D";
        if (cgpa >= 5.0) return "E";
        return "F";
    }
}
