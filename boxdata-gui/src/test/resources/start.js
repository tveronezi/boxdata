/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

Ext.Loader.setConfig({
    enabled: true,
    disableCaching: false,
    paths: {
        'boxdata': 'src/main/webapp/app/js',
        'test': 'src/test/javascript/test'
    }
});

// all classes definitions
var classDefinitions = {

};

// Wrapping it because we don't the "tests" variable available outside this file.
(function () {

    // Don't forget to put a new entry here whenever you add a new test file.
    var tests = [
        'test.I18N',
        'test.PortletContainerController'
    ];

    // EXTJS testing TRICK!
    // We dont need to start the entire application to run our tests. There are unit tests, so we only target units
    // of code. ExtJs uses config objects to define classes, so we can call the functions defined in these
    // config objects directly. We replace the original "Ext.define" function by our own, where we can keep
    // tracking of the definitions we created.
    // See an example of usage in "test/javascript/test/PortletContainerController.js".
    var originalDefineFn = Ext.define;
    Ext.define = function (className, data, createdFn) {
        // keep tracking of all the classes definitions (test purposes only)
        classDefinitions[className] = data;
        return originalDefineFn(className, data, createdFn);
    };

    Ext.onReady(function () {
        // Load all the test modules before starting.
        Ext.require(tests, function () {
            jasmine.getEnv().addReporter(
                new jasmine.HtmlReporter()
            );
            // Run tests!
            jasmine.getEnv().execute();
        });
    });

})();
