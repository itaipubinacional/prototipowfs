var Interactions = {
	Class: function(){
	  	this.listenerKey;

	    this.isDraw;

		this.draw = new ol.interaction.Draw({
		  source: mySources.sourceInteraction,
		  type: 'Point'
		});

		this.select = new ol.interaction.Select();

		this.modify = new ol.interaction.Modify({
		  features: this.select.getFeatures()
		});


		this.getInteractions = function(){
			return [this.select, this.draw, this.modify];
		}
	}
}