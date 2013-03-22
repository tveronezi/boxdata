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

    Ext.define('boxdata.view.DiskUsage', {
        title: boxdata.i18n.get('application.disk.usage'),
        extend: 'boxdata.ux.ChartPanel',
        alias: 'widget.boxdata-disk-usage-panel',
        layout: 'fit',
        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        store: 'DiskUsage',
        legendPosition: 'bottom',

        leftRenderer: function(v) {
            return Ext.util.Format.number(v / 1024 / 1024 / 1024, '0.00') + ' ' + boxdata.i18n.get('gigabyte');
        },

        getSeriesValues: function (rec) {
            var me = this;
            var path = rec.get('path');
            var timestamp = new Date(rec.get('timestamp'));
            return [
                {
                    name: path + ' total',
                    xValue: timestamp,
                    type: 'line',
                    left: rec.get('total')
                },
                {
                    name: path + ' free',
                    xValue: timestamp,
                    type: 'line',
                    left: rec.get('free')
                },
                {
                    name: path + ' usable',
                    xValue: timestamp,
                    type: 'line',
                    left: rec.get('usable')
                }
            ];
        }
    });

}());




