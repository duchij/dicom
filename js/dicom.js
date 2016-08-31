var oServer = "dicom.local";

var pixelSpacing = [];

var contrastStatus = {};
var brightnessStatus = {};

var selectedPicData = {};



var Instances =[];

var sliderData = {};

var dicomDir = "http://"+this.oServer+"/public/dicom/pictures/";
var dCacheDir = "http://"+this.oServer+"/public/";

var cache = false;

var orthancREST = "http://10.10.2.49:3333";
var dicomServer = "http://10.10.2.49/dicom/";


var __width = 0;
var __height= 0;



function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}

http://is.kdch.sk/hlasko.aspx
function copy_object(obj)
{
	//return copyObject(obj);
	
	if (typeof (obj) == "object") {
		
		if (obj instanceof Array) var new_obj = [];
		else var new_obj = {};

		for (var i in obj) {
			new_obj[i] = copy_object(obj[i]);
		}
		
		return new_obj;
	}
	else return obj;
};


function showPreview(id,url){
	/*var str = onlineRes.fncs.sprintf("<center>Ťahom za pravý dolný roh sa obrázok bude zväčšovať...<br><img src='{url}/instances/{id}/preview' width='100%'></center>",{url:url,id:id});
	
	$("#preview").html(str);
	
	$( "#dialog" ).dialog({
			dialogClass: "no-close",
			title:"Nahlad",
			width:500,
			height:500,
			poisition:{of:"#content"},
			buttons: [
						{
							text: "Zavri",
							click: function() {
							$( this ).dialog( "close" );
							}
						}
					]
	});*/
	
	$(".cell_"+id).css("display","inline");
	html5
}

function autoQueryAndRetrieve(filter)
{
	var t=new js_comunication();
	t.addRawRequest("index.php","jsOt/autoQueryAndRetrieveAsync",this,[{filterDate:filter},"showQueries"]);
	t.sendData();
}

function retrieveAllQueries(path)
{
	var t=new js_comunication();
	t.addRawRequest("index.php","jsOt/retrieveAllAsync",this,[{path:path},"afterAllRetrieve"]);
	t.sendData();
}

function afterAllRetrieve(status,result)
{
	console.log(result);
}


function showQueries(status,result)
{
	console.log(result);
}

function loadPictures(id)
{
	//alert(id);
	
	var t = new js_comunication();
	t.addRawRequest("index.php","jsOt/loadSeries",this,[{id:id},"afterLoadData"]);
	t.sendData();
	
}

function moveCursor(id)
{
	$('body').mousemove(function(e){
		//console.log(e.pageX);
		var posX = e.pageX;
		console.log(posX);
		$("#slider").css("left",posX);
		
	});
	//console.log(mouseX);
}

function afterLoadData(status,result)
{
	//alert(status);
	$("#debug").html(result);
	
}

function resetPicture()
{
	
	var canvas = document.getElementById("player");
	var ctx = canvas.getContext("2d");
	
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
	
	var data = hiddenCtx.getImageData(0,0,this.__width,this.__height);
	
	ctx.putImageData(data,0,0);
	
	$("#contrastSlider").slider("value",0);
	$("#brightnessSlider").slider("value",0);
	
	$(".contrastLabel").html("0");
	$(".brightnessLabel").html("0");
	
}

function dragging(e,ui,cache){
	
	
	
	var pos = ui.value;
	var instance = this.Instances[pos];
	
	if (instance != undefined)
	{
		
		if (this.cache==true){
			var file = instance.file_location;
			var url = this.dCacheDir+file;
		}else{
			var file = dirStructure(instance);
			var url = this.dicomDir+file+".png";
		}
		$("#mplayer_frame").html((this.Instances.length-1)+"/"+pos);
	
		var wRatio = this.__width / instance.file_info.width;
		var hRatio = this.__height / instance.file_info.height;
		
		
		var canvas = document.getElementById("player");
		var ctx = canvas.getContext("2d");
		var img = new Image();
		img.src = url;
		
		var viewWidth = instance.file_info.width*wRatio;
		var viewHeight = instance.file_info.height*hRatio;
		
		
		img.onload = function (){
			ctx.drawImage(img,0,0,viewWidth,viewHeight);
			
			var hiddenCanvas = document.getElementById("hiddenPlayer");
			var hiddenCtx = hiddenCanvas.getContext("2d");
		
			hiddenCtx.drawImage(img,0,0,viewWidth,viewHeight);
			hiddenCtx.fill();
		
			if (this.contrastStatus.value != undefined){
				changeContrast(e,this.contrastStatus);
			}
		
			if (this.brightnessStatus.value != undefined){
				changeBrightness(e,this.brightnessStatus);
			}
		}
	}
}


