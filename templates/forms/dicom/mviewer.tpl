
<div class="row">


<div class="one fifth">
<h1>Priehliadač</h1>	
<code><div id="mplayer_frame"></div></code>
<input type="hidden" id="series" value="{$series}">
<input type="hidden" id="mviewer" value="1">
<input type="hidden" id="mviewer_cache" value="{$cache}">
	<ul>
		<li>Contrast: <code><div class="contrastLabel">0</div></code><div id="contrastSlider" style="width:150px;"></div></li>
		<li>Brigthness:<code> <div class="brightnessLabel">0</div></code><div id="brightnessSlider" style="width:150px;"></div></li>
		<li><a href="javascript:resetPicture();">Obnova nastaveni</a></li>
	</ul>
	
	<ul>
	<li><a href="javascript:painter('free');">Voľná čiara</a></li>
	<li><a href="javascript:painter('line');">Meranie vzdialenosti</a></li>
	<li><a href="javascript:painter('off');">Zrus malovanie</a></li>
	</ul>
	<div class="info box">
		<div id="patientInfo"></div>
	</div>
	
	
	
</div>

<div class="four fifth">
	<div id="imagePlayer">
		<canvas id="player" width="800px" height="800px"></canvas>
		<canvas id="hiddenPlayer" width="800px" height="800px"></canvas>
		<center>
			<div id="sliderBar">
				<div id="slider"></div> 
			</div>
			
		</center>
	</div>
</div>
</div>


