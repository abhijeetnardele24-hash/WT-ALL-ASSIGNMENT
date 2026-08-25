<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bill Summary - ElectriBill</title>
    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Inter Font -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            /* Light Theme */
            --bg-color: #fafafa;
            --text-primary: #111111;
            --text-secondary: #666666;
            --card-bg: rgba(255, 255, 255, 0.8);
            --card-border: rgba(0, 0, 0, 0.08);
            --btn-bg: #000000;
            --btn-text: #ffffff;
            --btn-hover: #333333;
            --success: #0070f3;
            --glass-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.05);
            --table-border: #eaeaea;
            --gradient-1: rgba(0, 112, 243, 0.05);
        }

        [data-theme="dark"] {
            /* Dark Theme */
            --bg-color: #000000;
            --text-primary: #ffffff;
            --text-secondary: #888888;
            --card-bg: rgba(17, 17, 17, 0.6);
            --card-border: rgba(255, 255, 255, 0.12);
            --btn-bg: #ffffff;
            --btn-text: #000000;
            --btn-hover: #cccccc;
            --success: #3291ff;
            --glass-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
            --table-border: #333333;
            --gradient-1: rgba(50, 145, 255, 0.1);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: radial-gradient(circle at 50% -20%, var(--gradient-1), transparent 60%);
            background-attachment: fixed;
            margin: 0;
            -webkit-font-smoothing: antialiased;
            transition: background-color 0.4s ease, color 0.4s ease;
        }

        .navbar-custom {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid var(--card-border);
            padding: 1.2rem 0;
            transition: border-color 0.4s ease;
        }

        .navbar-brand {
            font-weight: 600;
            color: var(--text-primary) !important;
            display: flex;
            align-items: center;
            gap: 10px;
            text-decoration: none;
            letter-spacing: -0.03em;
        }

        .receipt-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: var(--glass-shadow);
            max-width: 650px;
            margin: 3rem auto 4rem;
            animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
            transition: background-color 0.4s, border-color 0.4s, box-shadow 0.4s;
        }

        .success-icon {
            width: 64px;
            height: 64px;
            background: rgba(50, 145, 255, 0.1);
            color: var(--success);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            margin: 0 auto 1.5rem;
            animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s forwards;
            opacity: 0;
        }

        .total-amount {
            font-size: clamp(3rem, 6vw, 4rem);
            font-weight: 700;
            text-align: center;
            letter-spacing: -0.05em;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
            line-height: 1;
        }

        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin: 2.5rem 0;
            padding: 1.5rem;
            background: rgba(128, 128, 128, 0.05);
            border-radius: 16px;
            border: 1px solid var(--card-border);
        }

        .meta-item {
            display: flex;
            flex-direction: column;
            gap: 0.3rem;
        }
        
        .meta-label {
            font-size: 0.75rem;
            color: var(--text-secondary);
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }

        .meta-value {
            font-weight: 500;
            font-size: 1.1rem;
            color: var(--text-primary);
        }

        .modern-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin: 2rem 0;
        }

        .modern-table th {
            color: var(--text-secondary);
            font-size: 0.875rem;
            font-weight: 500;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--table-border);
            text-align: left;
        }

        .modern-table td {
            padding: 1.2rem 0;
            border-bottom: 1px solid var(--table-border);
            color: var(--text-primary);
            font-size: 0.95rem;
        }
        
        .modern-table tr:last-child td {
            border-bottom: none;
        }

        .modern-table .amt-col {
            text-align: right;
            font-variant-numeric: tabular-nums;
        }

        .summary-section {
            border-top: 1px solid var(--table-border);
            padding-top: 1.5rem;
            margin-top: 1rem;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            color: var(--text-secondary);
            font-size: 0.95rem;
        }
        
        .summary-row.total {
            color: var(--text-primary);
            font-weight: 600;
            font-size: 1.2rem;
            border-top: 1px solid var(--table-border);
            padding-top: 1rem;
            margin-top: 0.5rem;
        }

        .actions {
            display: flex;
            gap: 1rem;
            margin-top: 3rem;
        }

        .btn-modern {
            background: var(--btn-bg);
            color: var(--btn-text);
            border: 1px solid transparent;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            font-weight: 600;
            flex: 1;
            text-align: center;
            text-decoration: none;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        
        .btn-outline {
            background: transparent;
            color: var(--text-primary);
            border: 1px solid var(--card-border);
        }

        .btn-modern:hover {
            transform: translateY(-2px);
            color: var(--btn-text);
        }
        
        .btn-outline:hover {
            background: var(--card-bg);
            color: var(--text-primary);
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.5); }
            to { opacity: 1; transform: scale(1); }
        }
        
        /* Print styles */
        @media print {
            body { background: white !important; color: black !important; }
            .receipt-card { box-shadow: none !important; border: none !important; margin: 0 !important; padding: 0 !important; }
            .actions, .navbar-custom { display: none !important; }
            .meta-grid { background: transparent !important; border: 1px solid #ccc !important; }
            * { color: black !important; }
        }

        @media (max-width: 576px) {
            .receipt-card { padding: 2rem 1.5rem; border-radius: 20px; }
            .meta-grid { grid-template-columns: 1fr; gap: 1rem; }
            .actions { flex-direction: column; }
        }
    </style>
</head>
<body>

    <nav class="navbar-custom">
        <div class="container">
            <a class="navbar-brand" href="index.jsp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                ElectriBill
            </a>
        </div>
    </nav>

    <div class="container">
        <div class="receipt-card">
            <div class="success-icon">
                <i class="bi bi-check2"></i>
            </div>
            
            <p class="text-center text-secondary mb-1" style="font-weight: 500;">Total Amount Due</p>
            <div class="total-amount">
                ₹<%= request.getAttribute("totalBill") %>
            </div>

            <div class="meta-grid">
                <div class="meta-item">
                    <span class="meta-label">Billed To</span>
                    <span class="meta-value"><%= request.getAttribute("customerName") %></span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Meter Number</span>
                    <span class="meta-value"><%= request.getAttribute("meterNo") %></span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Units Consumed</span>
                    <span class="meta-value"><%= request.getAttribute("units") %> kWh</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Date Generated</span>
                    <span class="meta-value">
                        <%= new java.text.SimpleDateFormat("MMM dd, yyyy").format(new java.util.Date()) %>
                    </span>
                </div>
            </div>

            <table class="modern-table">
                <thead>
                    <tr>
                        <th>Slab Details</th>
                        <th class="amt-col">Units</th>
                        <th class="amt-col">Rate</th>
                        <th class="amt-col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <% if ((Integer)request.getAttribute("slab1Units") > 0) { %>
                    <tr>
                        <td>0 - 50 units</td>
                        <td class="amt-col"><%= request.getAttribute("slab1Units") %></td>
                        <td class="amt-col">₹<%= String.format("%.2f", request.getAttribute("slab1Rate")) %></td>
                        <td class="amt-col">₹<%= request.getAttribute("slab1Charge") %></td>
                    </tr>
                    <% } %>
                    
                    <% if ((Integer)request.getAttribute("slab2Units") > 0) { %>
                    <tr>
                        <td>51 - 150 units</td>
                        <td class="amt-col"><%= request.getAttribute("slab2Units") %></td>
                        <td class="amt-col">₹<%= String.format("%.2f", request.getAttribute("slab2Rate")) %></td>
                        <td class="amt-col">₹<%= request.getAttribute("slab2Charge") %></td>
                    </tr>
                    <% } %>
                    
                    <% if ((Integer)request.getAttribute("slab3Units") > 0) { %>
                    <tr>
                        <td>151 - 250 units</td>
                        <td class="amt-col"><%= request.getAttribute("slab3Units") %></td>
                        <td class="amt-col">₹<%= String.format("%.2f", request.getAttribute("slab3Rate")) %></td>
                        <td class="amt-col">₹<%= request.getAttribute("slab3Charge") %></td>
                    </tr>
                    <% } %>
                    
                    <% if ((Integer)request.getAttribute("slab4Units") > 0) { %>
                    <tr>
                        <td>Above 250 units</td>
                        <td class="amt-col"><%= request.getAttribute("slab4Units") %></td>
                        <td class="amt-col">₹<%= String.format("%.2f", request.getAttribute("slab4Rate")) %></td>
                        <td class="amt-col">₹<%= request.getAttribute("slab4Charge") %></td>
                    </tr>
                    <% } %>
                </tbody>
            </table>

            <div class="summary-section">
                <div class="summary-row">
                    <span>Energy Charges</span>
                    <span>₹<%= request.getAttribute("energyCharge") %></span>
                </div>
                <div class="summary-row">
                    <span>Fixed Charges (Meter Rent)</span>
                    <span>₹<%= request.getAttribute("fixedCharge") %></span>
                </div>
                <div class="summary-row">
                    <span>Govt. Tax (<%= request.getAttribute("taxRate") %>%)</span>
                    <span>₹<%= request.getAttribute("taxAmount") %></span>
                </div>
                <div class="summary-row total">
                    <span>Total Bill</span>
                    <span>₹<%= request.getAttribute("totalBill") %></span>
                </div>
            </div>

            <div class="actions">
                <a href="index.jsp" class="btn-modern btn-outline">
                    <i class="bi bi-arrow-left"></i> Back to Calculator
                </a>
                <button onclick="window.print()" class="btn-modern">
                    <i class="bi bi-printer"></i> Print Receipt
                </button>
            </div>
        </div>
    </div>

    <script>
        // Set theme on load to prevent flash
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
    </script>
</body>
</html>
