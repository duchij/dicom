{literal}

<script src="js/jquery.min.js" type="text/javascript"></script>


<script src="js/jquery-ui.min.js" type="text/javascript"></script>

<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/gdw/js/libs/jquery-1.10.2.min.js"></script> -->
<script type="text/javascript" src="gdw/js/groundwork.all.js"></script>
<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/js/jquery-ui.js"></script> -->

<!-- <script type="text/javascript" src="{$GLOBALS.APP_URL}/js/myfnc.js"></script> -->
<script src="js/comm_class.js" type="text/javascript"></script>
<!-- <script src="js/pss.js" type="text/javascript"></script> -->
<!-- <script src="tinymce/tinymce.min.js" type="text/javascript"></script> -->
<script src="js/main.js" type="text/javascript"></script>
<script src="js/dicommath.js" type="text/javascript"></script>

<script>
	/*tinymce.init({ 
					selector:'textarea',
					menubar:false,
					toolbar:'bold italic | alignleft alignright alignjustify' });*/

	mainInit({
				class:{/literal}'{$className}'{literal}
		});
	

</script>
{/literal}