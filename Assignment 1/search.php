<?php
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/data.php';

$q = strtolower(trim($_GET['q'] ?? ''));
$matches = array_filter($searchItems, function ($item) use ($q) {
    return $q === '' || strpos(strtolower($item), $q) !== false;
});

$pageTitle = 'Search | Mahavitaran Demo';
$currentPage = 'search.php';
require_once __DIR__ . '/includes/header.php';
?>
<section class="search-wrapper py-5" style="background: url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80') center/cover fixed; min-height: 80vh;">
    <div class="container site-width d-flex justify-content-center">
        <div class="glass-card shadow-lg p-5 w-100 bg-white bg-opacity-90" style="backdrop-filter: blur(20px); border-radius: 24px; max-width: 900px;">
            <div class="d-flex align-items-center mb-2">
                <i class="bi bi-search display-6 text-primary me-3"></i>
                <h2 class="fw-bold mb-0">Search Results</h2>
            </div>
            
            <p class="text-muted mb-4 fs-5">
                Showing results for: <strong class="text-dark bg-light px-2 py-1 rounded-3 border"><?php echo e($_GET['q'] ?? ''); ?></strong>
            </p>
            
            <form class="mb-5 position-relative" method="GET" action="search.php">
                <input type="search" name="q" class="form-control form-control-lg bg-light border-0 shadow-sm rounded-pill ps-4 pe-5 py-3" placeholder="Search again..." value="<?php echo e($_GET['q'] ?? ''); ?>">
                <button type="submit" class="btn btn-primary rounded-circle position-absolute top-50 end-0 translate-middle-y me-2" style="width: 45px; height: 45px; display: flex; align-items: center; justify-content: center;">
                    <i class="bi bi-arrow-right"></i>
                </button>
            </form>

            <div class="search-results d-flex flex-column gap-3">
                <?php foreach ($matches as $item): ?>
                    <?php $target = stripos($item, 'payment') !== false ? 'payment.php' : 'bill.php'; ?>
                    <a href="<?php echo e($target); ?>" class="text-decoration-none">
                        <div class="glass-panel p-3 px-4 rounded-pill transition bg-white shadow-sm d-flex align-items-center border-0 text-dark">
                            <div class="bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3 d-flex align-items-center justify-content-center">
                                <i class="bi bi-search"></i>
                            </div>
                            <span class="fw-medium fs-5 flex-grow-1"><?php echo e($item); ?></span>
                            <i class="bi bi-chevron-right text-muted"></i>
                        </div>
                    </a>
                <?php endforeach; ?>
                
                <?php if (empty($matches)): ?>
                    <div class="alert alert-warning rounded-4 p-4 text-center border-0 bg-warning bg-opacity-10 shadow-sm mt-3">
                        <i class="bi bi-emoji-frown display-4 text-warning mb-3"></i>
                        <h4 class="fw-bold text-dark">No results found</h4>
                        <p class="text-muted mb-0">We couldn't find any matching services. Try a different search term.</p>
                    </div>
                <?php endif; ?>
            </div>
            
            <?php if (!empty($matches)): ?>
            <nav aria-label="Search pagination" class="mt-5">
                <ul class="pagination justify-content-center gap-2">
                    <li class="page-item active"><a class="page-link rounded-circle border-0 shadow-sm" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;" href="#">1</a></li>
                    <li class="page-item"><a class="page-link rounded-circle border-0 bg-light text-dark" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;" href="#">2</a></li>
                    <li class="page-item"><a class="page-link rounded-circle border-0 bg-light text-dark" style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;" href="#">3</a></li>
                    <li class="page-item ms-2"><a class="page-link rounded-pill border-0 bg-light text-dark px-3" style="height: 40px; display: flex; align-items: center;" href="#">Next <i class="bi bi-chevron-right ms-1"></i></a></li>
                </ul>
            </nav>
            <?php endif; ?>
        </div>
    </div>
</section>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
