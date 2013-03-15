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

    Ext.define('boxdata.view.MemUsage', {
        title: boxdata.i18n.get('application.mem.usage'),
        extend: 'Ext.panel.Panel',
        alias: 'widget.boxdata-mem-usage-panel',
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
                legendPosition: 'bottom',
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            color: '#000000',
                            connectorColor: '#000000',
                            formatter: function () {
                                return '<b>' + this.point.name + '</b>';
                            }
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage}%</b>',
                    percentageDecimals: 1
                },

                buildData: function (series, rec) {
                    if (!series.pie) {
                        series.pie = {
                            data: [],
                            type: 'pie'
                        };
                    }
                    var used = rec.total - rec.free;
                    var data = series.pie.data;
                    data.push(['used', used]);
                    data.push(['free', rec.free]);
                }
            }
        ],

        loadData: function (records) {
            var me = this;
            var chart = me.child('boxdata-chart-panel');
            chart.setData(records);

        },
        initComponent: function () {
            var me = this;
            Ext.panel.Panel.prototype.initComponent.apply(me, arguments);
        }
    });

}());


