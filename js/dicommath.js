


var dicomMath = function(canvas,ctx,pixelSpacing,scaleRatio,hiddenCanvas)  {
	
	this._canvas = canvas;
	this._ctx = ctx;
	
	this.pixelSpacing = pixelSpacing;
	this.scaleRatio  = scaleRatio;
	
	this._lastMouse = {x:0,y:0};
	
	this._lineMouse = {x:-1,y:-1};
	
	this._mouse = {x:0,y:0};
	
	this._hiddenCanvas = hiddenCanvas;
	
	
}

dicomMath.prototype.storeData = function()
{
	
	var hiddenCanvas = document.getElementById("hiddenPlayer");
	var hiddenCtx = hiddenCanvas.getContext("2d");
		
	hiddenCtx.putImageData(this._ctx.getImageData(0,0,800,800),0,0);
}


dicomMath.prototype.paint = function() {
	
	
	this._ctx.lineWidth = 2;
	this._ctx.lineJoin = 'round';
	this._ctx.lineCap = 'round';
	this._ctx.strokeStyle = 'yellow';
	
	this._canvas.addEventListener("mousemove",this.setMouse,false);

	this._canvas.addEventListener("mousedown", this.draw_mousedown ,false);

	this._canvas.addEventListener("mouseup",this.draw_mouseup,false);
	
	
}


dicomMath.prototype.d_setMouse = function (e){
	//console.log(["ddfdfdf",e]);
	
	self._lastMouse.x = self._mouse.x;
	self._lastMouse.y = self._mouse.y;
	
	var realPos = document.getElementById("player").getBoundingClientRect();
	
	self._mouse.x = e.pageX - this.offsetLeft - realPos.left;
	self._mouse.y = e.pageY - this.offsetTop - realPos.top;
		
	//console.log(["ju",e]);
	
}

dicomMath.prototype.draw_mousedown = function () {
	self._canvas.addEventListener("mousemove",self.draw_paint,false);
	
}

dicomMath.prototype.draw_mouseup = function()
{
	//self.storePData();
	//var hiddenCtx = self._hiddenCanvas.getContext("2d");
		
	//hiddenCtx.putImageData(self._ctx.getImageData(0,0,800,800),0,0);
	
	self._canvas.removeEventListener("mousemove",self.draw_paint,false);
	//source.storeData();
	self.storeData;
}



dicomMath.prototype.draw_paint = function (){
	
	console.log("paint");
	
	if (typeof _ctx.beginPath === "function") {
		self._ctx.beginPath();
		self._ctx.moveTo(self._lastMouse.x, self._lastMouse.y);
		self._ctx.lineTo(self._mouse.x, self._mouse.y);
		self._ctx.closePath();
		self._ctx.stroke();
	}
}


dicomMath.prototype.d_ruler_countLength = function()
{
	if (typeof self._ctx.fillText === "function"){
	
		var xs = 0;
		var ys = 0;
		
		var vector = { startX:self._lineMouse.x, startY:self._lineMouse.y, endX:self._mouse.x, endY:self._mouse.y};
					
		var le = self.countVectorLength(vector);
					
		le = Math.round(le*100);
		le = le / 100;
					
		self._ctx.font = "18px Helvetica";
		self._ctx.fillStyle ="white";
		self._ctx.fillText("cca "+le+" mm",_lineMouse.x,_lineMouse.y);
		
		self.storeData;
		
		self._lineMouse = {x:-1,y:-1};
		
	}
	
	self._canvas.removeEventListener("mouseup",self.d_ruler_countLength,false);
	self._canvas.removeEventListener("mousedown",self.d_ruler_countLinePoints,false);
	self._canvas.removeEventListener("mousemove",self.d_ruler_drawLine,false);
	
	//this.stopDraw();
		
}

dicomMath.prototype.d_ruler_drawLine = function()
{
	
	
	if (typeof self._ctx.putImageData == "function"){
		console.log("halo");
		var hdc = document.getElementById("hiddenPlayer");
		
		var hCtx = hdc.getContext('2d');
		
		var hID = hCtx.getImageData(0,0,800,800);
		
		self._ctx.putImageData(hID,0,0);
				
		self._ctx.beginPath();
		self._ctx.moveTo(self._lineMouse.x, self._lineMouse.y);
		self._ctx.lineTo(self._mouse.x, self._mouse.y);
		self._ctx.closePath();
				//ctx.fill();
		self._ctx.stroke();
		
	}
}

/**
 * function sets the start point as fixed and mouse determines the endpoint
 */
dicomMath.prototype.d_ruler_countLinePoints = function()
{
	console.log(self._lineMouse);
	
	if (self._lineMouse.x == -1){
		self._lineMouse.x = self._mouse.x;
		self._lineMouse.y = self._mouse.y;
	}
	
	
	self._canvas.addEventListener("mousemove",dicomMath.prototype.d_ruler_drawLine,false);
}



dicomMath.prototype.ruler = function(){
	
	this._ctx.lineWidth = 2;
	this._ctx.lineJoin = 'round';
	this._ctx.lineCap = 'round';
	this._ctx.strokeStyle = 'yellow';
	
	this._canvas.addEventListener("mousemove",dicomMath.prototype.d_setMouse,false);
	
	this._canvas.addEventListener("mousedown",dicomMath.prototype.d_ruler_countLinePoints,false);
	
	this._canvas.addEventListener("mouseup",dicomMath.prototype.d_ruler_countLength,false);
}





dicomMath.prototype.countVectorLength = function(vector)
{
	return Math.sqrt( ( Math.pow((vector.startX - vector.endX) ,2) * Number(this.pixelSpacing[0]) * this.scaleRatio[0]) + ( Math.pow((vector.startY - vector.endY),2) * Number(this.pixelSpacing[1]) * this.scaleRatio[1]));
}






