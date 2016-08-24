<html>
<head>
	<meta charset="UTF-8">
	
	<script src="http://10.10.2.49/dicom/js/jquery.min.js" type="text/javascript"></script>

	<script src="http://10.10.2.49/dicom/js/jquery-ui.min.js" type="text/javascript"></script>

	<script src="http://10.10.2.49/dicom/js/comm_class.js" type="text/javascript"></script>
	<script src="http://10.10.2.49/dicom/js/orthanc.js" type="text/javascript"></script>
	
	
	<link rel="stylesheet" type="text/css" href="http://10.10.2.49/dicom/css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="http://10.10.2.49/dicom/css/jquery-ui.structure.min.css">
	<link rel="stylesheet" type="text/css" href="http://10.10.2.49/dicom/css/jquery-ui.theme.min.css">
<!-- 	<link rel="stylesheet" type="text/css" href="http://10.10.2.49/dicom/css/main.css"> -->
	
	<!-- Modernizr -->
	<script src="gdw/js/libs/modernizr-2.6.2.min.js"></script>
	<!-- framework css -->
	<!--[if gt IE 9]><!-->
	<link type="text/css" rel="stylesheet" href="gdw/css/groundwork.css">
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
	
	
	
	
</head>
<body>

<div class="row">
	<nav class="nav blue">
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

<div class="row"
	<div id="content">
	<div id="dialog"><div id="preview"></div></div>
	<div id="debug"></div>
	<div id="commBall"><img src="http://10.10.2.49/dicom/images/loader.gif"></div>
</div>	

<div class="row">
		<h1 class="responsive center" data-compression="30">DICOM WebServer</h1>
		<p class="small red">Pozor t.č. nie je všetko dokončené, preto používať s rozumom. CT, MR štúdie zatiaľ pozerať v Tomocone, klasické RTG tu už idú normálne...</p>
	</p>
</div>

{if $gError}
	<div id="error">{$gError}</div>
{/if}


<div id="asyncResult"></div>

<div class="row">

	{if $body}
		{include file="forms/$body"}
	{/if}

</div>

<!--  <li><a href="{$router}dicom/lastHour" target="_self">Posledná hodina</a></li>-->

<div class="row yellow box">
<p class="align-center">
	Scripting by Boris Duchaj<br>2016
	</p>
</div> <!-- End of content div -->

{include file="scripts.tpl"}

</body>
</html>



