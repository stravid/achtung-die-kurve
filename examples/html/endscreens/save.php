<?php
  require 'database.php';

  if (isset($_POST['data']) && !empty($_POST['data'])) {
    $data = $_POST['data'];
    $data =  substr($data, strpos($data, ",") + 1);
    $file_name = "endscreen-" . time() . ".png";

    file_put_contents($file_name, base64_decode($data));

    $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
    $prepared_statement = $db->prepare("INSERT INTO achtung_die_kurve_endscreens (file_name, created_at) VALUES (?, NOW())");
    $prepared_statement->bind_param('s', $file_name);
    $prepared_statement->execute();
    $prepared_statement->close();
  }
?>