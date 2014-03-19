<div class="row">

{{#each pos_index}}
  <div class="col-lg-6 col-md-6 col-sm-6" >
		<h1>{{@key}}</h1>
		
		{{#../contents}}
			{{#ifCond POS @key}}
  			
			<div id="wordPolarity-{{@index}}">

			</div>
			        
			{{/ifCond}}
		{{/../contents}}
		
		
  </div>

{{/each}}




</div>

