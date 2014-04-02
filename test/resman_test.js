'use strict';

var grunt = require('grunt');
var tmpDir = "./tmp/";

exports.resman = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    main: function(test) {
        test.expect(1);

        var HtmlProcessor = require('../lib/htmlprocessor');
        var processor = new HtmlProcessor("./test/fixtures/index.html");
        var result = false;

        try {
            var updatedHtml = processor.ProcessWithResourceFile("./test/fixtures/resman-resource.json", tmpDir + "test.html");
            console.log("\r\nUpdated: \r\n" + updatedHtml);

            result = true;
        } catch(ex) {
            console.log(ex);
        }

        test.ok(result);

        test.done();
    }
};
