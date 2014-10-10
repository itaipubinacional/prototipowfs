var Layers = {
	Class : function(){
		
		myStyle = new Styles.Class();

		this.OSM = new ol.layer.Tile({
		  source: new ol.source.OSM(),
		});

		this.mapQuest = new ol.layer.Tile({
			source: new ol.source.MapQuest({layer: 'osm'}),
			visible: false //default visible
		});

		this.newLayer = function(store, layerId){
			return vectorPoints = new ol.layer.Vector({
			  source: mySources.newSource(store, layerId),
			  style: myStyle.styleFunction
			});
		}

		this.vectorInteraction = new ol.layer.Vector({
		  source: mySources.sourceInteraction,
		  style: myStyle.styleFunction
		});


	  this.showMapQuest = function(){
	      myLayers.mapQuest.setVisible(true);
	      myLayers.OSM.setVisible(false);
	  }

	  this.showOSM = function(){
	      myLayers.OSM.setVisible(true);
	      myLayers.mapQuest.setVisible(false);
	    }
	  
	}
};