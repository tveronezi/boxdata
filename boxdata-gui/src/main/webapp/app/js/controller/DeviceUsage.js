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

    Ext.define('boxdata.controller.DeviceUsage', {
        extend: 'Ext.app.Controller',

        views: [
            'ApplicationContainer',
            'DeviceUsage'
        ],

        refs: [
            {
                ref: 'myView',
                selector: 'boxdata-device-usage-panel'
            }
        ],

        buildDiskUsage: function (list) {
            var data = {
                isDiskUsage: true,
                free: 0,
                total: 0
            };
            Ext.Array.each(list, function(item) {
                data.free += item.free;
                data.total += item.total;
            });
            return data;
        },

        setData: function (rawData) {
            var self = this;
            var data = [];
            if (Ext.isDefined(rawData.deviceUsageDto)) {
                if (Ext.isDefined(rawData.deviceUsageDto.diskUsageList)) {
                    Ext.Array.push(data, self.buildDiskUsage(rawData.deviceUsageDto.diskUsageList));
                }

                if (Ext.isDefined(rawData.deviceUsageDto.fileUsageList)) {
                    Ext.Array.push(data, rawData.deviceUsageDto.fileUsageList);
                }
            }
            self.getMyView().setSeries(data);
        },

        loadData: function () {
            var self = this;
            if (!self.currentRequest) {
                self.currentRequest = Ext.Ajax.request({
                    url: 'rest/device-usage',
                    callback: function () {
                        delete self.currentRequest;
                    },
                    success: function (response) {
                        var text = response.responseText;
                        var json = Ext.JSON.decode(text);
                        self.setData(json);
                    }
                });
            }
        },

        init: function () {
            var self = this;

            self.control({
                'boxdata-device-usage-panel': {
                    render: function () {
                        self.loadData();
                    },
                    refreshpanel: function () {
                        self.loadData();
                    }
                }
            });
        }
    });

}());
