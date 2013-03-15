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

    function getValueInGB(value) {
        return Ext.util.Format.number((value / 1024 / 1024), '0.00') + ' GB';
    }

    Ext.define('boxdata.view.DiskUsage', {
        title: boxdata.i18n.get('application.disk.usage'),
        extend: 'Ext.panel.Panel',
        alias: 'widget.boxdata-system-load-panel',
        requires: ['boxdata.view.ChartPanel'],
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
        items: [
            {
                xtype: 'boxdata-chart-panel',
                xAxis: {
                    type: 'datetime',
                    lineWidth: 1
                },
                yAxis: {
                    opposite: true,
                    lineWidth: 1,
                    min: 0,
                    labels: {
                        formatter: function () {
                            return getValueInGB(this.value);
                        }
                    },
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
                        return this.y;
                    }
                },

                addData: function (series, rec, key) {
                    var name = rec.get('path') + ' ' + key;
                    if (!series[name]) {
                        series[name] = {
                            data: []
                        };
                    }
                    var data = series[name].data;
                    data.push([rec.get('timestamp'), rec.get(key)]);
                },

                buildData: function (series, rec) {
                    if (!series.load) {
                        series.load = {
                            data: []
                        };
                    }
                    var data = series.load.data;
                    data.push([rec.get('timestamp'), rec.get('load')]);
                }
            }
        ],

        loadRemoteData: function (store, records) {
            var me = this;
            var chart = me.child('boxdata-chart-panel');
            chart.setData(records);
        },

        initComponent: function () {
            var me = this;
            me.store = Ext.data.StoreManager.lookup('SystemLoad');
            me.store.on('load', me.loadRemoteData, me);
            Ext.panel.Panel.prototype.initComponent.apply(me, arguments);
        }
    });

}());


