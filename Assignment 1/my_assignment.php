<?php
echo "\n";
echo "=================================================\n";
echo "           ELECTRICITY BILL SYSTEM               \n";
echo "         Submitted by: Abhijeet Nardele          \n";
echo "=================================================\n\n";

$units = 120;
$billAmount = 0;

if ($units <= 50) {
    $billAmount = $units * 3.50;
} elseif ($units <= 150) {
    $billAmount = (50 * 3.50) + (($units - 50) * 4.00);
} else {
    $billAmount = (50 * 3.50) + (100 * 4.00) + (($units - 150) * 5.20);
}

echo "Consumer Name : Rahul\n";
echo "Units Consumed: " . $units . " Units\n";
echo "Total Amount  : Rs. " . number_format($billAmount, 2) . "\n\n";
echo "=================================================\n";
?>
