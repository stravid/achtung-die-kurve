<?php
  require 'database.php';

  if (isset($_POST['data']) && !empty($_POST['data']) && isset($_POST['keyPressCount']) && !empty($_POST['keyPressCount'])) {
    $data = $_POST['data'];
    $key_press_count = $_POST['keyPressCount'];
    $data =  substr($data, strpos($data, ",") + 1);
    $file_name = "endscreen-" . time() . ".png";

    file_put_contents($file_name, base64_decode($data));

    $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
    $prepared_statement = $db->prepare("INSERT INTO achtung_die_kurve_endscreens (file_name, key_press_count, created_at) VALUES (?, ?, NOW())");
    $prepared_statement->bind_param('si', $file_name, $key_press_count);
    $prepared_statement->execute();
    $prepared_statement->close();
  }
?>