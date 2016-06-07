{include file="header.tpl"}
{include file="parts/headBanner.tpl"}
{literal}
	<script>
	loadSeriesData('{/literal}{$series}{literal}','{/literal}{$cache}{literal}');
	</script>
{/literal}
<h1>Priehliadač</h1>	
<input type="hidden" id="series" value="{$uuid}">
<div id="imagePlayer">
	<!--  <img src="" id="player" width="800px">-->
	<canvas id="player" width="800px" height="800px"></canvas>
	<center>
		<div id="sliderBar">
			<div id="slider"></div> 
		</div>
		<div id="mplayer_frame"></div>
	</center>
</div>

{include file="footer.tpl"}