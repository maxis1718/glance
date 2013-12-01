/* ------------ common keyCode ------------ */
var BACKSPACE = 8;
var SPACE = 32;
var LEFT_ARROW =37;
var RIGHT_ARROW = 39;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var TAB = 9;
var CHAR_A = 65;
var CHAR_Z = 90;
var ENTER = 13;

// Get current cursor position in a input-field
// source: http://stackoverflow.com/a/2897510
// usage: $('#input-field-id').getCursorPosition()
(function($) {
    $.fn.getCursorPosition = function() {
        var input = this.get(0);
        if (!input) return; // No (input) element found
        if ('selectionStart' in input) {
                return input.selectionStart;
        } else if (document.selection) {
            // IE
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
})(jQuery);

function _verticalCenter()
{
    var wh = $(window).height();
    var ch = $('#container').height();
    if (wh > ch)
    {
        $('#container').css('top', (wh-ch)/2.618);
    }
    
}

