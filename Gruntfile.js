'use strict';

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({

    jshint: {
      dev: {
        src: ['Gruntfile.js', 'server.js', 'models/**/*.js', 'app/**/*.js', 'routes/**/*.js', 'test/**/*test.js']
      },
      options: {
        jshintrc: true
      }
    },

    webpack: {
      client: { //this can be any name
        entry: __dirname + '/app/js/client.js', //__dirname is a node global,
        output: {
          path: 'build/',
          file: 'bundle.js'
        }
      },
      test: {
        entry: __dirname + '/test/client/test.js',
        output: {
          path: 'test/client/',
          file: 'test_bundle.js'
        }
      },
      karma_test: {
        entry: __dirname + '/test/karma_tests/test_entry.js',
        output: {
          path: 'test/karma_tests/',
          file: 'bundle.js'
        }
      }
    },

    copy : {
      html: {
        cwd: 'app/',
        expand: true,
        flatten: false,
        src: '**/*.html',
        dest: 'build/',
        filter: 'isFile'
      }
    },

    clean: {
      dev: {
        src: 'build/'
      }
    }
  });

  grunt.registerTask('build:dev', ['webpack:client', 'copy:html']);
  grunt.registerTask('build:test', ['webpack:test', 'webpack:karma_test']);
  grunt.registerTask('build', ['build:dev', 'build:test']);
  grunt.registerTask('linter', ['jshint:dev']);
};
