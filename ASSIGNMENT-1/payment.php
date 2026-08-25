<?php
require_once __DIR__ . '/includes/functions.php';

function demoInvoiceForConsumer($consumer)
{
    if (!isset($_SESSION['demo_bills'])) {
        $_SESSION['demo_bills'] = [];
    }

    if ($_SERVER['REQUEST_METHOD'] === 'GET' && empty($_GET['receipt'])) {
        unset($_SESSION['demo_bills'][$consumer]);
    }

    if (!isset($_SESSION['demo_bills'][$consumer])) {
        $units = random_int(75, 420);
        [$amount, $breakup] = calculateBill($units);

        $_SESSION['demo_bills'][$consumer] = [
            'bill_no' => 'DEMO' . random_int(100000, 999999),
            'consumer' => $consumer,
            'units' => $units,
            'amount' => $amount,
            'breakup' => $breakup,
            'due_date' => date('d M Y', strtotime('+12 days')),
            'month' => date('F Y'),
            'status' => 'Unpaid'
        ];
    }

    return $_SESSION['demo_bills'][$consumer];
}

$consumerUser = $_SESSION['consumer_user'] ?? null;
$consumer = trim($_GET['consumer'] ?? ($_SESSION['quick_pay_consumer'] ?? ''));

if ($consumer === '' && $consumerUser) {
    $consumer = $consumerUser['consumer_id'];
}

if ($consumer === '') {
    $_SESSION['quick_pay_error'] = 'Enter consumer number before opening payment page.';
    redirectTo('index.php', ['section' => 'quick-pay']);
}

$invoice = demoInvoiceForConsumer($consumer);
$paymentMessage = '';
$paymentError = '';
$receiptNo = $_GET['receipt'] ?? '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $razorpayPaymentId = trim($_POST['razorpay_payment_id'] ?? '');

    if (empty($razorpayPaymentId)) {
        $paymentError = 'Payment failed or was cancelled.';
    } else {
        $receiptNo = 'RZP' . random_int(10000000, 99999999);
        $_SESSION['demo_bills'][$consumer]['status'] = 'Paid';
        $_SESSION['demo_bills'][$consumer]['receipt'] = $receiptNo;
        $_SESSION['demo_bills'][$consumer]['upi_id'] = 'Razorpay (' . $razorpayPaymentId . ')';
        $_SESSION['demo_bills'][$consumer]['payer_name'] = $consumerUser['name'] ?? 'Online User';
        redirectTo('payment.php', ['consumer' => $consumer, 'receipt' => $receiptNo]);
    }
}

$invoice = $_SESSION['demo_bills'][$consumer];
$isPaid = ($invoice['status'] ?? '') === 'Paid';

