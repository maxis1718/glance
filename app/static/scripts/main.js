$( document ).ready(function() {
   

	$.urlParam = function(name){
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (!results) { return 0; }
			return results[1] || 0;
	}

	var query = $.urlParam( 'query' );


	if( query != "" ){
		$("#input-area").val(query);
		fetchData( query );
	}



   	init();
   	events();

	bindKeyboardActionToForm();



	handlebarHelperRegister();

});



function handlebarHelperRegister(){


	/* string comparison */
	Handlebars.registerHelper('ifCond', function(v1, v2, options) {
	  if(v1 === v2) {
	    return options.fn(this);
	  }
	  return options.inverse(this);
	});




	/* pos aggregate */
	Handlebars.registerHelper('posList', function(lst) {
	  	console.log(lst);
		var posLst = {};
		$.each( lst , function(index, val) {

			/* iterate through array or object */
			var pos = val['pos'];

			posLst[ pos ] += 1;


		});

		return posLst;
	});

	/* upper case a string */
	Handlebars.registerHelper('toUpperCase', function(value) {
    	return (value && typeof value === 'string') ? value.toUpperCase() : '';
	});

}



function events(){
	navigation('.function-nav-block');
	scrolling('.function-content', '.function-nav-block');
}

function scrolling(listenTo, changeTarget) {

	var previous = false;
	var current = false;

	$(window).scroll(function(){

		$.each($(listenTo), function(i, obj){

			// console.log(i)
			// console.log(obj)
			// var text = $(obj).find('.function-tag').text();
			var nav_id = 'nav-' + $(obj).attr('id').split('-')[1];
			var scrollTop = $(window).scrollTop();
			// var allheight = $('#content-container').height();

			var blockScreenTop = $(obj).offset().top - scrollTop;
			var blockScreenBot = blockScreenTop + $(obj).height();

			// console.log(nav_id,':',blockScreenTop)

			if(blockScreenTop < 190 && blockScreenTop > 0)
			{
				
				if (previous == false && current == false){
					// first time, just record, don't do click
					previous = nav_id;
					current = nav_id;
				}

				previous = current;
				current = nav_id;

				if ( previous == current ) {
					// do nothing
				}
				else {
					$(changeTarget).removeClass('selected');
					$('#'+nav_id).addClass('selected');
				}

			}
		});
		
		
	});
}

function navigation(selector) {

	$(selector).click(function(e){
		$(selector).removeClass('selected');
		$(this).addClass('selected');

		// var name = $(this).find('.content-head').find('a').attr('href').slice(1);
		var name = $(this).attr('id').split('-')[1];

		var block = $("#block-"+name).parent();
		// var margin_padding_offset =  block.index() == 0 ? 0 : block.outerHeight(true) - block.height();
		var margin_padding_offset =  block.outerHeight(true) - block.height();

	    $('html, body').animate({
    	    scrollTop: $("#block-"+name).offset().top - margin_padding_offset
    	}, 250);

    	// if this is the input wrap
    	$(this).find('#input-area').focus();
	});
}

function init(){
	$('#input-area').focus();

}


/* load tempalte file and render it to #entry */
function loadTemplate( templateName , data , entry , callback ){

    $.ajax({
		url : "/hb-template/" + templateName + ".tpl" ,
		dataType: "text",
		success : function (source) {
            
			var template = Handlebars.compile(source);
			var html    = template(data);

			/* put html string into entry */
			entry.html( html );	
			if(callback){
				callback();	
			}
			

        }
    });
    
}

/* bind enter action to text input */
function bindKeyboardActionToForm(){

	// $('body').keyup(function(e){
	// 	// if pressing a-z
	// 	if( (e.keyCode >= 65 && e.keyCode <= 90)  || (e.which >= 65 && e.which <= 90) )
	// 	{

	// 	}
	// 	if( (e.keyCode == 13 || e.which == 13) ){
			
	// 	}
	// });
	
	$('.input-btn').click(function(e){
		fetchData( $("#input-area").val() );
		// $("#input-area").val('');
	});

	$("#input-area").keyup(function(e){
	    if(e.keyCode == 13 || e.which == 13){
	    	// triger the fetch event
	       $('.input-btn').click();
	    }
	}).mouseup(function(e){
		$(this).select();
	});
}


