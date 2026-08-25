<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/data.php';

// Temporary hack to copy the generated image from brain directory to project
$srcImg = 'C:\\Users\\Abhijeet Nardele\\.gemini\\antigravity\\brain\\dd5fb6e1-ab0c-46fc-801a-45998365edb5\\paypal_hero_illustration_1784995595907.png';
$destImg = __DIR__ . '/paypal_hero.png';
if (file_exists($srcImg) && !file_exists($destImg)) {
    copy($srcImg, $destImg);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'quick_pay') {
    $consumerUser = $_SESSION['consumer_user'] ?? null;
    $consumer = trim($_POST['quick_consumer'] ?? '');
    $captcha = trim($_POST['captcha'] ?? '');
    $agree = isset($_POST['agree']);

    if ($consumer === '' && $consumerUser) {
        $consumer = $consumerUser['consumer_id'];
    }

    if ($consumer === '' || $captcha === '' || !$agree) {
        $_SESSION['quick_pay_error'] = 'Enter consumer number, captcha and accept payment conditions.';
        redirectTo('index.php', ['section' => 'quick-pay']);
    }

    $_SESSION['quick_pay_consumer'] = $consumer;
    redirectTo('payment.php', ['consumer' => $consumer]);
}

$pageTitle = 'Home | Mahavitaran Demo';
$currentPage = 'index.php';
$quickPayError = flashMessage('quick_pay_error');
require_once __DIR__ . '/includes/header.php';
?>
<section class="hero-marketing position-relative" style="background: var(--bg-main); padding: 80px 0; overflow: hidden; border-bottom: 1px solid var(--border-color);">
    <div class="container site-width position-relative" style="z-index: 10;">
        <div class="row align-items-center">
            <div class="col-lg-5">
                <div class="pe-lg-5">
                    <h1 class="fw-bold mb-4" style="color: var(--text-main); font-size: 3rem; letter-spacing: -1px; line-height: 1.1;">
                        Electricity management, simplified.
                    </h1>
                    <p class="lead mb-5" style="color: var(--text-main); font-size: 1.15rem; max-width: 95%;">
                        Join millions of citizens in Maharashtra who use our platform to track usage, apply for new connections, and pay bills seamlessly.
                    </p>
                    <div class="d-flex flex-column flex-sm-row gap-3">
                        <a href="signup.php" class="btn btn-primary btn-lg fw-bold px-4 py-3 shadow-none">
                            Sign Up for Free
                        </a>
                        <a href="payment.php" class="btn btn-outline-primary btn-lg fw-bold px-4 py-3">
                            Quick Pay
                        </a>
                    </div>
                </div>
            </div>
            <div class="col-lg-7 position-relative mt-5 mt-lg-0 text-center">
                <img src="/ElectricityBill/paypal_hero.png" onerror="this.style.display='none'" alt="MSBEDC Illustration" class="img-fluid" style="max-height: 500px; animation: float 6s ease-in-out infinite;">
                <style>
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-15px); }
                        100% { transform: translateY(0px); }
                    }
                </style>
            </div>
        </div>
    </div>
</section>

<section class="portal-row container my-5">
    <div class="row text-center g-4 justify-content-center">
        <div class="col-md-3">
            <a class="portal-item rzp-card p-4 d-block h-100 text-decoration-none transition border-0" style="background: white;" href="consumer.php">
                <span class="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 text-white" style="width: 56px; height: 56px; background: var(--accent-blue); font-size: 1.5rem;"><i class="bi bi-person"></i></span>
                <strong class="d-block fs-6 mt-2 text-dark">Consumers</strong>
            </a>
        </div>
        <div class="col-md-3">
            <a class="portal-item rzp-card p-4 d-block h-100 text-decoration-none transition border-0" style="background: white;" href="supplier.php">
                <span class="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 text-white" style="width: 56px; height: 56px; background: var(--accent-dark-blue); font-size: 1.5rem;"><i class="bi bi-briefcase"></i></span>
                <strong class="d-block fs-6 mt-2 text-dark">Suppliers</strong>
            </a>
        </div>
        <div class="col-md-3">
            <a class="portal-item rzp-card p-4 d-block h-100 text-decoration-none transition border-0" style="background: white;" href="employee.php">
                <span class="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3 text-white" style="width: 56px; height: 56px; background: #009cde; font-size: 1.5rem;"><i class="bi bi-building"></i></span>
                <strong class="d-block fs-6 mt-2 text-dark">Employees</strong>
            </a>
        </div>
    </div>
</section>

