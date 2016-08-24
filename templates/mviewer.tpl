{include file="header.tpl"}
{include file="parts/headBanner.tpl"}

<h1>Priehliadač</h1>	
<input type="hidden" id="series" value="{$series}">
<input type="hidden" id="mviewer" value="1">
<input type="hidden" id="mviewer_cache" value="{$cache}">

<div id="controls" style="float:left;top:0px;border:1px solid black;padding-right:5px;">
<ul>
	<li>Contrast: <div class="contrastLabel" style="display:block;"></div><div id="contrastSlider" style="width:150px;display:block;"></div></li>
	<li>Brigthness: <div class="brightnessLabel" style="display:block;"></div><div id="brightnessSlider" style="width:150px;display:block;"></div></li>
	<li><a href="javascript:resetPicture();">Obnova nastaveni</a></li>
</ul>
</div>
<div id="imagePlayer">
	<canvas id="player" width="800px" height="800px"></canvas>
	<canvas id="hiddenPlayer" width="800px" height="800px"></canvas>
	<center>
		<div id="sliderBar">
			<div id="slider"></div> 
		</div>
		<div id="mplayer_frame"></div>
	</center>
</div>


{include file="footer.tpl"}