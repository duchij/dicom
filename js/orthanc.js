
var instances =[];

var sliderData = {};


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

function dragging(e,ui){
	
	var barWidth = $("#sliderBar").width();
	var ratio = barWidth / sliderData.frames;
	var ratioM  = barWidth % sliderData.frames;
	
	var intRatio = Math.round(ratio);
	var pos = ui.position.left;
	var frame = Math.round(pos/intRatio+ratioM);

	var instance = instances[frame];
	
	if (instance != undefined)
	{
		var dir1 = instance.substr(0,2);
		var dir2 = instance.substr(2,2);
	
		var url = "http://doma.local/nanodicom/public/pictures/"+dir1+"/"+dir2+"/"+instance+".png";
	
		$("#player").attr("src",url);
	}
	
	
}

function loadSeriesData()
{
	var series = $("input[id$=series]").val();
	
	var t=new js_comunication();
	t.addRawRequest("index.php","jsOt/loadSeriesInstancesAsync",this,[{series:series},"afterLoadSeries"]);
	t.sendData();
}

function afterLoadSeries(status,result)
{
	if (status)
	{
		sliderData.frames = result.length;
		$("#sliderBar").css("width","100%");
	
		this.instances = result;
		var instance = result[0];

		var dir1 = instance.substr(0,2);
		var dir2 = instance.substr(2,2);
	
		var url = "http://doma.local/nanodicom/public/pictures/"+dir1+"/"+dir2+"/"+instance+".png";
		$("#player").attr("src",url);
	
		if (instances.length > 1)
		{
			$("#slider").draggable({
			containment:"#sliderBar",
			cursor:"move",
			//snap:"#sliderBar",
			//grid:[1,30],
			axis:"x",
			drag:function(e,ui){
				dragging(e,ui);
			}
			});
		}
		else{
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