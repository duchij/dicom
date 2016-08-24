

			<div class="blue box">
				Dátum: <strong>{$Study.MainDicomTags.StudyDate}</strong> 
				Popis: <strong>{$Study.MainDicomTags.StudyDescription}</strong>
				Čas: <strong>{$Study.MainDicomTags.StudyTime}</strong> 
			</div>
			
			{assign var="Series" value=$Study.Series}
			{if $Series[1]}
				{foreach from=$Series item=SerieItem key=s}
				
					<div class="box">
						Lokalita:<strong>{$Series[$s].MainDicomTags.BodyPartExamined}</strong>
						Modalita:<strong>{$Series[$s].MainDicomTags.Modality}</strong>
						Protokol:<strong>{$Series[$s].MainDicomTags.ProtocolName}</strong>
						Popis:<strong>{$Series[$s].MainDicomTags.SeriesDescription}</strong>
						Počet obrázkov:<strong>{$Series[$s].Instances|@count}</strong>
					</div>
					
					{assign var="Instances" value=$Series[$s].Instances}
					{assign var="Modality" value=$Series[$s].MainDicomTags.Modality}
					
					{if count($Instances)>2}
<!-- 							<td valign="top"><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="50"></a></td> -->
						  <div class="white box">
						  	<a href="{$router}dicom/showViewer&seriesUUID={$Series[$s].ID}">
						  	<img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="50" align="left"></a>
									<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Series[$s].ID}" target="_blank">Prehliadac</a></li>
<!-- 									<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhľad</a></li> -->
									<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Series[$s].ID}" target="_blank">Plná info..</a></li>
						</div>
					{else}
					{foreach from=$Instances item=Instance key=i}
						<div class="white box">
							<a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">
							<img src="{$orthancUrl}/instances/{$Instance}/preview" width="50" align="left"></a>
<!-- 							<td valign="top"><a href="{$router}dicom/showViewer?seriesUUID={$Series[$s].ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="50"></a></td> -->
							<div class="tripple-gapped">
									<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Series[$s].ID}" target="_blank">Plná kvalita</a></li>
									<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhľad</a></li>
									<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Series[$s].ID}" target="_blank">Plná info..</a></li>
							</div>
						</div>
							<!-- <td class="cell_{$Instance}" style="display:none;"><a href="javascript:hidePic('cell_{$Instance}');">
							<img width="80%" src="{$orthancUrl}/instances/{$Instance}/preview"></a></td> -->
						
						
						
					{/foreach}
					{/if}
				{/foreach}
						
			{else}
				{assign var="Serie" value=$Series[0]}
				<div class="box">
					Lokalita: <strong>{$Serie.MainDicomTags.BodyPartExamined}</strong>
					Modalita: <strong>{$Serie.MainDicomTags.Modality}</strong>
					Protokol: <strong>{$Serie.MainDicomTags.ProtocolName}</strong>
					Popis:<strong>{$Serie.MainDicomTags.SeriesDescription}</strong>
					Počet obrázkov:<strong>{$Serie.Instances|@count}</strong>
				</div>
				{assign var="Instances" value=$Serie.Instances}
				
				{if count($Instances)>2}
<!-- 					<td valign="middle"><center><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="100"></a></center></td> -->
						<div class="white box">
							<a href="{$router}dicom/showViewer&seriesUUID={$Series.ID}">
							<img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="100" align="left"></a>
								<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Serie.ID}" target="_blank">Prehliadac</a></li>
<!-- 							<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhlad</a></li> -->
								<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Serie.ID}" target="_blank">Plná info..</a></li>
						</div>
				{else}
					{foreach from=$Instances item=Instance key=i}
					<div class="white box">
						<a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">
						<img src="{$orthancUrl}/instances/{$Instance}/preview" width="100" align="left"></a>
<!-- 						<td valign="middle"><center><a href="{$router}dicom/showViewer?seriesUUID={$Series.ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="100"></a></center></td> -->
								<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Serie.ID}" target="_blank">Plná kvalita</a></li>
								<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhlad</a></li>
								<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Serie.ID}" target="_blank">Plná info..</a></li>
					</div>
						<!--  
						<td class="cell_{$Instance}" style="display:none;"><a href="javascript:hidePic('cell_{$Instance}');"><img width="80%" src="{$orthancUrl}/instances/{$Instance}/preview"></a></td>
						-->
					{/foreach}
					{/if}
			{/if}
