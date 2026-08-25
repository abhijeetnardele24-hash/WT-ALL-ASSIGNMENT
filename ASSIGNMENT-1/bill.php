<?php
require_once __DIR__ . '/includes/functions.php';

$units = '';
$bill = 0;
$billError = '';
$breakup = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $units = trim($_POST['units'] ?? '');

    if ($units === '' || !is_numeric($units)) {
        $billError = 'Please enter valid electricity units.';
    } elseif ($units < 0) {
        $billError = 'Electricity units cannot be negative.';
    } else {
        $units = (float) $units;
        [$bill, $breakup] = calculateBill($units);
    }
}

$pageTitle = 'Bill Calculator | Mahavitaran Demo';
$currentPage = 'bill.php';
require_once __DIR__ . '/includes/header.php';
?>
<section class="calculator-wrapper py-5" style="background: url('https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1920&q=80') center/cover no-repeat; min-height: 80vh;">
    <div class="container site-width">
        <div class="row g-4 justify-content-center">
            <div class="col-lg-5">
                <div class="glass-card shadow-lg p-4 p-md-5 bg-white bg-opacity-75" style="backdrop-filter: blur(20px);">
                    <div class="d-flex align-items-center mb-4">
                        <i class="bi bi-calculator display-6 text-primary me-3"></i>
                        <h2 class="fw-bold mb-0">Bill Calculator</h2>
                    </div>
                    
                    <?php if (($_GET['from'] ?? '') === 'quickpay'): ?>
                        <div class="alert alert-info rounded-3 small py-2 border-0 bg-info bg-opacity-10 text-info fw-medium">
                            <i class="bi bi-info-circle me-1"></i> Quick payment consumer <?php echo e($_GET['consumer'] ?? ''); ?> loaded.
                        </div>
                    <?php endif; ?>
                    
                    <form method="POST" action="bill.php">
                        <div class="mb-4">
                            <label for="units" class="form-label text-muted small fw-bold text-uppercase tracking-wider">Enter Electricity Units</label>
                            <input type="number" step="0.01" min="0" name="units" id="units" class="form-control form-control-lg bg-light bg-opacity-50 border-0 shadow-sm fw-bold fs-4 text-center" value="<?php echo e($units); ?>" placeholder="e.g. 300" required>
                            <div class="form-text text-center mt-2">Current input: <span id="liveUnits" class="fw-bold text-primary"><?php echo $units !== '' ? e($units) : '0'; ?></span> units</div>
                        </div>
                        <button class="btn btn-primary btn-lg w-100 rounded-pill fw-bold shadow-sm" type="submit">Calculate Bill</button>
                    </form>
                    
                    <?php if ($billError): ?>
                        <div class="alert alert-danger mt-4 rounded-3 small py-2 border-0 bg-danger bg-opacity-10 text-danger fw-medium">
                            <i class="bi bi-exclamation-circle me-1"></i> <?php echo e($billError); ?>
                        </div>
                    <?php elseif ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($breakup)): ?>
                        <div class="mt-4 p-4 rounded-4 bg-success bg-opacity-10 border border-success border-opacity-25 text-center">
                            <span class="d-block text-success fw-bold text-uppercase small tracking-wider mb-1">Total Estimated Bill</span>
                            <strong class="display-5 text-success">&#8377; <?php echo number_format($bill, 2); ?></strong>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <div class="col-lg-7">
                <div class="glass-card shadow-lg p-4 p-md-5 h-100 bg-white bg-opacity-90" style="backdrop-filter: blur(20px);">
                    <h3 class="fw-bold mb-4 d-flex align-items-center">
                        <i class="bi bi-list-columns-reverse text-primary me-2"></i> Tariff Structure
                    </h3>
                    
                    <div class="table-responsive mb-5">
                        <table class="table table-borderless table-hover align-middle">
                            <thead class="border-bottom">
                                <tr>
                                    <th class="text-muted text-uppercase small fw-bold">Units Slab</th>
                                    <th class="text-end text-muted text-uppercase small fw-bold">Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="fw-medium">First 50 units</td>
                                    <td class="text-end"><span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">&#8377; 3.50 / unit</span></td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">Next 100 units</td>
                                    <td class="text-end"><span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">&#8377; 4.00 / unit</span></td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">Next 100 units</td>
                                    <td class="text-end"><span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">&#8377; 5.20 / unit</span></td>
                                </tr>
                                <tr>
                                    <td class="fw-medium">Above 250 units</td>
                                    <td class="text-end"><span class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">&#8377; 6.50 / unit</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <?php if (!empty($breakup)): ?>
                        <h4 class="fw-bold mb-3 border-top pt-4">Calculation Breakup</h4>
                        <div class="table-responsive">
                            <table class="table table-borderless table-striped rounded-3 overflow-hidden align-middle">
                                <thead class="bg-light">
                                    <tr>
                                        <th class="text-muted small fw-bold">Slab</th>
                                        <th class="text-end text-muted small fw-bold">Units</th>
                                        <th class="text-end text-muted small fw-bold">Rate</th>
                                        <th class="text-end text-muted small fw-bold">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($breakup as $item): ?>
                                        <tr>
                                            <td class="fw-medium"><?php echo e($item['slab']); ?></td>
                                            <td class="text-end"><?php echo number_format($item['units'], 2); ?></td>
                                            <td class="text-end text-muted">&#8377; <?php echo number_format($item['rate'], 2); ?></td>
                                            <td class="text-end fw-bold text-primary">&#8377; <?php echo number_format($item['amount'], 2); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
