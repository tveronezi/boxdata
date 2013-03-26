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

    Ext.define('boxdata.ux.chart.CategoryStackedBar', {
        extend: 'boxdata.ux.chart.Panel',

        /**
         * This method should return an object or an array of objects with the following format:
         * {seriesName: <STRING>, value: <NUMBER>, category: <STRING>}
         * @param rec
         */
        getValue: function (rec) {
            throw 'You should override the getValue method';
        },

        dataLabelsFormatter: undefined,

        axisLabelsFormatter: undefined,

        getChartData: function () {
            var me = this;
            var categories = [];
            var seriesMap = {};
            var min = 0;
            var max = 0;
            me.store.each(function (record) {
                var newValues = me.getValue(record);
                if (!Ext.isArray(newValues)) {
                    newValues = [newValues];
                }

                Ext.Array.forEach(newValues, function (newValue) {
                    var seriesValues = seriesMap[newValue.seriesName];
                    if (!seriesValues) {
                        seriesValues = {};
                        seriesMap[newValue.seriesName] = seriesValues;
                    }

                    seriesValues[newValue.category] = newValue.value;
                    min = Math.min(min, newValue.value);
                    max = Math.max(max, newValue.value);

                    Ext.Array.include(categories, newValue.category);
                });
            });

            var series = [];
            Ext.Object.each(seriesMap, function (seriesName, seriesObject) {
                var data = [];
                Ext.Array.forEach(categories, function (categoryName) {
                    data.push(seriesObject[categoryName]);
                });
                series.push({
                    name: seriesName,
                    data: data
                });
            });

            return {
                categories: categories,
                series: series,
                min: min,
                max: max
            };
        },

        getChartConfig: function () {
            var me = this;
            var data = me.getChartData();

            var columnConfig = {
                stacking: 'normal'
            };

            if (me.dataLabelsFormatter) {
                columnConfig.dataLabels = {
                    enabled: true,
                    formatter: function () {
                        var formatter = me.dataLabelsFormatter;
                        return formatter.apply(me, [this.y]);
                    }
                };
            }

            var yAxis = {
                min: data.min,
                max: data.max,
                title: {
                    text: ''
                }
            };

            if (me.axisLabelsFormatter) {
                yAxis.labels = {
                    formatter: function () {
                        var formatter = me.axisLabelsFormatter;
                        return formatter.apply(me, [this.value]);
                    }
                };
            }

            return {
                chart: {
                    type: 'column'
                },
                title: {
                    text: ''
                },
                xAxis: {
                    categories: data.categories
                },
                yAxis: yAxis,
                plotOptions: {
                    column: columnConfig
                },
                series: data.series
            };

        }
    });
}());