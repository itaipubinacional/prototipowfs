
var myOptions = new Options.Class();

myOptions.SelectOption(); //Select is default option

window.onload = function(){

  $(function(){
    $('#radioOptions label').on('click', function(){
      $(myInterface.element).popover('destroy');
      myInterface.map.unByKey( myInteractions.listenerKey );

      var optionId = $(this).attr('id');
      switch(optionId){
        case 'selectOption':
          myOptions.SelectOption();
          break;
        case 'drawOption':
          myOptions.DrawOption();
          break;
        case 'modifyOption':
          myOptions.ModifyOption();
          break;
        case 'deleteOption':
          myOptions.DeleteOption();
          break;
      };
    });
  });

  $('#changeMapTo a').on('click', function(){
    var id = $(this).attr('id');
    if(id == "GoogleMaps"){ //Change to Open Street Maps
      myLayers.googleMaps.setVisible(true);
      myLayers.OSM.setVisible(false);
    }else{ // Change to Google Maps
      myLayers.OSM.setVisible(true);
      myLayers.googleMaps.setVisible(false);
    }
  });

  $('#layersTable a').on('click', function(){
    if($(this).attr('class') == 'glyphicon glyphicon-eye-close'){
    var layer = myLayers.newLayer('http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
                                  'version=2.0.0&'+
                                  'request=GetFeature&typename=sid1.gg:'+$(this).attr('id')+'&' +
                                  'outputFormat=text/javascript&' +
                                  'format_options=callback:mySources.loadFeaturesPoints&' +
                                  'srsname=EPSG:900913');
    $(this).attr('index', myInterface.layersCollection.push(layer)); //the collection returns the layer's index
    $(this).attr('class','glyphicon glyphicon-eye-open');
   }else{
      myInterface.layersCollection.removeAt(parseInt($(this).attr('index'))); //index of the element to delete
      $(this).attr('class','glyphicon glyphicon-eye-close');
    }
   }
  });
}