<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Electricity Bill Calculator</title>
    <!-- Bootstrap for layout only -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Modern Font: Inter (iOS / Vercel style) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <style>
        :root {
            /* Light Theme */
            --bg-color: #fafafa;
            --text-primary: #111111;
            --text-secondary: #666666;
            --card-bg: rgba(255, 255, 255, 0.65);
            --card-border: rgba(0, 0, 0, 0.08);
            --input-bg: #ffffff;
            --input-border: #eaeaea;
            --input-focus: #000000;
            --btn-bg: #000000;
            --btn-text: #ffffff;
            --btn-hover: #333333;
            --accent: #0070f3;
            --glass-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.05);
            --gradient-1: rgba(0, 112, 243, 0.1);
            --gradient-2: rgba(255, 0, 128, 0.05);
        }

        [data-theme="dark"] {
            /* Dark Theme */
            --bg-color: #000000;
            --text-primary: #ffffff;
            --text-secondary: #888888;
            --card-bg: rgba(17, 17, 17, 0.5);
            --card-border: rgba(255, 255, 255, 0.12);
            --input-bg: #111111;
            --input-border: #333333;
            --input-focus: #ffffff;
            --btn-bg: #ffffff;
            --btn-text: #000000;
            --btn-hover: #cccccc;
            --accent: #3291ff;
            --glass-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
            --gradient-1: rgba(50, 145, 255, 0.15);
            --gradient-2: rgba(255, 100, 100, 0.08);
        }

        * {
            box-sizing: border-box;
            transition: background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: var(--bg-color);
            color: var(--text-primary);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            background-image: 
                radial-gradient(circle at 15% 40%, var(--gradient-1), transparent 30%),
                radial-gradient(circle at 85% 60%, var(--gradient-2), transparent 30%);
            background-attachment: fixed;
            margin: 0;
            -webkit-font-smoothing: antialiased;
        }

        /* Navbar */
        .navbar-custom {
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            background: transparent;
            border-bottom: 1px solid var(--card-border);
            padding: 1.2rem 0;
            position: sticky;
            top: 0;
            z-index: 1000;
        }

        .navbar-brand {
            font-weight: 600;
            color: var(--text-primary) !important;
            letter-spacing: -0.03em;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.1rem;
            text-decoration: none;
        }

        .theme-toggle {
            background: transparent;
            border: 1px solid var(--card-border);
            color: var(--text-primary);
            border-radius: 50%;
            width: 42px;
            height: 42px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            backdrop-filter: blur(8px);
        }

        .theme-toggle:hover {
            background: var(--card-bg);
            transform: scale(1.05);
        }

        /* Hero */
        .hero {
            text-align: center;
            padding: 5rem 1rem 3rem;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            opacity: 0;
        }

        .hero h1 {
            font-weight: 700;
            font-size: clamp(2.5rem, 6vw, 4.5rem);
            letter-spacing: -0.05em;
            line-height: 1.05;
            margin-bottom: 1rem;
            background: linear-gradient(to bottom right, var(--text-primary), var(--text-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .hero p {
            color: var(--text-secondary);
            font-size: 1.125rem;
            max-width: 500px;
            margin: 0 auto;
            letter-spacing: -0.01em;
            line-height: 1.6;
        }

        /* Glassmorphism Card */
        .glass-card {
            background: var(--card-bg);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid var(--card-border);
            border-radius: 24px;
            padding: 3rem;
            box-shadow: var(--glass-shadow);
            max-width: 580px;
            margin: 0 auto 5rem;
            animation: slideUpFade 1s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
            opacity: 0;
        }

        /* Form Inputs */
        .form-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: var(--text-primary);
            margin-bottom: 0.6rem;
            display: flex;
            justify-content: space-between;
        }

        .input-group {
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid var(--input-border);
            background: var(--input-bg);
            transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-group:focus-within {
            border-color: var(--input-focus);
            box-shadow: 0 0 0 1px var(--input-focus);
        }

        .input-group-text {
            background: transparent;
            border: none;
            color: var(--text-secondary);
            padding: 0.8rem 1rem;
        }

        .form-control {
            background: transparent;
            border: none;
            color: var(--text-primary);
            padding: 0.8rem 1rem 0.8rem 0;
            font-size: 1rem;
            box-shadow: none !important;
        }

        .form-control:focus {
            background: transparent;
            color: var(--text-primary);
        }

        .form-control::placeholder {
            color: var(--text-secondary);
            opacity: 0.5;
        }

        /* Modern Button */
        .btn-modern {
            background: var(--btn-bg);
            color: var(--btn-text);
            border: none;
            border-radius: 12px;
            padding: 1rem 1.5rem;
            font-weight: 600;
            font-size: 1rem;
            width: 100%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            letter-spacing: -0.01em;
            margin-top: 1rem;
        }

        .btn-modern:hover {
            background: var(--btn-hover);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        
        .btn-modern:active {
            transform: translateY(0);
        }

        /* Live Preview Widget */
        .live-preview {
            background: rgba(128, 128, 128, 0.04);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 1.5rem;
            margin-bottom: 2rem;
            display: none;
            animation: fadeIn 0.4s ease forwards;
        }
        
        .live-preview .amount {
            font-size: 2.2rem;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: -0.04em;
            line-height: 1;
            margin: 0.5rem 0 1rem;
        }

        .slab-tag {
            display: inline-block;
            font-size: 0.75rem;
            font-weight: 500;
            padding: 0.35rem 0.75rem;
            border-radius: 20px;
            background: var(--bg-color);
            border: 1px solid var(--card-border);
            margin: 0 0.4rem 0.4rem 0;
            color: var(--text-secondary);
        }

        /* Animations */
        @keyframes slideUpFade {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Range Slider */
        .form-range {
            height: 4px;
            border-radius: 2px;
            background: var(--input-border);
            appearance: none;
            outline: none;
            margin-top: 1rem;
        }
        
        .form-range::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--btn-bg);
            cursor: pointer;
            border: 2px solid var(--bg-color);
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .form-range::-webkit-slider-thumb:hover {
            transform: scale(1.2);
        }
        
        .invalid-msg {
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 6px;
            display: none;
        }

        @media (max-width: 576px) {
            .glass-card { padding: 2rem 1.5rem; border-radius: 20px; }
            .hero { padding: 3rem 1rem 2rem; }
        }
    </style>
</head>
<body>

    <nav class="navbar-custom">
        <div class="container d-flex justify-content-between align-items-center">
            <a class="navbar-brand" href="index.jsp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                </svg>
                ElectriBill
            </a>
            <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
                <i class="bi bi-moon-stars-fill" id="themeIcon"></i>
            </button>
        </div>
    </nav>

    <main class="container flex-grow-1">
        <div class="hero">
            <h1>Calculate with<br>precision.</h1>
            <p>A beautifully designed tool to estimate your electricity charges instantly.</p>
        </div>

        <div class="glass-card">
            <% String error = (String) request.getAttribute("error"); %>
            <% if (error != null && !error.isEmpty()) { %>
                <div class="alert alert-danger" style="background: rgba(255, 68, 68, 0.1); border: 1px solid rgba(255, 68, 68, 0.3); color: #ff4444; border-radius: 12px; font-size: 0.9rem; margin-bottom: 2rem;">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i><%= error %>
                </div>
            <% } %>

            <form id="billForm" action="calculate" method="post" novalidate>
                
                <div class="row g-4 mb-4">
                    <div class="col-md-6">
                        <label class="form-label">Full Name</label>
                        <div class="input-group" id="nameGroup">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" class="form-control" id="customerName" name="customerName" placeholder="John Doe" required autocomplete="off">
                        </div>
                        <div class="invalid-msg" id="nameErr">Name is required</div>
                    </div>
                    
                    <div class="col-md-6">
                        <label class="form-label">Meter Number <span style="color:var(--text-secondary);font-weight:400;">Optional</span></label>
                        <div class="input-group">
                            <span class="input-group-text"><i class="bi bi-upc-scan"></i></span>
                            <input type="text" class="form-control" id="meterNo" name="meterNo" placeholder="M-10293" autocomplete="off">
                        </div>
                    </div>
                </div>

                <div class="mb-5">
                    <label class="form-label">
                        <span>Units Consumed</span>
                        <span id="unitsDisplay" style="color:var(--text-secondary);font-weight:400;">0 kWh</span>
                    </label>
                    <div class="input-group" id="unitsGroup">
                        <span class="input-group-text"><i class="bi bi-lightning"></i></span>
                        <input type="number" class="form-control" id="units" name="units" placeholder="e.g. 150" min="0" required>
                    </div>
                    <input type="range" class="form-range" id="unitsSlider" min="0" max="600" value="0">
                    <div class="invalid-msg" id="unitsErr">Please enter valid units</div>
                </div>

                <div class="live-preview" id="livePreview">
                    <p class="text-secondary mb-1" style="font-size: 0.875rem;">Estimated Monthly Bill</p>
                    <div class="amount" id="estAmount">₹0.00</div>
                    <div id="slabBadges" class="mt-2"></div>
                </div>

                <button type="submit" class="btn-modern" id="submitBtn">
                    <span>Calculate Bill</span>
                    <i class="bi bi-arrow-right"></i>
                </button>
            </form>
        </div>
    </main>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script>
        $(document).ready(function() {
            
            // --- Theme Logic ---
            const toggleBtn = $('#themeToggle');
            const themeIcon = $('#themeIcon');
            const html = $('html');
            
            const savedTheme = localStorage.getItem('theme') || 'dark';
            setTheme(savedTheme);

            toggleBtn.on('click', function() {
                const currentTheme = html.attr('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                setTheme(newTheme);
            });

            function setTheme(theme) {
                html.attr('data-theme', theme);
                localStorage.setItem('theme', theme);
                if (theme === 'dark') {
                    themeIcon.removeClass('bi-moon-stars-fill').addClass('bi-sun-fill');
                } else {
                    themeIcon.removeClass('bi-sun-fill').addClass('bi-moon-stars-fill');
                }
            }

            // --- Calculation Engine ---
            function calcEstimate(units) {
                if (isNaN(units) || units < 0) return null;
                
                let s1 = 0, s2 = 0, s3 = 0, s4 = 0;
                let activeSlabs = [];

                if (units > 0) activeSlabs.push("0-50 units @ ₹3.50");
                if (units > 50) activeSlabs.push("51-150 units @ ₹4.00");
                if (units > 150) activeSlabs.push("151-250 units @ ₹5.20");
                if (units > 250) activeSlabs.push("Above 250 @ ₹6.50");

                if      (units <= 50)  { s1 = units * 3.50; }
                else if (units <= 150) { s1 = 50 * 3.50; s2 = (units - 50)  * 4.00; }
                else if (units <= 250) { s1 = 50 * 3.50; s2 = 100 * 4.00; s3 = (units - 150) * 5.20; }
                else                   { s1 = 50 * 3.50; s2 = 100 * 4.00; s3 = 100 * 5.20; s4 = (units - 250) * 6.50; }
                
                let energy = s1 + s2 + s3 + s4;
                let tax = energy * 0.05;
                let total = energy + 50 + tax; 
                
                return { total: total, slabs: activeSlabs };
            }

            // --- UI Updates ---
            function updateUI(val) {
                let units = parseInt(val);
                if (!isNaN(units) && units > 0) {
                    let result = calcEstimate(units);
                    if(!result) return;
                    
                    $('#estAmount').text('₹' + result.total.toFixed(2));
                    $('#unitsDisplay').text(units + ' kWh');
                    
                    let badgesHtml = result.slabs.map(slab => `<span class="slab-tag">${slab}</span>`).join('');
                    $('#slabBadges').html(badgesHtml);
                    
                    if(!$('#livePreview').is(':visible')) {
                        $('#livePreview').slideDown(300);
                    }
                } else {
                    $('#livePreview').slideUp(300);
                    $('#unitsDisplay').text('0 kWh');
                }
            }

            $('#units').on('input', function() {
                let v = $(this).val();
                $('#unitsSlider').val(v);
                updateUI(v);
                $('#unitsGroup').css('border-color', '');
                $('#unitsErr').hide();
            });

            $('#unitsSlider').on('input', function() {
                let v = $(this).val();
                $('#units').val(v);
                updateUI(v);
            });

            // --- Validation ---
            $('#billForm').on('submit', function(e) {
                let valid = true;
                
                let name = $.trim($('#customerName').val());
                if (!name) {
                    $('#nameErr').show();
                    $('#nameGroup').css('border-color', '#ff4444');
                    valid = false;
                }

                let units = $('#units').val();
                if (!units || isNaN(units) || parseInt(units) < 0) {
                    $('#unitsErr').show();
                    $('#unitsGroup').css('border-color', '#ff4444');
                    valid = false;
                }

                if (!valid) {
                    e.preventDefault();
                } else {
                    $('#submitBtn').html('<div class="spinner-border spinner-border-sm me-2" role="status"></div> Calculating...').css('opacity', '0.7');
                }
            });
            
            $('#customerName').on('input', function() {
                $('#nameErr').hide();
                $('#nameGroup').css('border-color', '');
            });
        });
    </script>
</body>
</html>
