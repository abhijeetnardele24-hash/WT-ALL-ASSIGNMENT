<?php
require_once __DIR__ . '/functions.php';

$simpleTitle = $simpleTitle ?? 'Demo Page';
$simpleDescription = $simpleDescription ?? 'This route is part of the local Mahadiscom-style assignment mockup. Use the navigation to move between pages.';
?>
<section class="page-wrapper py-5" style="background: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; min-height: 70vh;">
    <div class="container site-width d-flex align-items-center justify-content-center h-100">
        <div class="glass-card shadow-lg p-5 w-100 bg-white bg-opacity-75 text-center" style="backdrop-filter: blur(20px); border-radius: 24px; max-width: 800px;">
            <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-4 bg-primary bg-opacity-10" style="width: 80px; height: 80px;">
                <i class="bi bi-card-heading display-5 text-primary"></i>
            </div>
            
            <h2 class="fw-bold mb-3"><?php echo e($simpleTitle); ?></h2>
            <p class="text-muted fs-5 mb-5 px-md-4"><?php echo e($simpleDescription); ?></p>
            
            <div class="row g-4 justify-content-center">
                <div class="col-md-4">
                    <a class="text-decoration-none" href="login.php">
                        <div class="glass-panel p-4 rounded-4 transition bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style="border: 1px solid rgba(0,0,0,0.05);">
                            <i class="bi bi-person-circle fs-2 text-primary mb-2"></i>
                            <strong class="text-dark">Consumer Login</strong>
                        </div>
                    </a>
                </div>
                <div class="col-md-4">
                    <a class="text-decoration-none" href="bill.php">
                        <div class="glass-panel p-4 rounded-4 transition bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style="border: 1px solid rgba(0,0,0,0.05);">
                            <i class="bi bi-calculator fs-2 text-success mb-2"></i>
                            <strong class="text-dark">Bill Calculator</strong>
                        </div>
                    </a>
                </div>
                <div class="col-md-4">
                    <a class="text-decoration-none" href="search.php?q=payment">
                        <div class="glass-panel p-4 rounded-4 transition bg-white shadow-sm h-100 d-flex flex-column align-items-center justify-content-center" style="border: 1px solid rgba(0,0,0,0.05);">
                            <i class="bi bi-search fs-2 text-info mb-2"></i>
                            <strong class="text-dark">Search Services</strong>
                        </div>
                    </a>
                </div>
            </div>
            
            <div class="mt-5">
                <a href="index.php" class="btn btn-outline-secondary rounded-pill px-4 fw-medium"><i class="bi bi-house me-2"></i>Return Home</a>
            </div>
        </div>
    </div>
</section>
