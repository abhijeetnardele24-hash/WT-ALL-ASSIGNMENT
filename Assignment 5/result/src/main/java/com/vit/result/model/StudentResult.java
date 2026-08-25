package com.vit.result.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_results")
public class StudentResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String studentName;
    private String rollNumber;

    // Subject 1
    private Double sub1Mse;
    private Double sub1Ese;
    private Double sub1Total;

    // Subject 2
    private Double sub2Mse;
    private Double sub2Ese;
    private Double sub2Total;

    // Subject 3
    private Double sub3Mse;
    private Double sub3Ese;
    private Double sub3Total;

    // Subject 4
    private Double sub4Mse;
    private Double sub4Ese;
    private Double sub4Total;

    private Double grandTotal;
    private Double percentage;
    private String grade;

    // Constructors
    public StudentResult() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public Double getSub1Mse() {
        return sub1Mse;
    }

    public void setSub1Mse(Double sub1Mse) {
        this.sub1Mse = sub1Mse;
    }

    public Double getSub1Ese() {
        return sub1Ese;
    }

    public void setSub1Ese(Double sub1Ese) {
        this.sub1Ese = sub1Ese;
    }

    public Double getSub1Total() {
        return sub1Total;
    }

    public void setSub1Total(Double sub1Total) {
        this.sub1Total = sub1Total;
    }

    public Double getSub2Mse() {
        return sub2Mse;
    }

    public void setSub2Mse(Double sub2Mse) {
        this.sub2Mse = sub2Mse;
    }

    public Double getSub2Ese() {
        return sub2Ese;
    }

    public void setSub2Ese(Double sub2Ese) {
        this.sub2Ese = sub2Ese;
    }

    public Double getSub2Total() {
        return sub2Total;
    }

    public void setSub2Total(Double sub2Total) {
        this.sub2Total = sub2Total;
    }

    public Double getSub3Mse() {
        return sub3Mse;
    }

    public void setSub3Mse(Double sub3Mse) {
        this.sub3Mse = sub3Mse;
    }

    public Double getSub3Ese() {
        return sub3Ese;
    }

    public void setSub3Ese(Double sub3Ese) {
        this.sub3Ese = sub3Ese;
    }

    public Double getSub3Total() {
        return sub3Total;
    }

    public void setSub3Total(Double sub3Total) {
        this.sub3Total = sub3Total;
    }

    public Double getSub4Mse() {
        return sub4Mse;
    }

    public void setSub4Mse(Double sub4Mse) {
        this.sub4Mse = sub4Mse;
    }

    public Double getSub4Ese() {
        return sub4Ese;
    }

    public void setSub4Ese(Double sub4Ese) {
        this.sub4Ese = sub4Ese;
    }

    public Double getSub4Total() {
        return sub4Total;
    }

    public void setSub4Total(Double sub4Total) {
        this.sub4Total = sub4Total;
    }

    public Double getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(Double grandTotal) {
        this.grandTotal = grandTotal;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }
}
