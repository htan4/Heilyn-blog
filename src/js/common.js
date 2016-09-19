define(['jquery'],function($){
	function Common(){
		this.cfg = {}
	}
	Common.prototype = {
		sidebar:function(cfg){
			'use strict';
			var CFG = $.extend(this.cfg,cfg);
			var sidebar = $("#sidebar"),
				mask = $(".overlay"),
				sidebarTrigger = $("#sidebarTrigger");
				
			function showSideBar(){
				mask.fadeIn();
				sidebar.css("right",0);
			}
			
			function hideSideBar(){
				mask.fadeOut();
				sidebar.css("right",-sidebar.width());
			}
				
			sidebarTrigger.on("click",showSideBar);
			
			mask.on("click",hideSideBar);
		},

		backToTop:function(){
			var backToTop = $(".backToTop");
			backToTop.on("click",function(){
				$("html,body").animate({
					scrollTop:0
				},800);
			});
			// $(window).on("scroll",function(){
				// if($(window).scrollTop() > $(window).height()){
					// backToTop.fadeIn();
				// }else{
					// backToTop.fadeOut();
				// }
			// })
			// $(window).trigger("scroll");
		}
	}
	return{
		Common:Common
	}
});