
$(document).ready(function(){
	init();
	events();
});

// initial function
function init() {
	$('.search').focus();
	if($('#wp-chart').length > 0){
		ctx = $("#wp-chart").get(0).getContext("2d");	
		C = new Chart(ctx);
	}
}

// global variables
var C; //// Canvas object
var interfaces = {	//// API route
	'difficulty': ['/api/word', 'difficulty'],
	'postag': ['/api/word', 'postag'],
	'wp': ['/api/word', 'wp'],
}

// generate API route for the given query
function api_for(func, query) { return [interfaces[func][0], query, interfaces[func][1]].join('/'); }


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

	$('.search').keyup(function(){

		var val = $.trim($(this).val());

		// prevent sening the same query
		if(val == prev_query){ return false;}
		else { prev_query = val; }

		// do
		if($(this).attr('id') == 'search-test') {
			_ajaxGetTestLevel(val);
		}
		else if($(this).attr('id') == 'search-pos') {
			_ajaxGetPOS(val);

		}
		else if($(this).attr('id') == 'search-wp'){
			_ajaxGetWordPosition(val);
		}
	});
}


