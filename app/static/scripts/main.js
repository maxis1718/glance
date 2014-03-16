$( document ).ready(function() {
   
   	init();
   	events();
	bindKeyboardActionToForm();

});

function events(){
	navigation('.function-nav-block')
}

function navigation(selector) {
	$(selector).click(function(e){
		$(selector).removeClass('selected');
		$(this).addClass('selected');

		var name = $(this).find('.content-head').find('a').attr('href').slice(1);
		
		var block = $("#blockLabel-"+name).parents('.function-content-block')

		var margin_padding_offset = block.outerHeight(true) - block.height();

	    $('html, body').animate({
    	    scrollTop: $("#blockLabel-"+name).offset().top - margin_padding_offset
    	}, 250);

	});
}

function init(){
	$('#input-area').focus();
}

/* load tempalte file and render it to #entry */
function loadTemplate( templateName , data , entry ){
	
    $.ajax({
        url : "/hb-template/" + templateName + ".tpl" ,
        dataType: "text",
        success : function (source) {
            
			var template = Handlebars.compile(source);
			var html    = template(data);

			/* put html string into entry */
			entry.html( html );	
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

}







/* ===================== module specific =================== */


function queryWord( qWord ){

	/* get word info */
	$.get('/api/word/'+qWord, function(data) {
		/*optional stuff to do after success */
		console.log( data );

		loadTemplate("definition", data , $("#wordDefinition") );

	});


}



function queryPOS( qWord ){

	var pos_data = [
		  [ 'Verb' , 3453, 0.1345 ],
		  [ 'Adj' , 234, 0.81 ],
		  [ 'Noun' , 1234, 0.81 ]
	];

	drawPosChart( pos_data );


}


function queryGenre( qWord ){

	var genre_data = [
		  [ 'Spoken' , 3453 ],
		  [ 'Written' , 234 ]
	];


	drawGenreChart( genre_data );	

}


/* d3 functions */


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