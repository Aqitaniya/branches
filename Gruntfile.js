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

        clean: {
            transformed: ['transformed'],
            cjs: ['cjs']
        },

        copy: {
            cjs: {
                files: [
                  {
                    expand: true,
                    cwd: 'transformed/',
                    src: ['**/*.js'],
                    dest: 'dist/'
                  },
                  {
                    src: ['**/*'],
                    dest: 'dist/',
                    cwd: 'tools/commonjs',
                    expand: true
                  }
                ]
            }
        },

        less: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'components/styles',
                        src: ['**/*.less'],
                        dest: 'dist/styles/',
                        ext: '.css'
                    }
                ]
            }
        },

        watch: {
            js: {
                files: [ 'components/**/*.js' ],
                tasks: [ 'build' ]
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

        react: {
            src: {
                files: [
                    {
                        expand: true,
                        cwd: 'components',
                        src: [
                            '**/*.js',
                            '**/*.jsx'
                        ],
                        dest: 'transformed',
                        ext: '.js'
                    }
                ]
            }
        }
    });

    // Load npm tasks.
    grunt.util._.each([
        'browserify',
        'contrib-clean',
        'contrib-watch',
        'contrib-copy',
        'contrib-less',
        'gh-pages',
        'react'
    ], function (tasks) {
        grunt.loadNpmTasks('grunt-' + tasks);
    });

    grunt.registerTask('ghpages', [ 'gh-pages' ]);

    grunt.registerTask('build', [
        'clean:cjs',
        'react:src',
        'copy:cjs',
        'less',
        'clean:transformed'
    ]);
};
