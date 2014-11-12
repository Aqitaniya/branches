/* global module: false, require: false, __dirname: false, process: false */

// Database connect
var argv = require('optimist').argv;
var port = argv.port || 9999;

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        '<%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        watch: {
            js: {
                files: [ 'components/**/*.js' ],
                tasks: [ 'browserify' ]
            }
        },

        browserify: {
            options: {
                debug: true,
                transform: [['reactify', {es6: true}]],
                extensions: ['.jsx']
            },
            dist: {
                files: { 'dist/scripts.js': 'components/main.js'}
            }
        },

        'gh-pages': {
            options: {
                base: 'app'
            },
            src: ['**']
        },

        concurrent: {
            prod: {
                tasks: [
                    'browserify',
                    'watch'
                ],
                options: {
                    logConcurrentOutput: true
                }
            },
            dev: {
                tasks: [
                    'browserify',
                    'watch'
                ],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // Load npm tasks.
    grunt.util._.each([
        'contrib-watch',
        'concurrent',
        'gh-pages',
        'browserify'
    ], function (tasks) {
        grunt.loadNpmTasks('grunt-' + tasks);
    });

    grunt.registerTask('default', ['concurrent:dev']);

    grunt.registerTask('ghpages', [ 'gh-pages' ]);

};
