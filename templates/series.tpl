{include file="header.tpl"}
{include file="parts/headBanner.tpl"}
{if $result}

	<h1>Výsledok hľadania...</h1>
	
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
	{foreach from=$result item=patient key=p}
		{assign var="Studies" value=$patient.Studies}
		<div class="patientRes">
			Meno pacienta: <strong>{$patient.MainDicomTags.PatientName}</strong><br>
			Pacient ID: <strong>{$patient.MainDicomTags.PatientID}</strong><br>
			Pohlavie: <strong>{$patient.MainDicomTags.PatientSex}</strong><br>
		</div>
		{if $Studies[1]}
		
			{foreach from=$Studies item=Study key=s}
				{include file="parts/previewRes.tpl"}
			{/foreach}
		{else}
		
			{assign var="Study" value=$Studies[0]}
			
			{include file="parts/previewRes.tpl"}
		{/if}
		<div id="divider"></div>
	{/foreach}
{else}
<h3>{$noMatch}</h3>
{/if}

{include file="footer.tpl"}