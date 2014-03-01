$(document).ready(function(){
	draw();

});


BNC = {"a": 0.060322609948221494, "c": 0.08698529698023592, "b": 0.0644960355052622, "e": 0.03652266445191347, "d": 0.054355753383770876, "g": 0.038121439416550953, "f": 0.04081807446242489, "i": 0.030257335288545142, "h": 0.0420405144110357, "k": 0.019924992538185027, "j": 0.011186233924655134, "m": 0.06388611323790862, "l": 0.03820968348927445, "o": 0.02372727390700632, "n": 0.02411399057864753, "q": 0.00482227903294878, "p": 0.07040838837773654, "s": 0.10648204622432163, "r": 0.050657288571094874, "u": 0.022413994471768384, "t": 0.051918659728260166, "w": 0.03097366952594765, "v": 0.016543168221752162, "y": 0.0051804461516500346, "x": 0.0015001492362994588, "z": 0.004131898934582593}
BNC_100 = noramlize_to_100(BNC);

function noramlize_to_100() {
	var _max = 0;
	var BNC_100 = {};
	$.each(BNC, function(alphabet, prob){ if(prob > _max) _max = prob; });
	$.each(BNC, function(alphabet, prob){ BNC_100[alphabet] = prob/_max*100; });
	return BNC_100;
}

function draw() {
	var visual_wrap = $('#visual-wrap');
	$.each(BNC_100, function(alphabet, prob_100){

		var li = $('<li/>').addClass('alphabet-wrap').appendTo(visual_wrap);

		var bar_wrap = $('<div/>').addClass('bar-wrap').appendTo(li);

		var bar = $('<div/>').addClass('bar').css({'height':prob_100.toString()+'%'}).appendTo(bar_wrap);
		var label = $('<div/>').addClass('label').text(alphabet.toUpperCase()).appendTo(li);

	});
}