/* function when user input a word or reload a page with a word */
function fetchData( qWord ){

	// clear current data
	$('.function-aera').html('');


	/* load difinition */
	queryWord( qWord );

	queryPOS( qWord );
	

	queryGenre( qWord );


	queryPosition( qWord );


	queryTranlastion( qWord );

}







/* ===================== module specific =================== */

var wordsense;
function queryWord( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord, function(data) {
		/*optional stuff to do after success */
		loadTemplate("definition", data , $("#wordDefinition") , function(){


			$.each(data['contents'], function(index, val) {
				 /* iterate through array or object */
				var polarity = val['polarity'];

				var word_polarity_data = [];
			    $.each(polarity, function( key, value ) {
			      if(value>0){
					  word_polarity_data.push([ key, value]);
					}
				});

				
				drawPolarity( word_polarity_data , "wordPolarity-"+index );


			});


		});

		wordsense = data['contents'][0];
		wordsense.name = data['contents'][0]['sense'];

		drawTreeStructure();





	});


}



// function queryTreeStructure( qWord ){

// 	// $.urlParam = function(name){
// 	// 	var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
// 	// 		if (!results) { return 0; }
// 	// 		return results[1] || 0;
// 	// }

// 	// var query = $.urlParam( 'query' );

// 	$.getJSON('/api/word/'+ qWord , function(data){
		
		

		

// 	}).error(function(err){				
// 		console.log( err );
// 	});

// }



function queryPOS( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord+"/postag", function(data) {
		/*optional stuff to do after success */
		
		drawPosChart( data );
		
	});

}

function queryPosition( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord+"/wp", function(data) {
		/*optional stuff to do after success */
		// var word_position_data = [];
	 //    $.each(data[1], function( index, value ) {
		//   word_position_data.push([ index, value]);
		// });

		drawWordPosition( data , "wordPosition" );
		
	});

}

function queryTranlastion( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord+"/translation", function(data) {
		/*optional stuff to do after success */
		// var word_position_data = [];
	 //    $.each(data[1], function( index, value ) {
		//   word_position_data.push([ index, value]);
		// });

		loadTemplate("translation", data , $("#wordTranslation") );
		
	});

}



function queryGenre( qWord ){

	var genre_data = [
		  [ 'Spoken' , 3453 ],
		  [ 'Written' , 234 ]
	];


	drawGenreChart( genre_data );	

}


/* ===================== drawing functions ======================= */

/* draw a pie chart for POS tags */
function drawPosChart( pos_data ){
	var width = 460,
    height = 300,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.category20b();

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d[1]; });

	var svg = d3.select("#posChart").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var g = svg.selectAll(".arc").data(pie(pos_data)).enter().append("g").attr("class", "arc");

	g.append("path").attr("d", arc).style("fill", function(d) { return color(d.data); });
	g.transition().attr("d", arc).duration(500);
	g.append("text")
	  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	  .attr("dy", ".35em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return d.data[0]; });

}


/* draw a pie chart for Genre tags */
function drawGenreChart( genre_data ){
	var width = 460,
    height = 300,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d[1]; });

	var svg = d3.select("#genrePieChart").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var g = svg.selectAll(".arc").data(pie(genre_data)).enter().append("g").attr("class", "arc");

	g.append("path").attr("d", arc).style("fill", function(d) { return color(d.data); });

	g.append("text")
	  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	  .attr("dy", ".35em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return d.data[0]; });

}

/* ==================== Tree structure ====================== */


var tree;   // global variable tree


