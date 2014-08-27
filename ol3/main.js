
var myOptions = new Options.Class('http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
                                  'version=2.0.0&' +
                                  'request=GetFeature&typename=sid1.gg:wfs&' +
                                  'outputFormat=text/javascript&' +
                                  'format_options=callback:mySources.loadFeaturesPoints&' +
                                  'srsname=EPSG:900913');

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
  });
}