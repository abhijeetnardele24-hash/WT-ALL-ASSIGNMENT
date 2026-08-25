# ElectriBill — Premium Electricity Bill Calculator

![Java](https://img.shields.io/badge/Java-21-orange.svg)
![Jakarta EE](https://img.shields.io/badge/Jakarta%20EE-10-blue.svg)
![Apache Tomcat](https://img.shields.io/badge/Tomcat-10.1-yellow.svg)
![Maven](https://img.shields.io/badge/Maven-3.9-C71A22.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3.svg)

**ElectriBill** is a modern, responsive web application built with Java Servlets and JSP that accurately calculates monthly electricity bills based on government slab rates. It features a premium, glassmorphic UI heavily inspired by high-end tech platforms (like Vercel and Razorpay), complete with live estimation, dark/light mode switching, and a polished digital invoice view.

---

## ⚡ Features

### UI / UX Highlights
- **Premium Glassmorphism:** True glass UI using CSS `backdrop-filter` and translucent panels.
- **Dynamic Theming:** Seamless Dark and Light mode toggle built with vanilla JS and CSS variables (persists via `localStorage`).
- **Live Estimation Engine:** Real-time billing estimates updating instantly as the user types or drags the range slider.
- **Responsive Design:** Mobile-first approach using Bootstrap 5, optimized for all viewport sizes.
- **Modern Typography:** Utilizes the 'Inter' font stack (standard for Apple/Vercel interfaces) for crisp legibility.

### Backend Highlights
- **Jakarta EE 10:** Built using the latest `jakarta.servlet` API, entirely moving away from the legacy `javax` namespace.
- **MVC Pattern (Lightweight):** 
  - **View:** `index.jsp` handles input, `result.jsp` handles output formatting using JSTL.
  - **Controller/Model:** `BillServlet.java` handles request validation, business logic, and routing.
- **Robust Validation:** Dual-layer validation (jQuery on the frontend + Java exception handling on the backend).

---

## 🏗️ Architecture & Tech Stack

- **Language:** Java 21 LTS
- **Server:** Apache Tomcat 10.1.x
- **Build Tool:** Apache Maven 3.9+
- **Frontend Frameworks:** Bootstrap 5.3, jQuery 3.7.1, Bootstrap Icons
- **Templating:** JSP with JSTL (Jakarta Standard Tag Library)

### Directory Structure
```text
electricity-bill/
├── pom.xml                        # Maven dependencies & build configuration
├── build_and_run.bat              # Automation script for Windows deployment
└── src/
    └── main/
        ├── java/
        │   └── com/ebill/
        │       └── BillServlet.java    # Core billing logic & request routing
        └── webapp/
            ├── index.jsp               # Landing page with interactive form
            ├── result.jsp              # Dynamic invoice / receipt page
            └── WEB-INF/
                └── web.xml             # Deployment descriptor (Welcome file mapping)
```

---

## 🧮 Business Logic (Slab Rates)

The application calculates the total bill utilizing a progressive tier system. Rates are applied cumulatively based on total kilowatt-hours (kWh) consumed:

| Tier | Range (Units) | Rate (₹ per unit) |
|------|---------------|-------------------|
| 1    | 0 - 50        | ₹ 3.50            |
| 2    | 51 - 150      | ₹ 4.00            |
| 3    | 151 - 250     | ₹ 5.20            |
| 4    | Above 250     | ₹ 6.50            |

**Additional Charges:**
- **Fixed Meter Charge:** ₹ 50.00
- **Government Tax:** 5% on the total *energy charge* (excluding fixed charge).

---

## 🚀 Installation & Local Setup

### Prerequisites
Ensure your development environment meets the following requirements:
- **JDK 21** or higher (`JAVA_HOME` configured)
- **Maven 3.9+** (`MAVEN_HOME` configured)
- **Apache Tomcat 10.1+**

### Option A: Using the Automated Script (Windows Only)
For a seamless, one-click deployment to a local Tomcat server:
1. Ensure Tomcat is extracted to `C:\Tomcat10`.
2. Run the included batch script as Administrator:
   ```cmd
   build_and_run.bat
   ```
   *This script automatically compiles the `.java` files, copies the webapp to Tomcat's `webapps` directory, injects JSTL libraries via Maven, starts the server, and opens the app in your default browser.*

### Option B: Standard Maven Build
1. Navigate to the project root directory.
2. Package the application into a `.war` file:
   ```bash
   mvn clean package
   ```
3. Locate the generated file at `target/electricity-bill.war`.
4. Copy the `.war` file to your Tomcat `webapps/` directory:
   ```bash
   cp target/electricity-bill.war /path/to/tomcat/webapps/
   ```
5. Start Tomcat and navigate to: `http://localhost:8080/electricity-bill/`

---

## 👨‍💻 Development & Contribution

When modifying the UI (JSP/CSS/JS), Tomcat supports hot-reloading. You can edit `index.jsp` or `result.jsp` and simply refresh your browser. 
However, changes to `BillServlet.java` require a recompilation and a Tomcat restart.

If developing within an IDE (e.g., Eclipse IDE for Enterprise Java or IntelliJ IDEA Ultimate):
1. Import the project as an **Existing Maven Project**.
2. Add your local Tomcat 10.1 server to the IDE's Server runtime environments.
3. Right-click the project → **Run As → Run on Server**.

---
*Developed for Web Technologies Assignment.*
