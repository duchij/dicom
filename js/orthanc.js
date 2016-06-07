
var Instances =[];

var sliderData = {};

var dicomDir = "http://dicom.local/public/dicom/pictures/";
var dCacheDir = "http://dicom.local/public/";

var cache = false;


function showPreview(id,url){
	var str = onlineRes.fncs.sprintf("<center>Ťahom za pravý dolný roh sa obrázok bude zväčšovať...<br><img src='{url}/instances/{id}/preview' width='100%'></center>",{url:url,id:id});
	
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
			
			
			
			/*resizeStop:function(event,ui){
				var canvas = document.getElementById('canvas');
				var ctx = canvas.getContext("2d");
				console.log( $(this).innerWidth);
				//ctx.canvas.width  = $(this).innerWidth;
				//ctx.canvas.height = $(this).innerHeight;
			}*/
	});
	
	/*var img = new Image();
	var str2 = onlineRes.fncs.sprintf("{url}/instances/{id}/preview",{url:url,id:id});
	img.src = str2;
	console.log([img.height,img.width]);
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext("2d");
	
	
	
	//ctx.canvas.width  = $(this).innerWidth;
	//ctx.canvas.height = $(this).innerHeight;
	ctx.drawImage(img,0,0);*/
	
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
	//if (status)
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
	
		$("#player").attr("src",url);
	}
	
	
}

function dirStructure(instance){
	var dir1 = instance.substr(0,1);
	var dir2 = instance.substr(1,1);
	var dir3 = instance.substr(2,1);
	
	return dir1+"/"+dir2+"/"+dir3+"/"+instance;
}

function loadSeriesData(series,cache)
{
	var t=new js_comunication();
	//var series = $("input[id$=series]").val();
	if (cache === "1"){
		
		t.addRawRequest("http://dicom.local/index.php","jsOt/loadDataFromDb",this,[{series:series},"afterGetDataFromDb"]);
		
	}else{
		
		t.addRawRequest("http://dicom.local/index.php","jsOt/loadSeriesInstancesAsync",this,[{series:series},"afterLoadSeries"]);
		
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
		if (result.length > 0){
			this.cache = true;
			initSlider(result.length);
			this.Instances = result;
			var file = result[0].file_location;
			var url = this.dCacheDir+file;
			
			var canvas = document.getElementById("player");
			
			var ctx = canvas.getContext("2d");
			
			var img = new Image();
			img.src = url;
			ctx.drawImage(img,0,0,800,800);
			
			//$("#player").attr("src",url);
			
		}
	}
}

function afterLoadSeries(status,result)
{
	
	if (status)
	{
		this.sliderData.frames = result.Instances.length;
		
		//$("#sliderBar").css("width",sliderData.frames+"px");
		
		$("#sliderBar").css("width","100%");
		
		$("#slider").slider();
		//$("#slider").slider("option","step",7);
	
		this.Instances = result.Instances;
		
		var Instance = result.Instances[0];

		var file = dirStructure(Instance);
	
		var url = this.dicomDir+file+".png";
		
		
		var canvas = document.getElementById("player");
		
		var ctx = canvas.getContext("2d");
		
		var img = new Image();
		img.src = url;
		ctx.drawImage(img,0,0,10,20);
		
		//$("#player").attr("src",url);
	
		if (this.Instances.length > 1)
		{
			$("#slider").slider({
				containment:"#sliderBar",
				cursor:"move",
			//snap:"#sliderBar",
			//grid:[1,30],
				axis:"x",
				min:0,
				max:result.Instances.length
				/*slide:function(e,ui){
					dragging(e,ui);
				}*/
			});
			
			$("#slider").on("slide",function(e,ui){
				//console.log([e,ui]);
				
				dragging(e,ui);
			});
			
		}
	}
}

$(document).ready(function(){
	//loadSeriesData();
	$("#dialog").dialog();
	$("#dialog").dialog("close");
	$("#datePicker").datepicker();
	$("#datePicker").datepicker("option", "dateFormat", "yymmdd");
	
});