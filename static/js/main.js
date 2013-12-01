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
						$('<td/>').addClass('pos').text(pos).appendTo(li);
						$('<td/>').addClass('count').text(count).appendTo(li);

						
						var p = $('<td/>').addClass('percent').appendTo(li);

						var w = parseFloat(percent)/100*400;

						
						$('<div/>').css({'width':w, 'height':24, 'background':'orange'}).appendTo(p);
						$('<div/>').text(percent).appendTo(p)
						// $('<td/>').
						// console.log(list.length);
					});					
				}
			}).error(function(){
				$('#content-pos').html('');
				console.log('!!');
			});
		}
	});
}


