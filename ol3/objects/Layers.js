var Layers = {
	Class : function(mySources){
		
		myStyle = new Styles.Class();

		this.OSM = new ol.layer.Tile({
		  source: new ol.source.OSM(),
		});

		this.googleMaps = new ol.layer.Tile({
			source: new ol.source.MapQuest({layer: 'osm'}),
			visible: false //default visible
		});

		this.newLayer = function(url){
			return vectorPoints = new ol.layer.Vector({
			  source: mySources.newSource(url),
			  style: myStyle.styleFunction
			});
		}

		this.vectorInteraction = new ol.layer.Vector({
		  source: mySources.sourceInteraction,
		  style: myStyle.styleFunction
		});


	  $('#changeMapTo a').on('click', function(){
	    var id = $(this).attr('id');
	    if(id == "GoogleMaps"){ //Change to Open Street Maps
	      myLayers.googleMaps.setVisible(true);
	      myLayers.OSM.setVisible(false);
	    }else{ // Change to Google Maps
	      myLayers.OSM.setVisible(true);
	      myLayers.googleMaps.setVisible(false);
	    }
	  });
	  
	}
};