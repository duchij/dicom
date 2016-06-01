{include file="header.tpl"}
{include file="parts/headBanner.tpl"}
{literal}
	<script>
	loadSeriesData('{/literal}{$uuid}{literal}');
	</script>
{/literal}
<h1>Rychly nahlad...</h1>
{$uuid}
<input type="hidden" id="series" value="{$uuid}">
<div id="imagePlayer">
	<img src="" id="player" width="800px">
	
	<center>
		<div id="sliderBar">
			<div id="slider" draggable="true"></div> 
		</div>
	</center>
</div>

{include file="footer.tpl"}