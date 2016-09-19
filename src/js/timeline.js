define(['jquery'],function($){
	function Timeline(){
		this.cfg = {
			
		}
	}
	
	Timeline.prototype = {
		timeSlide:function(cfg){
			'use strict';
			var CFG = $.extend(this.cfg,cfg);
			var g = function(id){return document.getElementById(id);}
			var getBodyW = function(){ return document.body.offsetWidth;}
			var getBodyH = function(){ return document.body.offsetHeight;}

			var list={};
			
			for(var i=data.length-1;i>=0;i--){
				var date=new Date(data[i].date);
				var year=date.getFullYear();
				var month = date.getMonth()+1;
				var lunar = GetLunarDateString(date);
				if( !list[year] ){ list[year] = {};}
				if( !list[year][month] ){ list[year][month] = [];}
				
				var item=data[i];
				item.lunar = lunar[0]+'<br>&nbsp;&nbsp;&nbsp;'+lunar[1];
				item.like_format = item.like < 10000 ? item.like : ( item.like / 10000 ).toFixed(1) + '万';
				list[year][month].push(item);
			}
			
			//替换程序1
			var html_scrubber=[];
			var html_content_list=[];
			
			var tpl_scrubber_year = g('tpl_scrubber_year').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			var tpl_scrubber_month = g('tpl_scrubber_month').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');

			var tpl_year = g('tpl_content_year').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			var tpl_month = g('tpl_content_month').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			var tpl_item = g('tpl_content_item').innerHTML.replace(/^\s*/,'').replace(/\s*$/,'');
			
			for(year in list){
				var scrubber_month = [];
				
				for(month in list[year]){
					scrubber_month.unshift(tpl_scrubber_month.replace(/\{month\}/g,month).replace(/\{year\}/g,year));
				}
				html_scrubber.unshift(tpl_scrubber_year.replace(/\{year\}/g,year).replace(/\{list\}/g,scrubber_month.join('')));
			}
			
			g('scrubber').innerHTML = '<a href="javascript:;" class="now">现在</a>'+html_scrubber.join('')+'<a href="javascript:;" class="birth">出生</a>';


			for(var year in list){
				var html_year = tpl_year.replace(/\{year\}/g,year);				
				var html_month=[];
				for(var month in list[year]){
					var html_item = [];
					var isFirst_at_month = true;
					for(var i in list[year][month]){
						var item_data = list[year][month][i];
						var item_html = tpl_item
						.replace(/\{date\}/g,item_data.date)
						.replace(/\{lunar\}/g,item_data.lunar)
						.replace(/\{intro\}/g,item_data.intro)
						.replace(/\{media\}/g,item_data.media)
						.replace(/\{like\}/g,item_data.like)
						.replace(/\{leftOrRight\}/,i%2?'right':'left')
						.replace(/\{isFirst\}/,isFirst_at_month?'c_item_first':'')
						.replace(/\{like_format\}/g,item_data.like_format)
						.replace(/\{comment\}/g,item_data.comment);
						html_item.push(item_html);
						isFirst_at_month = false;
					}
					
					html_month.unshift(tpl_month.replace(/\{year\}/g,year).replace(/\{month\}/g,month).replace(/\{list\}/g,html_item.join('')));
				}
				html_year=html_year.replace(/\{list\}/g,html_month.join(''));
				html_content_list.unshift(html_year);
			}
			g('content').innerHTML = html_content_list.join('')+'<div class="c_year" id="content_month_0_0">出生</div>';


			// ------- 脚本处理

			//	年份点击展开
			var expandScrubber=function(year,elem){
				var years  = document.getElementsByClassName('s_year');
				var months = document.getElementsByClassName('s_month');
				var year_months = document.getElementsByClassName(year+'_month');
				//  清理所有年份的 cur 样式
				for (var i = years.length - 1; i >= 0; i--) {
					years[i].className = 's_year';
				};
				//  隐藏所有的月份
				for (var i = months.length - 1; i >= 0; i--) {
					months[i].style.display = 'none';
				};
				//  展现当前年份下所有的月份
				for (var i = year_months.length - 1; i >= 0; i--) {
					year_months[i].style.display = 'block';
				};
				//  设置当前年份的 cur 样式
				elem.className = 's_year cur';
				//elem.className = ' cur'; //不可行
			}

			//  高亮月份
			var highlightMonth = function( year , month , elem ){  //elem=this;
				var months = document.getElementsByClassName(year+'_month');  //所有月份的共同特征是：{year}_month
				for (var i = months.length - 1; i >= 0; i--) {  //如果months=3, i=2, months[2];2,1,0 
					months[i].className = months[i].className.replace('cur','');
				};
				elem.className = elem.className+' cur';
			}

			//  根据窗口滚动条更新时序年份状态
			var updateScrubberOnTop = function( top ){
				var years  = g('content').getElementsByClassName('c_year');
				var tops = [];
				for (var i = 0; i <years.length ; i++) {
					tops.push( years[i].offsetTop );
				};
				for(var i = 1; i <tops.length ; i++){
					if( top > tops[i-1] && top < tops[i] ){
						var year = years[i-1].innerHTML;
						expandScrubber(year,g('scrubber_year_'+year));
						return ;
					}
				}
			}


			//  根据窗口滚动条更新时序月份状态
			var updateMonthOnTop = function( top ){
				var months  = g('content').getElementsByClassName('c_month'); //如果共有7个月
				//alert(months.length);
				var tops = [];
				for (var i = 0; i <months.length ; i++) {//i<7
					tops.push( months[i].offsetTop );
				};
				//alert(tops.length);
				for(var i = 1; i <=tops.length ; i++){//tops.lenght=7
					var info  = months[i-1].id.split('_');
					var year  = info[2];
					var month = info[3];
					if(i==tops.length && top > tops[i-1]){
						highlightMonth( year , month , g('scrubber_month_'+year+month) );
					}else if( top > tops[i-1] && top < tops[i] ){//if top>tops[0] and <tops[1],
						highlightMonth( year , month , g('scrubber_month_'+year+month) );//scrubber_month_{year}{month}是id;
					}
				}
			}

			function scrollPositionTo(position){
				//offsetTop(本身顶部的高度)和scrollTop(滚动条顶部的高度)是有区别的
				$('html, body').animate({
					scrollTop: position
				}, 500);
			}
			
			//showYear event
			$(".s_year").click(function(){
				var $year = $(this);
				showYear($year.html(),this);
			});
			
			var showYear = function(year,elem){
				expandScrubber(year,elem);
				var temp = $("#"+"content_year_"+year);
				var top = temp.offset().top;
				scrollPositionTo(top);
			};
			
			//http://jingyan.baidu.com/article/a378c96098c048b32828300b.html  html5新特性data_*自定义属性使用
			//showMonth event
			$(".s_month").click(function(){
				var $year = $(this).data("year");
				var $month = $(this).data("month");
				showMonth($year,$month,this);
			});
			
			var showMonth = function(year, month, elem){
				highlightMonth(year, month, elem);
				var temp = $("#"+"content_month_"+year+"_"+month);
				var top = temp.offset().top;
				scrollPositionTo(top);
			}
			
			$(".now").click(function(){
				scrollPositionTo(0);
			});
			
			$(".birth").click(function(){
				scrollPositionTo(getBodyH());
			});
			
			window.onscroll=function(){
				var top = document.body.scrollTop;
				if(top>200){
					g('scrubber').style.position='fixed';
					g('scrubber').style.left = (getBodyW()-1080)/2+ 'px';
					g('scrubber').style.top  = '5rem';	
				}else{
					g('scrubber').style.position = '';
					g('scrubber').style.left =     '';
					g('scrubber').style.top  =     '';
				}
				updateScrubberOnTop( top );
				updateMonthOnTop( top );
			}
			window.onresize = function(){
				window.onscroll();
			}

		}
	
	}
	return{
		Timeline:Timeline
	}
});