$pageTitle = 'UPI Bill Payment | Mahavitaran Demo';
$currentPage = 'payment.php';
require_once __DIR__ . '/includes/header.php';
?>
<section class="payment-wrapper py-5" style="background: var(--bg-main); min-height: 80vh;">
    <div class="container site-width">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-5 bg-white p-4 rounded-3 shadow-sm border">
            <div class="d-flex align-items-center gap-3">
                <i class="bi bi-wallet2 display-5 text-primary"></i>
                <div>
                    <h2 class="fw-bold mb-1" style="color: var(--text-main);">Demo UPI Payment</h2>
                    <p class="text-muted mb-0">Secure and fast mock transactions.</p>
                </div>
            </div>
            <a class="btn btn-outline-danger px-4 mt-3 mt-sm-0 d-flex align-items-center gap-2" href="index.php#quick-pay">
                <i class="bi bi-arrow-left"></i> Back to Quick Pay
            </a>
        </div>

        <div class="row g-4">
            <div class="col-lg-5">
                <div class="rzp-card p-4 mb-4">
                    <h5 class="fw-bold mb-4 pb-3" style="border-bottom: 1px solid var(--border-color);"><i class="bi bi-person-badge text-primary me-2"></i> Detected Consumer</h5>
                    <ul class="list-unstyled mb-0" style="font-size: 0.95rem;">
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Consumer No.</span> <strong class="text-dark"><?php echo e($consumer); ?></strong></li>
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Name</span> <strong class="text-dark"><?php echo e($consumerUser['name'] ?? 'Guest Consumer'); ?></strong></li>
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Registered Mobile</span> <strong class="text-dark"><?php echo e($consumerUser['mobile'] ?? 'Not logged in'); ?></strong></li>
                        <li class="d-flex justify-content-between"><span class="text-muted">Login Status</span> 
                            <strong class="<?php echo $consumerUser ? 'text-success' : 'text-warning'; ?> d-flex align-items-center gap-1">
                                <i class="bi bi-circle-fill" style="font-size: 0.5rem;"></i>
                                <?php echo $consumerUser ? 'Logged In' : 'Guest'; ?>
                            </strong>
                        </li>
                    </ul>
                </div>

                <div class="rzp-card p-4">
                    <h5 class="fw-bold mb-4 pb-3" style="border-bottom: 1px solid var(--border-color);"><i class="bi bi-receipt-cutoff text-primary me-2"></i> Demo Bill Summary</h5>
                    <ul class="list-unstyled mb-4" style="font-size: 0.95rem;">
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Bill No.</span> <strong class="text-dark"><?php echo e($invoice['bill_no']); ?></strong></li>
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Billing Month</span> <strong class="text-dark"><?php echo e($invoice['month']); ?></strong></li>
                        <li class="d-flex justify-content-between mb-3"><span class="text-muted">Units Consumed</span> <strong class="text-dark"><?php echo e($invoice['units']); ?> units</strong></li>
                        <li class="d-flex justify-content-between"><span class="text-muted">Due Date</span> <strong class="text-danger"><?php echo e($invoice['due_date']); ?></strong></li>
                    </ul>
                    <div class="p-3 rounded d-flex justify-content-between align-items-center" style="background: rgba(45, 104, 248, 0.05); border: 1px solid rgba(45, 104, 248, 0.1);">
                        <span class="text-muted fw-bold text-uppercase small">Amount Payable</span>
                        <strong class="fs-4 text-primary">&#8377; <?php echo number_format($invoice['amount'], 2); ?></strong>
                    </div>
                </div>
            </div>

            <div class="col-lg-7">
                <div class="rzp-card p-4 p-md-5 mb-4 h-100">
                    <h3 class="fw-bold mb-2">UPI Payment Gateway</h3>
                    <p class="text-muted mb-4 small">This is a mock gateway for assignment testing. No real transaction occurs.</p>

                    <?php if ($paymentError): ?>
                        <div class="alert alert-danger rounded-3 small py-2 mb-4 border-0 bg-danger bg-opacity-10 text-danger fw-medium">
                            <i class="bi bi-exclamation-circle me-1"></i> <?php echo e($paymentError); ?>
                        </div>
                    <?php endif; ?>

                    <?php if ($isPaid): ?>
                        <div class="alert alert-success d-flex align-items-center p-4 rounded-4 border-0 shadow-sm mb-4">
                            <i class="bi bi-check-circle-fill display-4 text-success me-4"></i>
                            <div>
                                <h4 class="alert-heading fw-bold mb-1">Payment Successful</h4>
                                <p class="mb-1 text-dark">Receipt No: <strong><?php echo e($invoice['receipt'] ?? $receiptNo); ?></strong></p>
                                <p class="mb-0 text-muted small">Paid via: <?php echo e($invoice['upi_id'] ?? 'Razorpay'); ?></p>
                            </div>
                        </div>
                        
                        <a href="dashboard.php" class="btn btn-outline-success rounded-pill px-4"><i class="bi bi-arrow-return-left"></i> Return to Dashboard</a>
                    <?php else: ?>
                        <div class="text-center py-4">
                            <i class="bi bi-shield-check display-4 text-primary mb-3"></i>
                            <h4 class="fw-bold mb-3">Pay with Razorpay</h4>
                            <p class="text-muted mb-4">You will be redirected to the secure Razorpay checkout to complete your payment of <strong>&#8377; <?php echo number_format($invoice['amount'], 2); ?></strong> using UPI, Card, or Netbanking.</p>
                            
                            <form id="razorpay-form" method="POST" action="payment.php?consumer=<?php echo urlencode($consumer); ?>">
                                <input type="hidden" name="razorpay_payment_id" id="razorpay_payment_id">
                                <button type="button" id="rzp-button" class="btn btn-primary btn-lg fw-bold px-5 py-3 d-inline-flex align-items-center gap-2">
                                    Proceed to Pay &#8377; <?php echo number_format($invoice['amount'], 2); ?> <i class="bi bi-arrow-right"></i>
                                </button>
                            </form>
                        </div>
                        
                        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                        <script>
                        document.getElementById('rzp-button').onclick = function(e){
                            var options = {
                                "key": "rzp_test_SzFO0Ifb5DFC3F",
                                "amount": "<?php echo (int)round($invoice['amount'] * 100); ?>",
                                "currency": "INR",
                                "name": "Mahavitaran Demo",
                                "description": "Bill Payment for Consumer <?php echo e($consumer); ?>",
                                "image": "logo.png",
                                "handler": function (response){
                                    document.getElementById('razorpay_payment_id').value = response.razorpay_payment_id;
                                    document.getElementById('razorpay-form').submit();
                                },
                                "prefill": {
                                    "name": "<?php echo e($consumerUser['name'] ?? 'Demo User'); ?>",
                                    "email": "demo@example.com",
                                    "contact": "<?php echo e($consumerUser['mobile'] ?? '9999999999'); ?>"
                                },
                                "theme": {
                                    "color": "#2d68f8"
                                }
                            };
                            var rzp1 = new Razorpay(options);
                            rzp1.on('payment.failed', function (response){
                                alert(response.error.description);
                            });
                            rzp1.open();
                            e.preventDefault();
                        }
                        </script>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="col-12 mt-4">
                <div class="rzp-card p-4 mb-4">
                    <h5 class="fw-bold mb-3 d-flex align-items-center"><i class="bi bi-bar-chart-steps text-primary me-2"></i> Bill Breakup Details</h5>
                    <div class="table-responsive">
                        <table class="table table-borderless table-striped align-middle rounded-3 overflow-hidden mb-0">
                            <thead class="bg-light">
                                <tr>
                                    <th class="text-muted small fw-bold text-uppercase">Slab Applied</th>
                                    <th class="text-end text-muted small fw-bold text-uppercase">Units</th>
                                    <th class="text-end text-muted small fw-bold text-uppercase">Rate</th>
                                    <th class="text-end text-muted small fw-bold text-uppercase">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($invoice['breakup'] as $item): ?>
                                    <tr>
                                        <td class="fw-medium py-3"><?php echo e($item['slab']); ?></td>
                                        <td class="text-end py-3"><?php echo number_format($item['units'], 2); ?></td>
                                        <td class="text-end text-muted py-3">&#8377; <?php echo number_format($item['rate'], 2); ?></td>
                                        <td class="text-end fw-bold text-primary py-3">&#8377; <?php echo number_format($item['amount'], 2); ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
