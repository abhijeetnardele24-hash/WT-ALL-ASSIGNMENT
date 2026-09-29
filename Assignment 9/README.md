# Assignment 9 - Scalable Real-Time Cricket Score Management System

## Objective
Build a scalable and real-time cricket score management system using Spring Boot that fetches, processes, and displays live cricket match information through REST APIs and a responsive frontend dashboard. The application simulates a live cricket scoring platform capable of handling ongoing matches, score updates, player statistics, and match summaries efficiently.

## Architecture & Tech Stack

### Backend (Spring Boot)
- **Framework**: Spring Boot
- **Language**: Java 17+
- **Data Access**: Spring Data JPA
- **Database**: H2 In-Memory Database (for rapid prototyping and ease of setup)
- **Web**: Spring Web (REST APIs)

### Frontend (React)
- **Framework**: React.js (Vite)
- **Styling**: Vanilla CSS with modern premium UI (Glassmorphism, Dark Mode)
- **Icons**: Lucide React

## Project Structure
The project is divided into two main modules:
1. `backend/`: The Spring Boot application providing REST APIs for matches.
2. `frontend/`: The React dashboard consuming the APIs and displaying live matches.

## Key Features
- View live and completed cricket matches.
- Detailed match summaries including teams, scoreline, and match status.
- Premium UI with dark mode support and interactive cards.
