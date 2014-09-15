var Options = {
	Class: function(){

		mySources = new Sources.Class();
		myLayers = new Layers.Class(mySources);
		myInteractions = new Interactions.Class(mySources);
		myInterface = new Interface.Class(mySources, myInteractions, myLayers);

		this.SelectOption = function(){
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.removeInteraction( myInteractions.modify );
			myInteractions.listenerKey = myInterface.map.on('click', function( evt ) { //Returns Key of Listener
				myInterface.SelectFeature(evt.pixel);
			});
		}

		this.DrawOption = function(){
			myInterface.map.removeInteraction( myInteractions.modify );
			myInterface.map.addInteraction( myInteractions.draw );
			myInteractions.isDraw = true;
			myInteractions.listenerKey = myInterface.map.on('click', function() { //Returns Key of Listener
				myInterface.form.name.value = '';
				$( myInterface.myModal ).modal('show'); 
			});
		}

		this.ModifyOption = function(){
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.addInteraction( myInteractions.modify );
			myInteractions.isDraw = false;
		}

		this.DeleteOption = function(){
			myInterface.map.removeInteraction( myInteractions.draw );
			myInterface.map.removeInteraction( myInteractions.modify );
			myInteractions.listenerKey = myInterface.map.on( 'click', function( evt ) { //Returns Key of Listener
				myInterface.DeleteFeature( evt.pixel );
			});
		}

	}
}