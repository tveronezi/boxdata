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

    Ext.define('boxdata.view.DeviceUsage', {
        title: boxdata.i18n.get('application.disk.usage'),
        extend: 'boxdata.ux.Chart',
        alias: 'widget.boxdata-device-usage-panel',

        statics: {
            MAX_PATH_LENGTH: 50
        },

        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        getSizeString: function (value) {
            var number = value / 1024 / 1024;
            if (number < 1000) {
                return Ext.util.Format.number(number, '0,000.00') + boxdata.i18n.get('megabyte');
            } else {
                return Ext.util.Format.number((number / 1024), '0,000.00') + boxdata.i18n.get('gigabyte');
            }
        },

        getPath: function (path) {
            if (path.length > boxdata.view.DeviceUsage.MAX_PATH_LENGTH) {
                var arr = path.split('\\');
                if (arr.length === 1) {
                    arr = path.split('/');
                }
                if (arr.length === 1) {
                    return Ext.String.ellipsis(path, boxdata.view.DeviceUsage.MAX_PATH_LENGTH);
                } else {
                    return this.getPath(path.substr(arr[0].length + 1));
                }
            } else {
                return path;
            }
        },

        yConfigs: {
            'disk-usage-pie': {
                type: 'pie',
                center: [80, 100],
                size: 100
            },
            'disk-usage-axis': {
                type: 'column',
                formatter: function (value) {
                    return this.getSizeString(value);
                },
                tooltip: function (value) {
                    return '<b>' + this.getPath(value.path) + '</b>: ' + this.getSizeString(value.size);
                }
            }
        },

        xConfigs: {
            'file-name-axis': {
                labels: false,
                type: 'category'
            }
        },

        tooltip: true,

        series: [
            {
                xId: 'file-name-axis',
                xField: 'path',
                yId: 'disk-usage-axis',
                yField: function (rec) {
                    if (!rec.isDiskUsage) {
                        return rec.size;
                    }
                    return null;
                },
                seriesName: 'file-usage'
            },
            {
                yId: 'disk-usage-pie',
                yField: function (rec) {
                    if (rec.isDiskUsage) {
                        return rec.free;
                    }
                    return null;
                },
                xField: function (rec) {
                    return 'free';
                },
                seriesName: 'disk-usage'
            },
            {
                yId: 'disk-usage-pie',
                yField: function (rec) {
                    if (rec.isDiskUsage) {
                        return rec.total - rec.free;
                    }
                    return null;
                },
                xField: function (rec) {
                    return 'used';
                },
                seriesName: 'disk-usage'
            }
        ]
    });

}());




