var Interface = {
	Class : function(){

		this.form = document.getElementById('form');
		this.nameControlLabel = document.getElementById('nameControl');

		this.map = new ol.Map({
			layers: [myLayers.OSM, myLayers.mapQuest, myLayers.vectorInteraction],
			target: document.getElementById('map'),
			view: new ol.View({
				center: [-6017386.113063093,-2863520.331444242],
				maxZoom: 19,
				zoom: 9
			})
		});

		this.setOption = function(optionId){
			this.removeAllInteractions();

			switch(optionId){

				case 'alternateEditOption':
					var disabled = $('#drawOption').attr('disabled');

					if(disabled){
						$('#layersTable .editColumn').show();

					}else{  // not disnabled

						$('#drawOption').attr('disabled', true);
						$('#modifyOption').attr('disabled', true);
						$('#deleteOption').attr('disabled', true);
						$('#saveButton').attr('disabled', true);

						$('#editButton').attr('disabled', true);

						$('#layersTable .editColumn').hide();
						$('#infoTable .editColumn').off();
						$('#infoTbody').html('');

						this.layerEditable = null;
					}

					break;

				case 'selectOption':
					myOptions.SelectOption();
					break;

				case 'drawOption':
					myOptions.DrawOption();
					break;

				case 'modifyOption':
					myOptions.ModifyOption();
					break;

				case 'deleteOption':
					myOptions.DeleteOption();
					break;
			}
		};

		this.removeAllInteractions = function(){  //but not the select and default interactions
			for(var i = 10; i < this.interactionsCollection.getLength(); i++){ //[0]..[9] is defaults interactions
				this.interactionsCollection.pop();
			}
			this.map.unByKey( myInteractions.listenerKey );
		}

		this.layersCollection = this.map.getLayers();
		this.interactionsCollection = this.map.getInteractions();

		this.newLayer = function(layerName){
			var url = 'http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
				'version=2.0.0&'+
				'request=GetFeature&'+
				'typename='+this.store+':'+layerName+'&' +
				'outputFormat=text/javascript&' +
				'format_options=callback:mySources.loadFeaturesPoints&' +
				'srsname=EPSG:900913';
			this.map.addLayer(myLayers.newLayer(url));
		}

		this.map.addInteraction(myInteractions.select);

		this.store = "sid1.gg";

		this.submitXml = function(){ //Draw or Modify Feature
			if (this.form.name.value != ''){
				var collection = myInteractions.select.getFeatures();
				var feature = collection.pop();
				var geometry = feature.getGeometry();
				if(myInteractions.isDraw){
					str = '<Transaction service="WFS" version="1.1.0"\n'+
					      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
					      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
					      ' xmlns:'+myInterface.store+'="'+myInterface.store+'"\n'+
					      ' xmlns:gml="http://www.opengis.net/gml"\n'+
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':'+this.layerEditable+'">'+
					        '<wfs:Insert>\n'+
					          '<gml:featureMember>\n'+
					            '<'+myInterface.store+':'+this.layerEditable+'>\n'+
					              '<'+myInterface.store+':geometria>\n'+
					                '<gml:'+geometry.getType()+' srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
					                  '<gml:coordinates decimal="." cs="," ts=" ">'+geometry.getCoordinates()+'</gml:coordinates>\n'+
					                '</gml:'+geometry.getType()+'>\n'+
					              '</'+myInterface.store+':geometria>\n'+
					              '<'+myInterface.store+':nome>'+this.form.name.value+'</'+myInterface.store+':nome>\n'+
					            '</'+myInterface.store+':'+this.layerEditable+'>\n'+
					          '</gml:featureMember>\n'+
					        '</wfs:Insert>\n'+
					      '</Transaction>\n';
				}else{
					str = '<Transaction service="WFS" version="1.1.0"\n'+
					      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
					      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
					      ' xmlns:'+myInterface.store+'="'+myInterface.store+'"\n'+
					      ' xmlns:ogc="http://www.opengis.net/ogc"\n'+
					      ' xmlns:gml="http://www.opengis.net/gml"\n'+
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':'+this.layerEditable+'">'+
					        '<wfs:Update typeName="'+myInterface.store+':'+this.layerEditable+'">\n'+
					          '<wfs:Property>\n'+
					            '<wfs:Name>geometria</wfs:Name>\n'+
					            '<wfs:Value>\n'+
					              '<gml:'+geometry.getType()+' srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
					                '<gml:coordinates decimal="." cs="," ts=" ">'+geometry.getCoordinates()+'</gml:coordinates>\n'+
					              '</gml:'+geometry.getType()+'>\n'+
					            '</wfs:Value>\n'+
					          '</wfs:Property>\n'+
					          '<wfs:Property>\n'+
					            '<wfs:Name>nome</wfs:Name>\n'+
					            '<wfs:Value>'+this.form.name.value+'</wfs:Value>\n'+
					          '</wfs:Property>\n'+
					          '<ogc:Filter>\n'+
					            '<ogc:FeatureId fid="'+feature.getId()+'"/>\n'+
					          '</ogc:Filter>\n'+
					        '</wfs:Update>\n'+
					      '</Transaction>\n';
				}
				this.form.textXML.value = str;
				this.form.submit();
				}else 
					myInterface.nameControlLabel.hidden = false; //Show error message
		};

		this.cancelDrawInteraction = function(){
			mySources.sourceInteraction.clear();
			var collection = myInteractions.select.getFeatures();
			collection.clear();
		};

		this.SelectFeature = function(pixel) {
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				return feature;
			});

			if (feature){
				if(this.layerEditable)
					$('#editButton').attr('disabled', false);

				var featureKeysArray = feature.getKeys();

				var strInfo ="<tr>"+
								"<th>Id</th>"+
								"<td>"+feature.getId()+"</td>"+
							"</tr>";
				var strEditInfo = strInfo;

				 // feature.get(0) = geometry = Object, then "i = 1"
				for (var i = 1; i < featureKeysArray.length; i++){
					strInfo += "<tr>"+
									"<th>"+featureKeysArray[i]+"</th>"+
									"<td>"+feature.get(featureKeysArray[i])+"</td>"+
								"</tr>";
					strEditInfo += "<tr>"+
									"<th>"+featureKeysArray[i]+"</th>"+
									"<td><input class='form-control' value='"+feature.get(featureKeysArray[i])+"' /></td>"+
								"</tr>";
				}

				$('#infoTbody').html(strInfo);
				$('#editInfoTbody').html(strEditInfo);

			}else{
				$('#editButton').attr('disabled', true);
				$('#infoTbody').html('');
				$('#editInfoTbody').html(strEditInfo);
			}
		}

		this.DeleteFeature = function(pixel){
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
			});

			if(feature){
				var deleteArray = [feature];
				var WFS = new ol.format.WFS();
				var node = WFS.writeTransaction(null,null,deleteArray,{
					featureNS: this.store,
					featureType: this.layerEditable,
					schemaLocation: "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename="+this.store+":"+this.layerEditable
				});
				var XMLS = new XMLSerializer();
				var str = XMLS.serializeToString( node );
				this.form.textXML.value = str;
				this.form.submit();
			}
		}

		this.modifyFeature = function(feature){
			var collection = myInteractions.select.getFeatures();
			var featureArray = collection.getArray();

			if(featureArray){
				var WFS = new ol.format.WFS();
				var node = WFS.writeTransaction(null,featureArray,null,{
					featureNS: this.store,
					featureType: this.layerEditable,
					schemaLocation: "http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename="+this.store+":"+this.layerEditable,
					gmlOptions: {
						srsName: "EPSG:900913",
						coordinates: "decimal='.' cs=',' ts=' '"
					}
				});
				var XMLS = new XMLSerializer();
				var str = XMLS.serializeToString( node );
				this.form.textXML.value = str;
				this.form.submit();
			}
		}

		this.layerEditable = null;
		this.setEdit = function(layerId){

			//get the index where the layer is inserted in the collection
			var layerIndex = $('#'+layerId).attr('index');

			if(!layerIndex) // Is there the layer on the list ?
				this.showLayer(layerId);

			this.layerEditable = layerId;

			$('#drawOption').attr('disabled', false);
			$('#modifyOption').attr('disabled', false);
			$('#deleteOption').attr('disabled', false);
			$('#saveButton').attr('disabled', false);
			$('#editButton').attr('disabled', true);

		};

		this.getLayerType = function(layerId){
			var layerIndex = $('#'+layerId).attr('index');
			var layer = this.layersCollection.removeAt(layerIndex);
			var source = layer.getSource();
			var featuresArray = source.getFeatures();
			var geometry = featuresArray[featuresArray.length-1].getGeometry()
			layerIndex = this.layersCollection.push(layer);
			$('#'+layerId).attr('index',layerIndex);

			var geometryType = geometry.getType();
			switch(geometryType){
				case geometryType == 'MultiLineString':
					geometryType = 'LineString';
					break;

				case geometryType == 'MultiPoint':
					geometryType = 'Point';
					break;

				case geometryType == 'MultiPolygon':
					geometryType = 'Polygon';
					break;
			}
			return geometryType;
		}

		this.showLayer = function(layerId){
			var visibility = $('#'+layerId).attr('class');
			
				if(visibility.search('close') != -1){ //the layer is hidden

					var layer = myLayers.newLayer(this.store, layerId);

					var layerIndex =  this.layersCollection.push(layer); //the collection returns the layer's index
					$('#'+layerId).attr('index', layerIndex);

					var visibility = visibility.replace('close', 'open');
					$('#'+layerId).attr('class', visibility);


				}else{  //the layer is visible

					this.layersCollection.removeAt(parseInt($('#'+layerId).attr('index'))); //index of the element to delete
					$('#'+layerId).attr('index', null);
					$('#'+layerId).attr('class',visibility.replace('open','close'));
				}
		}

		this.changeMapTo = function(map){

			if(map == "mapQuest")
				myLayers.showMapQuest();
			else
				myLayers.showOSM();
		}

	}
};