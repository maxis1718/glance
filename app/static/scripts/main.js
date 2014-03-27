var glanceWordPosID = "posChart";
var glanceWordDefinitionID = "wordDefinition";
var glanceWordPositionID = "wordPosition";
var glanceWordTranslationID = "wordTranslation";
var glanceWordTree = "wordSenseTree";
var glacneWordPolarityID = "wordPolarity";
var glanceWordGenreID = "wordGenre";
var glanceWordCategoryID = "wordCategory";



var glanceFunctions = { 

	"function-list": [

		{ 'id': glanceWordDefinitionID  ,"display-name":"Definition"  },
		{ 'id': glanceWordTranslationID ,"display-name":"Translation" },
		{ 'id': glanceWordPosID         ,"display-name":"Part-of-speech"},
		{ 'id': glanceWordPositionID    ,"display-name":"Position"    },
		// { 'id': glanceWordTree          ,"display-name":"Structure"   },
		// { 'id': glacneWordPolarityID    ,"display-name":"Polarity"  },
		{ 'id': glanceWordGenreID       ,"display-name":"Form"  },
		{ 'id': glanceWordCategoryID    ,"display-name":"Discipline"}

	], 
	postfixFirst : "1",
	postfixSecond : "2"
};

// var svgPosChart;

var postfixFirst = "1";
var postfixSecond = "2"

var query;
var query2;
var test_mode;

