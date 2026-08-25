<?php
require_once __DIR__ . '/functions.php';

$pageTitle = $pageTitle ?? 'Mahavitaran Demo | Modern UI';
$currentPage = $currentPage ?? basename($_SERVER['PHP_SELF']);
$consumerUser = $_SESSION['consumer_user'] ?? null;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo e($pageTitle); ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Razorpay Marketing Style White Top Bar -->
    <nav class="main-nav navbar navbar-expand-lg navbar-light bg-white py-3 border-bottom sticky-top">
        <div class="container-fluid" style="max-width: 1320px;">
            
            <!-- Brand / Logo -->
            <a class="navbar-brand d-flex align-items-center gap-2 me-5" href="index.php">
                <div class="brand-mark d-flex justify-content-center align-items-center" style="width: 32px; height: 32px; background: var(--accent-blue); color: white; border-radius: 4px; clip-path: polygon(10% 0, 100% 0, 90% 100%, 0% 100%);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
                    </svg>
                </div>
                <div class="d-flex align-items-baseline gap-1">
                    <span style="font-weight: 800; font-size: 1.4rem; letter-spacing: -0.5px; color: #002244;">Mahavitaran</span>
                </div>
            </a>

            <!-- Mobile Toggle -->
            <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#siteNav" aria-controls="siteNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <!-- Navigation Links -->
            <div class="collapse navbar-collapse" id="siteNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0 align-items-center fw-semibold" style="font-size: 0.95rem;">
                    <li class="nav-item me-3">
                        <a class="nav-link <?php echo activeClass('index.php', $currentPage); ?>" href="index.php" style="color: #002244 !important;">Smart Grid</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link <?php echo activeClass('payment.php', $currentPage); ?>" href="payment.php" style="color: #002244 !important;">Payments</a>
                    </li>
                    <li class="nav-item me-3">
                        <a class="nav-link <?php echo activeClass('bill.php', $currentPage); ?>" href="bill.php" style="color: #002244 !important;">Tariffs+</a>
                    </li>
                </ul>
                
                <!-- Right Side Actions (Login/Dashboard) -->
                <div class="d-flex align-items-center gap-3 my-2 my-lg-0">

                    <?php if ($consumerUser): ?>
                        <a class="btn btn-outline-primary btn-sm px-4 fw-bold text-nowrap" href="dashboard.php" style="height: 38px; line-height: 24px; border-radius: 4px; border-color: #2d68f8; color: #2d68f8;">
                            Dashboard
                        </a>
                        <form method="POST" action="dashboard.php" class="m-0">
                            <input type="hidden" name="action" value="logout">
                            <button type="submit" class="btn btn-primary btn-sm px-4 fw-bold text-white text-nowrap" style="height: 38px; line-height: 24px; background-color: #2d68f8; border-color: #2d68f8; border-radius: 4px;">
                                Logout <i class="bi bi-arrow-right ms-1"></i>
                            </button>
                        </form>
                    <?php else: ?>
                        <a class="btn btn-outline-primary btn-sm px-4 fw-bold text-nowrap" href="login.php" style="height: 38px; line-height: 24px; border-radius: 4px; border-color: #2d68f8; color: #2d68f8;">
                            Login
                        </a>
                        <a class="btn btn-primary btn-sm px-4 fw-bold text-white text-nowrap" href="signup.php" style="height: 38px; line-height: 24px; background-color: #2d68f8; border-color: #2d68f8; border-radius: 4px;">
                            Sign Up <i class="bi bi-arrow-right ms-1"></i>
                        </a>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </nav>

    <main id="main-content">
