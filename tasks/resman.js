/*
 * grunt-resman
 * https://github.com/syple/grunt-resman
 *
 * Copyright (c) 2014 Syple Technologies.
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var path = require('path');
var FileProcessor = require("../lib/htmlprocessor");

module.exports = function(grunt) {

    grunt.registerMultiTask('resman', 'A HTML resource manager.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options();

        if(!options.resourceFileSrc) {
            grunt.log.error('The resource file location was not specified, exiting.');

            return false;
        } else {
            this.files.forEach(function(f) {

                // Iterate over HTML file sources.
                f.src.filter(function(filepath) {

                    if (!grunt.file.exists(filepath)) {
                        grunt.log.warn('Source file "' + filepath + '" not found.');
                        return false;
                    } else if (!grunt.file.match(filepath, "*.html")) {
                        grunt.log.warn('Source file "' + filepath + '" is not of the HTML format.');
                        return false;
                    } else {
                        return true;
                    }

                }).forEach(function(filepath) {

                    // Process each individual file.
                    try {
                        var processor = new FileProcessor(filepath);
                        var destination = f.dest || filepath;

                        processor.ProcessWithResourceFile(options.resourceFileSrc, destination, options);
                    } catch(ex) {
                        grunt.log.error(util.format("An error occurred when processing the '%s' file: %s", filepath, ex));
                    }

                });

            });

            return true;
        }
    });
};
