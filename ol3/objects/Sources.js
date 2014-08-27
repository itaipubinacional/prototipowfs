var Sources = {
	Class: function(url){

		this.loadFeaturesPoints = function(response) {
		  this.sourcePoints.addFeatures(this.sourcePoints.readFeatures(response));
		};

		this.sourcePoints = new ol.source.ServerVector({
		  format: new ol.format.GeoJSON(),
		  loader: function(extent, resolution, projection) {
		    $.ajax({
		      url: url,
		      dataType: 'jsonp'
		    });
		  },
		  strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
		    maxZoom: 19
		  }))
		});

		this.sourceInteraction = new ol.source.Vector();
	}
}