function changeContrast(e,ui)
{
	
	
	var canvas = document.getElementById("player");
	var ctx = canvas.getContext("2d");
	
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
	
	var imageData= hiddenCtx.getImageData(0,0,this.__width,this.__height);
	
	
	var dataLn = imageData.data.length;
	var data = imageData.data
	var contrast = ui.value;
	
	$(".contrastLabel").html(contrast);
	
	for (var i = 0; i < dataLn; i += 4) {
		
		var average = Math.round( ( data[i] + data[i+1] + data[i+2] ) / 3 );
		
		if (average > 127){
		    data[i] += ( data[i]/average ) * contrast;
		    data[i+1] += ( data[i+1]/average ) * contrast;
		    data[i+2] += ( data[i+2]/average ) * contrast;
		}else{
		    data[i] -= ( data[i]/average ) * contrast;
		    data[i+1] -= ( data[i+1]/average ) * contrast;
		    data[i+2] -= ( data[i+2]/average ) * contrast;
		}
	}
	
	imageData.data = data;
	
	ctx.putImageData(imageData,0,0);
	ctx.fill();
}

function changeBrightness(e,ui)
{
	console.log([e,ui]);
	var canvas = document.getElementById("player");
	var ctx = canvas.getContext("2d");
	
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
	
	var imageData= hiddenCtx.getImageData(0,0,this.__width,this.__height);
	
	//console.log(imageData);
	//return;
	
	var dataLn = imageData.data.length;
	var data = imageData.data
	var brightness = ui.value;
	$(".brightnessLabel").html(brightness);
	
	for (var i = 0; i < dataLn; i += 4) {
		data[i] = data[i]+brightness < 255 ? data[i]+brightness:255;
		data[i+1] = data[i+1]+brightness < 255 ? data[i+1]+brightness:255;
		data[i+2] = data[i+2]+brightness < 255 ? data[i+2]+brightness:255;
	}
	
	imageData.data = data;
	
	ctx.putImageData(imageData,0,0);
	
	ctx.fill();
}


function dirStructure(instance){
	var dir1 = instance.substr(0,1);
	var dir2 = instance.substr(1,1);
	var dir3 = instance.substr(2,1);
	
	return dir1+"/"+dir2+"/"+dir3+"/"+instance;
}

function loadSeriesData(series,cache)
{
	this.init();
	
	var t=new js_comunication();
	//var series = $("input[id$=series]").val();
	if (cache === "1"){
		
		t.addRawRequest("index.php","dicom/js_loadDataFromDb",this,[{series:series},"afterGetDataFromDb"]);
		
	}else{
		
		t.addRawRequest("index.php","dicom/js_loadSeriesInstancesAsync",this,[{series:series},"afterLoadSeries"]);
		
	}
	t.sendData();
	
}

function initSlider(frCount,cache){
	$("#sliderBar").css("width","100%");
	$("#slider").slider();
	
	$("#slider").slider({
		containment:"#sliderBar",
		cursor:"move",
		axis:"x",
		min:0,
		max:frCount
	});
	
	$("#slider").on("slide",function(e,ui){
		//console.log([e,ui]);
		
		dragging(e,ui);
	});
	
	
}



function afterGetDataFromDb(status,result)
{
	if (status){
		getPixelRatio(result.dicom.Instances[0]);
		
		
		var fileData = result.file;
		if (fileData.length > 0){
			
			this.cache = true;
			
			
			
			initSlider(fileData.length);
			
			this.Instances = fileData;
			var file = fileData[0].file_location;
			
			var imageData = fileData[0].file_info;
			
			var wRatio = this.__width / imageData.width;
			var hRatio = this.__height / imageData.height;
			
			
			var url = this.dCacheDir+file;
			console.log("url:"+url);
			
			var canvas = document.getElementById("player");
			
			var ctx = canvas.getContext("2d");
			
			var img = new Image();
			img.src =url
			
			var viewWidth = imageData.width*wRatio;
			var viewHeight = imageData.height*hRatio;
			
			img.onload = function (){
				ctx.drawImage(img,0,0,viewWidth,viewHeight);
				
				var hiddenCanvas = document.getElementById("hiddenPlayer");
				var hiddenCtx = hiddenCanvas.getContext("2d");
			
				hiddenCtx.drawImage(img,0,0,viewWidth,viewHeight);
				hiddenCtx.fill();
				
			}
		}
	}
}

