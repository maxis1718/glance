
<!-- Nav tabs -->
<ul class="nav nav-pills">
{{#each pos_index}}
  <li {{#ifCond @index 0}} class="active"{{/ifCond}}>
    <a href="#tab-{{@key}}-{{../postfixTargetID}}" data-toggle="pill">
      <span class="badge pull-right">{{this}}</span>
      <span class="pos-tab-label">{{#toUpperCase @key}}{{/toUpperCase}}</span>
    </a>
  </li>
{{/each}}

</ul>

<!-- Tab panes -->
<div class="tab-content">
{{#each pos_index}}
  
  <div class="tab-pane fade {{#ifCond @index 0}} in active{{/ifCond}}" id="tab-{{@key}}-{{../postfixTargetID}}">
  		
  		
		<div class="panel-group" id="accordion-{{../postfixTargetID}}">
		{{#../contents}}

			{{#ifCond POS @key}}
			  <div class="panel panel-default">
			    <div class="panel-heading">
			      <h4 class="panel-title">
			        <a data-toggle="collapse" data-parent="#accordion-{{../../../postfixTargetID}}" href="#collapse-{{@index}}-{{../../../postfixTargetID}}">
			           <span class="panel-title-definition">{{definition}}</span>
						
			        </a>
			      </h4>
					<div id="wordPolarity-{{@index}}-{{../../../postfixTargetID}}">

					</div>
			    </div>
			    <div id="collapse-{{@index}}-{{../../../postfixTargetID}}" class="panel-collapse collapse {{#if @first}}in{{/if}}">
			      <div class="panel-body">
			      	<b>Example Sentences</b>
			      	<ul>
					{{#example}}
						<li>{{.}}</li>
					{{/example}}

					</ul>

			      </div>
			    </div>
			  </div>
			{{/ifCond}}
		{{/../contents}}
		</div>

  </div>

{{/each}}
<div id="toolTip" class="tooltip" style="opacity:0;">
	    
</div>	
</div>







