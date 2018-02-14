sap.ui.controller("AstroPix.view.Master", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf astropix.Master
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf astropix.Master
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf astropix.Master
*/
	onAfterRendering: function() {
		
		this.onLoadMethods();
		this.onLoadLayerModels();
		this.onCreateCanvas();
		
	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf astropix.Master
*/
//	onExit: function() {
//
//	}
	
	activeLayer : "red",
	lastValue : 50,
	lastContrast : 50,
	
	onLoadMethods:function(evt){
		sap.ui.getCore().byId("master--sideNav").setExpanded(false);
		sap.ui.getCore().byId("master--toolPage").setSideExpanded(false);

	},
	
	onLoadLayerModels:function(evt){
		var redLayer = new sap.ui.model.json.JSONModel();
		this.getView().setModel(redLayer,"redLayer");
		
		var greenLayer = new sap.ui.model.json.JSONModel();
		this.getView().setModel(greenLayer,"greenLayer");
		
		var blueLayer = new sap.ui.model.json.JSONModel();
		this.getView().setModel(blueLayer,"blueLayer");
		
		var screenLayer = new sap.ui.model.json.JSONModel();
		this.getView().setModel(screenLayer,"screenLayer");
		
	},
	
	onSideNavButtonPress: function(evt){
		var sideNav = sap.ui.getCore().byId("master--sideNav");
		var toolPage = sap.ui.getCore().byId("master--toolPage");

		if(sideNav.getExpanded() == false){
			sideNav.setExpanded(true);
			toolPage.setSideExpanded(true);
		}
		else{
			sideNav.setExpanded(false);
			toolPage.setSideExpanded(false);
		}
	},
	
	onBarSelect: function(evt){
		var key = this.getView().byId(evt.getSource().sId.split("--")[1]).getSelectedKey();		
		this.activeLayer = key;
		
		this.reDrawCanvas();

		
	},
	
	
	
	onCreateCanvas: function(){
		var canvas = document.getElementById("redcanvas").getContext("2d");
		var width = document.getElementById("redcanvas").width;
		var height = document.getElementById("redcanvas").height;

		var image = new Image();
		image.crossOrigin = "anonymous";  // This enables CORS
		image.src = "img/andromeda_infra.gif";

		image.onload = function (event) {
		    try {
		        
		    	canvas.drawImage(image, 0, 0, width, height); 
		    	
		    } catch (e) {

		    }
			
		};
	},
	
	
	
	reDrawCanvas: function(restore){
		var canvasID = this.activeLayer + "canvas";
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		var imageData;
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		switch(canvasID){
			case "redcanvas":
				imageData = this.getView().getModel("redLayer").oData;
			break;
			
			case "greencanvas":
				imageData = this.getView().getModel("greenLayer").oData;
			break;
			
			case "bluecanvas":
				imageData = this.getView().getModel("blueLayer").oData;
			break;
			case "screenBlendingcanvas":
				imageData = this.getView().getModel("screenLayer").oData;
			break;
		}
		
		var image = new Image();
		
		if(canvasID == "redcanvas"){
			image.src = "img/andromeda_infra.gif";
		}
		else if(canvasID == "greencanvas"){
			image.src = "img/andromeda_red.gif";
		}
		else if(canvasID == "bluecanvas"){
			image.src = "img/andromeda_blue.gif";
		}
		else{
			image.src = "img/andromeda_red.gif";
		}
		
		

		image.onload = function (event) {
		    try {
		        if(imageData.data == null || restore == true){
		        	console.log(image);
		        	canvas.drawImage(image, 0, 0, width, height); 
		        }
		        else{
		        	canvas.putImageData(imageData,0,0); 
		        }
		    	

		    } catch (e) {

		    }
			
		};
		
	},
	
	onRestore: function(evt){
		this.reDrawCanvas(true);
	},
	
	onBrightnessChange:function(oEvent){
		var scrollID = oEvent.getSource().sId;
		var scrollValue = sap.ui.getCore().byId(scrollID).getValue();
		var checkValue = true;
		
		scrollValue > this.lastValue ? checkValue = true : checkValue = false;
		
		this.onAdjustImage(checkValue);
		
		this.lastValue = scrollValue;
	},
	
	onContrastChange:function(oEvent){
		var scrollID = oEvent.getSource().sId;
		var scrollValue = sap.ui.getCore().byId(scrollID).getValue();
		var checkValue = true;
		
		scrollValue > this.lastContrast ? checkValue = true : checkValue = false;
		
		this.onContrast(checkValue);
		
		this.lastContrast = scrollValue;
	},
	
	onAdjustImage:function(value){
		var canvasID = this.activeLayer + "canvas";
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		var imageData = canvas.getImageData(0, 0, width, height);
		var data = imageData.data;
		 
		  
		 
		 if(value == true){
			 for (var i = 0; i < data.length; i += 4) {
				  data[i]     += 5;     // red
			      data[i + 1] += 5; // green
			      data[i + 2] += 5; // blue
			   }
		 }
		 else{
			 for (var i = 0; i < data.length; i += 4) {
				  data[i]     -= 5;     // red
			      data[i + 1] -= 5; // green
			      data[i + 2] -= 5; // blue
			   }
		 }
		 
		  
		  
		  canvas.putImageData(imageData,0,0);
		  
		  switch(canvasID){
		  case "redcanvas":
			  this.getView().getModel("redLayer").setData(imageData);
			  break;
		  case "greencanvas":
			  this.getView().getModel("greenLayer").setData(imageData);
			  break;
		  case "bluecanvas":
			  this.getView().getModel("blueLayer").setData(imageData);
			  break;  
		  }
		

		
	},
	
	onGreyImage: function(){
		var canvasID = this.activeLayer + "canvas";
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		var imageData = canvas.getImageData(0, 0, width, height);
		 var data = imageData.data;
		 
		 var value= 15;
		  
		 for (var i = 0; i < data.length; i += 4) {
			  var r = data[i];     // red
		      var g = data[i + 1]; // green
		      var b = data[i + 2]; // blue
		      
		      var v = 0.2126*r + 0.7152*g + 0.0722*b;
		      data[i] = data[i+1] = data[i+2] = v;
		   }
		  
		  
		  canvas.putImageData(imageData,0,0);
		  
		  switch(canvasID){
		  case "redcanvas":
			  this.getView().getModel("redLayer").setData(imageData);
			  break;
		  case "greencanvas":
			  this.getView().getModel("greenLayer").setData(imageData);
			  break;
		  case "bluecanvas":
			  this.getView().getModel("blueLayer").setData(imageData);
			  break;  
		  }
			
	},
	
	
	onContrast: function(ContrastValue){
		var canvasID = this.activeLayer + "canvas";
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		var imageData = canvas.getImageData(0, 0, width, height);
		var data = imageData.data;
		
		 
		 var value= 15;
		 
		 if(ContrastValue == true){
			  for (var i = 0; i < data.length; i += 4) {
				  
				  var factor = (259 * (value + 255)) / (255 * (259 - value));
				  
				  data[i]     = factor * data[i];     // red
			      data[i + 1] = factor * data[i + 1]; // green
			      data[i + 2] = factor * data[i + 2]; // blue
			   }
		 }
		 else{
			  for (var i = 0; i < data.length; i += 4) {
				  
				  var factor = (259 * (value + 255)) / (255 * (259 - value));
				  
				  data[i]     = 1 / factor * data[i];     // red
			      data[i + 1] = 1 / factor * data[i + 1]; // green
			      data[i + 2] = 1 / factor * data[i + 2]; // blue
			   
			  }
		 }
		  

		  
		  
		  canvas.putImageData(imageData,0,0);
		  
		  switch(canvasID){
		  case "redcanvas":
			  this.getView().getModel("redLayer").setData(imageData);
			  break;
		  case "greencanvas":
			  this.getView().getModel("greenLayer").setData(imageData);
			  break;
		  case "bluecanvas":
			  this.getView().getModel("blueLayer").setData(imageData);
			  break;  
		  }
	},
	
	
	addColorChannel: function(evt){
		var canvasID = this.activeLayer + "canvas";
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		var imageData = canvas.getImageData(0, 0, width, height);
		 var data = imageData.data;
		 
		var red = 0;
		var green = 0;
		var blue = 0;
		
		
		
			if(evt.getSource().sId.indexOf("red") > -1){
				red = 20; green=0; blue=0;
				
				  for (var i = 0; i < data.length; i += 4) {
					  
					  data[i]     = red + data[i];     // red
				      data[i + 1] = green * data[i + 1]; // green
				      data[i + 2] = blue * data[i + 2]; // blue
				   }
			}
			else if(evt.getSource().sId.indexOf("green") > -1){
				red = 0; green=20; blue=0;
				
				  for (var i = 0; i < data.length; i += 4) {
					  
					  data[i]     = red * data[i];     // red
				      data[i + 1] = green + data[i + 1]; // green
				      data[i + 2] = blue * data[i + 2]; // blue
				   }
			}
			else{
				red = 0; green=0; blue=20;
				
				  for (var i = 0; i < data.length; i += 4) {
					  
					  data[i]     = red * data[i];     // red
				      data[i + 1] = green * data[i + 1]; // green
				      data[i + 2] = blue + data[i + 2]; // blue
				   }
			}
		
	

		  
		  
		  canvas.putImageData(imageData,0,0);
		  
		  switch(canvasID){
		  case "redcanvas":
			  this.getView().getModel("redLayer").setData(imageData);
			  break;
		  case "greencanvas":
			  this.getView().getModel("greenLayer").setData(imageData);
			  break;
		  case "bluecanvas":
			  this.getView().getModel("blueLayer").setData(imageData);
			  break;  
		  }
		
	},
	
	onScreen: function(evt){
		
		var canvasID = this.activeLayer + "canvas";
		
		console.log(canvasID);
		
		var canvas = document.getElementById(canvasID).getContext("2d");
		
		var width = document.getElementById(canvasID).width;
		var height = document.getElementById(canvasID).height;
		
		var imageData = canvas.getImageData(0, 0, width, height);
		var data = imageData.data;
		
		var redCanvas =  this.getView().getModel("redLayer").getData().data;
		var greenCanvas =  this.getView().getModel("greenLayer").getData().data;
		var blueCanvas =  this.getView().getModel("blueLayer").getData().data;
		
		console.log(redCanvas);
		console.log(greenCanvas);
		console.log(blueCanvas);
		
		
		  for (var i = 0; i < data.length; i += 4) {
			  
			  data[i]     = redCanvas[i];     // red
		      data[i + 1] = greenCanvas[i + 1]; // green
		      data[i + 2] = blueCanvas[i + 2]; // blue
		   }
		
		canvas.putImageData(imageData,0,0);
	}

});