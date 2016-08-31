
function mainInit(settings)
{
	//console.log(settings);
	
	loadJsFileForClass(settings);
}

function loadJsFileForClass(settings)
{
	var jsfile = settings.class;
	
	if (jsfile === ".js"){
		return;
	}
	if (!checkClass(jsfile)){
		var fileRef = document.createElement("script");
		fileRef.setAttribute("type","text/javascript");
		fileRef.setAttribute("src","js/"+jsfile);
	
		document.getElementsByTagName("head")[0].appendChild(fileRef);
	}
}

function checkClass(jsFile)
{
	
	var head = document.getElementsByTagName("head")[0].children;
	for (var ele in head)
	{
		if (typeof head[ele]==="object")
		{
			if (head[ele].outerHTML.indexOf("jsFile")!=-1) return true;
		}
	}
	return false;
}