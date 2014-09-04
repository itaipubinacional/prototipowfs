
var myOptions = new Options.Class();

myOptions.SelectOption(); //Select is default option

window.onload = function(){

  $(function(){
    $('#radioOptions .btn-default').on('click', function(){ //Select Button
      $(myInterface.element).popover('destroy');
      myOptions.SelectOption();
    });
    $('#radioOptions .btn-primary').on('click', function(){ //Draw Button
      $(myInterface.element).popover('destroy');
      myOptions.DrawOption();
    });
    $('#radioOptions .btn-warning').on('click', function(){ //Modify Button
      $(myInterface.element).popover('destroy');
      myOptions.ModifyOption();
    });
    $('#radioOptions .btn-danger').on('click', function(){ //Delete Button
      $(myInterface.element).popover('destroy');
      myOptions.DeleteOption();
    });

    $('#layersTable a').on('click', function(){
        if($(this).attr('class') === 'glyphicon glyphicon-eye-close'){
        myInterface.newLayer('http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
                                  'version=2.0.0&' +
                                  'request=GetFeature&typename=sid1.gg:'+$(this).attr('id')+'&' +
                                  'outputFormat=text/javascript&' +
                                  'format_options=callback:mySources.loadFeaturesPoints&' +
                                  'srsname=EPSG:900913');
        $(this).attr('class','glyphicon glyphicon-eye-open');
     }else{
        $(this).attr('class','glyphicon glyphicon-eye-close');
     }
    });
  });
  $('#changeMapTo a').on('click', function(){
    var id = $(this).attr('id');
    if(id == "GoogleMaps"){ //Change to Open Street Maps
      myInterface.map.removeLayer( myLayers.OSM );
      myInterface.map.addLayer( myLayers.googleMaps );
      myInterface.map.addLayer( myLayers.vectorInteraction );
      myInterface.map.addLayer( myLayers.vectorPoints );
    }else{ // Change to Google Maps
      myInterface.map.removeLayer( myLayers.googleMaps ); 
      myInterface.map.addLayer( myLayers.OSM );
      myInterface.map.addLayer( myLayers.vectorInteraction );
      myInterface.map.addLayer( myLayers.vectorPoints );
    }
  });
}