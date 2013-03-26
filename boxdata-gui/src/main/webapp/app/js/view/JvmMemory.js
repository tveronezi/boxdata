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

    Ext.define('boxdata.view.JvmMemory', {
        title: boxdata.i18n.get('application.system.jvm.memory'),
        extend: 'boxdata.ux.chart.LineAndStackedBarByTime',
        alias: 'widget.boxdata-jvm-mem-panel',
        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        store: 'SystemLoad',

        getLineValue: function (rec) {
            var timestamp = rec.get('timestamp');
            var value = rec.get('load');
            if (value < 0) {
                return [];
            }
            return [
                {
                    timestamp: timestamp,
                    value: value,
                    seriesName: 'system load'
                }
            ];
        },

        pushStackedValue: function(array, rec, timestamp, columnName) {
            var value = rec.get(columnName);
            array.push({
                timestamp: timestamp,
                value: value,
                seriesName: columnName
            });
        },

        getColumnValue: function (rec) {
            var result = [];
            var timestamp = rec.get('timestamp');
            this.pushStackedValue(result, rec, timestamp, 'heapCommitted');
            this.pushStackedValue(result, rec, timestamp, 'heapUsed');
            this.pushStackedValue(result, rec, timestamp, 'nonHeapCommitted');
            this.pushStackedValue(result, rec, timestamp, 'nonHeapUsed');

            return result;
        },

        columnLabelsFormatter: function (value) {
            var number = Ext.util.Format.number((value / 1024 / 1024), '0,000.00');
            return number + ' ' + boxdata.i18n.get('megabyte');
        }
    });

}());


