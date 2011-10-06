<?php
  if (isset($_POST['data']) && !empty($_POST['data'])) {
    $data = $_POST['data'];
    $data =  substr($data, strpos($data, ",") + 1);
    $file_name = "endscreen-" . time() . ".png";

    file_put_contents($file_name, base64_decode($data));
  } else {
    $directory = "./";
    $endscreens = glob($directory . "*.png");
 
    foreach($endscreens as $endscreen) {
      echo '<img src="' . $endscreen . '" width="20%" height="20%" style="float: left;"/>';
    }
  }
?>