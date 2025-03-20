<?php
$borrowedBooks = json_decode($_POST['books'], true);
$alerts = [];

foreach ($borrowedBooks as $book) {
    $dueDate = strtotime($book['dueDate']);
    if ($dueDate < time()) {
        $alerts[] = "Book '{$book['title']}' is overdue!";
    }
}

echo json_encode(["alerts" => $alerts]);
?>
