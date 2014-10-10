var Interactions = {
	Class: function(){
	  	this.listenerKey;

	    this.isDraw;

	    this.draw = new ol.interaction.Draw({
			source: mySources.sourceInteraction,
			type: 'Point' //default
		});

		this.setDrawType = function(geometryName){
			this.draw = new ol.interaction.Draw({
				source: mySources.sourceInteraction,
				type: geometryName //default
			});
		}

		this.select = new ol.interaction.Select();

		this.modify = new ol.interaction.Modify({
		  features: this.select.getFeatures()
		});
		
		this.getInteractions = function(){
			return [this.select, this.draw, this.modify];
		}

		this.cancelDrawInteraction = function(){
			mySources.sourceInteraction.clear();
			var collection = this.select.getFeatures();
			collection.clear();
		};
	}
}