<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	
	<script src="{$webUrl}js/jquery.min.js" type="text/javascript"></script>

	<script src="{$webUrl}js/jquery-ui.min.js" type="text/javascript"></script>

	<script src="{$webUrl}js/comm_class.js" type="text/javascript"></script>
	<script src="{$webUrl}js/orthanc.js" type="text/javascript"></script>
	
	
	<link rel="stylesheet" type="text/css" href="{$webUrl}css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="{$webUrl}css/jquery-ui.structure.min.css">
	<link rel="stylesheet" type="text/css" href="{$webUrl}css/jquery-ui.theme.min.css">
	
	
	<!-- Modernizr -->
	<script src="{$webUrl}gdw/js/libs/modernizr-2.6.2.min.js"></script>
	<!-- framework css -->
	<!--[if gt IE 9]><!-->
	<link type="text/css" rel="stylesheet" href="{$webUrl}gdw/css/groundwork.css">
	<!--<![endif]-->
	<!--[if lte IE 9]>
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork-core.css">
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork-type.css">
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork-ui.css">
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork-anim.css">
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork-ie.css">
	<![endif]-->

	<!--  <link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.structure.min.css">
	<link rel="stylesheet" type="text/css" href="css/jquery-ui.theme.min.css">
	<link rel="stylesheet" type="text/css" href="css/main.css">-->
	
	<link rel="stylesheet" type="text/css" href="{$webUrl}css/main.css">
	
	
	
</head>
<body>

<div class="row">
	<nav class="nav asphalt">
			<li><a href="{$webUrl}">Domov...</a></li>
			<li><a href="{$router}dicom/searchForm" target="_self" title="Vyhľadávanie lokálnych štúdii">Hľadanie</a></li>
			<li><a href="{$router}dicom/pacs" target="_self" title="Hľadanie na centrálnom nemocničnom úložišti.">PACS</a></li>
			<li><a href="{$router}dicom/toDay" target="_self" title="Zobrazí všetky lokálne štúdie nahraté doteraz.Pozor!!! Vzhľadom na mnosžtvo dát môže chvílu trvať." >Zobraz DNES</a></li>
			<li><a href="{$router}dicom/todayCT" target="_self" title="Zobrazí dnešné CT v lokálnom úložišti.">Dnešné CT</a></li>
			<li><a href="{$router}dicom/todayCR" target="_self" title="Zobrazí dnešné RTG">Dnešné RTG</a></li>
			<li><a href="{$router}dicom/toDayXA" target="_self" title="Zobrazí dnešné štúdie z operačnej sály">Dnešné XA</a></li>
			<li><a href="{$router}dicom/yesterdayXa" target="_self" title="Zobrazí včerajšie štúdie z operačnej sály">Včerajšie XA</a></li>
	</nav>
</div>

<div class="row">
	<div id="commBall"><img src="{$webUrl}images/loader.gif"></div>
</div>	

<div class="row">
	<div class="one fifth"></div>
	
	<div class="three fifth">
		<h1 class="asphalt">DICOM WebServer</h1>
		<hr class="asphalt">
		<p class="small red">Pozor t.č. nie je všetko dokončené, preto používať s rozumom. CT, MR štúdie zatiaľ pozerať v Tomocone, klasické RTG tu už idú normálne...</p>
	

		{if $errorMsg}	{$errorMsg} {/if}
		<div id="asyncResult"></div>
	
		<div class="double-padded">
			{if $body}
				{include file="forms/$body"}
			{/if}
		</div>
	
	</div>

	<div class="one fifth"></div>

<div class="row asphalt box">
		<p class="align-center small white">Scripting by Boris Duchaj, 2016</p>
</div> <!-- End of content div -->

{include file="scripts.tpl"}

</body>
</html>



