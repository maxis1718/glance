$(document).ready(function(){
	init();
	events();
});

function init() {
	$('.search').focus();
}

function use(q) {

	$('#exam-type-wrap').find('span').removeClass('show').addClass('hide');
	var groups = W[q];
	if (groups.length) {
		$.each( W[q], function(i){
			$('#'+W[q][i]).addClass('show');
		});	
	}
}

function events () {
	
	// pos.html
	var prev_query = '';


	$('#pick-wrap').find('span').click(function(e){
		var q = $(this).text();
		$('#search-test').val(q);
		use(q);
	});


	$('.search').keyup(function(){

		var val = $.trim($(this).val());

		// do
		if( $(this).attr('id') == 'search-test' )
		{
			use(val);
		}
		else if( $(this).attr('id') == 'search-pos' )
		{
			// prevent sening the same query
			if(val == prev_query){ return false;}
			else { prev_query = val; }

			$.getJSON('/api/pos/'+val, function(data){

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
				$('#content-pos').html('');
				console.log('!!');
			});
		}
	});
}


