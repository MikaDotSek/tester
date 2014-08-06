module.exports = function(grunt) {

  // configure the tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    
    clean: {// empty build (and test) folders
      build: {
        src: [ 'build/**/*' ]
      },
    },

    copy: {// copy src to build (and test) folders
      build: {
        cwd: 'src',
        src: [ '**', '!**/*.styl', '!**/*.coffee', '!**/*.jade' ],
        dest: 'build',
        expand: true
      },
      html: {
        cwd: 'src',
        src: [ '*.html', '!**/*.styl', '!**/*.coffee', '!**/*.jade' ],
        dest: 'build',
        expand: true
      },
      js: {
        cwd: 'src/js',
        src: [ '**/*.js'],
        dest: 'build/js/',
        expand: true
      },
    },

    connect: { // toimii http://localhost:8000/
      server: {
        options: {
          //port: 9001,
          /*port: 8080,
          hostname: '127.0.0.1:8080',
          base: 'www-root',*/
          keepalive: 'true'
        }
      }
    },
   
    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss', require('node-bourbon').includePaths]
      },
      dist: {
        options: {
          outputStyle: 'nested',//, //'nested', 'expanded', 'compact', 'compressed'
          sourceComments: 'map',
          sourceMap: 'source-comments.css'

          /*sourceComments: {
            options: {
              sourceComments: 'map'
            },
            files: {
              'source-comments.css': 'app.scss'
            }
          },
          sourceMap: {
            options: {
              sourceComments: 'map',
              sourceMap: 'source-map.css.map'
            },
            files: {
              'source-map.css': 'app.scss'
            }
          }*/
        },


        files: {
          'build/css/app.css': 'src/scss/app.scss',
          'build/css/jadeApp.css': 'src/scss/jadeApp.scss',
          //'build/app.html': 'src/app.html',
          /*'css/alko-app.css': 'scss/alko-app.scss'*/
        }        
      }
    },

    jade: {
      build: {
        options: {
          pretty: true
        },
        src: "src/views/jade.jade",
        dest: "build/jade.html"
      }
    },

    coffee: {
      build: {
        options: {
          join: true
        },
        src: [
          "src/scripts/**/*.coffee",
          "!src/scripts/app.coffee",
          "src/scripts/app.coffee"
        ],
        dest: "build/js/coffee.js"
      }
    },

    cssmin: {
      combine: {
        files: {
          'build/css/app.css': ['src/css/equstom_screen.css', 'build/css/app.css' ]
        }
      },
      minify: {
        expand: true,
        cwd: 'build/css/',
        src: ['app.css', '!*.min.css'],
        dest: 'build/css/',
        ext: '.min.css'
      }
    },

    htmlmin: {
      options: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeRedundantAttributes: true,
        removeOptionalTags: true
      },
      compress: {
        src: "src/index.html",
        dest: "build/index.html"
      }
    },

    uglify: {
      compress: {
        src: [ 'src/**/*.js', '!src/**/jquery*', '!src/**/*.coffee', '!src/**/*.jade' ],
        dest: "build/js/app.js"
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: ['src/scss/**/*.scss'],
        tasks: ['sass', 'cssmin']//['sass', 'autoshot']
      },

      scripts: {
        files: "src/scripts/**/*.coffee",
        tasks: "scripts"
      },

      html: {
        files: [ 'src/*.html', '!src/**/*.styl', '!src/**/*.coffee', '!src/**/*.jade' ],
        tasks: [  'copy:html', 'htmlmin' ]
      },

      views: {
        files: "src/views/**/*.jade",
        tasks: "views"
      },

      js: {
        files: [ 'src/**/*.js', '!src/**/jquery*', '!src/**/*.coffee', '!src/**/*.jade' ],
        tasks: [ 'js' ]
      }
    },

    'ftp-deploy': {
      build: {
        auth: {
          host: 'grid1.sigmatic.fi',
          port: 21,
          authKey: 'key1' // .ftppass file
        },
        src: 'css',
        dest: '/public_html/eqsign/test/'
      }
    },

    autoshot: {
      default_options: {
        options: {
          path: 'shots/', //'./test/screenshot',
          /*remote: {
            files: [
              { src: "http://getbootstrap.com", dest: "bootstrap.jpg" },
              { src: "http://www.google.com", dest: "google.png", delay: "3000" }
            ]
          },*/
          local: {
            path: '', //'./test/src',
            port: 8000,
            files: [
              { src: "theme_1.html", dest: "theme_1.jpg" },
              { src: "theme_2.html", dest: "theme_2.jpg" },
              { src: "theme_3.html", dest: "theme_3.jpg" }
            ]
          },
          viewport: [
            '320x480', '1024x768', '1920x1080'
          ]
        },
      },
    },
   

    
  });

  // load the tasks

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-ftp-deploy');

  // define the tasks
  grunt.registerTask('build', ['sass']);//['sass', 'autoshot']); //grunt.registerTask('build', ['sass', 'ftp-deploy']);
  grunt.registerTask('default', ['build','watch']);
  grunt.registerTask('html',   ['copy:html', 'htmlmin']);
  grunt.registerTask('scripts', ['coffee']);
  grunt.registerTask('styles',  ['cssmin']);
  /*grunt.registerTask('scripts',  ['uglify']);*/
  grunt.registerTask('views',   ['jade']);// grunt.registerTask('views',   ['jade',   'htmlmin']);
  grunt.registerTask('js',  ['copy:js']);
}