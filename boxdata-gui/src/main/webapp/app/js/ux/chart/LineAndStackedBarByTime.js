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

    Ext.define('boxdata.ux.chart.LineAndStackedBarByTime', {
        extend: 'boxdata.ux.chart.Panel',

        columnLabelsFormatter: undefined,
        lineLabelsFormatter: undefined,
        lineAxisAtRight: false,
        columnAxisAtRight: true,

        /**
         * This method should return an object or an array of objects with the following format:
         * [{timestamp: 0, value: 0, seriesName: 'a'}, ..., {timestamp: 0, value: 0, seriesName: 'a'}]
         * @param rec
         */
        getLineValue: function (rec) {
            throw 'You should override the getLineValue method';
        },

        /**
         * This method should return an array of objects with the following format:
         * [{timestamp: 0, value: 0, seriesName: 'a'}, ..., {timestamp: 0, value: 0, seriesName: 'a'}]
         * @param rec
         */
        getColumnValue: function (rec) {
            throw 'You should override the getColumnValue method';
        },

        putValues: function (seriesMap, getMethodName, axisId, type, record) {
            var me = this;
            var newValues = me[getMethodName](record);
            Ext.Array.forEach(newValues, function (item) {
                var seriesValue = seriesMap[item.seriesName];
                if (!seriesValue) {
                    seriesValue = {
                        name: item.seriesName,
                        yAxis: axisId,
                        type: type,
                        data: []
                    };
                    seriesMap[item.seriesName] = seriesValue;
                }
                var data = seriesValue.data;
                data.push([item.timestamp, item.value]);
            });
        },

        getChartData: function () {
            var me = this;

            var seriesMap = {};

            me.store.each(function (record) {
                me.putValues(seriesMap, 'getColumnValue', 'columnAxis', 'column', record);
                me.putValues(seriesMap, 'getLineValue', 'lineAxis', 'line', record);
            });

            return {
                series: Ext.Object.getValues(seriesMap)
            };
        },

        getChartConfig: function () {
            var me = this;
            var data = me.getChartData();

            function getOppositeValue(propertyName) {
                var property = me[propertyName];
                if (Ext.isFunction(property)) {
                    property = property({
                        chartData: data
                    });
                }
                return property;
            }

            var lineAxis = {
                id: 'lineAxis',
                title: {
                    text: '',
                    style: {
                        color: '#89A54E'
                    }
                },
                opposite: getOppositeValue('lineAxisAtRight')
            };

            var columnAxis = {
                id: 'columnAxis',
                title: {
                    text: '',
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: getOppositeValue('columnAxisAtRight')
            };

            function setLabelsConfig(labelFormatterFunctionName, config) {
                if (me[labelFormatterFunctionName]) {
                    config.labels = {
                        formatter: function () {
                            var customFormatter = me[labelFormatterFunctionName];
                            return customFormatter.apply(me, [this.value]);
                        }
                    };
                }
            }

            setLabelsConfig('columnLabelsFormatter', columnAxis);
            setLabelsConfig('lineLabelsFormatter', lineAxis);

            return {
                chart: {
                },
                title: {
                    text: ''
                },
                xAxis: [
                    {
                        type: 'datetime'
                    }
                ],
                yAxis: [
                    lineAxis,
                    columnAxis
                ],
                series: data.series,
                plotOptions: {
                    column: {
                        stacking: 'normal'
                    }
                }
            };

        }
    });
}());