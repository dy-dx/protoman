'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        , require: [
            'coffee-script'
          , 'test/support/common'
          ]
        }
      , src: [
          'test/*.coffee'
        , 'test/*.js'
        ]
      }
    }
  , watch: {
      scripts: {
        files: [
          '**/*.js'
        , '**/*.coffee'
        ]
      , tasks: [
          'mochaTest'
        ]
      }
    }
  });

  
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', 'mochaTest');
};
