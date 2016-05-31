<html>
<head>
	<meta charset="UTF-8">
	
	<script src="{$web_url}js/jquery.min.js" type="text/javascript"></script>

	<script src="{$web_url}js/jquery-ui.min.js" type="text/javascript"></script>

	<script src="{$web_url}js/comm_class.js" type="text/javascript"></script>
	<script src="{$web_url}js/orthanc.js" type="text/javascript"></script>
	
	
	<link rel="stylesheet" type="text/css" href="{$web_url}css/jquery-ui.min.css">
	<link rel="stylesheet" type="text/css" href="{$web_url}css/jquery-ui.structure.min.css">
	<link rel="stylesheet" type="text/css" href="{$web_url}css/jquery-ui.theme.min.css">
	<link rel="stylesheet" type="text/css" href="{$web_url}css/main.css">
	
	
</head>
<body>



{include file="parts/topmenu.tpl"}


<div id="content">
	<!--<div id="dialog"><div id="preview"></div></div>  -->
	<div id="dialog"><div id="preview"></div><canvas id="canvas" width="500" height="400"></canvas></div>
	
	<div id="debug"></div>
	<div id="commBall"><img src="{$web_url}images/loader.gif"></div>

