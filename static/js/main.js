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


