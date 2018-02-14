(function(){ 
	jQuery.sap.declare("AstroPix.utils.canvasHolder");
	jQuery.sap.require("sap.m.Text");
	
	
	
	sap.ui.core.Control.extend("AstroPix.utils.canvasHolder",{
		metadata:{
			 properties : {
				 channel			 : {type : "string"},
	          }
		},
		init : function(){},
		renderer : {
	        render : function(oRm, oControl) {
	        	
	        	oRm.write('<canvas id="');
	        	oRm.write(oControl.getChannel());
	        	oRm.write('canvas" width="800" height="500" style="border:1px solid #d3d3d3;">');
	        	
	        }
		}
	});
	
})();

