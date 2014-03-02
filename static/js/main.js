
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
	'translation': ['/api/word', 'translation'],
}

// generate API route for the given query
function api_for(func, query) { return [interfaces[func][0], query, interfaces[func][1]].join('/'); }

function _ajaxGetUsage (q) {
	var url = '/static/usages/'+q+'.json';

	var usages_container = $('#usages-container')

	$.getJSON(url, function(data){
		$.each(data, function(anchor, arrays){
			var anchor_word = anchor.split('.')[0]
			var anchor_pos = anchor.split('.')[1]



			$.each(arrays, function(arr_idx, usage){

				var ustr = usage[0];
				var count = usage[1];
				var percent = usage[2];



				var usage_container = $('<tr/>').addClass('usage').appendTo(usages_container);

				
				var usage_obj = $('<td/>').addClass('usage-obj')
											.appendTo(usage_container);

				$('<td/>').addClass('usage-count')
							.text( Math.round(count) )
							.appendTo(usage_container);

				$('<td/>').addClass('usage-percent')
							.text( Math.round(percent*10000)/100 )
							.appendTo(usage_container);


				// transform usage_str to markedup format
				$.each(ustr.split(' '), function(i, element){

					var nodeText = element.replace('DOING_SOMETHING', 'V-ing')

					var span = $('<span/>').text(nodeText);

					if( element == anchor )
					{
						span.text( anchor_word.replace('#','') )
							.addClass( 'anchor' )
							.attr( 'pos', anchor_pos )
					}
					else if ( element == element.toUpperCase()) // capitalized words
					{
						if( element == "PERSON's" )
						{
							className = "person";
						}else
						{
							className = element.toLowerCase();
						}
						span.addClass( className );
					}


					span.appendTo(usage_obj)
				});

				

			});
		})
	})
}

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
	else if(this_id == 'search-usages'){
		_ajaxGetUsage(val);
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


