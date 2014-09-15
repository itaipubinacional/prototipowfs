var Interface = {
	Class : function(mySources, myInteractions, myLayers){

		this.myModal = document.getElementById('myModal');
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

		this.layersCollection = this.map.getLayers();

		this.newLayer = function(url){
			this.map.addLayer(myLayers.newLayer(url));
		}

		this.map.addInteraction(myInteractions.select);

		//Modal Buttons -------

		$('#submitButton').click(function() { //Draw or Modify Feature
			if (this.form.name.value != ''){
				var collection = myInteractions.select.getFeatures();
				var feature = collection.pop();
				var geometry = feature.getGeometry();
				if(myInteractions.isDraw){
					str = '<Transaction service="WFS" version="1.1.0"\n'+
					      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
					      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
					      ' xmlns:sid1.gg="sid1.gg"\n'+
					      ' xmlns:gml="http://www.opengis.net/gml"\n'+
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=sid1.gg:wfs">'+
					        '<wfs:Insert>\n'+
					          '<gml:featureMember>\n'+
					            '<sid1.gg:wfs>\n'+
					              '<sid1.gg:geometria>\n'+
					                '<gml:'+geometry.getType()+' srsName="http://www.opengis.net/gml/srs/epsg.xml#900913">\n'+
					                  '<gml:coordinates decimal="." cs="," ts=" ">'+geometry.getCoordinates()+'</gml:coordinates>\n'+
					                '</gml:'+geometry.getType()+'>\n'+
					              '</sid1.gg:geometria>\n'+
					              '<sid1.gg:nome>'+this.form.name.value+'</sid1.gg:nome>\n'+
					            '</sid1.gg:wfs>\n'+
					          '</gml:featureMember>\n'+
					        '</wfs:Insert>\n'+
					      '</Transaction>\n';
				}else{
					str = '<Transaction service="WFS" version="1.1.0"\n'+
					      ' xmlns:wfs="http://www.opengis.net/wfs"\n'+
					      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n'+
					      ' xmlns:sid1.gg="sid1.gg"\n'+
					      ' xmlns:ogc="http://www.opengis.net/ogc"\n'+
					      ' xmlns:gml="http://www.opengis.net/gml"\n'+
					      ' xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=sid1.gg:wfs">'+
					        '<wfs:Update typeName="sid1.gg:wfs">\n'+
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
		});

		$('#cancelButton').click(function(){
			mySources.sourceInteraction.clear();
			myInterface.map.removeInteraction( myInteractions.select );
			myInteractions.select = new ol.interaction.Select();
			myInterface.map.addInteraction( myInteractions.select );
		});

		//end of Modal Buttons-------

		this.SelectFeature = function(pixel) {
			var feature = this.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
				return feature;
			});
			if (feature){
				var featureKeysArray = feature.getKeys();

				var str = "<tbody>";
				for (var i = 1; i < featureKeysArray.length; i++){
					str+="<tr>"+
							"<th>"+featureKeysArray[i]+"</th>"+
							"<td> "+feature.get(featureKeysArray[i])+"</td>"+
						"</tr>";
				}
				str += "</tbody>";

				$('#panelTable').html(feature.getId());
				$('#infoTable').html(str);

				this.form.name.value = feature.get('nome')? feature.get('nome'):'';
				var coord = feature.getGeometry().getCoordinates();
				this.popup.setPosition(coord);

			}else{
					this.form.name.value = '';
					$('#infoTable').html('');
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
					featureNS: 'sid1.gg',
					featureType: 'wfs',
					schemaLocation: "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=sid1.gg:wfs",
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
	}
};