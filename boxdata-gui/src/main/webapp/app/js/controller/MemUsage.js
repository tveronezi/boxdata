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

    var TIMEOUT = 5000;

    Ext.define('boxdata.controller.MemUsage', {
        extend: 'Ext.app.Controller',

        views: [
            'ApplicationContainer',
            'MemUsage'
        ],

        loadUsage: function (panel) {
            var me = this;
            Ext.Ajax.request({
                url: 'rest/mem-usage',
                success: function (response) {
                    var usage = Ext.JSON.decode(response.responseText);
                    panel.loadData([usage.memoryUsageDto]);
                },
                callback: function () {
                    window.setTimeout(function () {
                        me.loadUsage(panel);
                    }, TIMEOUT);
                }
            });
        },

        init: function () {
            var self = this;

            self.control({
                'boxdata-mem-usage-panel': {
                    render: function (panel) {
                        self.loadUsage(panel);
                    }
                }
            });
        }
    });

}());
