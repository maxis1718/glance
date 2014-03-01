
$(document).ready(function(){
	init();
	events();

	$('pre').css('background', 'inherit');
	$('pre').css('border', 'inherit');

});


var data = [4, 8, 15, 16, 23, 20];
BNC = {"a": 0.060322609948221494, "c": 0.08698529698023592, "b": 0.0644960355052622, "e": 0.03652266445191347, "d": 0.054355753383770876, "g": 0.038121439416550953, "f": 0.04081807446242489, "i": 0.030257335288545142, "h": 0.0420405144110357, "k": 0.019924992538185027, "j": 0.011186233924655134, "m": 0.06388611323790862, "l": 0.03820968348927445, "o": 0.02372727390700632, "n": 0.02411399057864753, "q": 0.00482227903294878, "p": 0.07040838837773654, "s": 0.10648204622432163, "r": 0.050657288571094874, "u": 0.022413994471768384, "t": 0.051918659728260166, "w": 0.03097366952594765, "v": 0.016543168221752162, "y": 0.0051804461516500346, "x": 0.0015001492362994588, "z": 0.004131898934582593}


// initial function
function init() {
	$('.search').focus();
	if($('#wp-chart').length > 0){
		ctx = $("#wp-chart").get(0).getContext("2d");	
		C = new Chart(ctx);
	}





	// d3.select(".chart")
	//   .selectAll("div")
	//     .data(data)
	//   .enter().append("div")
	//     .style("width", function(d) { return d * 10 + "px"; })
	//     .text(function(d) { return d; });
	// var x = d3.scale.linear().domain([0, d3.max(data)]).range([0, 420]);
	// var chart = d3.select(".chart");
	// var bar = chart.selectAll("div");
	// var barUpdate = bar.data(data);
	// var barEnter = barUpdate.enter().append("div");	
	// barEnter.style("width", function(d) { return x(d) + "px"; });
	// barEnter.text(function(d) { return d; });
	
	var pos_data = [
		  [ 'Verb' , 3453, 0.1345 ],
		  [ 'Adj' , 234, 0.81 ],
		  [ 'Noun' , 1234, 0.81 ]
	];
	

	var word_position_data_lst = [
	    [ 7, 1, 2, 3, 10, 15, 23, 12 , 13, 21, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15, 2, 1, 1, 2, 3, 10, 15 , 2, 1, 1 ]
    ];

    var word_position_data = [];
    $.each(word_position_data_lst[0], function( index, value ) {
	  word_position_data.push([ index, value]);
	});

    /* draw word position */
    drawWordPosition( word_position_data );

	/* drwa pos chart */
	drawPosChart( pos_data );

	var char_dist_data = [];
	var BNC = {"a": 0.060322609948221494, "c": 0.08698529698023592, "b": 0.0644960355052622, "e": 0.03652266445191347, "d": 0.054355753383770876, "g": 0.038121439416550953, "f": 0.04081807446242489, "i": 0.030257335288545142, "h": 0.0420405144110357, "k": 0.019924992538185027, "j": 0.011186233924655134, "m": 0.06388611323790862, "l": 0.03820968348927445, "o": 0.02372727390700632, "n": 0.02411399057864753, "q": 0.00482227903294878, "p": 0.07040838837773654, "s": 0.10648204622432163, "r": 0.050657288571094874, "u": 0.022413994471768384, "t": 0.051918659728260166, "w": 0.03097366952594765, "v": 0.016543168221752162, "y": 0.0051804461516500346, "x": 0.0015001492362994588, "z": 0.004131898934582593};

	$.each( Object.keys(BNC) , function( index, value ){

		char_dist_data.push( [ value, BNC[value] ] );

	});

	drawDistChar( char_dist_data );


	/* draw discourse chart */
	var dscs_data = [
		  [ 'Spoken' , 3453 ],
		  [ 'Written' , 234 ]
	];
	drawDiscourseChart( dscs_data );



	drawClusterChart();


	_ajaxGetTranslation();
	_ajaxGetUsage();


	
	drawWordGraph( );



}

// global variables
var C; //// Canvas object
var interfaces = {	//// API route
	'difficulty': ['/api/word', 'difficulty'],
	'postag': ['/api/word', 'postag'],
	'wp': ['/api/word', 'wp'],
	'translation': ['/api/word', 'translation'],
}

// generate API route for the given query
function api_for(func, query) { return [interfaces[func][0], query, interfaces[func][1]].join('/'); }

