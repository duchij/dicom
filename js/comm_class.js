/**
 * Ajax Communcation Class definition for Studio2 .....
 * Author Duch v0.1 
 */
/**
 * Trieda workerProcess sluzi na pracu s Workerom
 * @todo Velmi vela roboty t.c. len zaciatok prace...
 */

//var __nativeST = window.setTimeout;
//var __nativeSI = window.setInterval;

//window.setTimeout = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
//  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//  return __nativeST__(vCallback instanceof Function ? function () {
//    vCallback.apply(oThis, aArgs);
//  } : vCallback, nDelay);
//};
//
//window.setInterval = function (vCallback, nDelay /*, argumentToPass1, argumentToPass2, etc. */) {
//  var oThis = this, aArgs = Array.prototype.slice.call(arguments, 2);
//  return __nativeSI__(vCallback instanceof Function ? function () {
//    vCallback.apply(oThis, aArgs);
//  } : vCallback, nDelay);
//};

var comm = {queue:{},count:0};

var __timeOutId__ = undefined;

var __timeOut__ = 30;
var __window__ = undefined;
var __url__ = "";

var _C_URL_ = "http://test2.medic.sk/r/html";
var _M_URL_ = "http://test2.medic.sk/";

var SESSION = {};

var GV = {};




function __encode_utf8(s) {
	  return unescape(encodeURIComponent(s));
}

function __decode_utf8(s) {
	  return decodeURIComponent(escape(s));
}

var myWorker = {};

//this.startWorkerThread();


function startWorkerThread()
{
	if (window.Worker){
		myWorker = new Worker("./js/worker.js");
		
		myWorker.postMessage("init");
		
		myWorker.onmessage = function(e){
			
			var st = e.data;
			if (st){
				myWorker.addEventListener("message",workerProcess.msg.recieve);
			}
			else{
				console.log("Worker nejde...");
			}
		}
	}
	else{
		alert("pozor worker nie je podporovany");
	}
}


function mtime()
{
	var d = new Date();
	return d.getTime();
}


String.prototype.format = function(objArgs)
{
	var text = this;
	for (var key in objArgs){
		var reg = new RegExp('k{'+key+'}','gm');
		text = text.replace(reg,objArgs[key]);
	}
	return text;
}


var workerProcess = workerProcess || {
		
}

workerProcess.msg = {
		_source:{},
		
		startGlobalComm: function (data){
			
			var inWFnc = "startComuncationLayer";
			
			//_source = data.source;
			//console.log(["r",_source]);
			
			var _broadCast1 = {
					wFnc:inWFnc,
					callBack:data.callBack,
					toServer:true,
					formName:"global", 
					url:data.url,
					path:data.path,
					timeInterval:data.timeInterval
			}
			
			myWorker.postMessage({broadCast:_broadCast1});
			
		},
		
		
		
		/**
		 * Zavola postMessage preposle veci workeru a po dokonceni vrati hodnotu do zadanej funkcie
		 * @param {string} inWFnc funkcia vo vnutri Workera
		 * @param {object} data javasdcript object co chceme poslat na spracovanie
		 * @param {callBack} callBack funkcia kam maju spracovane data prijst
		 * 
		 */
		broadCast: function (inWFnc,data,callBack,toServer){
			
			if (toServer==undefined) toServer=false;
			
			if (data.source !== undefined){
				this._source = data.source;
			}else{
				this._source = undefined;
				}
			var sData = data.data;
			
			myWorker.postMessage({broadCast:{wFnc:inWFnc,callBack:callBack,args:sData,toServer:toServer}});	
		},
		
		/**
		 * Nahranie formu do modalneho window
		 * @param data {object} {source:kam chceme aby sa to vratilo, data:data_ktore_chceme_spracovat,url:adresa pre ajax, path:cesta k modulu a metode}
		 * @param formName {string} Nazov formu ktory chceme nahrat zakld je v adresari forms
		 * @param callBack {string} funkcia kam chceme nahrat data...
		 */
		
		loadForm:function (data,formName,callBack) { 
			
			var toServer = true;
			var inWFnc = "getForm";
			
			_source = data.source;
			var sData = data.data;
			
			var _broadCast = {
					
					wFnc:inWFnc,
					callBack:callBack,
					args:sData,
					toServer:toServer,
					formName:formName, 
					url:data.url,
					path:data.path
			}
			console.log("wokrerrrrr");
			myWorker.postMessage({broadCast:_broadCast});
			
			
		},
		
		recieve: function(e){
			var data = e.data;
			console.log(data);
			
			if (_source !== undefined)	{
				_source[data.callBack](data.result);
			}
			else{
				
				if (typeof data.callBack == "string"){
					if (data.callBack != undefined){
						self[data.callBack](data.result);
					}
					else{
					}
				}
				if (typeof data.callBack == "object"){
					var _source = data.callBack.sender;
					var _callBack = data.callBack.callBack;
					
					_source[_callBack](data.result);
				}
			}
		}
}




