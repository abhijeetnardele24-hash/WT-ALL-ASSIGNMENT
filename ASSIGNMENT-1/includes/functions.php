<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

function e($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function redirectTo($file, $params = [])
{
    $location = $file;

    if (!empty($params)) {
        $location .= '?' . http_build_query($params);
    }

    header('Location: ' . $location);
    exit;
}

function activeClass($file, $currentPage)
{
    return $file === $currentPage ? 'active' : '';
}

function flashMessage($key)
{
    $message = $_SESSION[$key] ?? '';
    unset($_SESSION[$key]);
    return $message;
}

function addSlab(&$breakup, $slabName, $unitsUsed, $rate)
{
    if ($unitsUsed > 0) {
        $breakup[] = [
            'slab' => $slabName,
            'units' => $unitsUsed,
            'rate' => $rate,
            'amount' => $unitsUsed * $rate
        ];
    }
}

function calculateBill($units)
{
    $breakup = [];

    if ($units <= 50) {
        addSlab($breakup, 'First 50 units', $units, 3.50);
    } elseif ($units <= 150) {
        addSlab($breakup, 'First 50 units', 50, 3.50);
        addSlab($breakup, 'Next 100 units', $units - 50, 4.00);
    } elseif ($units <= 250) {
        addSlab($breakup, 'First 50 units', 50, 3.50);
        addSlab($breakup, 'Next 100 units', 100, 4.00);
        addSlab($breakup, 'Next 100 units', $units - 150, 5.20);
    } else {
        addSlab($breakup, 'First 50 units', 50, 3.50);
        addSlab($breakup, 'Next 100 units', 100, 4.00);
        addSlab($breakup, 'Next 100 units', 100, 5.20);
        addSlab($breakup, 'Above 250 units', $units - 250, 6.50);
    }

    $bill = 0;
    foreach ($breakup as $item) {
        $bill += $item['amount'];
    }

    return [$bill, $breakup];
}