function getPixelRatio(data)
{
	var t = new js_comunication()
	t.addRawRequest("index.php","dicom/js_getInstanceTags",this,[{uuid:data},"setInstancePixelRatio"]);
	t.sendData();
}

function setInstancePixelRatio(status,result)
{
	this.pixelSpacing = result.PixelSpacing.split("\\");
	
	this.showPatientData(result);
	
}

function showPatientData(data)
{
	var html = "<strong>{PatientName}</strong></br>" +
			"Narodený:<strong>{PatientBirthDate}</strong><br>" +
			"Vek: <strong>{PatientAge}</strong><br> Sex:<strong>{PatientSex}</strong><br>" +
			"Dátum štúdie: <strong>{AcquisitionDate}</strong> <br>Čas štúdie: <strong>{AcquisitionTime}</strong><br>" +
			"Protokol: <strong>{ProtocolName}<br>";
			
	var data = {
		PatientName:data.PatientName,
		PatientBirthDate:data.PatientBirthDate,
		PatientAge:data.PatientAge,
		PatientSex:data.PatientSex,
		AcquisitionDate:data.AcquisitionDate,
		AcquisitionTime:data.AcquisitionTime,
		ProtocolName:data.ProtocolName
	};
	
	var fHtml = onlineRes.fncs.sprintf(html,data);
	
	$("#patientInfo").html(fHtml);
			
}


function afterLoadSeries(status,result)
{
	
	if (status)
	{
		this.sliderData.frames = result.Instances.length;
		
		initSlider();
		//$("#slider").slider("option","step",7);
	
		this.Instances = result.Instances;
		
		var Instance = result.Instances[0];

		var file = dirStructure(Instance);
	
		var url = this.dicomDir+file+".png";
		
		
		var canvas = document.getElementById("player");
		
		var ctx = canvas.getContext("2d");
		
		var img = new Image();
		img.src = url;
		img.onload = function() {
			ctx.drawImage(img,0,0,10,20);
			ctx.fill();
		}
		
		
		
	}
}

function hidePic(id)
{
	$("."+id).css("display","none");
}

function pacsMove(path,rId)
{
	
	var t= new js_comunication();
	
	$("#indi_"+rId).css("display","inline");
	
	t.addRawRequest("index.php","jsOt/moveFromPacs",this,[{path:path,rId:rId},"afterMoveStudy"]);
	t.sendData();
	
}

function afterMoveStudy(status,result)
{
	console.log([status,result]);
	
	if (status){
		$("#row_"+result).remove();
	}
	
}


function init()
{
	
	console.log("tu");
	this.__width = $("#player").width();
	this.__height = $("#player").height();
	
	
	
	$("#contrastSlider").slider({
		min:-100,
		max:100
	
	});
	
	$("#contrastSlider").on("slide",function(e,ui){
			contrastStatus = ui;
			changeContrast(e,ui);
	});
	

	$("#brightnessSlider").slider({
		min:-100,
		max:100
	
	});
	
	$("#brightnessSlider").on("slide",function(e,ui){
			brightnessStatus = ui;
			changeBrightness(e,ui);
	});
	
	//loadSeriesData();
	$("#dialog").dialog();
	$("#dialog").dialog("close");
	$("#datePicker").datepicker();
	$("#datePicker").datepicker("option", "dateFormat", "yymmdd");

}

function painterOff()
{
	var canvas = document.getElementById('player');
	
	console.log(canvas);
	
	canvas.removeEventListener('mousemove',onPaint,true);
	
	
}




