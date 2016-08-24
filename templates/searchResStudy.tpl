{include file="header.tpl"}
{include file="parts/headBanner.tpl"}
{if $result}

	<h1>Výsledok hľadania... <i>{$parameter}</i></h1>
	
	<div class="hint">
	V zozname, ktorý vyhovuje vyhľadávaniu, sa nachádzajú malé náhľady snímok, následne sa dá odkliknúť.
	<ul>
		<li><strong>Plná kvalita</strong> - otvorí vstavaný prehliadač Orthancu, na plné prezretie obrázku - Pozor CT,MR štúdie radšej pozerať v Tomocone.... 
		Vľavo hore je ikona H po klinutí naňu sa otvorí menu, kde sa dajú nastaviť Window levely pre štúdie...</li>
		<li><strong>Náhľad</strong> - načíta snímku do okna, ťahaním za dolný okraj sa snímka postupne zväčšuje, posúvať v nej sa dá aj bočným skrolovacím pásom. Oknom sa dá hýbať ako v Windowse....
		<li><strong>Plná info</strong> - otvorí danú Sériu, priamo v Orthancu, tu sú všetky informácie... Pre zobrazenie je nutné stlačiť tlačidlo Orthanc WebViewer, 
		v ľavom bočnom menu...
	</ul>
	
	</div>
	<div id="divider"></div>
	{foreach from=$result item=study key=p}
		{assign var="Series" value=$study.Series}
		<div class="patientRes">
			Meno pacienta: <strong>{$study.PatientMainDicomTags.PatientName}</strong><br>
			Pacient ID: <strong>{$study.PatientMainDicomTags.PatientID}</strong><br>
			Pohlavie: <strong>{$study.PatientMainDicomTags.PatientSex}</strong><br>
		</div>
			{assign var="Study" value=$study}
			{include file="parts/previewRes.tpl"}
		<div id="divider"></div>
	{/foreach}
{else}
<h3>{$noMatch}</h3>
{/if}

{include file="footer.tpl"}