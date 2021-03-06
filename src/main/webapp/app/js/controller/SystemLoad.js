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

(function () {
    'use strict';

    var TIMEOUT = 60000;

    Ext.define('boxdata.controller.SystemLoad', {
        extend: 'Ext.app.Controller',

        views: [
            'ApplicationContainer',
            'SystemLoad',
            'JvmMemory'
        ],

        refs: [
            {
                ref: 'loadView',
                selector: 'boxdata-system-load-panel'
            },
            {
                ref: 'memoryView',
                selector: 'boxdata-jvm-mem-panel'
            }
        ],

        loadData: function () {
            var self = this;
            self.getLoadView().mask(boxdata.i18n.get('loading.data'));
            self.getMemoryView().mask(boxdata.i18n.get('loading.data'));
            if (!self.currentRequest) {
                self.currentRequest = Ext.Ajax.request({
                    url: 'rest/system-load',
                    callback: function () {
                        delete self.currentRequest;
                        self.getLoadView().unmask();
                        self.getMemoryView().unmask();
                    },
                    success: function (response) {
                        var text = response.responseText;
                        var json = Ext.JSON.decode(text);
                        self.setData(json);
                    }
                });
            }
        },

        setData: function (rawData) {
            var self = this;
            window.console.log('system-load -> ' + rawData.systemLoadDto.length + ' items');
            self.getLoadView().setData(rawData.systemLoadDto);
            self.getMemoryView().setData(rawData.systemLoadDto);
        },

        init: function () {
            var self = this;

            self.control({
                'boxdata-system-load-panel': {
                    render: function (panel) {
                        self.loadData();
                    },
                    refreshpanel: function () {
                        self.loadData();
                    }
                },
                'boxdata-jvm-mem-panel': {
                    refreshpanel: function () {
                        self.loadData();
                    }
                }
            });
        }
    });

}());
