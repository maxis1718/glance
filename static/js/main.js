$(document).ready(function(){
	init();
	events();
});

function init() {
	$('.search').focus();
}

function _ajaxGetTestLevel(q) {

	$('#exam-type-wrap').find('span').removeClass('show').addClass('hide');

	$.getJSON('/api/test/'+q, function(data){

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

function _ajaxGetPOS(q) {

	$.getJSON('/api/pos/'+q, function(data){

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


function _ajaxGetWordPosition(q) {

	// $('#exam-type-wrap').find('span').removeClass('show').addClass('hide');

	$.getJSON('/api/wp/'+q, function(data){
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

function chart(X, Y) {

	// get canvas object
	ctx = $("#wp-chart").get(0).getContext("2d");

	// set data
	var data = {
		labels : X,
		datasets : [
			{
				fillColor : "rgba(023, 091, 106, 1)",
				data : Y
			}
		]
	}

	// set options
	var options = {
		// animation: false,
		scaleShowGridLines: false,
		scaleLineWidth: 0,
		scaleLineColor: "rgba(255,255,255,0)",
		// scaleFontSize: 8,
		barShowStroke: false,
		barStrokeWidth: 0,

		barDatasetSpacing: 0,
		barValueSpacing: 0,

		// Y-axis label
		scaleShowLabels: false,

		// X-axis grid
		scaleGridLineColor: "rgba(0,0,0,0)",

		animationSteps: 10,
	}

	// draw
	new Chart(ctx).Bar(data, options);
}

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
		// if(val.length == 0) return false;

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


