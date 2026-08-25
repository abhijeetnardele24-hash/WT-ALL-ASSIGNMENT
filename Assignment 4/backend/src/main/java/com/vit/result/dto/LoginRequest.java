package com.vit.result.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "PRN number is required")
    private String prnNumber;

    @NotBlank(message = "Password is required")
    private String password;
}
