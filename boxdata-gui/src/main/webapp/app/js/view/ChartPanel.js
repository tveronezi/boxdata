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

    Ext.define('boxdata.view.ChartPanel', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.boxdata-chart-panel',

        border: false,

        // right or bottom
        legendPosition: 'right',

        // replace it by your own builder
        buildData: function (series, record) {
            return null;
        },

        setData: function (records) {
            var me = this;
            var series = {};
            Ext.each(records, function (rec) {
                me.buildData(series, rec);
            });

            var deleteMe = Ext.Array.map(me.chart.series, function(item) {
                return item;
            });
            Ext.each(deleteMe, function(item) {
                item.remove();
            });

            Ext.Object.each(series, function (key, value) {
                me.chart.addSeries({
                    name: key,
                    data: value
                }, true);
            });
        },

        showChart: function () {
            var me = this;

            var chartConfig = {
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: me.id,
                    type: 'line'
                },
                title: {
                    text: ''
                },
                xAxis: me.xAxis,
                yAxis: me.yAxis,
                tooltip: me.tooltip,
                series: []
            };

            if (me.legendPosition) {
                if (me.legendPosition === 'bottom') {
                    chartConfig.legend = {
                        verticalAlign: 'bottom',
                        backgroundColor: '#FFFFFF'
                    };

                } else if (me.legendPosition === 'right') {
                    chartConfig.legend = {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'middle',
                        backgroundColor: '#FFFFFF'
                    };

                } else {
                    throw 'Invalid legend position. Value: ' + me.legendPosition;
                }
            }

            me.chart = new Highcharts.Chart(chartConfig);

            if (me.legendPosition) {
                var legendEl = Ext.get(me.el.query('.highcharts-legend')[0]);
                var rectangle = Ext.get(legendEl.child('rect'));
                rectangle.on('click', function () {
                    me.toggleLegend()
                });
            }
        },

        toggleLegend: function () {
            var me = this;
            var legendObject = me.chart.legend;
            if (!legendObject) {
                return; //no-op
            }

            var legendEl = Ext.get(me.el.query('.highcharts-legend')[0]);
            var width = legendObject.legendWidth;
            var height = legendObject.legendHeight;

            if (legendEl.isVisible()) {
                if (legendObject.options.align === 'right') {
                    me.chart.setSize(me.chart.chartWidth + width, me.chart.chartHeight);
                } else {
                    me.chart.setSize(me.chart.chartWidth, me.chart.chartHeight + height);
                }
                legendEl.hide();
            } else {
                if (legendObject.options.align === 'right') {
                    me.chart.setSize(me.chart.chartWidth - width, me.chart.chartHeight);
                } else {
                    me.chart.setSize(me.chart.chartWidth, me.chart.chartHeight - height);
                }
                legendEl.show();
            }
        },

        initComponent: function () {
            var me = this;
            me.on('resize', me.showChart, me, {
                single: true
            });
            Ext.panel.Panel.prototype.initComponent.apply(me, arguments);
        }
    });

}());


