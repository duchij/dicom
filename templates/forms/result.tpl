
<div class="row">

{if $result}

<h2>RTG za poslednú hodinu</h2>
	{foreach from=$result item=study key=p}
		{assign var="Series" value=$study.Series}
		<p class="row">
			<div class="box yellow">
				<span class="black">Meno pacienta: <strong>{$study.PatientMainDicomTags.PatientName}</strong><br>
				Pacient ID: <strong>{$study.PatientMainDicomTags.PatientID}</strong><br>
				Pohlavie: <strong>{$study.PatientMainDicomTags.PatientSex}</strong><br></span>
				{assign var="Study" value=$study}
			</div>				
				{include file="forms/previewRes.tpl"}
		</p>		
	{/foreach}
{else}
<h3>{$noMatch}</h3>
{/if}

</div>