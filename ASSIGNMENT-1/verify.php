<?php
require_once __DIR__ . '/includes/functions.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $otp = trim($_POST['otp'] ?? '');
    $pending = $_SESSION['pending_auth'] ?? null;

    if (!$pending) {
        redirectTo('login.php');
    }

    if ($otp === '123456') {
        $_SESSION['consumer_user'] = $pending;
        unset($_SESSION['pending_auth']);
        redirectTo('dashboard.php', ['verified' => '1']);
    }

    $_SESSION['otp_error'] = 'Invalid OTP. Use 123456 for this demo.';
    redirectTo('verify.php');
}

$pendingAuth = $_SESSION['pending_auth'] ?? null;
if (!$pendingAuth) {
    redirectTo('login.php');
}

$pageTitle = 'OTP Verification | Mahavitaran Demo';
$currentPage = 'verify.php';
$otpError = flashMessage('otp_error');
require_once __DIR__ . '/includes/header.php';
?>
<section class="auth-wrapper d-flex align-items-center justify-content-center" style="background: url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; min-height: 80vh;">
    <div class="container site-width d-flex justify-content-center">
        <div class="glass-card shadow-lg text-center p-5 bg-white bg-opacity-75" style="backdrop-filter: blur(20px); border-radius: 24px; max-width: 500px; width: 100%;">
            
            <div class="mb-4 d-inline-flex align-items-center justify-content-center rounded-circle" style="width: 80px; height: 80px; background: rgba(92, 136, 196, 0.1);">
                <i class="bi bi-shield-lock display-5 text-primary"></i>
            </div>
            
            <h2 class="fw-bold mb-3">Verify Your Identity</h2>
            <p class="text-muted mb-4 px-3">
                A verification code has been sent to<br>
                <strong class="text-dark"><?php echo e($pendingAuth['mobile'] ?? $pendingAuth['identity'] ?? 'demo consumer'); ?></strong>
            </p>
            
            <div class="alert alert-info rounded-3 small py-2 border-0 bg-primary bg-opacity-10 text-primary fw-medium mb-4">
                <i class="bi bi-info-circle me-1"></i> Use <strong>123456</strong> for this demo
            </div>

            <?php if ($otpError): ?>
                <div class="alert alert-danger rounded-3 small py-2 mb-4"><?php echo e($otpError); ?></div>
            <?php endif; ?>
            
            <form method="POST" action="verify.php">
                <div class="mb-4">
                    <input type="text" name="otp" class="form-control form-control-lg bg-light bg-opacity-50 border-0 shadow-sm text-center fw-bold fs-4" maxlength="6" placeholder="------" required style="letter-spacing: 8px;">
                </div>
                <button class="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm" type="submit">Verify & Continue</button>
            </form>
            
            <p class="mt-4 text-muted small">Didn't receive the code? <a href="login.php" class="text-primary text-decoration-none">Resend</a></p>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
