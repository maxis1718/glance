$( document ).ready(function() {
   

	$.get('/api/word/glance', function(data) {
		/*optional stuff to do after success */
		console.log( data );
	});



});