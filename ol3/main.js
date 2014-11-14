var mySources = new Sources.Class();
var myLayers = new Layers.Class();
var myInteractions = new Interactions.Class();
var myInterface = new Interface.Class();
var myOptions = new Options.Class();

$('#layersTable .editColumn').hide(); //hide the columm edit

window.onload = function(){

	myOptions.SelectOption(); //Select is default option

	$('#layersTable a').on('click', function(){ //Vilibility button
		myInterface.showLayer($(this).attr('id'));
	});

	$('#layersTable input').on('change', function(){ //Edit button
		myInterface.setEdit($(this).attr('layerName'));
	});

	$('#toolsOptions label').on('change', function(){
		myInterface.setOption($(this).attr('id')); 
	});

	$('#submitButton').on('click', function(){
		myInterface.submitXml();
	});

	$('#saveButton').on('click', function(){
		myInterface.submitXml();
	});

	$('#changeMapTo a').on('click', function(){
		myInterface.changeMapTo($(this).attr('id'));
	});

	initializeLayers(window.json_layer_structure);
};

 function initializeLayers(json_layer_structure){
 	if(json_layer_structure.featureTypes.editMode){
 		myOptions.alternateEditOption();
 		$('#alternateEditOption').attr('class', 'btn btn-default active');
 	}
 	var layers = json_layer_structure.featureTypes.featureType;

 	for(i in layers){
 		if(layers[i].visible)
 			myInterface.showLayer(layers[i].name);

 		if(layers[i].editable){
 			myInterface.setEdit(layers[i].name);
 		     document.getElementById(layers[i].name+'Checkbox').checked = true;
 		}
 	}
 }