var js_comunication = function()
{
	/** 
	 * Vytvori objekt na pracu s requestami JS - PHP via OMEGA 
	 * @constructor
	 * 
	 *  */	
	
	
	/*var __nativeST__ = this.setTimeout;

	this.setTimeout = function(vCallBack, delay,_source,_callBack){

	var oThis = this.js_comunication;
	var aArgs = Array.prototype.slice.call(arguments, 2);
	//console.log(["override setTimouT",vCallBack,oThis]);
	return __nativeST__(vCallBack instanceof Function ? function (){
		vCallBack.apply(oThis, aArgs);
	} : vCallBack, delay);
	
	
};*/
	
	
}
js_comunication.prototype.xhttp = {};

/**
 * Vytvori ASYNC request smerom na dany url PHP

 * @author duch
 * @param {string} url  router cesta smerom na php 
 * @param {string} classPath cesta na PHP modul/triedu/metodu
 * @param {object} source zdroj odkial a kam chceme navrat callBacku, pozor na JQuery!!! poslat odkaz na this
 * @param {array}  [{objekt} ktory posielam, {string} callback funckia, {mixed} argument (moze byt pole, object, string a pod]
 * 
 * @return nothing
 */
js_comunication.prototype.addRawRequest = function (url,classPath,source,argsAndCallBack)
{
	
	
	if (__window__ == undefined){
		__window__ = source;
	}
	
	if (__url__== ""){
		__url__ = url;
	}
	
//	console.log(["count",comm.count]);
	
	comm.queue["comm_"+comm.count] = {};
	comm.queue["comm_"+comm.count]={ 
						id:comm.count, 
						classPath:classPath, 
						source:source, 
						args:argsAndCallBack[0],
						callBack:argsAndCallBack[1],
						oArgs:argsAndCallBack[2] 
						};
	
	comm.count = comm.count+1;
	
//	console.log(["ad1",comm]);
	
	
}

function showProgressBar(st)
{
	var cover  = $("#cover");
	
	if (cover != undefined)	{
		if (st){
			$("#cover").fadeIn();
			$("#progressBar").progressbar();
			$("#progressBar").progressbar("option","value",false);
		}else{
			$("#cover").fadeOut();
		}
	}else{
		console.log("No progress bar defined...");
	}
}

function extractJsonData(data)
{
	//console.log(["extract",data]);
	var result = [];
	for (var row in data){
		if (row.indexOf("comm_")!=-1){
			result[data[row].id] = {path:data[row].classPath,request:data[row].args,id:data[row].id};
		}
	}
	return result;
}

function toggleComm(st)
{
	/*var commBall = __window__.document.getElementById("commBall");
	if (commBall != undefined)
	{
		if (st){
			commBall.setAttribute("style","visibility:visible;");
		}
		else
		{
			commBall.setAttribute("style","visibility:hidden;");
		}
	}*/
}

