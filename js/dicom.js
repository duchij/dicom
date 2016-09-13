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


var _canvas = {};
var _ctx = {};

var _mouse = {x:0,y:0};
var _lineMouse = {x:-1,y:-1};

var _lastMouse = {x:0,y:0};

var _lineCounter = 0;

var _pointMatrix = [];


function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = new obj.constructor(); 
    for(var key in obj)
        temp[key] = clone(obj[key]);

    return temp;
}


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
			if (this.contrastStatus == undefined){
				return;
			}		
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
//	console.log([e,ui]);
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
	console.log(result);
	if (status){
		getPixelRatio(result.dicom.Instances[0]);
		
		var fileData = result.file;
		if (fileData.length > 0){
			
			$("#mplayer_frame").html(fileData.length+"/1");
			
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

		$("#mplayer_frame").html(result.Instances.length+"/1");
		
		initSlider();
	
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

/**
 * This is global mouse handler for basic drawing....
 * It takes the getBoundingClientRect ----- > we are in responsive design so the position may wary......
 */

var setMouse = function(e) {
	
		_lastMouse.x = _mouse.x;
		_lastMouse.y = _mouse.y;
	
		var realPos = document.getElementById("player").getBoundingClientRect();
	
		_mouse.x = e.pageX - this.offsetLeft - realPos.left;
		_mouse.y = e.pageY - this.offsetTop - realPos.top;
//		console.log(_mouse);
}


function draw(){

	this._canvas = document.getElementById("player");
	this._ctx = this._canvas.getContext("2d");
	
	_ctx.lineWidth = 2;
	_ctx.lineJoin = 'round';
	_ctx.lineCap = 'round';
	_ctx.strokeStyle = 'yellow';
	
	_canvas.addEventListener("mousemove",setMouse,false);

	_canvas.addEventListener("mousedown", draw_mousedown ,false);

	_canvas.addEventListener("mouseup",draw_mouseup,false);
	
}


function draw_mousedown()
{
	_canvas.addEventListener("mousemove",draw_paint,false);
}

function draw_mouseup()
{
	storePaintData();
	_canvas.removeEventListener("mousemove",draw_paint,false);
}



function draw_paint(){
	
	if (typeof _ctx.beginPath === "function") {
		_ctx.beginPath();
		_ctx.moveTo(_lastMouse.x, _lastMouse.y);
		_ctx.lineTo(_mouse.x, _mouse.y);
		_ctx.closePath();
		_ctx.stroke();
	}
}
/**
 * Function calculates the length of a line by using Euklid theorem and using dicom horizontal and vertical 
 * Pixel spacing counts the approximated length of the line 
 */
function ruler_countLength()
{
	if (typeof _ctx.fillText === "function"){
	
		var xs = 0;
		var ys = 0;
					
		xs = (_mouse.x - _lineMouse.x) * self.pixelSpacing[0];
		ys = (_mouse.y - _lineMouse.y) * self.pixelSpacing[1];
					
		xs = xs*xs;
		ys = ys*ys;
					
		var le = Math.round(Math.sqrt(xs+ys));
					
		_ctx.font = "18px Helvetica";
		_ctx.fillStyle ="white";
		_ctx.fillText("cca "+le+" mm",_lineMouse.x,_lineMouse.y);
		
		storePaintData();	
		
		_lineMouse = {x:-1,y:-1};
		
	}
	
	_canvas.removeEventListener("mousemove",ruler_drawLine,false);
	_canvas.removeEventListener("mousedown",ruler_countLinePoints,false);
		
}

/**
 * function sets the start point as fixed and mouse determines the endpoint
 */
function ruler_countLinePoints()
{
	if (_lineMouse.x == -1){
		_lineMouse.x = _mouse.x;
		_lineMouse.y = _mouse.y;
	}
	
	_canvas.addEventListener("mousemove",ruler_drawLine,false);
}



function ruler(){
	
	this._canvas = document.getElementById("player");
	this._ctx = this._canvas.getContext("2d");
	
	_ctx.lineWidth = 2;
	_ctx.lineJoin = 'round';
	_ctx.lineCap = 'round';
	_ctx.strokeStyle = 'yellow';
	
	_canvas.addEventListener("mousemove",setMouse,false);
	
	_canvas.addEventListener("mousedown",ruler_countLinePoints,false);
	
	_canvas.addEventListener("mouseup",ruler_countLength,false);
}

function storePaintData()
{
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
		
	hiddenCtx.putImageData(_ctx.getImageData(0,0,800,800),0,0);
}

function getPaintData()
{
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
	
	var imageData = hiddenCtx.getImageData(0,0,800,800);
	
	_ctx.putImageData(imageData,0,0);
	
}

function stopDraw(){
	
	_ctx={};
	
	_lineMouse = {x:-1,y:-1};
	_mouse = {x:0,y:0};
	_lastMouse = {x:0,y:0};
	
	_canvas.removeEventListener("mousemove",setMouse,false);
	
}


function ruler_drawLine()
{
	if (typeof _ctx.putImageData == "function"){
		
		var hCanvas = document.getElementById('hiddenPlayer');
		var hCtx = hCanvas.getContext('2d');
		var hID = hCtx.getImageData(0,0,800,800);
		
		_ctx.putImageData(hID,0,0);
				
		_ctx.beginPath();
		_ctx.moveTo(_lineMouse.x, _lineMouse.y);
		_ctx.lineTo(_mouse.x, _mouse.y);
		_ctx.closePath();
				//ctx.fill();
		_ctx.stroke();
		
	}
}

function angle()
{
	this._canvas = document.getElementById("player");
	this._ctx = this._canvas.getContext("2d");
	
	_ctx.lineWidth = 2;
	_ctx.lineJoin = 'round';
	_ctx.lineCap = 'round';
	_ctx.strokeStyle = 'yellow';
	
	_canvas.addEventListener("mousemove",setMouse,false);
	
	_canvas.addEventListener("mousedown",angle_countLinePoints,false);
	
	_canvas.addEventListener("mouseup",angle_drawSecondLine,false);
}

function angle_countLinePoints()
{
	if (_lineMouse.x == -1){
		_lineMouse.x = _mouse.x;
		_lineMouse.y = _mouse.y;
		
	}
	
	_canvas.addEventListener("mousemove",angle_drawLine,false);
	
}

function angle_drawLine()
{
	if (typeof _ctx.putImageData == "function"){
		
		var hCanvas = document.getElementById('hiddenPlayer');
		var hCtx = hCanvas.getContext('2d');
		var hID = hCtx.getImageData(0,0,800,800);
		
		_ctx.putImageData(hID,0,0);
				
		_ctx.beginPath();
		_ctx.moveTo(_lineMouse.x, _lineMouse.y);
		
		_ctx.lineTo(_mouse.x, _mouse.y);
		_ctx.closePath();
		
		_pointMatrix[_lineCounter] = { startX:_lineMouse.x,startY:_lineMouse.y,endX:_mouse.x,endY:_mouse.y};
				//ctx.fill();
				
		_ctx.stroke();
		
//		console.log(["d",_lineCounter,_pointMatrix]);
		
	}
}

function angle_drawSecondLine()
{
	storePaintData();
	
	_lineMouse.x = _mouse.x;
	_lineMouse.y = _mouse.y;
	_lineCounter++;
	_canvas.removeEventListener("mousemove",angle_drawLine,false);
	
	if (_lineCounter >=2){
		
		countAngle();
		_lineMouse={x:-1,y:-1}
		_lineCounter = 0;
		_canvas.removeEventListener("mousedown",angle_countLinePoints,false);
	}
	
//	console.log(_pointMatrix)
		
}

function calculateCosinusLamba(a,b,c)
{
	var cosLambda = (Math.pow(c,2)-Math.pow(a,2)-Math.pow(b,2)) / (-1*(2*a*b));
	
	return cosLambda;
	
	
}


function countAngle()
{
	console.log(_pointMatrix);
	
	var vector1 = this._pointMatrix[0];
	var vector2 = this._pointMatrix[1];
	
	
	//calculate the mm pixel with pixelRatio
	vector1.x = vector1.x*pixelSpacing[0];
	vector2.x = vector2.x*pixelSpacing[0];
	
	vector1.y = vector1.y * pixelSpacing[0];
	vector2.y = vector2.y * pixelSpacing[0];
	
	
	var eu_vector1 = {x:0,y:0};
	var eu_vector2 = {x:0,y:0};
	
	var vector1Length = Math.sqrt(Math.pow((vector1.startX - vector1.endX),2) + Math.pow((vector1.startY - vector1.endY),2));
	
	var vector2Length = Math.sqrt(Math.pow((vector2.startX - vector2.endX),2) + Math.pow((vector2.startY - vector2.endY),2));
	
	var vector3Length = Math.sqrt(Math.pow((vector1.startX - vector2.endX),2) + Math.pow((vector1.startY - vector2.endY),2));
	
	console.log([vector1Length,vector2Length,vector3Length]);
	
	if (vector1Length !== vector2Length !== vector2Length){
		var cosLambda = this.calculateCosinusLamba(vector1Length,vector2Length,vector3Length);
		
		var lambdaR = Math.acos(cosLambda);
		
		var angle = (lambdaR*180/Math.PI)*100;
		
		angle = Math.round(angle);
		angle = angle / 100;
		
		console.log(angle);
		
		_ctx.font = "18px Helvetica";
		_ctx.fillStyle ="white";
		_ctx.fillText("cca "+angle+" ˚",vector1.endX,vector1.endY);
		
	}
}




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