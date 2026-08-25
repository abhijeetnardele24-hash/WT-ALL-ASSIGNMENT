<?php
$news = [
    ['title' => 'Lottery for allotment of maintenance works to registered engineers', 'date' => 'July 17, 2026'],
    ['title' => 'Power quality meter update for HT consumers', 'date' => 'July 16, 2026'],
    ['title' => 'Solar rooftop application facility available for consumers', 'date' => 'July 15, 2026'],
    ['title' => 'Consumer awareness program for safe digital payments', 'date' => 'July 10, 2026'],
    ['title' => 'Mobile app services available for bill payment and meter reading', 'date' => 'July 09, 2026']
];

$linkCards = [
    'Suggestions/Comments Regarding Land Requirement For Electrical Infrastructure',
    'MYT Review Petition',
    'Power Quality Meter for HT Consumer',
    'Swagat Cell For Industrial Consumers',
    'Magel Tyala Saur Krushi Pump Yojana',
    'Apply for Solar Rooftop',
    'Mukhyamantri Saur Krushi Vahini Yojana - 2.0'
];

$searchItems = array_merge(
    ['Quick Bill Payment', 'UPI Bill Payment', 'Electricity Bill Calculator', 'Consumer Portal Login', 'Register Mobile Number', 'New Connection', 'Complaint Registration'],
    array_column($news, 'title'),
    $linkCards
);
