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

Ext.define('test.I18N', {
    singleton: true,
    requires: ['boxdata.i18n'],
    constructor: function () {
        describe('I18N test', function () {
            it('should show the application name', function () {
                var str = boxdata.i18n.get('application.name');
                expect(str).toEqual('FaceID');
            });
            it('should show the parameterized message', function () {
                var str = boxdata.i18n.get('test.with.param', {
                    myParam: 'Yeah'
                });
                expect(str).toEqual('This is for test only. Yeah!');
            });
        });
    }
});


