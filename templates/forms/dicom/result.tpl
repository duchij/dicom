
<div class="row">

{if $result}

<h2>RTG za poslednú hodinu</h2>
	{foreach from=$result item=study key=p}
		{assign var="Series" value=$study.Series}
		<div class="row">
			<div class="blue box">
				<span class="white">Meno pacienta: <strong>{$study.PatientMainDicomTags.PatientName|replace:"^":" "}</strong><br>
				Pacient ID: <strong>{$study.PatientMainDicomTags.PatientID}</strong><br>
				Pohlavie: <strong>{$study.PatientMainDicomTags.PatientSex}</strong><br></span>
				{assign var="Study" value=$study}
			</div>				
				{include file="forms/dicom/previewRes.tpl"}
		</div>		
	{/foreach}
{else}
<h3>{$noMatch}</h3>
{/if}

</div>