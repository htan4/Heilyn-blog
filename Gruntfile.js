module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify:{
			options:{
				stripBanners: false
			},
			build:{
				files:[
					{src:'src/js/common.js',dest:'dest/js/common.js'},
					{src:'src/js/main.js',dest:'dest/js/main.js'},
					{src:'src/js/main-me.js',dest:'dest/js/main-me.js'},
					{src:'src/js/data.js',dest:'dest/js/data.js'},
					{src:'src/js/GetLunarDay.js',dest:'dest/js/GetLunarDay.js'},
					{src:'src/js/timeline.js',dest:'dest/js/timeline.js'},
				]				
			}
		},
		cssmin:{
			build:{
				files:[
					{src:'src/css/common.css',dest:'dest/css/common.css'},
					{src:'src/css/homepage.css',dest:'dest/css/homepage.css'},
					{src:'src/css/article.css',dest:'dest/css/article.css'},
					{src:'src/css/me.css',dest:'dest/css/me.css'},
				]				
			}
		},
		watch: {
			build: {
				files: ['src/js/*.js', 'src/css/*.css'],
				tasks: ['cssmin', 'uglify'],
				options: {spawn: false}
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default',['uglify','cssmin','watch']);
};