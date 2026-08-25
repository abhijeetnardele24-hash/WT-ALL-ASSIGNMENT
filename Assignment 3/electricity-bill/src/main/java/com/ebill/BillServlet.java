package com.ebill;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * BillServlet.java
 * 
 * Electricity Bill Calculator Servlet
 * 
 * Billing Slabs:
 *   First 50 units        -> Rs. 3.50 per unit
 *   Next 100 units (51-150)  -> Rs. 4.00 per unit
 *   Next 100 units (151-250) -> Rs. 5.20 per unit
 *   Above 250 units       -> Rs. 6.50 per unit
 * 
 * @author WT Assignment
 */
@WebServlet("/calculate")
public class BillServlet extends HttpServlet {

    // Rate constants (in Rs per unit)
    private static final double RATE_SLAB1 = 3.50;   // 0-50 units
    private static final double RATE_SLAB2 = 4.00;   // 51-150 units
    private static final double RATE_SLAB3 = 5.20;   // 151-250 units
    private static final double RATE_SLAB4 = 6.50;   // above 250 units

    // Slab limits
    private static final int SLAB1_LIMIT = 50;
    private static final int SLAB2_LIMIT = 150;
    private static final int SLAB3_LIMIT = 250;

    // Fixed charges (meter rent + service charge)
    private static final double FIXED_CHARGE = 50.00;
    private static final double TAX_RATE     = 0.05;  // 5% electricity duty

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // ── 1. Read inputs from the HTML form ──
        String customerName  = request.getParameter("customerName");
        String customerID    = request.getParameter("customerID");
        String meterNo       = request.getParameter("meterNo");
        String unitsStr      = request.getParameter("units");

        // ── 2. Basic input validation ──
        if (customerName == null || customerName.trim().isEmpty() ||
            unitsStr == null || unitsStr.trim().isEmpty()) {
            request.setAttribute("error", "Please fill all required fields.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        int units;
        try {
            units = Integer.parseInt(unitsStr.trim());
            if (units < 0) throw new NumberFormatException();
        } catch (NumberFormatException e) {
            request.setAttribute("error", "Units must be a positive whole number.");
            request.getRequestDispatcher("/index.jsp").forward(request, response);
            return;
        }

        // ── 3. Calculate bill using slab rates ──
        double slab1Charge = 0, slab2Charge = 0, slab3Charge = 0, slab4Charge = 0;
        int    slab1Units  = 0, slab2Units  = 0, slab3Units  = 0, slab4Units  = 0;

        if (units <= SLAB1_LIMIT) {
            // All units in slab 1
            slab1Units  = units;
            slab1Charge = units * RATE_SLAB1;

        } else if (units <= SLAB2_LIMIT) {
            // Slab 1 full + some slab 2
            slab1Units  = SLAB1_LIMIT;
            slab1Charge = SLAB1_LIMIT * RATE_SLAB1;

            slab2Units  = units - SLAB1_LIMIT;
            slab2Charge = slab2Units * RATE_SLAB2;

        } else if (units <= SLAB3_LIMIT) {
            // Slab 1 + slab 2 full + some slab 3
            slab1Units  = SLAB1_LIMIT;
            slab1Charge = SLAB1_LIMIT * RATE_SLAB1;

            slab2Units  = SLAB2_LIMIT - SLAB1_LIMIT;   // 100 units
            slab2Charge = slab2Units * RATE_SLAB2;

            slab3Units  = units - SLAB2_LIMIT;
            slab3Charge = slab3Units * RATE_SLAB3;

        } else {
            // All 4 slabs
            slab1Units  = SLAB1_LIMIT;
            slab1Charge = SLAB1_LIMIT * RATE_SLAB1;

            slab2Units  = SLAB2_LIMIT - SLAB1_LIMIT;   // 100 units
            slab2Charge = slab2Units * RATE_SLAB2;

            slab3Units  = SLAB3_LIMIT - SLAB2_LIMIT;   // 100 units
            slab3Charge = slab3Units * RATE_SLAB3;

            slab4Units  = units - SLAB3_LIMIT;
            slab4Charge = slab4Units * RATE_SLAB4;
        }

        double energyCharge = slab1Charge + slab2Charge + slab3Charge + slab4Charge;
        double taxAmount     = energyCharge * TAX_RATE;
        double totalBill     = energyCharge + FIXED_CHARGE + taxAmount;

        // ── 4. Set all values as request attributes for result.jsp ──
        request.setAttribute("customerName",  customerName.trim());
        request.setAttribute("customerID",    customerID != null ? customerID.trim() : "N/A");
        request.setAttribute("meterNo",       meterNo    != null ? meterNo.trim()    : "N/A");
        request.setAttribute("units",         units);

        request.setAttribute("slab1Units",    slab1Units);
        request.setAttribute("slab1Rate",     RATE_SLAB1);
        request.setAttribute("slab1Charge",   String.format("%.2f", slab1Charge));

        request.setAttribute("slab2Units",    slab2Units);
        request.setAttribute("slab2Rate",     RATE_SLAB2);
        request.setAttribute("slab2Charge",   String.format("%.2f", slab2Charge));

        request.setAttribute("slab3Units",    slab3Units);
        request.setAttribute("slab3Rate",     RATE_SLAB3);
        request.setAttribute("slab3Charge",   String.format("%.2f", slab3Charge));

        request.setAttribute("slab4Units",    slab4Units);
        request.setAttribute("slab4Rate",     RATE_SLAB4);
        request.setAttribute("slab4Charge",   String.format("%.2f", slab4Charge));

        request.setAttribute("energyCharge",  String.format("%.2f", energyCharge));
        request.setAttribute("fixedCharge",   String.format("%.2f", FIXED_CHARGE));
        request.setAttribute("taxRate",       (int)(TAX_RATE * 100));
        request.setAttribute("taxAmount",     String.format("%.2f", taxAmount));
        request.setAttribute("totalBill",     String.format("%.2f", totalBill));

        // ── 5. Forward to result.jsp ──
        request.getRequestDispatcher("/result.jsp").forward(request, response);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // Redirect GET requests to the home page
        response.sendRedirect(request.getContextPath() + "/index.jsp");
    }
}