// request API: translation
function _ajaxGetTranslation (q) {
	$('#content-translation').html('');

	$.getJSON(api_for('translation', q), function(data){

		console.log('>> data:',data);

		if (data.length){
			cht = data[0];

			$('<li/>').text(cht).appendTo($('#content-translation'));
		}
	}).error(function(err){
		// catch "no page found" --> clear results
		// $('#exam-type-wrap').find('span').removeClass('show').addClass('hide');
	});

}

// request API: difficulty
function _ajaxGetTestLevel(q) {

	$('#exam-type-wrap').find('span').removeClass('show').addClass('hide');

	$.getJSON(api_for('difficulty', q), function(data){

		if (data.length){
			$.each( data, function(k, level){
				$('#'+level).addClass('show').removeClass('hide');
			});
		}
	}).error(function(err){
		// catch "no page found" --> clear results
		$('#exam-type-wrap').find('span').removeClass('show').addClass('hide');
	});
}

// request API: postag
function _ajaxGetPOS(q) {

	$.getJSON(api_for('postag', q), function(data){

		$('#content-pos').html('');
		
		if(data.length > 0){

			$.each(data, function(k, list){
				pos = list[0];
				count = list[1];
				percent = list[2];

				var li = $('<tr/>').appendTo( $('#content-pos') );

				

				var li_pos = $('<td/>').addClass('pos').appendTo(li);
				$('<span/>').text(pos).appendTo(li_pos);
				$('<td/>').addClass('count').text(count).appendTo(li);

				
				var p = $('<td/>').addClass('percent').appendTo(li);

				var w = parseFloat(percent)/100*400;

				$('<div/>').addClass('pos-percent-bar').width(w).appendTo(p);
				$('<div/>').addClass('pos-percent-label').text(percent.toString() + ' %').appendTo(p);
			});					
		}
	}).error(function(){
		// catch "no page found" --> clear results
		$('#content-pos').html('');
	});
}

// request API: wp
function _ajaxGetWordPosition(q) {

	$.getJSON(api_for('wp', q), function(data){
		// clear chart
		chart([],[]);

		if (data.length){
			// drop 0
			data[0].shift();
			data[1].shift();

			X = data[0];
			Y = data[1];

			for(var i = 0; i < X.length; i++){ X[i] = "";} // clear X-axis label
			chart(X, Y);
		}
	}).error(function(err){
		// clear chart
		chart([],[]);
	});
}


/* request API: translation */

function _ajaxGetTranslation( word ){


	var urlPath = "word/" + word + "/translation";
	var data = {
		
			'中文1': 0.2,
			'中文2': 0.6,
			'中文3': 0.8
		
	};

	drawTranslation( data );



	// $.getJSON( urlPath , function(data){
		
	// 	var translationLst = data['translation'];
	// 	$.each(data, function(i, item){



	// 	}

	// }).error(function(err){

	// });

}


function _ajaxGetUsage( word ){


	var	usageData = {
	    'vframe':{
	        '[PERSON] apologize to [PERSON]': {
	            'you apologize to me': [
	                'After a few moments of uncomfortable silence , she said stubbornly , If you denigrate my life s work , you shall not profit by it unless you apologize to me , Clare .',
	                'You shall not profit by it unless you apologize to me , Clare .'
	            ],
	            'me apologize to you': [
	                'After a few moments of uncomfortable silence , she said stubbornly , If you denigrate my life s work , you shall not profit by it unless you apologize to me , Clare .',
	                'You shall not profit by it unless you apologize to me , Clare .'
	            ]
	        },
	        '[PERSON] apologize to [MAN]': {
	            'you apologize to me': [
	                'After a few moments of uncomfortable silence , she said stubbornly , If you denigrate my life s work , you shall not profit by it unless you apologize to me , Clare .',
	                'You shall not profit by it unless you apologize to me , Clare .'
	            ]
	        }

		},
	    'aframe':{
	        


	    }
	
	};


	drawWordUsage( usageData );


}



/* draw usage */
function drawWordUsage( usageData ){

	$.each(usageData, function(key, value){

		var label = $('<h2/>', {
		    html: key
		});



		var node = $('<div/>', {
			class: 'col-md-6', 
		    html: label
		});


		$.each( value , function(pattern, examplePattern ){
			var pattern = $('<div/>', {
			    class: 'patternDiv',
			    html: $('<label/>', { html: pattern} )

			});
			
			var patternEgDiv = $('<div/>', {
			    
			  	class: 'pattern-eg'

			});


			$.each( examplePattern , function( instancePattern , exampleSentLst ){

				var patternEg = $( '<div/>' , {
					html: instancePattern
				});

				patternEgDiv.append( patternEg );
				patternEgDiv.append( "<br>" ); 

				var exampleSentUL = $('<ul/>', {style:'display:none'} );

				patternEg.click(function(){

					exampleSentUL.toggle( speed= 'normal');

				});


				$.each( exampleSentLst , function(i , exampleSent ){

					var exampleSent = $( '<li/>', {
						html: exampleSent
					});
					exampleSentUL.append( exampleSent );

				});

				patternEgDiv.append( exampleSentUL );

			});
			

			pattern.append( patternEgDiv );
			node.append( pattern );

			// $.each( value , function( i , exampleSent ){
				
			// })


		});

		$("#wordUsage").append( node );

	});

}