$( document ).ready(function() {
   
	$.urlParam = function(name){
		var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
			if (!results) { return 0; }
			return results[1] || 0;
	}

	query = $.urlParam( 'query' );
	query2 = $.urlParam( 'query2' );
	test_mode = $.urlParam( 'textmode' );

	
	
	// console.log('test_mode:',test_mode);
	
	glanceFunctions['query'] = query == 0 ? '' : query;
	glanceFunctions['query2'] = query2 == 0 ? '' : query2;

	glanceFunctions['display'] = query2 == 0 ? 'hide': 'show';

	glanceFunctions['part1'] = query2 == 0 ? '7': '5';
	glanceFunctions['part2'] = query2 == 0 ? '3': '5';

	console.log('glanceFunctions:',glanceFunctions);
	console.log(glanceFunctions['display']);
	// console.log('query:',query);
	// console.log('query2:',query2);

	if( test_mode == 0 ){
		loadTemplate( "index", glanceFunctions, $("#main-container") , function(){


			if(query){

				
				fetchData( query , postfixFirst );

				// prevent from requesting "/api/word/0"
				if(query2){

					
					fetchData( query2 , postfixSecond );	
				}
			}



			events();
			init();
			bindKeyboardActionToForm();
			// $("#basic-search-bar").val(query);
			// $("#compare-search-bar").val(query2);
		});
	}else{

		loadTemplate( "index_text", glanceFunctions, $("#main-container") , function(){

			if(query){

				fetchTextData( query , postfixFirst );	

				// prevent from requesting "/api/word/0"
				if(query2){
					fetchTextData( query2 , postfixSecond );
				}
			}

			events();
			init();
			bindKeyboardActionToForm();
			// $("#basic-search-bar").val(query);
			// $("#compare-search-bar").val(query2);
		});

	}

	


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

function menuHandeler() {

	// var showMenu = function(){ .addClass('open-part'); };

	var obj = $('#menu-nav');

	// var hidePart = obj.animate( {marginLeft: "-96px"}, 500 );

	var clickEvent = function(){

		var open = !obj.hasClass('hide-part');
		var close = obj.hasClass('hide-part');
		var fixed = obj.hasClass('fixed');
		var notfixed = !obj.hasClass('fixed');

		// 本來是打開的，而且釘住 --> 隱藏 + 取消 fixed
		if(open && fixed)
		{
			obj.animate( { marginLeft: "-96px" }, 250, function(){ 
				obj.addClass('hide-part')
				   .removeClass('fixed')
				   .removeClass('bring-to-front').addClass('bring-to-back'); 
			});
		}
		// 本來是打開的, 還沒釘住, fixed it
		else if(open && notfixed)
		{
			obj.addClass('fixed');
		}
		// 本來是 close，打開並 fix
		else if(close)
		{
			obj.animate( { marginLeft: "0" }, 250, function(){ 
				obj.removeClass('hide-part')
				   .addClass('fixed'); 
			});
		}
	}
	var mouseoverEvent = function(){

		var open = !obj.hasClass('hide-part');
		var close = obj.hasClass('hide-part');
		var fixed = obj.hasClass('fixed');

		// 本來是打開，而且釘住
		if(open && fixed)
		{
			// do nothing	
		}
		// 本來是關著 --> 打開，不釘住
		else if(close)
		{
			obj.animate( { marginLeft: "0" }, 250, function(){ 
				obj.removeClass('hide-part')
				   .removeClass('bring-to-back').addClass('bring-to-front');
			});
		}
	}
	
	var mouseoutEvent = function(){

		var open = !obj.hasClass('hide-part');
		var close = obj.hasClass('hide-part');
		var fixed = obj.hasClass('fixed');
		var notfixed = !obj.hasClass('fixed');		

		// 本來是打開，而且釘住
		if(open && fixed)
		{
			// do nothing
		}
		// 本來是開著，沒釘住 --> 關
		else if(open && notfixed)
		{
			obj.animate( { marginLeft: "-96px" }, 250, function(){ 
				obj.addClass('hide-part')
				   .removeClass('bring-to-front').addClass('bring-to-back')
				   .removeClass('fixed');

			});
		}
		
		else if(close)
		{
			// do nothing
		}
	}

	var timer;

	$('#menu-controler')
		.click(clickEvent)
		.mouseenter(function(){
			clearTimeout(timer); // don't hide
			setTimeout(mouseoverEvent, 0); // execute mounse over event immediately
		})
		.mouseleave(function(){
			// after leave #menu-controler
			// wait for 450 msec 
			// to see if move to #menu-nav
			timer = setTimeout(mouseoutEvent, 450);			
		});

	$('#menu-nav').mouseenter(function(){
		clearTimeout(timer);
	}).mouseleave(function(){
		timer = setTimeout(mouseoutEvent, 450);

	});
}
function startSearch(){

	var basic = $('#basic-search-bar');
	var compare = $('#compare-search-bar');

	var basic_query = $.trim(basic.val());
	var compare_query = $.trim(compare.val());

	query_uri = '?';
	query2_uri = '';
	textmode_uri = '';

	if(basic_query.length > 0){
		query_uri += 'query='+basic_query;
	}
	if(compare_query.length > 0){
		query2_uri += '&query2='+compare_query;
	}
	if(test_mode){
		textmode_uri += '&textmode=1'
	}

	location.href = query_uri + query2_uri +textmode_uri;
}

function inputHandeler() {

	maxWidth = '128px';
	minWidth = '0px';
	var timer;

	var compare = $('#compare-search-bar');
	var basic = $('#basic-search-bar');
	var searchBar = $('.search-bar');

	if($.trim(compare.val()).length > 0){
		compare.addClass('fixed');
		compare.animate( { width: maxWidth }, 0 );
	}



	var focusEvent = function(){
		clearTimeout(timer);
		if($.trim(basic.val()).length > 0){
			compare.addClass('fixed');
			compare.animate( { width: maxWidth }, 200 );
		}
		
	};
	var blurEvent = function(){
		if($.trim(compare.val()).length == 0 && !compare.hasClass('fixed') ){

			timer = setTimeout(function(){
				compare.animate( { width: minWidth }, 200 );	
			}, 400)
			
		}
	};	

	var keyupEvent = function(e){
		if($.trim(basic.val()).length == 0 && $.trim(compare.val()).length == 0){
			compare.removeClass('fixed');
			compare.animate( { width: minWidth }, 200 );	
		}
		if($.trim(basic.val()).length > 0 || $.trim(compare.val()).length > 0){
			compare.addClass('fixed');
		}

		// handle query
		if(e.which == 13 || e.keyCode == 13)
		{
			startSearch();
		}
	}



	compare
		.focus(focusEvent)
		.blur(blurEvent)
		.mouseleave(blurEvent)
		.mouseenter(focusEvent);

	searchBar
		.hover(function(){
			$(this).focus();
		})
		.keyup(keyupEvent);

	$('#search-btn-wrap').click(function(e){
		startSearch();
	});

}


function events(){

	menuHandeler();

	inputHandeler();

	// navigation('.function-nav-block');
	// scrolling('.function-content', '.function-nav-block');

	// adjust last column width on window resize
	// var i = 0;
	// $(window).resize(function(){
	// 	i += 1;
	// 	console.log(i);
	// 	var siblings_width = 0;
	// 	$.each( $('.last-col').siblings('.col'), function(i, obj){
	// 		siblings_width += Math.max( $(obj).outerWidth(), $(obj).width() );
	// 	});
	// 	$('.last-col').width( $('.last-col').parent().innerWidth() - siblings_width );		
	// });
	


	// var w = $('#wrapper').width();
	// var s = $('#sideBar').width();
	// $('#mainContent').width(w - s);

	// $(window).scroll(function () {

	//     if ($(window).scrollTop() + $(window).height() > $('section').eq(0).offset().top) {
	//         console.log( s )
	//     } else {
	//         alert("footer invisible");
	//     }
	// });	
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
		// var name = $(this).attr('id').split('-')[1];

		// var block = $("#block-"+name).parent();
		// // var margin_padding_offset =  block.index() == 0 ? 0 : block.outerHeight(true) - block.height();
		// var margin_padding_offset =  block.outerHeight(true) - block.height();

	 //    $('html, body').animate({
  //   	    scrollTop: $("#block-"+name).offset().top - margin_padding_offset
  //   	}, 250);

  //   	// if this is the input wrap
  //   	$(this).find('#input-area').focus();
	});
}

