'use strict';
//var path = require('path');

module.exports = function(grunt) {
    // Show elapsed time at the end
    require('time-grunt')(grunt);
    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({

        nodemon: {
            dev: {
                script: 'bin/www'
            }
        },

        // take all the js files and minify them into app.min.js
        uglify: {
            build: {
                files: {
                    'dist/javascripts/app.min.js': ['public/javascripts/**/*.js', 'public/javascripts/*.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js']
            },
            test: {
                src: ['test/**/*.js']
            },
            routes: {
                src: ['routes/**/*.js']
            },
            angualrfile: {
                src: ['public/controllers/*.js','public/*.js','public/services/*.js']
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

        // watch 와 demon 을 동시에 진행하기.
        concurrent: {
            options: {
                logConcurrentOutput: true
            },
            tasks: ['nodemon', 'watch']
        }
    });

    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    // Default task.
    grunt.registerTask('default', ['nodemon','jshint','uglify','concurrent']);


};

