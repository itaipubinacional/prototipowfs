var Options = {
	Class: function(){

		this.SelectOption = function(){
			myInteractions.listenerKey = myInterface.map.on('click', function( evt ) { //Returns Key of Listener
				myInterface.SelectFeature(evt.pixel);
			});
		}

		this.DrawOption = function(){
			var geometryName = myInterface.getLayerType(myInterface.layerEditable);
			myInterface.map.removeInteraction( myInteractions.draw );
			myInteractions.setDrawType(geometryName);
			myInterface.map.addInteraction( myInteractions.draw );
			
			myInteractions.isDraw = true;
			myInteractions.listenerKey = myInterface.map.on('click', function() { //Returns Key of Listener
				myInterface.form.name.value = '';
				$( myInterface.myModal ).modal('show');
			});
		}

		this.ModifyOption = function(){
			myInterface.map.addInteraction( myInteractions.modify );
			myInteractions.isDraw = false;
		}

		this.DeleteOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInteractions.listenerKey = myInterface.map.on( 'click', function( evt ) { //Returns Key of Listener
				myInterface.DeleteFeature( evt.pixel );
			});
		};

	}
};