function init(){

	// $('#input-area').focus();
	// $('.function-nav-block').eq(0).click();
}


/* load tempalte file and render it to #entry */
function loadTemplate( templateName , data , entry , callback ){

	// console.log(templateName, data);

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
function fetchData( qWord , postfixTargetID ){

	// clear current data
	// $('.content-body').html('');

	/* load difinition */
	queryWord( qWord , postfixTargetID );

	queryPOS( qWord , postfixTargetID );

	queryGenre( qWord , postfixTargetID );

	queryPosition( qWord , postfixTargetID );

	queryTranlastion( qWord , postfixTargetID );

	queryCategory( qWord , postfixTargetID );

}

/* function when user input a word or reload a page with a word */
function fetchTextData( qWord , postfixTargetID ){

	// clear current data
	// $('.content-body').html('');

	/* load difinition */
	/* get word info */
	$.get('/api/word/'+qWord, function(data) {
		/*optional stuff to do after success */
		data['postfixTargetID'] = postfixTargetID;
		loadTemplate("definition", data , $("#"+glanceWordDefinitionID+"_"+postfixTargetID) , function(){

				
			$.each(data['contents'], function(index, val) {
				 /* iterate through array or object */
				var polarity = val['polarity'];

				var word_polarity_data = [];
			    $.each(polarity, function( key, value ) {
			      if(value>0){
					  word_polarity_data.push([ key, value]);
					}
				});
				
			    
	    		var source = "{{#polarity}}<li>{{.}}</li>{{/polarity}}";
				var template = Handlebars.compile(source);
				var html    = template({ "polarity" : word_polarity_data});

				/* put html string into entry */
				$( "#wordPolarity-"+index+"-"+postfixTargetID ).html( html );
			});


		});

		wordsense = data['contents'][0];
		wordsense.name = data['contents'][0]['sense'];

		// drawTreeStructure( glanceWordTree );

	});

	queryTranlastion( qWord , postfixTargetID );

	/* get word info */
	$.get('/api/word/'+qWord+"/postag", function(data) {
		/*optional stuff to do after success */

		var source = "{{#pos}}<li>{{[0]}} : {{[1]}}</li>{{/pos}}";
		var template = Handlebars.compile(source);
		var html    = template({ "pos" : data});

		/* put html string into entry */
		$( "#"+ glanceWordPosID + "_" + postfixTargetID).html( html );	
		
	});

	/* get word info */
	$.get('/api/word/'+qWord+"/wp", function(data) {
		/*optional stuff to do after success */
		// var word_position_data = [];
	 //    $.each(data[1], function( index, value ) {
		//   word_position_data.push([ index, value]);
		// });
		var source = "{{#position}}<li>{{[0]}} : {{[1]}}</li>{{/position}}";
		var template = Handlebars.compile(source);
		var html    = template({ "position" : data});

		/* put html string into entry */
		$("#"+glanceWordPositionID + "_" + postfixTargetID).html( html );	


	
		
	});

		/* get word info */
	$.get('/api/word/'+qWord+"/genre", function(data) {
		
		var total = data[0][1] + data[1][1];
		
		

		var new_data = data;
		new_data[0][1] = new_data[0][1]/total;
		new_data[1][1] = new_data[1][1]/total; 

		var source = "{{#genre}}<li>{{[0]}} : {{[1]}}</li>{{/genre}}";
		var template = Handlebars.compile(source);
		var html    = template({ "genre" : new_data});

		/* put html string into entry */
		$("#"+ glanceWordGenreID + "_" + postfixTargetID).html( html );	
	});


}


/* ===================== module specific =================== */

var wordsense;
function queryWord( qWord , postfixTargetID ){

	/* get word info */
	$.get('/api/word/'+qWord, function(data) {
		/*optional stuff to do after success */
		data['postfixTargetID'] = postfixTargetID;
		loadTemplate("definition", data , $("#"+glanceWordDefinitionID+"_"+postfixTargetID) , function(){

			loadTemplate("polarity", data, $("#"+glacneWordPolarityID+"_"+postfixTargetID), function(){
					
				
				$.each(data['contents'], function(index, val) {
					 /* iterate through array or object */
					var polarity = val['polarity'];

					var word_polarity_data = [];
				    $.each(polarity, function( key, value ) {
				      if(value>0){
						  word_polarity_data.push([ key, value]);
						}
					});
				    
				    drawPolarity( word_polarity_data , "wordPolarity-"+index+"-"+postfixTargetID );
					
					
				});

			});

		});

		wordsense = data['contents'][0];
		wordsense.name = data['contents'][0]['sense'];

		// drawTreeStructure( glanceWordTree );

	});


}


function queryPOS( qWord , postfixTargetID ){

	/* get word info */
	$.get('/api/word/'+qWord+"/postag", function(data) {
		/*optional stuff to do after success */
		
		drawPosChart( data, glanceWordPosID + "_" + postfixTargetID );
		
	});

}

function queryPosition( qWord , postfixTargetID ){

	/* get word info */
	$.get('/api/word/'+qWord+"/wp", function(data) {
		/*optional stuff to do after success */
		// var word_position_data = [];
	 //    $.each(data[1], function( index, value ) {
		//   word_position_data.push([ index, value]);
		// });

		drawWordPosition( data , glanceWordPositionID + "_" + postfixTargetID );
		
	});

}






function queryTranlastion( qWord , postfixTargetID ){

	/* get word info */
	$.get('/api/word/'+qWord+"/translation", function(data) {
		/*optional stuff to do after success */
		// var word_position_data = [];
	 //    $.each(data[1], function( index, value ) {
		//   word_position_data.push([ index, value]);
		// });

		loadTemplate("translation", data , $("#"+glanceWordTranslationID + "_" + postfixTargetID ) );
		
	});

}



function queryGenre( qWord , postfixTargetID ){


	/* get word info */
	$.get('/api/word/'+qWord+"/genre", function(data) {
	
		drawGenreChart( data , glanceWordGenreID + "_" + postfixTargetID );	
	
	});

	

}

function queryCategory( qWord , postfixTargetID ){


		/* get word info */
	$.get('/api/word/'+qWord+"/category", function(data) {
	
		loadTemplate( "category" , {} , $( "#"+glanceWordCategoryID + "_" + postfixTargetID ) , function(){

			drawCategory( data , glanceWordCategoryID + "_" + postfixTargetID );

		} );
	
	});



}
/* ===================== drawing functions ======================= */



/* draw a pie chart for POS tags */
function drawPosChart( pos_data , entryName ){
	
	var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();
	
	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d[1]; });

	var svg = d3.select("#"+entryName).append("svg").attr("id", "svgPosChart")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	var g = svg.selectAll(".arc").data(pie(pos_data)).enter().append("g").attr("class", "arc").on('click', function (d, i) {

		console.log( i + "+" + d.data[0] );

	});

	g.append("path").attr("d", arc).style("fill", function(d) { return color(d.data); });
	g.transition().attr("d", arc).duration(500);
	g.append("text")
	  .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	  .attr("dy", ".35em")
	  .style("text-anchor", "middle")
	  .style('fill','white')
	  .text(function(d) { return d.data[0]; });

}


