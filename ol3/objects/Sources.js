var Sources = {
	Class: function(){

		this.loadFeaturesPoints = function(response) {
			var featuresArray = this.sourcePoints.readFeatures(response);
			for(i in featuresArray){
				featuresArray[i].geometryName = response.features[i].geometry_name;
			}
			this.sourcePoints.addFeatures(featuresArray);
		};

		this.newSource = function(store, layerId){
			return this.sourcePoints = new ol.source.ServerVector({
				format: new ol.format.GeoJSON(),
				loader: function(extent, resolution, projection) {

					var url =	'http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
					'version=2.0.0&'+
					'request=GetFeature&typename='+store+':'+layerId+'&' +
					'outputFormat=text/javascript&' +
					'format_options=callback:mySources.loadFeaturesPoints&' +
					'srsname=EPSG:900913'+ '&bbox=' + extent.join(',') + ',EPSG:900913';

					$.ajax({
						url: url,
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