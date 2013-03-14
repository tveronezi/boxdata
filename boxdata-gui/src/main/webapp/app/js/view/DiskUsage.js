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
        extend: 'Ext.panel.Panel',
        alias: 'widget.boxdata-disk-usage-panel',
        requires: ['boxdata.view.ChartPanel'],
        layout: 'fit',
        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refresh');
                }
            }
        ],
        items: [
            {
                xtype: 'boxdata-chart-panel',
                xAxis: {
                    type: 'datetime'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    plotLines: [
                        {
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }
                    ]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            this.x + ': ' + this.y + '°C';
                    }
                },

                addData: function (series, rec, key) {
                    var name = rec.get('path') + ' ' + key;
                    if (!series[name]) {
                        series[name] = [];
                    }
                    var data = series[name];
                    data.push([rec.get('timestamp'), rec.get(key)]);
                },

                buildData: function (series, rec) {
                    this.addData(series, rec, 'free');
                    this.addData(series, rec, 'total');
                    this.addData(series, rec, 'usable');
                }
            }
        ],

        refs: [
            {
                ref: 'chart',
                selector: 'boxdata-chart-panel'
            }
        ],

        loadRemoteData: function (store, records) {
            var me = this;
            var chart = me.child('boxdata-chart-panel');
            chart.setData(records);
        },

        initComponent: function () {
            var me = this;
            me.store = Ext.data.StoreManager.lookup('DiskUsage');
            me.store.on('load', me.loadRemoteData, me);
            Ext.panel.Panel.prototype.initComponent.apply(me, arguments);
        }
    });

}());