function painter (type)
{
	
	var canvas = document.getElementById('player');
	var ctx = canvas.getContext('2d');
	var imageData;
	
	if (type !== undefined){
		console.log(type);
		imageData= ctx.getImageData(0,0,this.__width,this.__height);
	}
	
	var realPos = document.getElementById("player").getBoundingClientRect();
	
	
	var sketch = document.getElementById('imagePlayer');
	var sketch_style = getComputedStyle(sketch);
	
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	//console.log(canvas);
	

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	var lineMouse = {x:-1,y:-1};
	
	/* Mouse Capturing Work */
	
	if (type!=undefined && type !="off"){
		
		
		
		
		
		canvas.addEventListener('mousemove', function(e) {
			
			if (type == "free"){
				//console.log(e);
				last_mouse.x = mouse.x;
				last_mouse.y = mouse.y;
				
				mouse.x = e.pageX- 	this.offsetLeft-realPos.left;
				mouse.y = e.pageY - this.offsetTop-realPos.top;
			}
			
			if (type == "line"){
				
				mouse.x = e.pageX- 	this.offsetLeft-realPos.left;
				mouse.y = e.pageY - this.offsetTop-realPos.top;
				
			/*	if (lineMouse.x == -1){
					lineMouse.x = mouse.x;
					lineMouse.y = mouse.y;
				}*/
				
				console.log(lineMouse.x);
				
				
			}
			
			
		}, false);
	}
	
	
	/* Drawing on Paint App */
	
	if (type !== undefined && type != "off"){
	
		ctx.lineWidth = 2;
		ctx.lineJoin = 'round';
		ctx.lineCap = 'round';
		ctx.strokeStyle = 'yellow';
		
		canvas.addEventListener('mousedown', function(e) {
			
			if (type=="line"){
				if (lineMouse.x == -1){
					lineMouse.x = mouse.x;
					lineMouse.y = mouse.y;
				}
			}
			
			canvas.addEventListener('mousemove', onPaint, false);
			
			//onPaint(ctx,last_mouse,mouse);
			
			
			/*ctx.beginPath();
			ctx.moveTo(last_mouse.x, last_mouse.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.closePath();
			ctx.stroke();*/
			
		}, false);
		
		canvas.addEventListener('mouseup', function() {
			
			
			if (type=="line"){
				
				var xs = 0;
				var ys = 0;
				
				console.log(this.pixelSpacing);
				
				xs = (mouse.x - lineMouse.x) * self.pixelSpacing[0];
				ys = (mouse.y - lineMouse.y) * self.pixelSpacing[1];
				
				xs = xs*xs;
				ys = ys*ys;
				
				var le = Math.round(Math.sqrt(xs+ys));
				
				
				ctx.font = "18px Helvetica";
				ctx.fillStyle ="white";
				ctx.fillText("cca "+le+" mm",lineMouse.x,lineMouse.y);
				
				
				
				
				lineMouse = {x:-1,y:-1};
			}
			canvas.removeEventListener('mousemove', onPaint, false);
			
		}, false);
		
		
		if (type!=undefined){
				ctx.putImageData(imageData,0,0);
				ctx.fill();
			}
		
		
		
	}
	
	var offPaint = function () {
		 if (type=="line"){
		 	lineMouse = {x:-1,y:-1};
		 }
	}
	
	
	var onPaint = function() {
		
			if (type=="free"){
				ctx.beginPath();
				ctx.moveTo(last_mouse.x, last_mouse.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.closePath();
				ctx.stroke();
			}
			
			if (type =="line"){
				
				var hCanvas = document.getElementById('hiddenPlayer');
				var hCtx = hCanvas.getContext('2d');
				
				var hID = hCtx.getImageData(0,0,800,800);
				
				ctx.putImageData(hID,0,0);
				
				ctx.beginPath();
				ctx.moveTo(lineMouse.x, lineMouse.y);
				ctx.lineTo(mouse.x, mouse.y);
				ctx.closePath();
				//ctx.fill();
				ctx.stroke();
				
			}
			
			
		};
		
	var off = function (){
		ctx.closePath();
	} 
	
	
	
	
	if (type == "off"){
		
		canvas = document.getElementById('player');
		ctx.putImageData(imageData,0,0);
		ctx.fill();
		
		
	}
	
}


/*function onPaint(ctx, last_mouse,mouse)
{
	ctx.beginPath();
			ctx.moveTo(last_mouse.x, last_mouse.y);
			ctx.lineTo(mouse.x, mouse.y);
			ctx.closePath();
			ctx.stroke();
			return;
}
*/

/*function onPaint(ctx,last_mouse,mouse)
{
	ctx.beginPath();
	ctx.moveTo(last_mouse.x, last_mouse.y);
	ctx.lineTo(mouse.x, mouse.y);
	ctx.closePath();
	ctx.stroke();
}*/



$(document).ready(function(){
	
	init();
	
	var mviewer = $("#mviewer").val();
	if (mviewer === "1") {
		var cache = $("#mviewer_cache").val();
		var uuid = $("#series").val();
		//painter();
		loadSeriesData(uuid,cache);
	}
	
	
});