/* draw a pie chart for Genre tags */
function drawGenreChart( genre_data , entryName ){
	var width = 300,
    height = 300,
    radius = Math.min(width, height) / 2;

	var color = d3.scale.category20();

	var arc = d3.svg.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(0);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d[1]; });

	var svg = d3.select("#"+entryName).append("svg")
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
	  .style("fill","white")
	  .text(function(d) { return d.data[0]; });

}

/* ==================== Tree structure ====================== */


var tree;   // global variable tree


function drawTreeStructure( entryName ){

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

	var layoutRoot = d3.select("#"+entryName)
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

	var margin = { top: 20, right: 20, bottom: 30, left: 60 },
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

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
function drawPolarity2( data , entryName ) {
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




function drawPolarity( data , entryName ){
	
	// var margin = {top: 20, right: 100, bottom: 30, left: 40},
	var margin = {top: 0, right: 0, bottom: 0, left: 0},
	    width = 370;
	    height = 7;

	var y = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .1);

	var toolTip = d3.select(document.getElementById("toolTip"));
	    
	var color = d3.scale.ordinal()
	.domain(["objective", "positive", "negative"])
	.range(["#6b486b", "#98abc5", "#ff8c00"]);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .tickFormat(d3.format(".0%"));

	var svg = d3.select("#"+entryName).append("svg")
	    // .attr("width", width + margin.left + margin.right)
	    .attr("width", '100%')
	    // .attr("height", height + margin.top + margin.bottom)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
	// color.domain(d3.keys(data[0]).filter(function(key) { return key !== "State"; }));
	var y0 = 0;
	data.forEach(function(d) {
	    
	    d.barOrigin = y0;
	    d.barWidth = d[1]*width;
	    y0 += d.barWidth;
	    
	});

	  // data.sort(function(a, b) { return b.ages[0].y1 - a.ages[0].y1; });
	var x = d3.scale.linear().rangeRound( data.map(function(d) {  return d[1]*100; }) );
	x.domain( data.map(function(d) {  return d[0]; }));
	
	  // svg.append("g")
	  //     .attr("class", "x axis")
	  //     .attr("transform", "translate(0," + height + ")")
	  //     .call(xAxis);

	  // svg.append("g")
	  //     .attr("class", "y axis")
	  //     .call(yAxis);

	  var state = svg.selectAll(".state")
	      .data(data)
	    .enter().append("g")
	      .attr("class", "state");
	      // .attr("transform", function(d) {  return "translate(" + x(d[0]) + ",0)"; });

	  state.selectAll("rect")
	      .data(data)
	    .enter().append("rect")
	      .attr("width", '100%' )
	      // .attr("width", function(d){ return d.barWidth; } )
	      .attr("y", function(d) { return 0; })
	      .attr("x",function(d){ return d.barOrigin; })
	      .attr("height", height )
	      .style("fill", function(d) { return color(d[0]); })

	      .on("mouseover", function(d) {							// when the mouse leaves a circle, do the following
	      	
			toolTip.transition()
			.duration(200)
			.style("opacity", ".9");

			toolTip.text( d[0] );

			// var positionLeft = this.getBoundingClientRect().left - $("#"+glacneWordPolarityID).offset().left ;
			// var positionTop = $("#"+entryName).position().top - height;
			
			// toolTip.style("left", positionLeft + "px")
			    // .style("top", positionTop + "px");
                	
          }).on("mouseout", function(d) {							// when the mouse leaves a circle, do the following
	      	
			toolTip.transition()
			.duration(200)
			.style("opacity", "0");

	
          });
	      

	  // var legend = svg.select(".state:last-child").selectAll(".legend")
	  //     .data(function(d) { return d.ages; })
	  //   .enter().append("g")
	  //     .attr("class", "legend")
	  //     .attr("transform", function(d) { return "translate(" + x.rangeBand() / 2 + "," + y((d.y0 + d.y1) / 2) + ")"; });

	  // legend.append("line")
	  //     .attr("x2", 10);

	  // legend.append("text")
	  //     .attr("x", 13)
	  //     .attr("dy", ".35em")
	  //     .text(function(d) { return d.name; });

	

}




function drawCategory( root , entryName ){

	var width = 300,
	    height = 300,
	    radius = Math.min(width, height) / 2;

	var color = d3.scale.ordinal()
	.domain(['written others','natural science','social science','others','lore & religion','spoken others','fiction','humanities arts','politics, law, education','sports','medicine','letter','lectures','students','technological engineering','Written','arts ','report','commerce','non-academic','science','Spoken','academic','popular science','editorial','social','newspaper','talk'])
	.range(['#1f77b4', '#aec7e8', '#ff7f0e', '#bcbd22', '#dbdb8d', '#98df8a', '#c5b0d5', '#ff9896', '#9467bd', '#d62728', '#8c564b', '#c49c94', '#e377c2', '#f7b6d2', '#5254a3', '#c7c7c7', '#ffbb78', '#2ca02c', '#17becf', '#9edae5', '#393b79', '#7f7f7f', '#6b6ecf', '#cedb9c', '#637939', '#8ca252', '#b5cf6b', '#9c9ede']);
	    

	var svg = d3.select("#"+entryName+" #chart").append("svg")
	    .attr("width", width)
	    .attr("height", height)
		.append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height * .5 + ")");

	var partition = d3.layout.partition()
	    .sort(null)
	    .size([2 * Math.PI, radius * radius])
	    .value(function(d) { return 1; });

	var arc = d3.svg.arc()
	    .startAngle(function(d) { return d.x; })
	    .endAngle(function(d) { return d.x + d.dx; })
	    .innerRadius(function(d) { return Math.sqrt(d.y); })
	    .outerRadius(function(d) { return Math.sqrt(d.y + d.dy); });

	var path = svg.datum(root).selectAll("path")
	  .data(partition.nodes)
	.enter().append("path")
	  .attr("display", function(d) { return d.depth ? null : "none"; }) // hide inner ring
	  .attr("d", arc)
	  .style("stroke", "#fff")
	  .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
	  .style("fill-rule", "evenodd")
	  .each(stash)
	  .on("mouseover", function(d){
	  		var sequenceArray = getAncestors(d);
			// updateBreadcrumbs(sequenceArray, percentageString);

			d3.select("#"+entryName+" #percentage")
			.text(d.name);

			d3.select("#explanation")
			.style("visibility", "");



			// Fade all the segments.
			d3.selectAll("#"+entryName+" path")
			  .style("opacity", 0.3);

			// Then highlight only those that are an ancestor of the current segment.
			svg.selectAll("#"+entryName+" path")
			   .filter(function(node) {
			        return (sequenceArray.indexOf(node) >= 0);
			      })
			   .style("opacity", 1);
	  } );
	
	// d3.select("#"+entryName).on("mouseleave", function(d){
		
	// 	// d3.selectAll("path").on("mouseover", null);

	// 	// Transition each segment to full opacity and then reactivate it.
	// 	d3.selectAll("path")
	//       .transition()
	//       .duration(1000)
	//       .style("opacity", 1)
	//       .each("end", function() {
	//           // d3.select(this).on("mouseover", function(d){} );
	// 		});
	// });


	d3.selectAll("input").on("change", function change() {
	    var value = this.value === "count"
	        ? function() { return 1; }
	        : function(d) { return d.size; };

	    path.data(partition.value(value).nodes)
			.transition()
			.duration(1500)
	        .attrTween("d", arcTween);
	});


	// Stash the old values for transition.
	function stash(d) {
	  d.x0 = d.x;
	  d.dx0 = d.dx;
	}

	// Interpolate the arcs in data space.
	function arcTween(a) {
	  var i = d3.interpolate({x: a.x0, dx: a.dx0}, a);
	  return function(t) {
	    var b = i(t);
	    a.x0 = b.x;
	    a.dx0 = b.dx;
	    return arc(b);
	  };
	}

	d3.select(self.frameElement).style("height", height + "px");

	
}




