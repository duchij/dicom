{include file="header.tpl"}
<table>
<tr>
<td valign="top">Pozri v <a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$seriesData.ID}" target="_blank">ORTHANC Web Prehliadaci</a></td>
	<td valign="top">Obrazky:
	
<!--  	{*foreach from=$picData item=instance key=i*}
	<ul>
		<li><a href="http://doma.local/nanodicom/public/{$instance.bigFile}" target="_blank"><img src="http://doma.local/nanodicom/public/{$instance.thumbFile}"></a></li>
	</ul>
	{*/foreach*}
-->	
</td>
</tr>
</table>
<h1>Rychly nahlad...</h1>
<input type="hidden" id="series" value="{$seriesData.ID}">
<div id="imagePlayer">
	<img src="" id="player" width="800px">
	
	<center>
		<div id="sliderBar">
			<div id="slider" draggable="true"></div> 
		</div>
	</center>
</div>

{include file="footer.tpl"}