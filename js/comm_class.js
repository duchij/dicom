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

var __comm_count__ = 0;
var __timeOutId__ = 0;
var __commQueue__ = [];
var __timeOut__ = 30;
var __window__ = undefined;
var __url__ = "";

var _URL_ ="http://127.0.0.1:8042";




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
		var reg = new RegExp('{'+key+'}','gm');
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
	
	
	__commQueue__["comm_"+__comm_count__]={ 
						id:__comm_count__, 
						classPath:classPath, 
						source:source, 
						args:argsAndCallBack[0],
						callBack:argsAndCallBack[1],
						oArgs:argsAndCallBack[2] 
						};
	
	__comm_count__++;
}

function extractJsonData(data)
{
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
	var commBall = __window__.document.getElementById("commBall");
	if (commBall != undefined)
	{
		if (st){
			commBall.setAttribute("style","visibility:visible;");
		}
		else
		{
			commBall.setAttribute("style","visibility:hidden;");
		}
	}
}

js_comunication.prototype.__sendData = function(_source,_callBack,oThis)
{
	
	clearTimeout(__timeOutId__);
	toggleComm(true);
	
	__timeOutId__ = 0;
	
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
	
	
	var data = {multi:extractJsonData(__commQueue__)};
	this.xhttp.open('POST',__url__,true);
	this.xhttp.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			
	this.xhttp.send("x=1&client=rjson&data="+JSON.stringify(data));
	
	this.xhttp.onreadystatechange = function (e)
	{
		
		/*if (_source != undefined && _callBack != undefined){
			callProgressFnc(_source,_callBack,this.readyState,this.status);
		}*/
		
		if (this.readyState == 4 ){
			__url__ = "";
			if (this.status ===200){	
				__completedRequest(this.responseText);
				//__commQueue__ = [];
			}
			else {
				__unCompletedRequest(this.statusText);
			}
		}
	}
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
	
	if (__timeOutId__ == 0){
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
		this.xhttp.addEventListener("progress",updateProgress);
		this.xhttp.addEventListener("load",dataLoaded);
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
	console.log(e);
}

function dataLoaded(e){
	console.log(e);
}


function callProgressFnc(source,callBack, state,status)
{
	source[callBack](state,status);
}


function __completedRequest(respond)
{
        var	resObj = JSON.parse(respond);
        //console.log(resObj);
        
        toggleComm(false);
        for (var row in resObj){
            if (row.length > 0){
            	
            	if (__commQueue__["comm_"+resObj[row].id] != undefined){
            		
            		callBackFnc(__commQueue__["comm_"+resObj[row].id].source,__commQueue__["comm_"+resObj[row].id].callBack,resObj[row],__commQueue__["comm_"+resObj[row].id].oArgs);
            		__comm_count__ -=1; 
            		delete __commQueue__["comm_"+row];
            		
            	}	
            }
            
            //completedRequest(resObj[row],source,callBack,Args);	
        }
}

function completedRequest(respond,source,callBack,oArgs)
{ 
	callBackFnc(source,callBack,respond,oArgs);
}

function __unCompletedRequest(respond)
{
	var resObj=JSON.parse(respond);
	//toggleComm(false);
	for (var row in resObj){
		if (row.length > 0){
			if (__commQueue__["comm_"+resObj[row].id] != undefined){
				errorCallBackFn(__commQueue__["comm_"+resObj[row].id].source,__commQueue__["comm_"+resObj[row].id].callBack,resObj[row],__commQueue__["comm_"+resObj[row].id].oArgs);
				__comm_count__ -=1; 
				delete __commQueue__["comm_"+row];
			}
		}
		
	}
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
		
	//console.log(["sendOK",source,fnc,result,args]);
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
		
		/**
		 * Prihlasi usera do omegy, 
		 * @param {object} data {name,password,source,callBack}
		 * 
		 * @returns status (true/false) result(object ak uspesny inak error message)
		 */
		
		loginUser:function(data)
		{
			console.log(SESSION.html);
			var pas1 = CryptoJS.MD5(data.password);
			var pas1Str = pas1.toString(CryptoJS.enc.Hex);
			var defPas1 = CryptoJS.MD5(pas1Str);
			var defPasStr = defPas1.toString(CryptoJS.enc.Hex)+"_"+SESSION.session_id;
			
			
			var t=new js_comunication();
			t.addRawRequest(_URL_,"onlineRes/forms/ms/jsLoginUser",data.source,[{name:data.name,pass:defPasStr},data.callBack]);
			t.sendData();
		},
        
		checkUserLogin:function(source,callBack)
		{
			var t=new js_comunication();
			t.addRawRequest(_URL_,"onlineRes/forms/ms/checkIsLogin",source,[{},callBack]);
			t.sendData();
		},
        
        logoutUser:function(source,callBack)
		{
			var t=new js_comunication();
			t.addRawRequest(_URL_,"onlineRes/forms/ms/logoutUser",source,[{session_id:SESSION.session_id},callBack]);
			t.sendData();
		}
}

/**
 * Trieda user sluzi na pracu s uzivetelom
 */
onlineRes.user = {
		
		/**Skontroluje ci je user prihlaseny pomocou AJAXu
	 * 
	 * @param login {string} login pacienta
	 * @param url {string} url kam poslat AJAX
	 * @param source {object} window kam sa to ma vratis
	 * @param callBack {string} nazov funkcie
	 */	
	checkUserLogin: function (login, url, source, callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(url,"onlineRes/forms/fromJs/jsCheckUserLogin",source,[{login:login},callBack]);
		t.sendData();
	},

	/**
	 * Vytvori noveho klienta pre online rezervacny system
	 * @param {object} data  (clientName,clientEmail,clientPassword 
	 * @param {string} url smer na router kde sa prijimaju async data
	 * @param {object} source zdroj vacsinou this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit
	 */
	
	createUser: function (data, url, source, callBack)
	{
		if (data !== undefined && url !== undefined && source !== undefined && callBack !==undefined )
		{
			var t = new js_comunication();
		
			t.addRawRequest(url, "onlineres/forms/fromJs/jsCreateClient",source,[data,callBack]);
			t.sendData();
		}
		else{
			callExtFnc(source,callBack,{status:false,result:"Chybne vstupne data..."});
		}
	},

	/**
	 * Overi existenciu klienta v pripade najdenia vracia jeho msId... 
	 * @param {object} data  {clientName,clientEmail,clientPassword} 
	 * @param {string} url smer na router kde sa prijimaju async data
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	
	loginUser: function (data,url,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(url,"onlineRes/forms/fromJs/jsLoginUser",source,[data,callBack]);
		t.sendData();
	},
	
	/**
	 * Vytvori rezervaciu na dany verejny slot v kalendari
	 *  
	 * @param {object} data  {eventId:cisloSlotu,forCreateReservation:true, returnCamelCase:true} 
	 * @param {string} url smer na router kde sa prijimaju async data
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	
	createReservation: function(data,url,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(url,"onlineRes/forms/fromJs/jsCreateReservation", source,[data,callBack]);
		t.sendData();
	},
	/**
	 * Odhlasi uzivatela
	 * @param {object} data {prazne}
	 * @param {string} url smer na router kde idu async data
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this, self a pod
	 * @param {string} callBack fukcia kam po logoute... 
	 */
	logoutUser: function (data,url,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(url,"onlineRes/forms/fromJs/jslogOutUser",source,[data,callBack]);
		t.sendData();
	},
	/**
	 * Ziska oddelenia pre rezervacny system...
	 * 
	 * @param {object} data  {slot:slot alebo sloty} sloty oddelene ciarkou, ak chceme dla viacerych slotov  
	 * @param {string} url smer na router kde sa prijimaju async data
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	getDepartments: function (data,url,source,callBack)
	{
		var t=new js_comunication();
		t.addRawRequest(url,"onlineRes/forms/fromJs/jsGetDepartaments",source,[data,callBack]);
		t.sendData();
	}
		
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
	
	
		
		/**Skontroluje ci je user prihlaseny pomocou AJAXu
	 * 
	 * @param login {string} login pacienta
	 * @param source {object} window kam sa to ma vratis
	 * @param callBack {string} nazov funkcie
	 */	
	checkUserLogin: function (login, source, callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(this.__url__,"onlineRes/forms/fromJs/jsCheckUserLogin",source,[{login:login},callBack]);
		t.sendData();
	},

	/**
	 * Vytvori noveho klienta pre online rezervacny system
	 * @param {object} data  (clientName,clientEmail,clientPassword 
	 * @param {object} source zdroj vacsinou this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit
	 */
	
	createUser: function (data, source, callBack)
	{
		if (data !== undefined && source !== undefined && callBack !==undefined )
		{
			var t = new js_comunication();
		
			t.addRawRequest(this.__url__, "onlineres/forms/fromJs/jsCreateClient",source,[data,callBack]);
			t.sendData();
		}
		else{
			callExtFnc(source,callBack,{status:false,result:"Chybne vstupne data..."});
		}
	},

	/**
	 * Overi existenciu klienta v pripade najdenia vracia jeho msId... 
	 * @param {object} data  {clientName,clientEmail,clientPassword} 
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	
	loginUser: function (data,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(this.__url__,"onlineRes/forms/fromJs/jsLoginUser",source,[data,callBack]);
		t.sendData();
	},
	
	/**
	 * Vytvori rezervaciu na dany verejny slot v kalendari
	 *  
	 * @param {object} data  {eventId:cisloSlotu,forCreateReservation:true, returnCamelCase:true} 
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	
	createReservation: function(data,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(this.__url__,"onlineRes/forms/fromJs/jsCreateReservation", source,[data,callBack]);
		t.sendData();
	},
	/**
	 * Odhlasi uzivatela
	 * @param {object} data {prazne}
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this, self a pod
	 * @param {string} callBack fukcia kam po logoute... 
	 */
	logoutUser: function (data,source,callBack)
	{
		var t = new js_comunication();
		t.addRawRequest(this.__url__,"onlineRes/forms/fromJs/jslogOutUser",source,[data,callBack]);
		t.sendData();
	},
	/**
	 * Ziska oddelenia pre rezervacny system...
	 * 
	 * @param {object} data  {slot:slot alebo sloty} sloty oddelene ciarkou, ak chceme dla viacerych slotov  
	 * @param {object} source zdroj vacsinou this, vo vnutri JQUERY treba dat odkaz na this
	 * @param {string} callBack obsahuje nazov funkcie kam sa ma vysledok vratit (vo formate, status, result)
	 */
	getDepartments: function (data,source,callBack)
	{
		var t=new js_comunication();
		t.addRawRequest(this.__url__,"onlineRes/forms/fromJs/jsGetDepartaments",source,[data,callBack]);
		t.sendData();
	}
		
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




