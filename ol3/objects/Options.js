var Options = {
	Class: function(){


		this.alternateEditOption = function(){

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
			window.json_layer_structure.featureTypes.editMode = true;

		}

		this.SelectOption = function(){
			myInteractions.listenerKey = myInterface.map.on('click', function( evt ) { //Returns Key of Listener
				myInterface.SelectFeature(evt.pixel);
			});
		}

		this.DrawOption = function(){
			var layerForDraw = myInterface.layerEditable;
			var geometryName = myInterface.getLayerType(layerForDraw);
			myInterface.map.removeInteraction(myInteractions.draw);

			var source = myInterface.getSource(layerForDraw);

			myInteractions.setDrawType(geometryName, source);

			myInterface.map.addInteraction(myInteractions.draw);
			
			myInteractions.isDraw = true;

			myInteractions.draw.on('drawend', function(evt){
				var arrayAtributes = myInterface.getLayerAtributes(layerForDraw);
				myInterface.addAtribbutesToEditTable(arrayAtributes);

				myInteractions.featureToDraw = evt.feature;

				$('#myModal').modal('show');

			}, null);
		}

		this.ModifyOption = function(){
			myInterface.map.addInteraction(myInteractions.modify);
			myInteractions.isDraw = false;
		}

		this.DeleteOption = function(){
			myInterface.map.unByKey( myInteractions.listenerKey );
			myInteractions.listenerKey = myInterface.map.on( 'click', function( evt ) { //Returns Key of Listener
				myInterface.DeleteFeature(evt.pixel);
			});
		};

	}
};