// Main function to draw and set up the visualization, once we have the data.
function createVisualization(json) {

  // Basic setup of page elements.
  // initializeBreadcrumbTrail();
  drawLegend();
  
  // Bounding circle underneath the sunburst, to make it easier to detect
  // when the mouse leaves the parent g.
  vis.append("svg:circle")
      .attr("r", radius)
      .style("opacity", 0);

  // For efficiency, filter nodes to keep only those large enough to see.
  var nodes = partition.nodes(json)
      .filter(function(d) {
      return (d.dx > 0.005); // 0.005 radians = 0.29 degrees
      });

  var path = vis.data([json]).selectAll("path")
      .data(nodes)
      .enter().append("svg:path")
      .attr("display", function(d) { return d.depth ? null : "none"; })
      .attr("d", arc)
      .attr("fill-rule", "evenodd")
      .style("fill", function(d) { return colors[d.name]; })
      .style("opacity", 1)
      .on("mouseover", mouseover);

  // Add the mouseleave handler to the bounding circle.
  d3.select("#container").on("mouseleave", mouseleave);

  // Get total size of the tree = value of root node from partition.
  totalSize = path.node().__data__.value;
 };

// Fade all but the current sequence, and show it in the breadcrumb trail.
function sunburstMouseover(d, svg) {

  // var percentage = (100 * d.value / totalSize).toPrecision(3);
  // var percentageString = percentage + "%";
  // if (percentage < 0.1) {
  //   percentageString = "< 0.1%";
  // }

  // d3.select("#percentage")
  //     .text(percentageString);

  // d3.select("#explanation")
  //     .style("visibility", "");


}

