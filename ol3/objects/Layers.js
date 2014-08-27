var Layers = {
	Class : function(mySources){
		
		myStyle = new Styles.Class();


		this.OSM = new ol.layer.Tile({
		  source: new ol.source.OSM(),
		});

		this.googleMaps = new ol.layer.Tile({source: new ol.source.MapQuest({layer: 'osm'})});

		this.vectorPoints = new ol.layer.Vector({
		  source: mySources.sourcePoints,
		  style: myStyle.styleFunction
		});

		this.vectorInteraction = new ol.layer.Vector({
		  source: mySources.sourceInteraction,
		  style: myStyle.styleFunction
		});
	}
};