
<div class="row">
<div class="one fifth">
	
<h1>Priehliadač</h1>	
<!-- Snímka: <code><div id="mplayer_frame"></div></code> -->
<input type="hidden" id="instance" value="{$Instance}">
<input type="hidden" id="pviewer" value="1">
<input type="hidden" id="pviewer_cache" value="{$cache}">
<input type="hidden" id="width" value="{$size[0]}">
<input type="hidden" id="height" value="{$size[1]}">

	
	<ul>
		<li>Contrast: <code><div class="contrastLabel">0</div></code><div id="contrastSlider" style="width:150px;"></div></li>
		<li>Brigthness:<code> <div class="brightnessLabel">0</div></code><div id="brightnessSlider" style="width:150px;"></div></li>
		<li>Gama:<code> <div class="gamaLabel">0</div></code><div id="gamaSlider" style="width:150px;"></div></li>
		
		<li><a href="javascript:resetPicture();">Obnova nastaveni</a></li>
	</ul>
	
	<ul>
	<li><a href="javascript:p_draw();">Voľná čiara</a></li>
	<li><a href="javascript:p_ruler();">Meranie vzdialenosti</a></li>
	<li><a href="javascript:angle();">Uhol</a></li>
	<li><a href="javascript:stopDraw();">Zrus malovanie</a></li>
	</ul>
	<div class="info box">
			<h2><div id="PatientName" class="small" ></div></h2>
			<span class="small">Narodeny:</span> <strong><div id="PatientBirthDate" class="small inline"></div></strong><br>
			<span class="small">Vek:</span>  <strong><div id="PatientAge" class="small inline"></div></strong><br>
			<span class="small">Sex:</span>  <strong><div id="PatientSex" class="small inline"></div></strong><br>
			<span class="small">Dátum štúdie:</span>  <strong><div id="AcquisitionDate" class="small inline"></div></strong><br>
			<span class="small">Čas štúdie:</span>  <strong><div id="AcquisitionTime" class="small inline"></div></strong><br>
			<span class="small">Protokol:</span>  <strong><div id="ProtocolName" class="small inline"></div></strong><br>
			<span class="small">Veľkosť pixela:</span> <strong> <div id="PixelSpacing" class="small inline"></div></strong>
	</div>
	
	
	
</div>

<div class="four fifth">
	<div id="imagePlayer">
		<canvas id="player" width="800px" height="800px"></canvas>
		<canvas id="hiddenPlayer" width="800px" height="800px"></canvas>
<!-- 		<center> -->
<!-- 			<div id="sliderBar"> -->
<!-- 				<div id="slider"></div>  -->
<!-- 			</div> -->
			
<!-- 		</center> -->
	</div>
</div>
</div>


