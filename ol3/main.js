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
};