// Restore everything to full opacity when moving off the visualization.
function sunburstMouseleave(d) {

  // Hide the breadcrumb trail
  // d3.select("#trail")
  //     .style("visibility", "hidden");

  // Deactivate all segments during transition.


  // d3.select("#explanation")
  //     .transition()
  //     .duration(1000)
  //     .style("visibility", "hidden");
}

// Given a node in a partition layout, return an array of all of its ancestor
// nodes, highest first, but excluding the root.
function getAncestors(node) {
  var path = [];
  var current = node;
  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }
  return path;
}

function initializeBreadcrumbTrail() {
  // Add the svg area.
  var trail = d3.select("#sequence").append("svg:svg")
      .attr("width", width)
      .attr("height", 50)
      .attr("id", "trail");
  // Add the label at the end, for the percentage.
  trail.append("svg:text")
    .attr("id", "endlabel")
    .style("fill", "#000");
}

// Generate a string that describes the points of a breadcrumb polygon.
function breadcrumbPoints(d, i) {
  var points = [];
  points.push("0,0");
  points.push(b.w + ",0");
  points.push(b.w + b.t + "," + (b.h / 2));
  points.push(b.w + "," + b.h);
  points.push("0," + b.h);
  if (i > 0) { // Leftmost breadcrumb; don't include 6th vertex.
    points.push(b.t + "," + (b.h / 2));
  }
  return points.join(" ");
}

