<div id="resultData">

			<div class="seriesDateTime">
				Dátum: <strong>{$Study.MainDicomTags.StudyDate}</strong> 
				Popis: <strong>{$Study.MainDicomTags.StudyDescription}</strong>
				Čas: <strong>{$Study.MainDicomTags.StudyTime}</strong> 
			</div>
			{assign var="Series" value=$Study.Series}
			{if $Series[1]}
				{foreach from=$Series item=SerieItem key=s}
				
					<div class="SeriesTags">
						Lokalita:<strong>{$Series[$s].MainDicomTags.BodyPartExamined}</strong>
						Modalita:<strong>{$Series[$s].MainDicomTags.Modality}</strong>
						Protokol:<strong>{$Series[$s].MainDicomTags.ProtocolName}</strong>
						Popis:<strong>{$Series[$s].MainDicomTags.SeriesDescription}</strong>
						Pocet obrazkov:<strong>{$Series[$s].Instances|@count}</strong>
					</div>
					{assign var="Instances" value=$Series[$s].Instances}
					{assign var="Modality" value=$Series[$s].MainDicomTags.Modality}
					
					
					
					<table cellpadding="0" cellspacing="0">
					{if count($Instances)>2}
						<tr class="instanceData">
<!-- 							<td valign="top"><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="50"></a></td> -->
								<td valign="top"><a href="{$router}dicom/showViewer&seriesUUID={$Series[$s].ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="50"></a></td>
							<td>
								<ul>
									<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Series[$s].ID}" target="_blank">Prehliadac</a></li>
<!-- 									<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhľad</a></li> -->
									<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Series[$s].ID}" target="_blank">Plná info..</a></li>
								</ul>
							</td>
						</tr>
					{else}
					{foreach from=$Instances item=Instance key=i}
						<tr class="instanceData">
							<td valign="top"><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="50"></a></td>
<!-- 							<td valign="top"><a href="{$router}dicom/showViewer?seriesUUID={$Series[$s].ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="50"></a></td> -->
							
							<td>
								<ul>
									<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Series[$s].ID}" target="_blank">Plná kvalita</a></li>
									<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhľad</a></li>
									<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Series[$s].ID}" target="_blank">Plná info..</a></li>
								</ul>
							</td>
							<td class="cell_{$Instance}" style="display:none;"><img width="80%" src="{$orthancUrl}/instances/{$Instance}/preview"></td>
						</tr>
					{/foreach}
					{/if}
					</table>
				{/foreach}
						
			{else}
				{assign var="Serie" value=$Series[0]}
				<div class="SeriesTag">
					Lokalita: <strong>{$Serie.MainDicomTags.BodyPartExamined}</strong>
					Modalita: <strong>{$Serie.MainDicomTags.Modality}</strong>
					Protokol: <strong>{$Serie.MainDicomTags.ProtocolName}</strong>
					Popis:<strong>{$Serie.MainDicomTags.SeriesDescription}</strong>
					Pocet obrazkov:<strong>{$Serie.Instances|@count}</strong>
				</div>
				{assign var="Instances" value=$Serie.Instances}
				<table cellpadding="0" cellspacing="0">
				
				{if count($Instances)>2}
					<tr class="instanceData">
<!-- 					<td valign="middle"><center><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="100"></a></center></td> -->
						<td valign="middle"><center><a href="{$router}dicom/showViewer&seriesUUID={$Series.ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instances[0]}/preview" width="100"></a></center></td>
					<td valign="middle">
						<ul>
							<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Serie.ID}" target="_blank">Prehliadac</a></li>
<!-- 							<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhlad</a></li> -->
							<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Serie.ID}" target="_blank">Plná info..</a></li>
						</ul>
						
					</tr>
				{else}
					{foreach from=$Instances item=Instance key=i}
					<tr class="instanceData">
					<td valign="middle"><center><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="100"></a></center></td>
<!-- 						<td valign="middle"><center><a href="{$router}dicom/showViewer?seriesUUID={$Series.ID}" class="picLink"><img src="{$orthancUrl}/instances/{$Instance}/preview" width="100"></a></center></td> -->
					<td valign="middle">
						<ul>
							<li><a href="{$orthancUrl}/web-viewer/app/viewer.html?series={$Serie.ID}" target="_blank">Plná kvalita</a></li>
							<li><a href="javascript:showPreview('{$Instance}','{$orthancUrl}');">Náhlad</a></li>
							<li><a href="{$orthancUrl}/app/explorer.html#series?uuid={$Serie.ID}" target="_blank">Plná info..</a></li>
						</ul>
						<td class="cell_{$Instance}" style="display:none;"><img width="80%" src="{$orthancUrl}/instances/{$Instance}/preview"></td>
					</tr>
					{/foreach}
					{/if}
				</table>
			{/if}
			</tr>
</table>
</div>