<?php
  require 'database.php';

  $db = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);

  $count_statement = $db->prepare("SELECT COUNT(id) FROM achtung_die_kurve_endscreens");
  $count_statement->execute();
  $count_statement->bind_result($count);
  $count_statement->fetch();
  $count_statement->close();

  $get_statement = $db->prepare("SELECT file_name FROM achtung_die_kurve_endscreens ORDER BY created_at DESC LIMIT 10");
  $get_statement->execute();
  $get_statement->bind_result($file_name);
?>
<!doctype html>
<html lang="en">
<head>
    <title>Achtung die Kurve</title>

    <meta charset="utf-8"/>
    <meta name="description" content="Example of the HTML5 canvas game 'Achtung die Kurve'. Also known under the name 'Zatacka'." />

    <meta name="author" content="Mathias Paumgarten" />
    <meta name="author" content="David Strauß" />

    <link href='../stylesheets/style.css' rel='stylesheet' type='text/css'>

    <script type="text/javascript" src="./javascripts/jquery.js"></script>
</head>
<body>
  <h1>Achtung die Kurve Endscreens</h1>
  <p>
    Every time a round of <a href="../">Achtung die Kurve</a> ends, we store the endscreen. No personal data is saved, just the beauty of curved lines.
  </p>

  <h2>Number of stored endscreens: <span class="yellow"><?php echo $count; ?></span></h2>
  <br><br>
  <h2>Last ten endscreens:</h2>

<?php
  while($get_statement->fetch()) {
    echo '<a href="./' . $file_name . '"><img src="' . $file_name . '" width="20%" height="20%" style="float: left; margin: 20px;"></a>';
  }

  $get_statement->close();
?>

  <br><br>
  <h2 style="clear: both;">Best ten endscreens:</h2>

<?php
  $key_statement = $db->prepare("SELECT file_name FROM achtung_die_kurve_endscreens ORDER BY key_press_count DESC LIMIT 10");
  $key_statement->execute();
  $key_statement->bind_result($file_name);

  while($key_statement->fetch()) {
    echo '<a href="./' . $file_name . '"><img src="' . $file_name . '" width="20%" height="20%" style="float: left; margin: 20px;"></a>';
  }

  $key_statement->close();
?>

</body>
</html>