// Update the breadcrumb trail to show the current sequence and percentage.
function updateBreadcrumbs(nodeArray, percentageString) {

  // Data join; key function combines name and depth (= position in sequence).
  var g = d3.select("#trail")
      .selectAll("g")
      .data(nodeArray, function(d) { return d.name + d.depth; });

  // Add breadcrumb and label for entering nodes.
  var entering = g.enter().append("svg:g");

  entering.append("svg:polygon")
      .attr("points", breadcrumbPoints)
      .style("fill", function(d) { return colors[d.name]; });

  entering.append("svg:text")
      .attr("x", (b.w + b.t) / 2)
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; });

  // Set position for entering and updating nodes.
  g.attr("transform", function(d, i) {
    return "translate(" + i * (b.w + b.s) + ", 0)";
  });

  // Remove exiting nodes.
  g.exit().remove();

  // Now move and update the percentage at the end.
  d3.select("#trail").select("#endlabel")
      .attr("x", (nodeArray.length + 0.5) * (b.w + b.s))
      .attr("y", b.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(percentageString);

  // Make the breadcrumb trail visible, if it's hidden.
  d3.select("#trail")
      .style("visibility", "");

}

function drawLegend() {

  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 75, h: 30, s: 3, r: 3
  };

  var legend = d3.select("#legend").append("svg:svg")
      .attr("width", li.w)
      .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend.selectAll("g")
      .data(d3.entries(colors))
      .enter().append("svg:g")
      .attr("transform", function(d, i) {
              return "translate(0," + i * (li.h + li.s) + ")";
           });

  g.append("svg:rect")
      .attr("rx", li.r)
      .attr("ry", li.r)
      .attr("width", li.w)
      .attr("height", li.h)
      .style("fill", function(d) { return d.value; });

  g.append("svg:text")
      .attr("x", li.w / 2)
      .attr("y", li.h / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.key; });
}

