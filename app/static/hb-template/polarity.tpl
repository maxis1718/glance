<div class="row">

{{#each pos_index}}
  <div class="col-lg-4 col-md-4 col-sm-4" >
		{{#../contents}}
			{{#ifCond POS @key}}
  
			<div id="wordPolarity-{{@index}}">

			</div>
			        
			{{/ifCond}}
		{{/../contents}}
		
  </div>

{{/each}}
  
</div>