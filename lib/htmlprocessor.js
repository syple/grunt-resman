'use strict';

var util = require('util');
var grunt = require('grunt');
var path = require('path');
var regexpQuote = require('regexp-quote');

/**
 * Replaces the contents of the provided string between the two indices (Start, End).
 *
 * @param {string} string The string.
 * @param {Number} start The starting index.
 * @param {Number} end The ending index.
 * @param {string} replacement The string to replace with.
 * @returns {string}
 */
var stringReplaceBetween = function(string, start, end, replacement) {
    return string.substring(0, start) + replacement + string.substring(end);
};

var HtmlProcessor = module.exports = function(filePath) {

    if (!filePath) {
        throw new Error('No file path given');
    }

    if(!grunt.file.exists(filePath)) {
        throw new Error(util.format('No file exists at the specified path: "%s"', filePath));
    }

    // Read file source.
    this.fileContents = grunt.file.read(filePath);
};

/**
 * Processes the file with the provided resource.
 *
 * @param {string} resourceFileLocation The location of the resource file.
 * @param {string} fileDest The destination of where the updated file should be saved to.
 * @param {Object} options The resman options object.
 * @returns {string} The updated file.
 */
HtmlProcessor.prototype.ProcessWithResourceFile = function(resourceFileLocation, fileDest, options) {
    if (!resourceFileLocation) {
        throw new Error('No resource file location given');
    }

    if(!grunt.file.exists(resourceFileLocation)) {
        throw new Error(util.format('No resource file exists at the specified path: "%s"', resourceFileLocation));
    }

    var self = this;
    var resourceFile = grunt.file.readJSON(resourceFileLocation);

    // Iterate over the resource blocks
    resourceFile.resourceBlocks.forEach(function(block) {
        var html = "\n";
        var htmlFormat = "";
        var endIdentifier = block.endIdentifier || options.endIdentifier;

        switch(block.type) {
            case "css":
                htmlFormat += '%s<link rel="stylesheet" href="%s" />\n';
                break;
            default:
                htmlFormat += '%s<script type="text/javascript" src="%s"></script>\n';
                break;
        }

        // Get all information related to the opening comment block.
        var beginRegexPattern = util.format("(\\s*)<\\!--\\s*%s\\s*-->", regexpQuote(block.beginIdentifier));
        var beginRegex = new RegExp(beginRegexPattern);
        var beginIndex = self.fileContents.search(beginRegex);

        if(beginIndex >= 0) {
            var beginMatch = self.fileContents.match(beginRegex);
            var beginLength = beginMatch[0].length;

            // Maintain the indent format based on the opening comment block.
            var indent = beginMatch[1].replace(/\n/g, "");

            // Get all information related to the closing comment block.
            var endRegexPattern = util.format("\\s*<\\!--\\s*%s\\s*-->", regexpQuote(endIdentifier));
            var endRegex = new RegExp(endRegexPattern);
            var endIndex = self.fileContents.substring(beginIndex).search(endRegex) + beginIndex;

            if(endIndex >= 0) {
                // Generate the html to replace with.
                block.resources.forEach(function(resource) {
                    html += util.format(htmlFormat, indent, resource);
                });

                // Remove the last line break.
                html = html.replace(/\n$/, "");

                // Update the html with the new resources between the blocks.
                self.fileContents = stringReplaceBetween(self.fileContents, beginIndex + beginLength, endIndex, html);
            }
        }
    });

    grunt.file.write(fileDest, self.fileContents);

    // Print a success message.
    grunt.log.writeln('File "' + fileDest + '" updated.');

    return self.fileContents;
};