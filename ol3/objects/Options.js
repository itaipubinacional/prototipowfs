var Options = {
	Class: function(){

		this.SelectOption = function(){
			myInteractions.listenerKey = myInterface.map.on('click', function( evt ) { //Returns Key of Listener
				myInterface.SelectFeature(evt.pixel);
			});
		}

		this.DrawOption = function(){
			var layerForDraw = myInterface.layerEditable;
			var geometryName = myInterface.getLayerType(layerForDraw);
			myInterface.map.removeInteraction(myInteractions.draw);

			var source = myInterface.getSource(layerForDraw);

			myInteractions.setDrawType(geometryName, source);

			myInterface.map.addInteraction(myInteractions.draw);
			
			myInteractions.isDraw = true;

			myInteractions.draw.on('drawend', function(evt){
				var arrayAtributes = myInterface.getLayerAtributes(layerForDraw);
				myInterface.addAtribbutesToEditTable(arrayAtributes);

				myInteractions.featureToDraw = evt.feature;

				$('#myModal').modal('show');

			}, null);
		}

		this.ModifyOption = function(){
			myInterface.map.addInteraction(myInteractions.modify);
			myInteractions.isDraw = false;
		}

		this.DeleteOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInteractions.listenerKey = myInterface.map.on( 'click', function( evt ) { //Returns Key of Listener
				myInterface.DeleteFeature(evt.pixel);
			});
		};

	}
};