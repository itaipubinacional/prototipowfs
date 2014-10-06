var Interface = {
	Class : function(){

		this.form = document.getElementById('form');
		this.nameControlLabel = document.getElementById('nameControl');
		this.map = new ol.Map({
			layers: [myLayers.OSM, myLayers.googleMaps, myLayers.vectorInteraction],
			target: document.getElementById('map'),
			view: new ol.View({
				center: [-6017386.113063093,-2863520.331444242],
				maxZoom: 19,
				zoom: 9
			})
		});

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

		//Modal Buttons -------

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
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':wfs">'+
					        '<wfs:Insert>\n'+
					          '<gml:featureMember>\n'+
					            '<'+myInterface.store+':wfs>\n'+
					              '<'+myInterface.store+':geometria>\n'+
					                '<gml:'+geometry.getType()+' srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
					                  '<gml:coordinates decimal="." cs="," ts=" ">'+geometry.getCoordinates()+'</gml:coordinates>\n'+
					                '</gml:'+geometry.getType()+'>\n'+
					              '</'+myInterface.store+':geometria>\n'+
					              '<'+myInterface.store+':nome>'+this.form.name.value+'</'+myInterface.store+':nome>\n'+
					            '</'+myInterface.store+':wfs>\n'+
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
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':wfs">'+
					        '<wfs:Update typeName="'+myInterface.store+':wfs">\n'+
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

		//end of Modal Buttons-------

		this.SelectFeature = function(pixel) {
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				return feature;
			});
			if (feature){
				var featureKeysArray = feature.getKeys();

				var str = "<tbody>"+
							"<tr>"+
								"<th>Id</th>"+
								"<td>"+feature.getId()+"</td>"+
							"</tr>";

				for (var i = 1; i < featureKeysArray.length; i++){ // feature.get(0) = geometry = Object then "i = 1"
					str+="<tr>"+
							"<th>"+featureKeysArray[i]+"</th>"+
							"<td> "+feature.get(featureKeysArray[i])+"</td>"+
						"</tr>";
				}
				str += "</tbody>";

				$('#infoTable').html(str);

			}else{
					this.form.name.value = '';
					$('#infoTable').html(' <thead><tr><th>Name</th><th>Data</th></tr></thead></table>');
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
					featureType: 'wfs',
					schemaLocation: "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename="+this.store+":wfs",
					srsname: 'http://www.opengis.net/gml/srs/epsg.xml#900913',
					gmlOptions: {
						srsname: 'http://www.opengis.net/gml/srs/epsg.xml#900913',
					}
				});
				var XMLS = new XMLSerializer();
				var str = XMLS.serializeToString( node );
				this.form.textXML.value = str;
				this.form.submit();
			}
		}

		this.setOption = function(optionId){
			this.removeAllInteractions();

			switch(optionId){

				case 'alternateEditOption':
					var disabled = $('#drawOption').attr('disabled');
					$('#drawOption').attr('disabled', !disabled); // Not in the disabled
					$('#modifyOption').attr('disabled', !disabled);
					$('#deleteOption').attr('disabled', !disabled);
					$('#saveButton').attr('disabled', !disabled);

					if(disabled){
					$('#layersTable .editColumn').show();
					}else
					$('#layersTable .editColumn').hide();

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

		this.setEdit = function(layerId){

			//get the index where the layer is inserted in the collection
			var layerIndex = $('#'+layerId).attr('index');

			var layer;
			if(layerIndex){ // Is there layer on the list ?
				//remove the layer from the list
				layer = this.layersCollection.removeAt(parseInt(layerIndex));
			}else{
				layer = this.newLayer(layerId);
			}

			//insert the layer on top of the list and returns the index
			$('#'+layerId).attr('index', this.layersCollection.push(layer)); 
		};

		this.showLayer = function(layerId){
			var visibility = $('#'+layerId).attr('class');
			
				if(visibility.search('close') != -1){ //the layer is hidden

					var layer = myLayers.newLayer('http://msiegalxhp:8080/geoserver/wfs?service=WFS&' +
													'version=2.0.0&'+
													'request=GetFeature&typename='+this.store+':'+layerId+'&' +
													'outputFormat=text/javascript&' +
													'format_options=callback:mySources.loadFeaturesPoints&' +
													'srsname=EPSG:900913');

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
	}
};