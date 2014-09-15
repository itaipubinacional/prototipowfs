
var myOptions = new Options.Class();

myOptions.SelectOption(); //Select is default option

window.onload = function(){

  $(function(){
    $('#radioOptions label').on('click', function(){
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

  $('#layersTable a').on('click', function(){

    switch($(this).attr('type')){

      case 'visibility':

        if($(this).attr('class') == 'glyphicon glyphicon-eye-close'){ //the layer is hidden

          var url = 'http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
                    'version=2.0.0&'+
                    'request=GetFeature&typename=sid1.gg:'+$(this).attr('name')+'&' +
                    'outputFormat=text/javascript&' +
                    'format_options=callback:mySources.loadFeaturesPoints&' +
                    'srsname=EPSG:900913';

          var layer = myLayers.newLayer(url);
          $(this).attr('index', myInterface.layersCollection.push(layer)); //the collection returns the layer's index
          $(this).attr('class','glyphicon glyphicon-eye-open');

        }else{  //the layer is visible

          myInterface.layersCollection.removeAt(parseInt($(this).attr('index'))); //index of the element to delete
          $(this).attr('class','glyphicon glyphicon-eye-close');
        }
        break;

      case 'edit':

        while(myInterface.layersCollection.getLength() > 2){ // 2 Layers from GoogleMaps and OpenStreetMaps
          myInterface.layersCollection.pop();
        }

        var url = 'http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
                  'version=2.0.0&'+
                  'request=GetFeature&typename=sid1.gg:'+$(this).attr('name')+'&' +
                  'outputFormat=text/javascript&' +
                  'format_options=callback:mySources.loadFeaturesPoints&' +
                  'srsname=EPSG:900913';

          var layer = myLayers.newLayer(url);
          $(this).attr('index', myInterface.layersCollection.push(layer)); //the collection returns the layer's index
        break;
    }
  });


}