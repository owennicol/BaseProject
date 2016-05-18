/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
var webpack = require("webpack");
//plugin for packing injecting js file into html file, and moving it to dist folder
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HTMLWebpackPluginConfig = new HtmlWebpackPlugin({
    template: __dirname + '/src/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'dist/css/site.css': 'src/sass/site.scss'
                }
            }
        },
        watch: {
            files: ['src/**/*.scss', 'src/**/*.js'],
            tasks: ['dev']
        },
        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: [{
                    expand: true,
                    cwd: 'dist/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
            }
        },
        uglify: {
            my_target: {
                files: [
                    {
                        expand: true,
                        cwd: 'src/js',
                        src: '*.js',
                        dest: 'dist/js'
                    },
                    {
                        expand: true,
                        cwd: 'dist',
                        src: '*.js',
                        dest: 'dist'
                    }
                ]
            }
        },
        clean: ["dist"],
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: ['**/*', '!sass', '!sass/*', '!main.js'],
                    dest: 'dist'
                }]
            }
        },
        webpack: {
            a: {
                entry: "./src/main",
                output: {
                    path: "dist",
                    filename: "bundle.js"
                },

                plugins: [
                    //call html webpack plugin
                    HTMLWebpackPluginConfig
                ],
                module: {
                    loaders: [
                        //run all js files through babel loader for es6 transpilation
                        {
                            test: /\.js$/,
                            exclude: /node_modules/,
                            loader: "babel-loader"
                        }
                    ]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-webpack');


    grunt.registerTask('default', ['clean', 'sass', 'cssmin', 'copy', 'webpack', 'uglify']);

    grunt.registerTask('dev', ['sass', 'cssmin', 'webpack', 'uglify']);

};
