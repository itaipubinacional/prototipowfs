var Options = {
	Class: function(url){

		mySources = new Sources.Class(url);
		myLayers = new Layers.Class(mySources);
		myInteractions = new Interactions.Class(mySources);
		myInterface = new Interface.Class(mySources, myInteractions, myLayers);

		this.SelectOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.removeInteraction( myInteractions.modify );
			myInterface.saveModifyButton.style.display = "none";
			myInteractions.listenerKey = myInterface.map.on('click', function( evt ) { //Returns Key of Listener
				myInterface.SelectFeature(evt.pixel);
			});
		}

		this.DrawOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInterface.map.removeInteraction( myInteractions.modify );
			myInterface.map.addInteraction( myInteractions.draw );
			myInterface.saveModifyButton.style.display = "none";
			myInteractions.isDraw = true;
			myInteractions.listenerKey = myInterface.map.on('click', function() { //Returns Key of Listener
				myInterface.form.name.value = '';
				$( myInterface.myModal ).modal('show'); 
			});
		}

		this.ModifyOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.addInteraction( myInteractions.modify );
			myInteractions.isDraw = false;
			myInterface.saveModifyButton.style.display = "block";
		}

		this.DeleteOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.removeInteraction( myInteractions.modify );
			myInterface.saveModifyButton.style.display = "none";
			myInteractions.listenerKey = myInterface.map.on( 'click', function( evt ) { //Returns Key of Listener
				myInterface.DeleteFeature( evt.pixel );
			});
		}

	}
}