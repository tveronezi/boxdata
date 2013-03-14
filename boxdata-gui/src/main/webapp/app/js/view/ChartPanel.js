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
                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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
                series: [
                    {
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    },
                    {
                        name: 'New York',
                        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    },
                    {
                        name: 'Berlin',
                        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                    },
                    {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }
                ]
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


