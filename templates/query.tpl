{include file="header.tpl"}
{$QRData|@var_dump}
<h1>Hladanie pacientov na PACS serveri</h1>
<hr>
<form method="POST" action="index.php?a=3">
<table>
	<tr>
		<td>Meno pacienta:</td><td><input type="radio" name="queryField" value="patientName" checked="checked"></td>
	</tr>
	
	<tr>
		<td>Rodne cislo:</td><td><input type="radio" name="queryField" value="patientID"></td>
	</tr>
	<tr>
		<td>Accession cislo:</td><td><input type="radio" name="queryField" value="AccessionNumber"></td>
	</tr>
	
	
	<tr> <td>Retazec:</td><td><input type="text" name="queryText" value="*"></td>
	
	
	<tr>
		<td>Datum:</td>
		<td>
			<select name="studyDate">
				<option value="anyDate">Vsetky datumy</option>
				<option value="today">Dnes</option>
				<option value="yesterday">Vcera</option>
				<option value="lastWeek">Poslednych 7 dni</option>
				<option value="lastMonth">Poslednych 30dni</option>
			</select>
		</td>
	</tr>
	<td colspan="2"><input type="submit" value="odosli">
	
</table>
</form>
{if $QRData}
	{foreach from=$QRData item=data key=k}
	<p>
	Patient name:{$data.PatientName}<br>
	StudyDate: {$data.StudyDate}</br>
	PatientID: {$data.PatientID}
	Retrieve this Patient into <a href="{$webUrl}index.php?a=4&path={$data.Path}&rId={$data.retrieveID}" target="_blank">Here</a>
	
	</p>
	{/foreach}
	Retrieve all <a href="{$webUrl}index.php?a=5&path={$data.Path}" target="_blank">Queries</a>or <a href="javascript:retrieveAllQueries('{$data.Path}');">Async</a><br>
	
{/if}

{include file="footer.tpl"}