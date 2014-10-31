var Interface = {
	Class : function(){

		this.form = document.getElementById('form');
		this.nameControlLabel = document.getElementById('nameControl');

		this.map = new ol.Map({
			layers: [myLayers.OSM, myLayers.mapQuest],
			target: document.getElementById('map'),
			view: new ol.View({
				center: [-6017386.113063093,-2863520.331444242],
				maxZoom: 19,
				zoom: 9
			})
		});

	    this.layersCollection = this.map.getLayers();
		this.interactionsCollection = this.map.getInteractions();
		this.map.addInteraction(myInteractions.select);
		this.store = "sid1.gg";

		this.setOption = function(optionId){
			this.removeExtraInteractions();

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

		this.removeExtraInteractions = function(){  //but not the select and default interactions
			for(var i = 10; i < this.interactionsCollection.getLength(); i++){ //[0]..[9] is defaults interactions
				this.interactionsCollection.pop();
			}
		}

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

		this.submitXml = function(){ //Draw or Modify Feature
			if (this.form.name.value != ''){
				var collection = myInteractions.select.getFeatures();
				var feature = collection.pop();
				var geometry = feature.getGeometry();

				if(myInteractions.isDraw)
					var str = this.drawFeature(myInteractions.featureToDraw);
				else
					var str = this.modifyFeature(feature);

				this.form.textXML.value = str;
				this.form.submit();
				}else 
					myInterface.nameControlLabel.hidden = false; //Show error message
		};

		this.drawFeature = function(feature){


			var geometry = feature.getGeometry();
			var geometryType = geometry.getType();
			var gmlStr;

			switch(geometryType){
				case 'LineString':
					gmlStr= this.gmlLineString(geometry.getCoordinates());
					break;

				case 'Polygon':
					gmlStr = this.gmlPolygon(geometry.getCoordinates());
					break;

				case 'Point':
					gmlStr= this.gmlPoint(geometry.getCoordinates());
					break;
			}

			var featureAtributesStr = this.getParametersToXMLDraw(feature);
			var geometryName = $('#'+this.layerEditable).attr('geometryName');

			var str = 
				'<Transaction service="WFS" version="1.1.0"\n'+
			      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
			      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
			      ' xmlns:'+myInterface.store+'="'+myInterface.store+'"\n'+
			      ' xmlns:gml="http://www.opengis.net/gml"\n'+
			      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':'+this.layerEditable+'">'+
			        '<wfs:Insert>\n'+
			          '<gml:featureMember>\n'+
			            '<'+myInterface.store+':'+this.layerEditable+'>\n'+
			              '<'+myInterface.store+':'+geometryName+'>\n'+

			              		gmlStr+

			              '</'+myInterface.store+':'+geometryName+'>\n'+

			              		featureAtributesStr+

			            '</'+myInterface.store+':'+this.layerEditable+'>\n'+
			          '</gml:featureMember>\n'+
			        '</wfs:Insert>\n'+
			      '</Transaction>\n';
			return str;
		}

		this.modifyFeature = function(feature){

			var geometry = feature.getGeometry();
			var geometryType = geometry.getType();
			var gmlStr;

			switch(geometryType){
				case 'LineString':
					gmlStr= this.gmlLineString(geometry.getCoordinates());
					break;

				case 'Polygon':
					gmlStr = this.gmlPolygon(geometry.getCoordinates());
					break;

				case 'Point':
					gmlStr= this.gmlPoint(geometry.getCoordinates());
					break;
			}

			var featureAtributesStr = this.getParametresToXMLModify(feature);

			var str = 
				'<Transaction service="WFS" version="1.1.0"\n'+
			      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
			      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
			      ' xmlns:'+myInterface.store+'="'+myInterface.store+'"\n'+
			      ' xmlns:ogc="http://www.opengis.net/ogc"\n'+
			      ' xmlns:gml="http://www.opengis.net/gml"\n'+
			      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename='+myInterface.store+':'+this.layerEditable+'">'+
			        '<wfs:Update typeName="'+myInterface.store+':'+this.layerEditable+'">\n'+
			          '<wfs:Property>\n'+
			            '<wfs:Name>'+feature.geometryName+'</wfs:Name>\n'+
			            '<wfs:Value>\n'+
			              gmlStr+
			            '</wfs:Value>\n'+
			          '</wfs:Property>\n'+
			          	featureAtributesStr+
			          '<ogc:Filter>\n'+
			            '<ogc:FeatureId fid="'+feature.getId()+'"/>\n'+
			          '</ogc:Filter>\n'+
			        '</wfs:Update>\n'+
			      '</Transaction>\n';
			return str;
		}

		this.getParametersToXMLDraw = function(feature){
			var featureAtributesStr = '';
			var editTable = document.getElementById('editTable');
			var rows = editTable.rows;
			for (var i=0; i < rows.length; i++) {
				var columms = rows[i].childNodes;
				var name = columms[0].innerHTML;
				var elements = columms[1].childNodes;
				var value = elements[0].value;
				featureAtributesStr += 
					'<'+myInterface.store+':'+name+'>'+value+'</'+myInterface.store+':'+name+'>\n';
			}
			return featureAtributesStr;
		}

		this.getParametresToXMLModify = function(feature){
			var featureAtributesStr = '';
			var editTable = document.getElementById('editTable');
			var rows = editTable.rows;
			for (var i=1; i < rows.length; i++) { //the first atribute is ID then the "for" begins at i = 1
				var columms = rows[i].childNodes;
				var name = columms[0].innerHTML;
				var elements = columms[1].childNodes;
				var value = elements[0].value;
				featureAtributesStr += 
					'<wfs:Property>\n'+
						'<wfs:Name>'+name+'</wfs:Name>\n'+
						'<wfs:Value>'+value+'</wfs:Value>\n'+
					'</wfs:Property>\n';
			}
			return featureAtributesStr;
		}

		this.gmlPoint = function(coordinates){
			return '<gml:Point srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
						'<gml:coordinates decimal="." cs="," ts=" ">'+coordinates+'</gml:coordinates>\n'+
					'</gml:Point>\n';
		}

		this.gmlPolygon = function(coordinates){
			var coordinatesStr = coordinates.toString();
			coordinatesStr = coordinatesStr.split(',').join(' ');
			return 	'<gml:Polygon srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
							'<gml:exterior>\n'+
								'<gml:LinearRing>\n'+
									'<gml:posList>'+coordinatesStr+'</gml:posList>\n'+
								'</gml:LinearRing>\n'+
							'</gml:exterior>\n'+
						'</gml:Polygon>\n';
		}

		this.gmlLineString = function(coordinates){
			var coordinatesStr = coordinates.toString();
			coordinatesStr = coordinatesStr.split(',').join(' ');
			return '<gml:LineString srsDimension="2" srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
						'<gml:posList>'+coordinatesStr+'</gml:posList>\n'+
					'</gml:LineString>\n';
		}

		this.SelectFeature = function(pixel) {
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				return feature;
			});

			if (feature && !myInteractions.isDraw){
				if(this.layerEditable)
					$('#editButton').attr('disabled', false);

				var featureKeysArray = feature.getKeys();

				var strInfo ="<tr>"+
								"<th>Id</th>"+
								"<td>"+feature.getId()+"</td>"+
							"</tr>";
				var strEditInfo = strInfo;
				var geometry = feature.get(featureKeysArray[0]);

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

		this.addAtribbutesToEditTable = function(featureKeysArray){
				var strEditInfo = '';
				console.log(featureKeysArray);
				for ( i in featureKeysArray ){
					strEditInfo += 
								"<tr>"+
									"<th>"+featureKeysArray[i]+"</th>"+
									"<td><input class='form-control' placeHolder='"+featureKeysArray[i]+"' /></td>"+
								"</tr>";
				}
				console.log(strEditInfo);
				$('#editInfoTbody').html(strEditInfo);
				console.log($('#editInfoTbody').html());
				
		}

		this.DeleteFeature = function(pixel){
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
			});

			if(feature){
				var deleteArray = [feature];
				var WFS = new ol.format.WFS();
				var node = WFS.writeTransaction(null, null ,deleteArray,{
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

		this.layerEditable = null;
		this.setEdit = function(layerId){
			//get the index where the layer is inserted in the collection
			var layerIndex = $('#'+layerId).attr('index');

			if(!layerIndex) // Is there the layer on the list ?
				this.showLayer(layerId);

			this.layerEditable = layerId;

			if(myInteractions.isDraw){
				myOptions.DrawOption();
			}

			$('#drawOption').attr('disabled', false);
			$('#modifyOption').attr('disabled', false);
			$('#deleteOption').attr('disabled', false);
			$('#saveButton').attr('disabled', false);
			$('#editButton').attr('disabled', true);

		};

		this.getLayerType = function(layerId){
			var layerType = $('#'+layerId).attr('layerType');
			switch(layerType){
				case 'line': return 'LineString';
				case 'polygon': return 'Polygon';
				case 'point' : return 'Point';
			}
		}

		this.getLayerAtributes = function(layerId){
			var atributesStr = $('#'+layerId+'Hidden').attr('atributes');
			return atributesStr.split(',');
		}

		this.getSource = function(layerId){
			var layerIndex = $('#'+this.layerEditable).attr('index');
			var layer = this.layersCollection.removeAt(layerIndex);

			layerIndex = this.layersCollection.push(layer);
			$('#'+this.layerEditable).attr('index',layerIndex);

			return layer.getSource();
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