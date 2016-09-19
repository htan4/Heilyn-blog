require.config({
	//baseUrl: 
	paths: {
　　　　　　'jquery': 'https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min'
　　　　}
});
require(["jquery","common"],function($,c){
	new c.Common().sidebar();
	new c.Common().backToTop();
});