function drawTreeStructure(){

	var size = { width:1200 , height:800 };
	var options = { fontSize:16, nodeRadius:3};
	var maxLabelLength = 80;



	// var nodes = tree.nodes(wordsense);
	// var links = tree.links(nodes);

	var m = [20, 120, 20, 120],
	    w = 1024 - m[1] - m[3],
	    h = 768 - m[0] - m[2],
	    i = 0,
	    root;

	tree = d3.layout.tree()
	    .sort(null)
	    .size([size.height, size.width - maxLabelLength*options.fontSize])
	    .children(function(d)
	    {
	        return (!d.hyponyms || d.hyponyms.length === 0) ? null : d.hyponyms;
	    });

	var layoutRoot = d3.select("#wordSenseTree")
	     .append("svg:svg").attr("width", size.width).attr("height", size.height)
	     .append("svg:g")
	     .attr("class", "container")
	     .attr("transform", "translate(" + maxLabelLength + ",0)");

	 var diagonal = d3.svg.diagonal()
	     .projection(function(d)
	     {
	        return [d.y, d.x];
	     });

	 // Edges between nodes as a <path class="link" />

	 // layoutRoot.selectAll("path.link")
	 //     .data(links)
	 //     .enter()
	 //     .append("svg:path")
	 //     .attr("class", "link")
	 //     .attr("d", diagonal);


	 /*
	     Nodes as
	     <g class="node">
	         <circle class="node-dot" />
	         <text />
	     </g>
	  */
	 // var nodeGroup = layoutRoot.selectAll("g.node")
	 //     .data(nodes)
	 //     .enter()
	 //     .append("svg:g")
	 //     .attr("class", "node")
	 //     .attr("transform", function(d)
	 //     {
	 //         return "translate(" + d.y + "," + d.x + ")";
	 //     });

	 // nodeGroup.append("svg:circle")
	 //     .attr("class", "node-dot")
	 //     .attr("r", options.nodeRadius);

	 // nodeGroup.append("svg:text")
	 //     .attr("text-anchor", function(d)
	 //     {
	 //         return d.children ? "end" : "start";
	 //     })
	 //     .attr("dx", function(d)
	 //     {
	 //         var gap = 2 * options.nodeRadius;
	 //         return d.children ? -gap : gap;
	 //     })
	 //     .attr("dy", 3)
	 //     .text(function(d)
	 //     {
	 //         return d.name;
	 //     });

	wordsense.x0 = 200;
	wordsense.y0 = 0;
	
	// toggle( wordsense , function(){ update( wordsense, layoutRoot, diagonal );} );
	toggle( wordsense , function(){ update( wordsense, layoutRoot, diagonal );} );
	

}


function toggle(d, callback) {
	
	if (d.hyponyms) {
		d._hyponyms = d.hyponyms;
		d.hyponyms = null;
		callback();
	} else {
		
		$.getJSON('/api/sense/'+ d.sense + '/hyponym' , function(data){

			
			d.hyponyms = data.hyponyms;
			d._hyponyms = null;
			
			// $.each(data.hyponyms, function(index, val) {
			// 	  iterate through array or object 
			// 	 console.log( val );	
			// });

			callback();

		}).error(function(err){				
			console.log( err );
		});
			// d.hyponyms = d._hyponyms;
			// d._hyponyms = null;
			// callback();
		
		
	}

}

function update(source, layoutRoot, diagonal ) {
	
	var duration = d3.event && d3.event.altKey ? 5000 : 500;

	// Compute the new tree layout.
	// console.log( "name : " + wordsense.name + " source: "+ source.name);
	var nodes = tree.nodes( wordsense ).reverse();

	// Normalize for fixed-depth.
	nodes.forEach(function(d) { d.y = d.depth * 200; });

	// Update the nodes…
	var node = layoutRoot.selectAll("g.node")
	  .data(nodes, function(d,i) { return d.id || (d.id = ++i); });

	// Enter any new nodes at the parent's previous position.
	var nodeEnter = node.enter().append("svg:g")
	  .attr("class", "node")
	  .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
	  .on("click", function(d) { toggle(d, function(){ update(d, layoutRoot, diagonal ) } ); });

	nodeEnter.append("svg:circle")
	  .attr("r", 1e-6)
	  .style("fill", function(d) { return d._hyponyms ? "lightsteelblue" : "#fff"; } );

	nodeEnter.append("svg:text")
	  .attr("x", function(d) { return d.hyponyms || d._hyponyms ? -10 : 10; })
	  .attr("dy", ".35em")
	  .attr("text-anchor", function(d) { return d.hyponyms || d._hyponyms ? "end" : "start"; })
	  .text(function(d) { return d.name; })
	  .style("fill-opacity", 1e-6);

	// Transition nodes to their new position.
	var nodeUpdate = node.transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

	nodeUpdate.select("circle")
	  .attr("r", 4.5)
	  .style("fill", function(d) { if( d._hyponyms == null){ return "#fff"; } return d._hyponyms.length!=0 ? "lightsteelblue" : "#fff"; });

	nodeUpdate.select("text")
	  .style("fill-opacity", 1);

	// Transition exiting nodes to the parent's new position.
	var nodeExit = node.exit().transition()
	  .duration(duration)
	  .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
	  .remove();

	nodeExit.select("circle")
	  .attr("r", 1e-6);

	nodeExit.select("text")
	  .style("fill-opacity", 1e-6);

	// Update the links…
	var link = layoutRoot.selectAll("path.link")
	  .data(tree.links(nodes), function(d) { return d.target.id; });

	// Enter any new links at the parent's previous position.
	link.enter().insert("svg:path", "g")
	  .attr("class", "link")
	  .attr("d", function(d) {
	    var o = {x: source.x0, y: source.y0};
	    return diagonal({source: o, target: o});
	  })
	.transition()
	  .duration(duration)
	  .attr("d", diagonal);

	// Transition links to their new position.
	link.transition()
	  .duration(duration)
	  .attr("d", diagonal);

	// Transition exiting nodes to the parent's new position.
	link.exit().transition()
	  .duration(duration)
	  .attr("d", function(d) {
	    var o = {x: source.x, y: source.y};
	    return diagonal({source: o, target: o});
	  })
	  .remove();

	// Stash the old positions for transition.
	nodes.forEach(function(d) {
	d.x0 = d.x;
	d.y0 = d.y;
	});
}