<section class="marketing-features py-5" style="background: white;">
    <div class="container site-width py-4">
        <div class="text-center mb-5">
            <h2 class="fw-bold mb-3" style="color: var(--text-main); font-size: 2.25rem;">MSBEDC Pipeline & Procedures</h2>
            <p class="text-muted fs-5">Everything you need to know about our services, from connection to billing.</p>
        </div>
        
        <!-- PayPal Style Tabs -->
        <ul class="nav nav-pills justify-content-center mb-5 gap-2" id="msbedcTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active rounded-pill px-4 py-2 fw-bold" id="new-connection-tab" data-bs-toggle="pill" data-bs-target="#new-connection" type="button" role="tab" style="color: var(--text-main); font-size: 1.1rem;">New Connections</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link rounded-pill px-4 py-2 fw-bold" id="billing-tab" data-bs-toggle="pill" data-bs-target="#billing" type="button" role="tab" style="color: var(--text-main); font-size: 1.1rem;">Meter Reading & Billing</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link rounded-pill px-4 py-2 fw-bold" id="tariffs-tab" data-bs-toggle="pill" data-bs-target="#tariffs" type="button" role="tab" style="color: var(--text-main); font-size: 1.1rem;">Tariffs & Subsidies</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link rounded-pill px-4 py-2 fw-bold" id="grievance-tab" data-bs-toggle="pill" data-bs-target="#grievance" type="button" role="tab" style="color: var(--text-main); font-size: 1.1rem;">Grievance Redressal</button>
            </li>
        </ul>
        
        <style>
            #msbedcTabs .nav-link { background: transparent; border: 1px solid transparent; }
            #msbedcTabs .nav-link:hover { background: var(--bg-main); color: var(--accent-blue) !important; }
            #msbedcTabs .nav-link.active { background: var(--accent-blue); color: white !important; }
        </style>

        <div class="tab-content" id="msbedcTabsContent">
            <!-- New Connection Tab -->
            <div class="tab-pane fade show active" id="new-connection" role="tabpanel">
                <div class="row align-items-center">
                    <div class="col-md-6 pe-md-5 mb-4 mb-md-0">
                        <h3 class="fw-bold mb-3" style="color: var(--text-main);">Pipeline for New Connections</h3>
                        <p class="mb-4" style="color: var(--text-muted); font-size: 1.05rem;">We have streamlined the process of acquiring a new electricity connection. Our digital pipeline ensures full transparency and quick turnarounds.</p>
                        <ul class="list-unstyled">
                            <li class="mb-3 d-flex"><i class="bi bi-1-circle-fill text-primary fs-4 me-3"></i> <div><strong>Submit Application:</strong> Fill the A1 form online with ID and address proof.</div></li>
                            <li class="mb-3 d-flex"><i class="bi bi-2-circle-fill text-primary fs-4 me-3"></i> <div><strong>Site Inspection:</strong> Engineer conducts a feasibility study within 48 hours.</div></li>
                            <li class="mb-3 d-flex"><i class="bi bi-3-circle-fill text-primary fs-4 me-3"></i> <div><strong>Quote & Payment:</strong> Receive an estimate and pay the security deposit instantly.</div></li>
                            <li class="mb-3 d-flex"><i class="bi bi-4-circle-fill text-primary fs-4 me-3"></i> <div><strong>Meter Installation:</strong> Smart meter installed and activated within 7 working days.</div></li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <div class="p-5 rounded-4" style="background: var(--bg-main);">
                            <h5 class="fw-bold text-center mb-4">Required Documents</h5>
                            <div class="d-flex flex-wrap gap-2 justify-content-center">
                                <span class="badge bg-white text-dark border p-2 px-3">Aadhar Card</span>
                                <span class="badge bg-white text-dark border p-2 px-3">Property Tax Receipt</span>
                                <span class="badge bg-white text-dark border p-2 px-3">NOC from Builder</span>
                                <span class="badge bg-white text-dark border p-2 px-3">Passport Photo</span>
                            </div>
                            <div class="text-center mt-4">
                                <a href="#" class="btn btn-outline-primary px-4 fw-bold">Download Full Checklist</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Billing Tab -->
            <div class="tab-pane fade" id="billing" role="tabpanel">
                <div class="row align-items-center flex-row-reverse">
                    <div class="col-md-6 ps-md-5 mb-4 mb-md-0">
                        <h3 class="fw-bold mb-3" style="color: var(--text-main);">Smart Metering & Automated Billing</h3>
                        <p class="mb-4" style="color: var(--text-muted); font-size: 1.05rem;">With the rollout of AMI (Advanced Metering Infrastructure), MSBEDC eliminates manual errors and enables dynamic, real-time consumption tracking.</p>
                        <ul class="list-unstyled">
                            <li class="mb-3"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Automated Reads:</strong> Meters sync data via RF/GPRS to the central MDM system on the 1st of every month.</li>
                            <li class="mb-3"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Dynamic Billing:</strong> Invoices are instantly generated and dispatched via SMS, Email, and WhatsApp.</li>
                            <li class="mb-3"><i class="bi bi-check-circle-fill text-success me-2"></i> <strong>Prepaid Integration:</strong> Option to switch to a prepaid smart meter model to control daily expenditures.</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <div class="p-5 rounded-4 text-center" style="background: var(--accent-dark-blue); color: white;">
                            <i class="bi bi-lightning-charge display-1 mb-3"></i>
                            <h4 class="fw-bold">No More Surprises</h4>
                            <p>Track your daily usage on the Consumer Dashboard and set alerts when you cross budget thresholds.</p>
                            <a href="dashboard.php" class="btn btn-light rounded-pill fw-bold px-4 mt-2" style="color: var(--accent-dark-blue);">View Dashboard</a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tariffs Tab -->
            <div class="tab-pane fade" id="tariffs" role="tabpanel">
                <div class="row align-items-center">
                    <div class="col-md-6 pe-md-5 mb-4 mb-md-0">
                        <h3 class="fw-bold mb-3" style="color: var(--text-main);">Transparent Tariffs & Subsidies</h3>
                        <p class="mb-4" style="color: var(--text-muted); font-size: 1.05rem;">MSBEDC categorizes consumers to ensure fair distribution of costs, with heavy subsidies applied for BPL and agricultural sectors.</p>
                        <div class="table-responsive">
                            <table class="table table-borderless align-middle">
                                <thead>
                                    <tr style="border-bottom: 2px solid var(--border-color);">
                                        <th>Category</th>
                                        <th>Base Rate</th>
                                        <th>Subsidy</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td class="fw-bold text-dark">Residential (LT-I)</td>
                                        <td>₹4.50 / unit</td>
                                        <td class="text-success">None</td>
                                    </tr>
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <td class="fw-bold text-dark">Agricultural (LT-IV)</td>
                                        <td>₹2.00 / unit</td>
                                        <td class="text-success">Up to 75%</td>
                                    </tr>
                                    <tr>
                                        <td class="fw-bold text-dark">Commercial (LT-II)</td>
                                        <td>₹7.80 / unit</td>
                                        <td class="text-success">None</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <a href="bill.php" class="text-primary fw-bold text-decoration-none">Open Tariff Calculator <i class="bi bi-arrow-right"></i></a>
                    </div>
                    <div class="col-md-6">
                        <div class="p-5 rounded-4" style="background: var(--bg-main);">
                            <h5 class="fw-bold mb-3"><i class="bi bi-info-circle text-primary me-2"></i> Solar Net Metering</h5>
                            <p class="mb-0 text-muted">Install rooftop solar panels and export excess energy back to the grid. Your monthly bill will be adjusted automatically against the exported units based on the state's net-metering policy.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grievance Tab -->
            <div class="tab-pane fade" id="grievance" role="tabpanel">
                <div class="row align-items-center text-center px-4">
                    <div class="col-12 mb-4">
                        <h3 class="fw-bold mb-3" style="color: var(--text-main);">Grievance Redressal Mechanism</h3>
                        <p class="text-muted mx-auto" style="max-width: 600px;">We are committed to resolving your issues promptly. Follow our escalation matrix for any unsolved billing or supply quality disputes.</p>
                    </div>
                    
                    <div class="col-md-4 mb-4">
                        <div class="p-4 rounded-3 h-100 border" style="background: white;">
                            <h4 class="fw-bold text-primary mb-2">Level 1</h4>
                            <h6 class="fw-bold text-dark mb-3">Internal Grievance Cell (IGRC)</h6>
                            <p class="small text-muted mb-0">Register complaints via the toll-free number or portal. Resolution target: 7 Days.</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="p-4 rounded-3 h-100 border" style="background: white;">
                            <h4 class="fw-bold text-primary mb-2">Level 2</h4>
                            <h6 class="fw-bold text-dark mb-3">Consumer Grievance Forum (CGRF)</h6>
                            <p class="small text-muted mb-0">If IGRC fails, escalate to the regional forum. Resolution target: 60 Days.</p>
                        </div>
                    </div>
                    <div class="col-md-4 mb-4">
                        <div class="p-4 rounded-3 h-100 border" style="background: white;">
                            <h4 class="fw-bold text-primary mb-2">Level 3</h4>
                            <h6 class="fw-bold text-dark mb-3">Electricity Ombudsman</h6>
                            <p class="small text-muted mb-0">Final appellate authority appointed by MERC for unresolved cases.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
