var Styles = {
	Class : function(){

		styles = {
		  'Point': [new ol.style.Style({
		    image: new ol.style.Circle({
			  radius: 5,
			  fill: new ol.style.Fill({
			      color: 'rgba(255, 0, 0, 0.4)'
			    }),
			  stroke: new ol.style.Stroke({color: 'red', width: 1})
			})
		  })],
		  'LineString': [new ol.style.Style({
		    stroke: new ol.style.Stroke({
		      color: 'green',
		      width: 1
		    })
		  })],
		  'Polygon': [new ol.style.Style({
		    stroke: new ol.style.Stroke({
		      color: 'blue',
		      lineDash: [4],
		      width: 1
		    }),
		    fill: new ol.style.Fill({
		      color: 'rgba(0, 0, 255, 0.1)',
		    })
		  })]
		};

		this.styleFunction = function(feature, resolution) {
			return this.styles[feature.getGeometry().getType()]
		};
	}
};