/* draw word position */
function drawWordPosition( word_position_data, entryName ){

	var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	// var xLabel = 

	var xAxis = d3.svg.axis()
	    .scale( x )
	    .orient("bottom")
	    .tickValues( [0,10,20, 30, 40, 50 , 60 , 70 , 80 , 90 ] );

	var yAxis = d3.svg.axis()
	    .scale( y )
	    .orient("left");



	var svg = d3.select("#"+entryName).append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	x.domain( word_position_data.map(function(d) { return d[0]; }));
	y.domain([0, d3.max(word_position_data, function(d) { return d[1]; })]);

	svg.append("g")
	  .attr("class", "x axis")
	  .call(xAxis)
	  .attr("transform", "translate(0," + height + ")");

	svg.append("g")
	  .attr("class", "y axis")
	  .call(yAxis)
	.append("text")
	  .attr("transform", "rotate(-90)")
	  .attr("y", 6)
	  .attr("dy", ".71em")
	  .style("text-anchor", "end")
	  .text("Frequency");

	svg.selectAll(".bar")
		.data( word_position_data )
		.enter().append("rect")
		.attr("class", "bar")
		.attr( "x" , function(d) { return x(d[0]); })
		.attr( "width" , x.rangeBand() )
		.attr( "y" , function(d) { return y(d[1]); })
		.attr("height", function(d) { return height - y(d[1]); });
}




/* polarity */



function drawPolarity( data , entryName ) {
	var width = 450,
    height = 300,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
	.domain(["objective", "positive", "negative"])
	.range(["#6b486b", "#98abc5", "#ff8c00"]);

	var pie = d3.layout.pie()
	    .value(function(d) { return d[1]; })
	    .sort(null);

	var arc = d3.svg.arc()
	    .innerRadius(radius - 100)
	    .outerRadius(radius - 20);
	var outerArc = d3.svg.arc()
	.innerRadius(radius * 0.9)
	.outerRadius(radius * 0.9);

	var svg = d3.select("#"+entryName).append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	function midAngle(d){
		return d.startAngle + (d.endAngle - d.startAngle)/2;
	}

	var g = svg.selectAll(".arc")
		.data(pie(data))
	    .enter().append("g")
		.attr("class", "arc");

		g.append("path")
		  .attr("d", arc)
		  .style("fill", function(d) { return color(d.data[0]); });

		g.append("text")
		  .attr("transform", function(d) {
		  	
			this._current = this._current || d;
			var interpolate = d3.interpolate(this._current, d);
			this._current = interpolate(0);
			var pos = outerArc.centroid(d);
			pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
			return "translate("+ pos +")";

		  })
		  .attr("dy", ".35em")
		  .style('fill','gray')
		  .style("text-anchor", function(d){
			return midAngle(d) < Math.PI ? "start":"end";
			})
		  .text(function(d) { return d.data[0]; });

		 g.append('polyline')
		 	.attr("points", function(d){
			
			var pos = outerArc.centroid(d);
			pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);

			return [arc.centroid(d), outerArc.centroid(d), pos];
			
		});

}

function type(d) {
  d.apples = +d.apples;
  d.oranges = +d.oranges;
  return d;
}

