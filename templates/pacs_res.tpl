{include file="header.tpl"}
{include file="parts/headBanner.tpl"}

<h1>Výsledok hľadania v PACSe</h1>
<hr>
<table width="98%">
<tr>
	<th>Meno pacienta</th>
	<th>Modalita</th>
	<th>Dátum štúdie</th>
	<th>Accesssion number</th>
</tr>
{foreach from=$data item=study key=k}

{if $study.retrieveID % 2 == 0}
<tr id="row_{$study.retrieveID}" style="background-color:#e49b1c;">
{else}
<tr id="row_{$study.retrieveID}">
{/if}
	<td><div id="indi_{$study.retrieveID}" style="display:none;"><img src="images/loader.gif"></div><strong>{$study.PatientName|replace:"^":" "}</strong></td>
	<td><center><em>{$study.ModalitiesInStudy}</em></center></td>
	<td><center>{$study.StudyDate}</center></td>
	<td><center>{$study.AccessionNumber}</center></td>
	<td>
		<center>
		<a href="javascript:pacsMove('{$study.Path}','{$study.retrieveID}');" target="_self">Nahraj</a>
		
		</center>
	</td>
</tr>
{/foreach}
</table>

{include file="footer.tpl"}