$(document).ready(function(){
	events();
});

function events () {
	
	// pos.html
	var prev_query = '';

	$('.search').keyup(function(){

		var val = $.trim($(this).val());

		// prevent sening the same query
		if(val == prev_query){ return false;}
		else { prev_query = val; }

		// do
		if( $(this).attr('id') == 'search-pos' )
		{
			
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


