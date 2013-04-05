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

        charts: [
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'area',
                yField: 'heapCommitted',
                seriesName: 'heapCommitted'
            },
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'area',
                yField: 'heapUsed',
                seriesName: 'heapUsed'
            },
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'area',
                yField: 'nonHeapCommitted',
                seriesName: 'nonHeapCommitted'
            },
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'area',
                yField: 'nonHeapUsed',
                seriesName: 'nonHeapUsed'
            },
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'line',
                yField: function (row) {
                    var value = row.get('load');
                    if (value < 0) {
                        return undefined;
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
                'heapCommitted': first.get('heapCommitted'),
                'heapInit': first.get('heapInit'),
                'heapMax': first.get('heapMax'),
                'heapUsed': first.get('heapUsed'),
                'load': first.get('load'),
                'nonHeapCommitted': first.get('nonHeapCommitted'),
                'nonHeapInit': first.get('nonHeapInit'),
                'nonHeapMax': first.get('nonHeapMax'),
                'nonHeapUsed': first.get('nonHeapUsed'),
                'timestamp': first.get('timestamp'),
                'usedmem': first.get('used-mem')
            });
            return output;
        },

        beforeInit: function () {
            var me = this;
            var store = Ext.getStore('SystemLoad');
            store.on('load', function (thisStore, records) {
                me.setSeries(records);
            });
        }
    });

}());


