$( document ).ready(function() {
   
	var pos_data = [
		  [ 'Verb' , 3453, 0.1345 ],
		  [ 'Adj' , 234, 0.81 ],
		  [ 'Noun' , 1234, 0.81 ]
	];

	var genre_data = [
		  [ 'Spoken' , 3453 ],
		  [ 'Written' , 234 ]
	];
	drawGenreChart( genre_data );
	drawPosChart( pos_data );

	bindKeyboardActionToForm();




});

function bindKeyboardActionToForm(){
	$("#input-area").keyup(function(event){
	    if(event.keyCode == 13){
	    	queryWord( $("#input-area").val() );
	        
	        $("#input-area").val("");
	    }
	});
}

function queryWord( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord, function(data) {
		/*optional stuff to do after success */
		console.log( data );
		// d3.select("#wordDefinition").selectAll("p")
		// 	.data( data.contents )
		// 	.enter().append("li")
		// 	.text(function(d) { console.log( d ); return d.definition; })
		// 	.style("color", "white");


		var output = Mustache.render( "{{#contents}}<li>{{definition}}</li>{{/contents}}" , data);

		console.log( output );
		$("#wordDefinition").html( output );

	});


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

	g.append("path").attr("d", arc).style("fill", function(d) { console.log(color(d.data)); return color(d.data); });

	g.append("text")
	  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	  .attr("dy", ".35em")
	  .style("text-anchor", "middle")
	  .text(function(d) { return d.data[0]; });

}