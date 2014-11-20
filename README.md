prototipowfs
============

Repositório de prototipacão de funcionalidades de iteracão com o padrão de servico WFS 

Como preparar seu ambiente
--------------------------

1. Baixe e instale o ao menos a versão [2.5.0](http://geoserver.org/release/2.5.x/)  do GeoServer (não testado com versões superiores) no seu localhost na porta 8080;

2. Baixe e instale o [PostgreSQL](http://www.postgresql.org/download/);

3. Configure o usuário e senha padrões para: Usuário = **geoadmin** e Senha=**itaipu.123**;

4. Crie um novo *Workspace* com o *name* e *namespace URI* = **sid1.gg**, e deixe selecionados os checkbox: *Enable, WFS e WMS*; 

5. Configure a conexão com banco de dados de acordo com o seu schema, usuário, senha etc... criando uma nova *Store* PostGIS DataBase no *Workspace*;

6. A partir dae, o protótipo realizará a consulta de todas as camadas pertencentes a essa "Store"

7. Baixe e instale o serivdor web [Apache](http://httpd.apache.org/download.cgi);
 
8. Baixe e instale o [PHP](http://php.net/downloads.php);

9. Baixe instale o [cURL](http://curl.haxx.se/download.html);

10. Divirta-se! :smile:
