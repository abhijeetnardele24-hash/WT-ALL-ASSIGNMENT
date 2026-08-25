<?php
require_once __DIR__ . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'logout') {
    unset($_SESSION['consumer_user'], $_SESSION['pending_auth']);
    redirectTo('index.php');
}

$consumerUser = $_SESSION['consumer_user'] ?? null;
$pageTitle = 'Consumer Dashboard | Mahavitaran Demo';
$currentPage = 'dashboard.php';
require_once __DIR__ . '/includes/header.php';
?>
<div class="d-flex" style="min-height: calc(100vh - 60px);">
    
    <!-- Razorpay Left Sidebar -->
    <?php if ($consumerUser): ?>
    <aside style="width: 260px; background: #ffffff; border-right: 1px solid var(--border-color); padding: 24px 16px; flex-shrink: 0;">
        <h6 style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 16px; padding-left: 12px; letter-spacing: 0.5px;">Recommended for you</h6>
        <ul class="nav flex-column gap-1 mb-4">
            <li class="nav-item">
                <a class="nav-link text-dark fw-medium d-flex align-items-center gap-3 active" href="dashboard.php" style="background: rgba(45, 104, 248, 0.08); border-radius: var(--radius-sm); color: var(--accent-blue) !important; padding: 10px 16px;">
                    <i class="bi bi-house-door"></i> Home
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-dark fw-medium d-flex align-items-center gap-3" href="payment.php" style="border-radius: var(--radius-sm); padding: 10px 16px; transition: background 0.2s;">
                    <i class="bi bi-arrow-left-right"></i> Transactions
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-dark fw-medium d-flex align-items-center gap-3" href="bill.php" style="border-radius: var(--radius-sm); padding: 10px 16px; transition: background 0.2s;">
                    <i class="bi bi-calculator"></i> Calculator
                </a>
            </li>
            <li class="nav-item">
                <a class="nav-link text-dark fw-medium d-flex align-items-center gap-3" href="about.php" style="border-radius: var(--radius-sm); padding: 10px 16px; transition: background 0.2s;">
                    <i class="bi bi-building"></i> Company Profile
                </a>
            </li>
        </ul>
        
        <h6 style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 16px; padding-left: 12px; letter-spacing: 0.5px;">Account Settings</h6>
        <ul class="nav flex-column gap-1">
            <li class="nav-item">
                <div class="nav-link text-dark d-flex align-items-center gap-3" style="padding: 10px 16px;">
                    <div class="rounded-circle bg-primary bg-opacity-10 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;">
                        <span class="fw-bold text-primary" style="font-size: 0.85rem;"><?php echo strtoupper(substr($consumerUser['name'], 0, 1)); ?></span>
                    </div>
                    <div style="line-height: 1.2;">
                        <div class="fw-bold" style="font-size: 0.85rem;"><?php echo e($consumerUser['name']); ?></div>
                        <div class="text-muted" style="font-size: 0.75rem;">ID: <?php echo e($consumerUser['consumer_id']); ?></div>
                    </div>
                </div>
            </li>
            <li class="nav-item mt-2 px-3">
                <form method="POST" action="dashboard.php">
                    <input type="hidden" name="action" value="logout">
                    <button class="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2" type="submit" style="font-size: 0.85rem; padding: 6px;">
                        <i class="bi bi-box-arrow-right"></i> Logout
                    </button>
                </form>
            </li>
        </ul>
    </aside>
    <?php endif; ?>

    <!-- Main Dashboard Content -->
    <main style="flex-grow: 1; padding: 32px; background: var(--bg-main);">
        <div class="container-fluid" style="max-width: 1200px; margin: 0 auto;">
            <?php if (!$consumerUser): ?>
                <div class="rzp-card p-5 text-center" style="max-width: 500px; margin: 60px auto;">
                    <i class="bi bi-exclamation-triangle display-4 text-warning mb-3"></i>
                    <h3 class="fw-bold mb-3">Authentication Required</h3>
                    <p class="text-muted mb-4">Please login to view your personal consumer dashboard.</p>
                    <a class="btn btn-primary px-5" href="login.php">Go to Login</a>
                </div>
            <?php else: ?>
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="fw-bold m-0" style="color: var(--text-main); font-size: 1.25rem;">Your account with Mahavitaran</h4>
                    <div class="d-flex align-items-center gap-3">
                        <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="bi bi-clock-history"></i> Updated now</span>
                        <select class="form-select form-select-sm" style="width: auto; background: white;">
                            <option>Last Week</option>
                            <option>Last Month</option>
                        </select>
                    </div>
                </div>

                <div class="row g-4 mb-5">
                    <!-- Stat Card 1 -->
                    <div class="col-md-4">
                        <div class="rzp-card p-4 h-100 d-flex flex-column">
                            <h6 class="text-muted mb-2" style="font-size: 0.85rem;">Current Demo Bill <i class="bi bi-info-circle ms-1"></i></h6>
                            <h2 class="fw-bold mb-1" style="color: var(--text-main);">Demo</h2>
                            <p class="text-muted mt-auto mb-0" style="font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 20px;">
                                <i class="bi bi-lightbulb-fill text-warning"></i> Insight: Click below to proceed to payment and view test bill.
                            </p>
                        </div>
                    </div>
                    <!-- Stat Card 2 -->
                    <div class="col-md-4">
                        <div class="rzp-card p-4 h-100 d-flex flex-column">
                            <h6 class="text-muted mb-2" style="font-size: 0.85rem;">Registered Mobile <i class="bi bi-info-circle ms-1"></i></h6>
                            <h3 class="fw-bold mb-1" style="color: var(--text-main);"><?php echo e($consumerUser['mobile']); ?></h3>
                            <p class="text-success mt-auto mb-0 fw-medium" style="font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 20px;">
                                <i class="bi bi-check-circle-fill"></i> Verified via OTP
                            </p>
                        </div>
                    </div>
                    <!-- Stat Card 3 -->
                    <div class="col-md-4">
                        <div class="rzp-card p-4 h-100 d-flex flex-column">
                            <h6 class="text-muted mb-2" style="font-size: 0.85rem;">Account Status <i class="bi bi-info-circle ms-1"></i></h6>
                            <h3 class="fw-bold mb-1 text-success">Active</h3>
                            <p class="text-muted mt-auto mb-0" style="font-size: 0.8rem; border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 20px;">
                                <i class="bi bi-check2-all text-primary"></i> All services available
                            </p>
                        </div>
                    </div>
                </div>
                
                <h4 class="fw-bold mb-4" style="color: var(--text-main); font-size: 1.25rem;">Quick Actions</h4>
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="rzp-card p-4">
                            <h5 class="fw-bold mb-2">Estimate Your Bill</h5>
                            <p class="text-muted mb-4" style="font-size: 0.9rem;">Calculate estimated costs based on your appliances and usage before paying.</p>
                            <a class="btn btn-outline-primary px-4 py-2 d-inline-flex align-items-center gap-2" href="bill.php">
                                <i class="bi bi-calculator"></i> Open Calculator
                            </a>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="rzp-card p-4" style="background: rgba(45, 104, 248, 0.03) !important; border: 1px dashed rgba(45, 104, 248, 0.3) !important;">
                            <h5 class="fw-bold mb-2 text-primary">Pay Your Demo Bill</h5>
                            <p class="text-muted mb-4" style="font-size: 0.9rem;">Test the real Razorpay integration securely with test cards and UPI handles.</p>
                            <a class="btn btn-primary px-4 py-2 d-inline-flex align-items-center gap-2" href="payment.php">
                                Get started <i class="bi bi-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </div>
            <?php endif; ?>
        </div>
    </main>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