function drawWordGraph( wordGraphData ){
	



	

	d3.json( "/static/data/graph.json" , function(error, flare) {
	  console.log( flare );
	  flare.x0 = 0;
	  flare.y0 = 0;
	  update(root = flare);
	});

}


/* plot word graph */
function update(source) {
	
	var margin = {top: 30, right: 20, bottom: 30, left: 20},
    width = 960 - margin.left - margin.right,
    barHeight = 20,
    barWidth = width * .8;

	var i = 0,
	    duration = 400,
	    root;

	var tree = d3.layout.tree()
	    .size([0, 100]);

	var diagonal = d3.svg.diagonal()
	    .projection(function(d) { return [d.y, d.x]; });

	var svg = d3.select("#wordGraphList").append("svg")
	    .attr("width", width + margin.left + margin.right)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  // Compute the flattened node list. TODO use d3.layout.hierarchy.
  var nodes = tree.nodes(root);

  var height = Math.max(500, nodes.length * barHeight + margin.top + margin.bottom);

  d3.select("svg")
      .attr("height", height);

  d3.select(self.frameElement)
      .style("height", height + "px");

  // Compute the "layout".
  nodes.forEach(function(n, i) {
    n.x = i * barHeight;
  });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .style("opacity", 1e-6);

  // Enter any new nodes at the parent's previous position.
  nodeEnter.append("rect")
      .attr("y", -barHeight / 2)
      .attr("height", barHeight)
      .attr("width", barWidth)
      .style("fill", color)
      .on("click", click);

  nodeEnter.append("text")
      .attr("dy", 3.5)
      .attr("dx", 5.5)
      .text(function(d) { return d.name; });

  // Transition nodes to their new position.
  nodeEnter.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1);

  node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })
      .style("opacity", 1)
    .select("rect")
      .style("fill", color);

  // Transition exiting nodes to the parent's new position.
  node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .style("opacity", 1e-6)
      .remove();

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
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

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function color(d) {
  return d._children ? "#3182bd" : d.children ? "#c6dbef" : "#fd8d3c";
}





/* draw translation */
function drawTranslation( translation_data ){

	$.each(translation_data, function(key, value){
		var node = $('<li/>', {
		    html: key
		});

		$("#translationTable").append( node );

	});
}


