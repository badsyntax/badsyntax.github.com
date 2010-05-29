
(function( $ ){

	$.fn.toggleNav = function(options){

		return this.each(function(){

			options = $.extend({
				speed: 200,
				cssClass: 'toggle'
			}, options || {});

			$(this).find("li").each(function(){
                
				if (!$("ul:first", this).length || !$("ul:first", this).children().length) return true;

				var self = this;

				$('<span />')
				.addClass(options.cssClass)
				.html($("ul:first", this).is(":visible") ? '-' : '+')
				.click(function(){
					var span = this;
					$("ul:first", self).animate({
						height: 'toggle',
						opacity: 'toggle'
					}, options.speed, function(){
						$(span).html($(this).is(':visible') ? '-' : '+');
					});
					return false;
				})
				.appendTo($(this).find("a:first"));
			});
		});
	};

})( jQuery );
