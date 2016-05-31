{include file="header.tpl"}

{include file="parts/headBanner.tpl"}

{if $gError}
	<div id="error">{$gError}</div>
{/if}
<div id="asyncResult"></div>

{include file="footer.tpl"}