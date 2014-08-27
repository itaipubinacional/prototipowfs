<!DOCTYPE html>
<html lang="pt">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js" type="text/javascript"></script>
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap-theme.min.css">
      <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
      <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>
      <title>OpenLayers 3 example</title>
    </head>
    <?php session_start() ?>
  <body>
    <div class="container">
      <div class="row">
          <h1 class="text-info"> <span class="glyphicon glyphicon-globe"></span> Log from GeoServer!</h1>
      </div>  
      <div class="row">
        <div class="alert alert-info">
          <?php
              function MostraArquivoDeErro($caminho){
                $file = @fopen($caminho, "r");
                if($file){
                  while (!@feof($file)){
                    $s = fgets($file);
                    echo htmlspecialchars($s); echo "<br>";
                  }
                  fclose($file);
                }else{
                  echo "Erro ao abrir o arquivo";
                }
              }
              MostraArquivoDeErro("GeoserverPHP.log");
            ?>
        </div>
        <ul class="pager">
           <li class="previous"><a href="index.php">&larr; Back</a></li>
        </ul>
      </div>
  </body>
</html>