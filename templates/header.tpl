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
	<link rel="stylesheet" type="text/css" href="{$webUrl}css/main.css">
	
	
</head>
<body>

	<div id="debug"></div>
	<div id="commBall"><img src="{$webUrl}images/loader.gif"></div>

{include file="parts/topmenu.tpl"}


<div id="content">
	<!--<div id="dialog"><div id="preview"></div></div>  -->
	<div id="dialog"><div id="preview"></div><canvas id="canvas" width="500" height="400"></canvas></div>
	


