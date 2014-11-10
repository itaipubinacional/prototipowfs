<?php
  session_start();
  $xmlStr = $_REQUEST['textXML'];
  // Open log file
  $logfh = fopen("GeoserverPHP.log", 'w') or die("can't open log file");
  fwrite($logfh, "-------------------XML-----------------------\n");
  fwrite($logfh, $xmlStr);
  fwrite($logfh, "---------------------------------------------\n");
  // Initiate cURL session
  $url = "http://localhost:8080/geoserver/wfs";
  $ch = curl_init($url);

  // Optional settings for debugging
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); //option to return string
  curl_setopt($ch, CURLOPT_VERBOSE, true);
  curl_setopt($ch, CURLOPT_STDERR, $logfh); // logs curl messages

  //Required POST request settings
  curl_setopt($ch, CURLOPT_POST, True);
  $passwordStr = "geoadmin:itaipu.123";
  curl_setopt($ch, CURLOPT_USERPWD, $passwordStr);

  //POST data
  curl_setopt($ch, CURLOPT_HTTPHEADER,
            array("Content-type: application/xml"));
  curl_setopt($ch, CURLOPT_POSTFIELDS, $xmlStr);

  //POST return code
  $successCode = 201;

  $buffer = curl_exec($ch); // Execute the curl request

  // Check for errors and process results
  $info = curl_getinfo($ch);
  if ($info['http_code'] != $successCode) {
    $msgStr = "# Unsuccessful cURL request to ";
    $msgStr .= $url." [". $info['http_code']. "]\n";
    fwrite($logfh, $msgStr);
  } else {
    $msgStr = "# Successful cURL request to ".$url."\n";
    fwrite($logfh, $msgStr);
  }

  fwrite($logfh, $buffer."\n");
  fwrite($logfh, $_REQUEST['json_layer_structure']);
  curl_close($ch); // free resources if curl handle will not be reused
  fclose($logfh);  // close logfile
  $striped = strip_tags($buffer); //remove tags html
  $int = intval($striped);
  if(0 < $int && $int < 1000){
    $_SESSION['Successful'] = "yes";
    Header('Location: index.php');
  }else{
    $_SESSION['Successful'] = "no";
    Header('Location: index.php');
  }
  $_SESSION['json_layer_structure'] = $_REQUEST['json_layer_structure']; //json structure for layer interface sets control
?>

