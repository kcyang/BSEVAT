'use strict';
//var path = require('path');

module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
//    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        // take all the js files and minify them into app.min.js
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                globals: { angular : true, serverConfig : true }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js,*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
            routes: {
                src: ['routes/**/*.js']
            },
            angualrfile: {
                src: ['public/javascripts/controllers/*.js','public/javascripts/*.js','public/javascripts/services/*.js']
            }

        },
        uglify: {
            build: {
                files: {
                    'dist/javascripts/app.min.js': ['public/javascripts/**/*.js', 'public/javascripts/*.js']
                }
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jshint:lib']
            },
            test: {
                files: '<%= jshint.test.src %>',
                tasks: ['jshint:test']
            },
            routes: {
                files: '<%= jshint.routes.src %>',
                tasks: ['jshint:routes']
            },
            angualrfile: {
                files: '<%= jshint.angualrfile.src %>',
                tasks: ['jshint:angualrfile']
            }
        },

        nodemon: {
            dev: {
                script: 'bin/www'
            }
        },
        // watch 와 demon 을 동시에 진행하기.
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });



    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-concurrent');
    // Default task.
    grunt.option('force', true);
    grunt.registerTask('default', ['jshint',/*'uglify',*/'concurrent']);



};

