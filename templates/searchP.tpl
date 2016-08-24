{include file="header.tpl"}
{include file="parts/headBanner.tpl"}

<h1>Hľadanie</h1>
<ul>
	<li><strong>Rodné číslo</strong>, celé rodné číslo pacienta bez lomky</li>
	<li><strong>Meno pacienta</strong>, Časť alebo celé priezvisko pacienta
	<li><strong>Dátumu</strong> </li>
</ul> 

<form action="{$webUrl}index.php?c=dicom&m=searchOrthanc" method="POST">
<table>
	<tr>
		<td>Priezvisko/Rodné číslo</td><td><input type="text" name="query" value=""></td>
	</tr>
	<tr>
	<td>Dátum:</td><td><input type="text" id="datePicker" name="queryDate" style="width:100px;"></td>
	</tr>
	<tr>
	<td colspan="2">	<input type="submit" value="Hľadaj" class="searchSubmit"></td>
	</tr>
</table>	
</form>


{include file="footer.tpl"}