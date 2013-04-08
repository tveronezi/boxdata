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

        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        yConfigs: {
            'disk-usage-axis': {
                type: 'column',
                formatter: function (value) {
                    var number = Ext.util.Format.number((value / 1024 / 1024 / 1024), '0,000.00');
                    return number + boxdata.i18n.get('gigabyte');
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

        charts: [
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
            }
        ]
    });

}());




