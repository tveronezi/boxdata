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

Ext.define('test.PortletContainerController', {
    singleton: true,
    requires: ['boxdata.controller.PortletContainer'],
    constructor: function () {
        describe('PortletContainerController test', function () {
            var oExtCreateFn;

            beforeEach(function () {
                oExtCreateFn = Ext.create;
            });

            afterEach(function () {
                Ext.create = oExtCreateFn;
            });

            it('should save the settings', function () {
                var saveExecuted = false;
                var data = {
                    xtype: 'my-xtype',
                    x: 1,
                    y: 2,
                    width: 3,
                    height: 4
                };
                Ext.create = function (name, args) {
                    var obj = oExtCreateFn(name, args);
                    if (name === 'boxdata.model.PanelSettings') {
                        obj.save = function () {
                            saveExecuted = true;
                            expect(this.get('portletXtype')).toBe(data.xtype);
                            expect(this.get('x')).toBe(data.x);
                            expect(this.get('y')).toBe(data.y);
                            expect(this.get('width')).toBe(data.width);
                            expect(this.get('height')).toBe(data.height);
                        };
                    }
                    return obj;
                };

                var definition = classDefinitions['boxdata.controller.PortletContainer'];
                var settings = definition.saveSettings(data);
                expect(saveExecuted).toBe(true);
                expect(settings).not.toBe(null);

            });

            it('should show the portlet', function () {
                // placeholder
            });
        });
    }
});


