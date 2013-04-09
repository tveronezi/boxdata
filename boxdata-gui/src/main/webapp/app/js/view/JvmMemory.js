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
        extend: 'boxdata.ux.Chart',
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

        statics: {
            tooltipTemplate: (function () {
                var arr = [
                    '<b>heapCommitted</b>: {heapCommitted} <br/>',
                    '<b>heapInit</b>: {heapInit} <br/>',
                    '<b>heapMax</b>: {heapMax} <br/>',
                    '<b>heapUsed</b>: {heapUsed} <br/>',
                    '<b>load</b>: {load} <br/>',
                    '<b>nonHeapCommitted</b>: {nonHeapCommitted} <br/>',
                    '<b>nonHeapInit</b>: {nonHeapInit} <br/>',
                    '<b>nonHeapMax</b>: {nonHeapMax} <br/>',
                    '<b>nonHeapUsed</b>: {nonHeapUsed} <br/>',
                    '<b>timestamp</b>: {timestamp} <br/>',
                    '<b>used-mem</b>: {usedmem}'
                ];
                return new Ext.Template(arr.join(''), {
                    compiled: true
                });
            }())
        },

        legend: 'bottom',

        xConfigs: {
            'datetime-axis': {
                type: 'datetime'
            }
        },

        yConfigs: {
            'value-axis': {
                type: 'area'
            }
        },

        charts: [
            {
                xId: 'datetime-axis',
                yId: 'value-axis',
                xField: 'timestamp',
                yField: 'heapCommitted',
                seriesName: 'heapCommitted'
            },
            {
                xId: 'datetime-axis',
                yId: 'value-axis',
                xField: 'timestamp',
                yField: 'heapUsed',
                seriesName: 'heapUsed'
            },
            {
                xId: 'datetime-axis',
                yId: 'value-axis',
                xField: 'timestamp',
                yField: 'nonHeapCommitted',
                seriesName: 'nonHeapCommitted'
            },
            {
                xId: 'datetime-axis',
                yId: 'value-axis',
                xField: 'timestamp',
                yField: 'nonHeapUsed',
                seriesName: 'nonHeapUsed'
            },
            {
                xId: 'datetime-axis',
                yId: 'value-axis',
                xField: 'timestamp',
                yField: function (row) {
                    var value = row.load;
                    if (value < 0) {
                        return null;
                    }
                    return value;
                },
                seriesName: 'load'
            }
        ],

        tooltip: function (records) {
            var first = records[0];
            var template = boxdata.view.JvmMemory.tooltipTemplate;
            var output = template.apply({
                'heapCommitted': first.heapCommitted,
                'heapInit': first.heapInit,
                'heapMax': first.heapMax,
                'heapUsed': first.heapUsed,
                'load': first.load,
                'nonHeapCommitted': first.nonHeapCommitted,
                'nonHeapInit': first.nonHeapInit,
                'nonHeapMax': first.nonHeapMax,
                'nonHeapUsed': first.nonHeapUsed,
                'timestamp': first.timestamp,
                'usedmem': first['used-mem']
            });
            return output;
        }

    });

}());


