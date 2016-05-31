{include file="header.tpl"}
{include file="parts/headBanner.tpl"}

<h1>Hľadanie</h1>
<ul>
	<li><strong>Rodné číslo</strong>, celé rodné číslo pacienta bez lomky</li>
	<li><strong>Meno pacienta</strong>, Časť alebo celé priezvisko pacienta
	<li><strong>Dátumu</strong> </li>
</ul> 

<form action="{$web_url}/index.php?c=dicom&m=searchOrthanc" method="POST">
	Priezvisko/Rodné číslo<input type="text" name="query" value=""><br>
	Dátum:<input type="text" id="datePicker" name="queryDate" style="width:100px;">
	<input type="submit" value="Hľadaj" class="searchSubmit">
	
</form>


{include file="footer.tpl"}