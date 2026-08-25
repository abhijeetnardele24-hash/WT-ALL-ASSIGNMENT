<?php
require_once __DIR__ . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $mobile = trim($_POST['mobile'] ?? '');
    $consumerId = trim($_POST['consumer_id'] ?? '');

    if ($name === '' || $mobile === '' || $consumerId === '') {
        $_SESSION['auth_error'] = 'Please fill name, registered mobile number and consumer ID.';
        redirectTo('signup.php');
    }

    $_SESSION['pending_auth'] = [
        'mode' => 'signup',
        'name' => $name,
        'mobile' => $mobile,
        'consumer_id' => $consumerId,
        'identity' => $consumerId
    ];

    redirectTo('verify.php');
}

$pageTitle = 'Consumer Sign Up | Mahavitaran Demo';
$currentPage = 'signup.php';
$authError = flashMessage('auth_error');
require_once __DIR__ . '/includes/header.php';
?>
<section class="auth-wrapper" style="background: #f6f8fb; min-height: calc(100vh - 75px); display: flex; align-items: center;">
    <div class="container site-width d-flex justify-content-center py-5">
        <div class="bg-white shadow-lg overflow-hidden w-100 d-flex" style="max-width: 1000px; border-radius: 12px; border: 1px solid #eaedf3; min-height: 600px;">
            <div class="row g-0 flex-grow-1">
                <!-- Left Side: Image/Branding -->
                <div class="col-md-5 d-none d-md-flex align-items-center justify-content-center flex-column p-5 position-relative" style="background: #001633; color: white;">
                    <div style="z-index: 2;" class="text-center">
                        <img src="/ElectricityBill/signup_illustration_1784623494204.png" onerror="this.style.display='none'" alt="Join Network" class="img-fluid mb-4" style="max-height: 250px; transform: scale(1.1);">
                        <h3 class="fw-bold mb-3" style="font-size: 1.5rem; letter-spacing: -0.5px;">Join the Network</h3>
                        <p class="px-2" style="font-size: 0.95rem; color: #8ba1b5; line-height: 1.6;">Create a digital account to easily monitor your power consumption and pay bills instantly from any device.</p>
                    </div>
                </div>
                <!-- Right Side: Form -->
                <div class="col-md-7 p-5 bg-white d-flex flex-column justify-content-center" style="padding-left: 8% !important; padding-right: 8% !important;">
                    <div class="d-flex justify-content-start mb-5 pb-2 border-bottom">
                        <a href="login.php" class="text-decoration-none fw-bold fs-6 pb-2 px-3 text-muted">Login</a>
                        <a href="signup.php" class="text-decoration-none fw-bold fs-6 pb-2 px-3 text-primary" style="border-bottom: 2px solid #2d68f8;">Sign Up</a>
                    </div>
                    
                    <h2 class="fw-bold mb-2" style="color: #002244; letter-spacing: -0.5px;">Create Account</h2>
                    <p class="text-muted small mb-4">Register with your name, mobile, and consumer ID for testing.</p>
                    
                    <?php if ($authError): ?>
                        <div class="alert alert-danger rounded-2 small py-2"><?php echo e($authError); ?></div>
                    <?php endif; ?>
                    
                    <form method="POST" action="signup.php" class="mt-2">
                        <div class="mb-3">
                            <label class="form-label small fw-bold mb-2" style="color: #515978;">Full Name</label>
                            <input type="text" name="name" class="form-control bg-white shadow-none" style="border: 1px solid #d4d9e2; border-radius: 4px; font-size: 0.95rem; padding: 12px;" placeholder="John Doe" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-bold mb-2" style="color: #515978;">Mobile Number</label>
                            <input type="tel" name="mobile" class="form-control bg-white shadow-none" style="border: 1px solid #d4d9e2; border-radius: 4px; font-size: 0.95rem; padding: 12px;" placeholder="9876543210" required>
                        </div>
                        <div class="mb-4">
                            <label class="form-label small fw-bold mb-2" style="color: #515978;">Consumer ID</label>
                            <input type="text" name="consumer_id" class="form-control bg-white shadow-none" style="border: 1px solid #d4d9e2; border-radius: 4px; font-size: 0.95rem; padding: 12px;" placeholder="12-digit ID" required>
                        </div>
                        <button class="btn btn-primary w-100 fw-bold shadow-none" type="submit" style="background: #2d68f8; border-color: #2d68f8; border-radius: 4px; padding: 14px; font-size: 1rem;">
                            Send OTP <i class="bi bi-arrow-right ms-2"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