/* draw word postion */
function drawWordPosition( word_position_data ){

	

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

	    

	var svg = d3.select("#wordPositionChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	x.domain( word_position_data.map(function(d) { return d[0]; }));
	y.domain([0, d3.max(word_position_data, function(d) { return d[1]; })]);
// 
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

/* draw word postion */
function drawDistChar( distData ){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 850 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

	var y = d3.scale.linear()
	    .range([height, 0]);

	// var xLabel = 

	var xAxis = d3.svg.axis()
	    .scale( x )
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale( y )
	    .orient("left");
	    

	var svg = d3.select("#charDistChart").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	x.domain( distData.map(function(d) { return d[0]; }));
	y.domain([0, d3.max(distData, function(d) { return d[1]; })]);
// 
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
		.data( distData )
		.enter().append("rect")
		.attr("class", "bar")
		.attr( "x" , function(d) { return x(d[0]); })
		.attr( "width" , x.rangeBand() )
		.attr( "y" , function(d) { return height; })
		.attr( "height" , 0 );

	svg.selectAll(".bar")
		.transition()
		.attr("height", function(d) { return height - y(d[1]); })
		.attr( "y" , function(d) { return y(d[1]); })
		.duration(1000);

}


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

/* draw a pie chart for POS tags */
function drawDiscourseChart( discourse_data ){
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

	var svg = d3.select("#discoursePieChart").append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var g = svg.selectAll(".arc").data(pie(discourse_data)).enter().append("g").attr("class", "arc");

	g.append("path").attr("d", arc).style("fill", function(d) { console.log(color(d.data)); return color(d.data); });

	g.append("text")
	  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	  .attr("dy", ".35em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return d.data[0]; });
	
}


function drawClusterChart(){

	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
	    .range([0, width]);

	var y = d3.scale.linear()
	    .range([height, 0]);

	var color = d3.scale.category10();

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left");

	var svg = d3.select("#charCluster").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	d3.tsv("/static/data/reduced_smallMatrix", function(error, data) {

	  data.forEach(function(d) {
	    d.xdata = +d.xdata;
	    d.ydata = +d.ydata;
	  });


	  x.domain(d3.extent(data, function(d) { return d.xdata; })).nice();
	  y.domain(d3.extent(data, function(d) { return d.ydata; })).nice();

	  svg.append("g")
	      .attr("class", "x axis")
	      .attr("transform", "translate(0," + height + ")")
	      .call(xAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("x", width)
	      .attr("y", -6)
	      .style("text-anchor", "end")
	      .text("X");

	  svg.append("g")
	      .attr("class", "y axis")
	      .call(yAxis)
	    .append("text")
	      .attr("class", "label")
	      .attr("transform", "rotate(-90)")
	      .attr("y", 6)
	      .attr("dy", ".71em")
	      .style("text-anchor", "end")
	      .text("Y")

	  svg.selectAll(".dot")
	      .data(data)
	    .enter().append("circle")
	      .attr("class", "dot")
	      .attr("r", 1.5)
	      .attr("cx", function(d) { return x(d.xdata); })
	      .attr("cy", function(d) { return y(d.ydata); })
	      .style("fill", function(d) { return "#FFFFFF"; });

	  var legend = svg.selectAll(".legend")
	      .data(color.domain())
	    .enter().append("g")
	      .attr("class", "legend")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

	  legend.append("rect")
	      .attr("x", width - 18)
	      .attr("width", 18)
	      .attr("height", 18)
	      .style("fill", color);

	  legend.append("text")
	      .attr("x", width - 24)
	      .attr("y", 9)
	      .attr("dy", ".35em")
	      .style("text-anchor", "end")
	      .text(function(d) { return d; });

	});


}



// chart drawing function
function chart(X, Y) {

	// get canvas object
	

	// set data
	var data = {
		labels : X,
		datasets : [
			{
				fillColor : "rgba(023, 091, 106, 1)",
				// strokeColor : "rgba(220,220,220,1)",
				data : Y
			}
		]
	}

	// set options
	var options = {

		scaleShowGridLines: false,
		scaleLineWidth: 0,
		// scaleLineColor: "rgba(023, 091, 106, 0.5)",
		// scaleFontSize: 8,

		// Y-axis label
		scaleShowLabels: false,

		// X-axis grid
		scaleGridLineColor: "rgba(0,0,0,0)",


		barShowStroke: false,
		barStrokeWidth: 0,
		barDatasetSpacing: 0,
		barValueSpacing: 0,

		animationSteps: 10,
	}

	// draw
	C.Bar(data, options);
}


function sent_request(this_id, val, run){ 

	// sent request
	if(this_id == 'search-test') {
		_ajaxGetTestLevel(val);
	}
	else if(this_id == 'search-pos') {
		_ajaxGetPOS(val);

	}
	else if(this_id == 'search-wp'){
		_ajaxGetWordPosition(val);
	}
	else if(this_id == 'search-translation'){
		_ajaxGetTranslation(val);
	}
}

// control all user events
function events () {
	
	// pos.html
	var prev_query = '';

	$('#pick-wrap').find('span').click(function(e){
		var q = $(this).text();
		$('#search-test').val(q);

		if(q == prev_query){ return false;}
		else { prev_query = q; }

		_ajaxGetTestLevel(q);
	});

	// ===================== begin-Timer =====================
	//// wait 3 sec
	// var timer = setTimeout(sent_request,3000);
	//// any other kepressed (except enter), clear timer
	// clearTimeout(timer)
	// ===================== end-Timer =====================

	// keyup:
	// 	 倒數, enter 的話停止倒數 直接送
	// keydown:
	//		clear timer
	var DELAY = 300;  	// minimum interval between two characters pressed
	var timer = null;	// timer

	$('.search').keydown(function(e){
		if(timer != null){
			clearTimeout(timer); // stop timer
		}
	});

	$('.search').keyup(function(e){
		// get user input
		var val = $.trim($(this).val());

		// detect Enter
		enter = (e.keyCode == 13)
		var this_id = $(this).attr('id');

		// "Enter" not detected
		if(!enter){
			// if content not changed (prevent sening the same query)
			if(val == prev_query){ return false; }
			// if content changed, start timer, ready to sent request
			else { 
				prev_query = val;
				timer = setTimeout(function(){ sent_request(this_id , val); }, DELAY);
			}
		// "Enter" detected
		}else {
			sent_request(this_id, val); // sent request directly
		}
	});
}


