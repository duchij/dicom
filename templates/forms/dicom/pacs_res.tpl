
<h1>Výsledok hľadania v PACSe</h1>
<hr>
<table class="responsive" data-max="15">
<tr>
	<th><h3 class="info">Meno pacienta</h3></th>
	<th><h3 class="info">Modalita</h3></th>
	<th><h3 class="info">Dátum štúdie</h3></th>
	<th colspan="2"><h3 class="info">Accesssion number</h3></th>
</tr>
{foreach from=$data item=study key=k}


<tr id="row_{$study.retrieveID}">

	<td><div id="indi_{$study.retrieveID}" style="display:none;"><img src="images/loader.gif"></div>
	<h4>{$study.PatientName|replace:"^":" "}</h4></td>
	<td><strong>{$study.ModalitiesInStudy}</strong></td>
	<td>{$study.StudyDate} {$study.StudyTime}</td>
	<td>{$study.AccessionNumber}</td>
	<td>
		<center><a href="javascript:pacsMove('{$study.Path}','{$study.retrieveID}');" target="_self" class="blue button">Nahraj</a>	</center>
	</td>
</tr>
{/foreach}
</table>

