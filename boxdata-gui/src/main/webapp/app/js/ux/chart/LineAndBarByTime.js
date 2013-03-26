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

    Ext.define('boxdata.ux.chart.LineAndBarByTime', {
        extend: 'boxdata.ux.chart.Panel',


        // rename it with the name of your series
        columnSeriesName: 'column',

        columnLabelsFormatter: undefined,

        // rename it with the name of your series
        areaSeriesName: 'area',

        areaLabelsFormatter: undefined,

        /**
         * This method should return an array of arrays with the following format:
         * [[<date>, <number>], [<date>, <number>], ..., [<date>, <number>]]
         * @param rec
         */
        getAreaValue: function (rec) {
            throw 'You should override the getAreaValue method';
        },

        /**
         * This method should return an array of arrays with the following format:
         * [[<date>, <number>], [<date>, <number>], ..., [<date>, <number>]]
         * @param rec
         */
        getColumnValue: function (rec) {
            throw 'You should override the getColumnValue method';
        },

        putValues: function (array, getMethodName, record) {
            var me = this;
            var newValues = me[getMethodName](record);
            if (!Ext.isEmpty(newValues)) {
                array.push(newValues);
            }
        },

        getChartData: function () {
            var me = this;

            var columnValues = [];
            var areaValues = [];

            me.store.each(function (record) {
                me.putValues(columnValues, 'getColumnValue', record);
                me.putValues(areaValues, 'getAreaValue', record);
            });

            return {
                columnValues: columnValues,
                areaValues: areaValues
            };
        },

        getChartConfig: function () {
            var me = this;
            var data = me.getChartData();

            var areaAxis = {
                title: {
                    text: '',
                    style: {
                        color: '#89A54E'
                    }
                }
            };

            var columnAxis = {
                title: {
                    text: '',
                    style: {
                        color: '#4572A7'
                    }
                },
                opposite: true
            };

            function setLabelsConfig(labelFormatterFunctionName, config) {
                if (me[labelFormatterFunctionName]) {
                    config.labels = {
                        formatter: function () {
                            return me[labelFormatterFunctionName].call(me, this.value);
                        }
                    };
                }
            }

            setLabelsConfig('columnLabelsFormatter', columnAxis);
            setLabelsConfig('areaLabelsFormatter', areaAxis);

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
                    areaAxis,
                    columnAxis
                ],
                series: [
                    {
                        name: me.columnSeriesName,
                        color: '#4572A7',
                        type: 'column',
                        yAxis: 1,
                        data: data.columnValues
                    },
                    {
                        name: me.areaSeriesName,
                        color: '#89A54E',
                        type: 'area',
                        data: data.areaValues
                    }
                ]
            };

        }
    });
}());