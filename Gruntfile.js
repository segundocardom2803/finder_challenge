module.exports = function (grunt) {
	grunt.initConfig({
		//uglify
		uglify: {
			options: {
				mangle: false,
				compress: {
				drop_console: true
				}
			},
			js: {
				files: [{
					cwd: 'public/js/',
					expand: true,
					src: '*.js',
					dest: 'public/js/prod/'
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'public/css/',
					src: ['*.min.css'],
					dest: 'public/css/'
				}]
			}
		},
		jade: {
			debug: {
				files: {
					"index.html": "views/index.jade"
				}
			}
		},
		stylus: {
			compile: {
				files: {
					'public/css/main.min.css': 'public/css/main.styl'
				}
			}
		},
		watch: {
			jade: {
				files: ['views/*.jade'],
				tasks: ['compilejade']
			},
			stylus: {
				files: ['public/css/*.styl'],
				tasks: ['compilestylus']
			},
			css: {
				files: ['public/css/*.css'],
				tasks: ['mincss']
			},
			scripts: {
				files: ['public/js/*.js'],
				tasks: ['minjs']
			}
		},

	});		
	// loadNpmTasks
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Run Default task(s).
	grunt.registerTask('minjs', ['uglify']);
	grunt.registerTask('mincss', ['cssmin']);
	grunt.registerTask('compilejade', ['jade']);
	grunt.registerTask('compilestylus', ['stylus']);
	grunt.registerTask('watching', ['watch']);
};

