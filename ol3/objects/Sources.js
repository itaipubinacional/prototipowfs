var Sources = {
	Class: function(){

		this.loadFeaturesPoints = function(response) {
		  this.sourcePoints.addFeatures(this.sourcePoints.readFeatures(response));
		};

		this.sourcePoints = null

		this.newSource = function(url, name){
			return this.sourcePoints = new ol.source.ServerVector({
			  format: new ol.format.GeoJSON(),
			  loader: function(extent, resolution, projection) {
			    $.ajax({
			      url: url + '&bbox=' + extent.join(',') + ',EPSG:900913',
			      dataType: 'jsonp'
			    });
			  },
			  strategy: ol.loadingstrategy.createTile(new ol.tilegrid.XYZ({
			    maxZoom: 19
			  }))
			});
		}

		this.sourceInteraction = new ol.source.Vector();
	}
}