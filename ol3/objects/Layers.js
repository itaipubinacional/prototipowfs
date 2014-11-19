var Layers = {
	Class : function(){
		
		myStyle = new Styles.Class();

		this.OSM = new ol.layer.Tile({ //default layer
		  source: new ol.source.OSM(),
		  visible: true
		});

		this.mapQuest = new ol.layer.Tile({
			source: new ol.source.MapQuest({layer: 'osm'}),
			visible: false 
		});

		this.wmsLayer =  new ol.layer.Image({
		    source: new ol.source.ImageWMS({
		      url: 'http://localhost:8080/geoserver/sid1.gg/wms',
		      params: { 'LAYERS': 'sid1.gg:all_images',
		                'FORMAT': 'image/jpeg',
		              }
		    }),
		    visible: false
		  });

		this.newLayer = function(store, layerId){
			return vectorPoints = new ol.layer.Vector({
				source: mySources.newSource(store, layerId),
				style: myStyle.styleFunction,
				layerId: layerId
			});
		}

		this.showMapQuest = function(){
			myInterface.map.setView(myInterface.wfsView);
			this.mapQuest.setVisible(true);
			this.OSM.setVisible(false);
			this.wmsLayer.setVisible(false);
		}

		this.showOSM = function(){
			myInterface.map.setView(myInterface.wfsView);
			this.OSM.setVisible(true);
			this.mapQuest.setVisible(false);
			this.wmsLayer.setVisible(false);
		}

		this.showWmsLayer = function(){
			myInterface.map.setView(myInterface.wmsView);
			this.wmsLayer.setVisible(true);
			this.OSM.setVisible(false);
			this.mapQuest.setVisible(false);
		}
	}
};