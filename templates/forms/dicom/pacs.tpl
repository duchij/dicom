

<h1>Hľadanie v PACSe</h1>
<div class="info box">
Hľadanie študií pacientov na centrálnom nemocničnom úložišti.
<ul>
	<li><strong>Rodné číslo</strong>, celé rodné číslo pacienta bez lomky</li>
	<li><strong>Meno pacienta</strong>, Časť alebo celé priezvisko pacienta
	<li><strong>Dátumu</strong> </li>
</ul> 

</div>


<form action="{$webUrl}d/dicom/searchPacs" method="GET">
<table style="width:500px;">
<tr><td colspan="2"><h3>Hľadaj podľa...</h3></td></tr>
<tr>
	<td><input type="radio" name="queryType" id="name" value="name" checked="checked"><label for="name"  class="inline">Priezvisko</label></td>
	<td><input type="radio" name="queryType"  id="binNum" value="binNum"><label for="binNum" class="inline">Rodné číslo</label>
</tr>	
<tr>	
	<td>Hodnota: </td><td><input type="text" name="query"  onclick="return false;"></td>
</tr>

<tr>
	<td>Dátum:</td><td><input type="text" id="datePicker" name="queryDate" style="width:100px;"></td>
</tr>

<tr>
	<td colspan="2"><input type="submit" value="Hľadaj"  class="searchSubmit"></td>
</tr>

</table>
</form>