function toggleLegend() {
  var legend = d3.select("#legend");
  if (legend.style("visibility") == "hidden") {
    legend.style("visibility", "");
  } else {
    legend.style("visibility", "hidden");
  }
}

// Take a 2-column CSV and transform it into a hierarchical structure suitable
// for a partition layout. The first column is a sequence of step names, from
// root to leaf, separated by hyphens. The second column is a count of how 
// often that sequence occurred.
function buildHierarchy(csv) {
  var root = {"name": "root", "children": []};
  for (var i = 0; i < csv.length; i++) {
    var sequence = csv[i][0];
    var size = +csv[i][1];
    if (isNaN(size)) { // e.g. if this is a header row
      continue;
    }
    var parts = sequence.split("-");
    var currentNode = root;
    for (var j = 0; j < parts.length; j++) {
      var children = currentNode["children"];
      var nodeName = parts[j];
      var childNode;
      if (j + 1 < parts.length) {
   // Not yet at the end of the sequence; move down the tree.
 	var foundChild = false;
 	for (var k = 0; k < children.length; k++) {
 	  if (children[k]["name"] == nodeName) {
 	    childNode = children[k];
 	    foundChild = true;
 	    break;
 	  }
 	}
  // If we don't already have a child node for this branch, create it.
 	if (!foundChild) {
 	  childNode = {"name": nodeName, "children": []};
 	  children.push(childNode);
 	}
 	currentNode = childNode;
      } else {
 	// Reached the end of the sequence; create a leaf node.
 	childNode = {"name": nodeName, "size": size};
 	children.push(childNode);
      }
    }
  }
  return root;
};
