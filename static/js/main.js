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

// var weekday = {'0':'Sunday','1':'Monday','2':'Tuesday','3':'Wednesday','4':'Thursday','5':'Friday','6':'Saturday'}
// var month = {'0':'January','1':'February','2':'March','3':'April','4':'May','5':'June','6':'July', '7':'August', '8':'September', '9':'October', '10':'November', '11':'December'}
// // var weekday = {'0':'Sun.','1':'Mon.','2':'Tue.','3':'Wed.','4':'Thu.','5':'Fri.','6':'Sat.'}

// var setToDinner = false;

// function _verticalCenter(){
// 	var wh = $(window).height();
// 	var ch = $('#container').height();
// 	if (wh > ch){
// 		$('#container').css('top', (wh-ch)/2.618);
// 	}
// }

// $(document).ready(function(){
// 	init();
// 	events();
// });

// // register update-date timer
// var dateUpdater = setInterval(_updateDate,500);

// var _STATUS = 1;

// function changeStatus(){
// 	if(_STATUS == 2)
// 	{
// 		$('.w1').fadeOut(100);
// 		$('.w2').fadeIn(300);
// 		_STATUS = 1;			
// 	}else{
// 		$('.w1').fadeIn(300);
// 		$('.w2').fadeOut(100);	
// 		_STATUS = 2;	
// 	}
// }
// function init() {_updateDate(); _verticalCenter(); changeStatus();}
// function events(){

// 	// resize event
// 	$(window).resize(_verticalCenter);
// 	// change status event
// 	$('#event-title').click(changeStatus);
// 	// people expand event
// 	$('#people-total').click(_people_event_handler);

// 	$('#t1').click(function(){ 
// 		if(setToDinner)
// 		{
// 			setToDinner = false;
// 		}else{
// 			setToDinner = true;
// 		}
// 	});
// }

// function _people_event_handler()
// {
// 	var arrow = $('.people-arrow');
// 	var who = $('#people-who');

// 	var up = !$('#up').hasClass('hide');
// 	var down = !$('#down').hasClass('hide');

// 	if(up)
// 	{
// 		who.slideUp(300);
// 		arrow.toggleClass('hide');
// 	}else{
// 		who.slideDown(250);
// 		arrow.toggleClass('hide');
// 	}	
// }
// function _updateDate()
// {
// 	var date = new Date();

// 	sec = date.getSeconds() % 2 == 0 ? ":" : "&nbsp;";
// 	if (!setToDinner){
// 		min = date.getMinutes() < 10 ? "0"+date.getMinutes().toString() : date.getMinutes().toString();
// 		hr = date.getHours() < 10 ? "0"+date.getHours().toString() : date.getHours().toString();
// 		if( date.getHours() < 18 || date.getHours() >= 20 ){
// 			$('#event').fadeOut(400).addClass('hide');
// 		}
// 	}else{
// 		min = "00";
// 		hr = "18";
// 		$('#event').fadeIn(400);
// 	}
	
// 	$('.time-m').text(min);
// 	$('.time-h').text(hr);
// 	$('.time-s').html(sec);

// 	$('.date-m').text(month[date.getMonth()]);
// 	$('.date-d').text(date.getDate());
// 	$('.date-w').text(weekday[date.getDay()]);	
// }