js_comunication.prototype.__sendData = function(_source,_callBack,oThis)
{
	
//	console.log(["tests",__timeOutId__,comm,_source,_callBack,oThis]);
	
	clearTimeout(__timeOutId__);
	
	__timeOutId__ = undefined;
	
//	console.log(["processed".__timeOutId]);
	
	if (window.XMLHttpRequest) {
		this.xhttp = new XMLHttpRequest();
	}
	
	else if (window.ActiveXObject){
		
		try {
			this.xhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch (e){
			try {
				this.xhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch (e){
			}
		}
	}	
	
	if (!this.xhttp) {
		alert("Error no XMLHttpRequest or ActiveXObject possibility");
		return false;
	}
	
	var data = {multi:extractJsonData(comm.queue)};
	
	//this.xhttp.addEventListener("progress", updateProgress);
	this.xhttp.addEventListener("load", transferComplete);
	this.xhttp.addEventListener("error", transferFailed);
	this.xhttp.addEventListener("abort", transferCanceled);
	showProgressBar(true);
	
	this.xhttp.open('POST',__url__,true);
	
	this.xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			
	this.xhttp.send("x=1&client=rjson&data="+JSON.stringify(data));
	
	/*this.xhttp.onreadystatechange = function (e)
	{
		
	
		
		if (this.readyState == 4 ){
			__url__ = "";
			if (this.status === 200){	
				__completedRequest(this.responseText);
				//__commQueue__ = [];
			}
			else {
				__unCompletedRequest(this.statusText);
			}
		}
	}*/
}

function updateProgress(e)
{
	//console.log(["progress",e]);
	
	//if (e.lengthComputable)
	//{
		var percentComplete = e.loaded / e.total;
		console.log(["[p]:",e.target.target.responseText]);
//		console.log(["running",percentComplete]);
	//}else{
//		console.log(["updateP",e]);
	//}
	
}

function transferComplete(e)
{
	//console.log(["tcomplete",e]);
	
	var target = e.target;
	
	if (target.readyState == 4){
		if (target.status == 200){
			__completedRequest(target.responseText);
		}else{
			__unCompletedRequest(target.statusText);
		}
	}
}

function transferFailed(e)
{
	console.log(["tfail",e]);
}

function transferCanceled(e)
{
	console.log(["tcancel",e]);
}


/**
 * Posle vytvoreny request smerom na PHP, ak zadane s parametrami tak posiela cely process
 * request smerom na _callBack funkciu 
 * 
 * @param {object} _source  vacsinou this odkial posielam
 * @param {string} _callBack funkcia kam chceme poslat data
 * 
 */
js_comunication.prototype.sendData = function(_source,_callBack)
{
	
	
	if (__timeOutId__ == undefined){
		
		__timeOutId__ = setTimeout(this.__sendData,__timeOut__,_source,_callBack);

	}
}


/**
 * Posle ASYNC request smerom k PHP za pomoci JQuery.Ajax funkie posiela po jednom
 * 
 * @param {string} url- cesta smerom routeru a PHP
 * @param {string} classPath - format modul/trieda/metoda
 * @param {object} source - zdroj kam sa to ma vratit pozor na JQuery!!! odkay na this stranky
 * @param {array} argsAndCallBack - [{object}, {string} callBack, {mixed} mozne ine paramtere]
 * 
 * @return nothing
 */
js_comunication.prototype.addSendJQRequest = function (url,classPath,source,argsAndCallBack)
{
	
	var args = argsAndCallBack[0];
	var callBack = argsAndCallBack[1];
	
	var oArgs = argsAndCallBack[2];
	
	
	var request = $.ajax({
        url: url,
        method: "POST",
        dataType:"json",
        data: {client : "json", data:{request:args,path:classPath}}
    });
    
    
   	request.done(function(data){
   		
   		//console.log(["nieco",data]);
   		var tmp=NaN;
   		if (typeof data == "string")
   		{
   			tmp = JSON.parse(data)
   		}
   		else
   		{
   			tmp=data;
   		}
   		
		var st = data.status; 
		var result = data.result;		
		
		callBackFnc(source,callBack,result,oArgs);	
			
    });
    
    request.fail(function(data,status,thrownE){
	   	errorCallBackFnc(source,callBack,thrownE.toString(),oArgs);	
    });
	
}

js_comunication.prototype.setProgress = function (){
	
	if (this.xhttp != undefined){
		//this.xhttp.addEventListener("progress",updateProgress);
		//this.xhttp.addEventListener("load",dataLoaded);
	}
	else
	{
		console.log("XMLHttpRequest object not exists");
		return false;
	}
	
}

/* End of class definition
 * 
 * Please put function after this comment....
 */

function updateProgress(e){
//	console.log(e);
}

function dataLoaded(e){
//	console.log(e);
}


function callProgressFnc(source,callBack, state,status)
{
	source[callBack](state,status);
}


function __completedRequest(respond)
{
   	console.log(["po vsetkom",respond]);
    var resObj;
    
    try{
    	
    	resObj = JSON.parse(respond);
    	toggleComm(false);
    	
//    	console.log(resObj);
	
    	for (var row in resObj){
    		
        	if (row.length > 0){
        	
        		if (comm.queue["comm_"+resObj[row].id] != undefined){
        		
        			callBackFnc(comm.queue["comm_"+resObj[row].id].source,comm.queue["comm_"+resObj[row].id].callBack,resObj[row],comm.queue["comm_"+resObj[row].id].oArgs);
        			delete comm.queue["comm_"+row];
        		
        		}	
        	}
    	}
        comm.count = 0;
    	showProgressBar(false);
    }
    catch (err){
    	showProgressBar(false);
    	
    	if (respond.indexOf("getErrorText")!=-1){
    		
    		pushWindow({caption:"Chyba",content:respond});
    		
    	}
    	else{
    		respond = respond.substr(0,500)+"...(truncated)";
        	
        	var error = "Error occured:\r\nk{message}\r\n\r\nStack:\r\nk{stack}\r\n\r\nResponse message:\r\nk{respond}\r\n\r\nProcessing data stopped !!!";
        	        	
        	var fError = onlineRes.fncs.sprintf(error,
        			{
        				message:err.message,
        				stack:err.stack,
        				respond:respond
    				});
//        	console.log(fError);
        	
        	comm.queue = {};
        	comm.count = 0;
        	
        	alert(fError);
        	
        	throw new Error (fError);
    	}
    	
    }
        
}

function completedRequest(respond,source,callBack,oArgs)
{ 
	callBackFnc(source,callBack,respond,oArgs);
}

function __unCompletedRequest(respond)
{
	var resObj;
        
    try{
    	
    	resObj = JSON.parse(respond);
    	
    	for (var row in resObj){
    		if (row.length > 0){
    			if (comm.queue["comm_"+resObj[row].id] != undefined){
    				errorCallBackFn(comm.queue["comm_"+resObj[row].id].source,comm.queue["comm_"+resObj[row].id].callBack,resObj[row],comm.queue["comm_"+resObj[row].id].oArgs);
    				//__comm_count__ -=1; 
    				delete comm.queue["comm_"+row];
    			}
    		}
    	}
    	comm.count=0;
    }
    catch (err){
    	
    	if (respond.indexOf("getErrorText")!=-1){
    		
    		pushWindow({caption:"Chyba",content:respond});
    		
    	}
    	else{
    		respond = respond.substr(0,255)+"...(truncated)";
        	
        	var error = "Error occured:\r\nk{message}\r\n\r\nStack:\r\nk{stack}\r\n\r\nResponse message:\r\nk{respond}\r\n\r\nProcessing data stopped !!!";
        	        	
        	var fError = onlineRes.fncs.sprintf(error,
        			{
        				message:err.message,
        				stack:err.stack,
        				respond:respond
    				});
        	
//        	console.log(fError);
        	
        	comm.queue = {};
        	comm.count = 0;
        	
        	alert(fError);
        	
        	throw new Error (fError);
    	}
    }
//	console.log(resObj);
	
}

function errorCallBackFnc(source,fnc,result,args)
{
	//console.log(["sendError",false,result, args]);
	
	if (typeof source == "function"){
		source.prototype[fnc](false,result,args);
	}
	else{
		source[fnc](false,result,args);
	}
}



function callBackFnc(source,fnc,result,args)
{
	//var response = JSON.parse(result);
		
//	console.log(["sendOK",source,fnc,result,args]);
	//return;
	if (typeof source == "function"){
		source.prototype[fnc](result.status,result.result,args);
	}
	else{
		source[fnc](result.status,result.result,args);
	}
}


function callExtFnc(source,fnc,result)
{
	if (typeof source == "function"){
		source.prototype[fnc](response.status,response.result,args);
	}
	else{
		source[fnc](response.status,response.result,args);
	}
}

/* Global functions onlineRes */
/**
 * @NameSpace onlineRes
 *  
 */
var onlineRes = onlineRes || {}


onlineRes.omega = {

}

/**
 * Trieda user sluzi na pracu s uzivetelom
 */
onlineRes.user = {
		
}


onlineRes.fncs = {

		/**
		 * Kontroluje validitu emailu na zaklade regexpu
		 * @param {string} email text
		 * @returns {boolean} true/false
		 */
		checkEmail: function(email)
		{
			email = email.trim();
			if (email!=undefined && email.length >0){
				var regPattern = /^[-a-z0-9_.+]+@[-a-z0-9_.]+\.[a-z]{2,10}$/i;
				var reg = new RegExp(regPattern);
				return reg.test(email);
			}
			else{
				return false;
			}
		},

		/**
		 * Vygeneruje hash a nasledny hex za pomoci SHA3
		 * @param {string} password ako retazec
		 * @returns {string} 128byte hex hodnota hesla
		 */
		
		sha3Enc: function(text){
			
			var pass = CryptoJS.SHA3(text);
			return pass.toString(CryptoJS.enc.Hex);
			
		},
		
		/**
		 * Funkcia naplní string podľa kotiev vo vstupnom reťazci
		 * @example sprintf('toto {test} funkcnosti {veci}', {test:'skuska',veci:'mokroty'})
		 * @param {string}	text na naformatovanie  
		 * @param {object} je object je dla kotiev v prvom retazci, key:value formtovany
		 * 
		 * @returns {string} formatovany retazec
		 */
		
		sprintf:function (text,args){
			return text.format(args);
		}

}


/* Global functions for Mobile version */
/**
 * @NameSpace Mobile
 *  
 */
var Mobile = Mobile || {
	__url__: "http://test2.medic.sk/r/onlineRes-mobile",
}
/**
 * Trieda user sluzi na pracu s uzivetelom
 */
Mobile.user = {

		
}


onlineRes.fncs = {

		/**
		 * Kontroluje validitu emailu na zaklade regexpu
		 * @param {string} email text
		 * @returns {boolean} true/false
		 */
		checkEmail: function(email)
		{
			email = email.trim();
			if (email!=undefined && email.length >0){
				var regPattern = /^[-a-z0-9_.+]+@[-a-z0-9_.]+\.[a-z]{2,10}$/i;
				var reg = new RegExp(regPattern);
				return reg.test(email);
			}
			else{
				return false;
			}
		},

		/**
		 * Vygeneruje hash a nasledny hex za pomoci SHA3
		 * @param {string} password ako retazec
		 * @returns {string} 128byte hex hodnota hesla
		 */
		
		sha3Enc: function(text){
			
			var pass = CryptoJS.SHA3(text);
			return pass.toString(CryptoJS.enc.Hex);
			
		},
		
		/**
		 * Funkcia naplní string podľa kotiev vo vstupnom reťazci
		 * @example sprintf('toto {test} funkcnosti {veci}', {test:'skuska',veci:'mokroty'})
		 * @param {string}	text na naformatovanie  
		 * @param {object} je object je dla kotiev v prvom retazci, key:value formtovany
		 * 
		 * @returns {string} formatovany retazec
		 */
		
		sprintf:function (text,args){
			return text.format(args);
		},
		
		md5Enc: function(text){
			
			var pass = CryptoJS.MD5(text);
			return pass.toString(CryptoJS.enc.Hex);
			
		}
		
		

}




