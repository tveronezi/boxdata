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

    Ext.define('boxdata.ux.ChartPanel', {
        extend: 'Ext.panel.Panel',

        layout: 'fit',

        items: [
            {
                xtype: 'panel',
                padding: '5 5 5 5'
            }
        ],

        bottomRenderer: undefined,
        leftRenderer: undefined,
        rightRenderer: undefined,

        getNormalizedData: function (params) {
            var me = this;
            var data = [];
            var fields = [];
            var typesMap = {};
            Ext.Array.forEach(params.records, function (rec) {
                var newData = params.getSeriesValues.call(params.scope || {}, rec);
                var names = Ext.Array.map(newData, function (item) {
                    var name = item.name || '';
                    typesMap[name] = item.type || 'line';
                    return name;
                });
                fields = Ext.Array.union(fields, names);
                Ext.Array.push(data, newData);
            });
            Ext.Array.remove(fields, '');

            var storeData = {};
            var sampleValues = {
                xValue: null,
                left: null,
                right: null
            };
            var leftFields = [];
            var rightFields = [];

            Ext.Array.forEach(data, function (item) {
                var value = storeData[item.xValue];
                if (!value) {
                    value = {
                        xValue: item.xValue
                    };
                    sampleValues.xValue = item.xValue;
                    storeData[item.xValue] = value;
                }

                var seriesValue = null;
                if (Ext.isDefined(item.left)) {
                    seriesValue = item.left;
                    sampleValues.left = seriesValue;
                    Ext.Array.include(leftFields, item.name);
                } else if (Ext.isDefined(item.right)) {
                    seriesValue = item.right;
                    sampleValues.right = seriesValue;
                    Ext.Array.include(rightFields, item.name);
                } else {
                    throw 'Unknown series position and value.';
                }
                value[item.name] = seriesValue;
            });

            var axes = [];

            function setAxisValue(position, axisFields, sample) {
                if (Ext.isEmpty(axisFields)) {
                    return; // no-op
                }

                var axis = {
                    position: position,
                    fields: axisFields
                };

                if (Ext.isNumber(sample)) {
                    axis.type = 'linear';
                } else if (Ext.isString(sample)) {
                    axis.type = 'category';
                } else if (Ext.isDate(sample)) {
                    axis.type = 'datetime';
                } else {
                    throw 'Unknown xAxis type. sample: ' + sample;
                }

                axes.push(axis);
            }

            setAxisValue('bottom', ['xValue'], sampleValues.xValue);
            setAxisValue('left', leftFields, sampleValues.left);
            setAxisValue('right', rightFields, sampleValues.right);

            var series = [];

            function setSeriesValue(seriesFields, position) {
                if (Ext.isEmpty(seriesFields)) {
                    return; // no-op
                }

                Ext.Array.forEach(seriesFields, function (name) {
                    series.push({
                        type: typesMap[name],
                        axis: position, //left or right
                        xField: 'xValue',
                        yField: name
                    });
                });
            }

            setSeriesValue(leftFields, 'left');
            setSeriesValue(rightFields, 'right');

            storeData = Ext.Object.getValues(storeData);
            var store = Ext.create('Ext.data.JsonStore', {
                fields: Ext.Array.union(fields, ['xValue']),
                data: storeData
            });

            return {
                store: store,
                axes: axes,
                series: series
            }
        },

        putSeries: function (seriesMap, rec) {
            var xValue = rec.get('xValue');
            rec.fields.each(function (field) {
                if (field.name === 'xValue') {
                    return; // no-op
                }
                if (field.name === 'id') {
                    return; // no-op
                }

                var series = seriesMap[field.name];
                if (!series) {
                    series = {
                        name: field.name,
                        data: []
                    };
                    seriesMap[field.name] = series;
                }
                var seriesData = series.data;
                seriesData.push([xValue, rec.get(field.name)]);
            });
        },

        getHighChartsConfig: function (data) {
            var me = this;

            var xAxis = null;
            var yAxis = [];

            function putAxis(cfg) {
                var value = {
                    type: cfg.type,
                    lineWidth: 1,
                    title: {
                        text: ''
                    }
                };

                var renderer = me[cfg.position + 'Renderer'];
                if (Ext.isDefined(renderer)) {
                    value.labels = {
                        formatter: function () {
                            // calling our custom renderer (if any)
                            return renderer(this.value);
                        }
                    }
                }

                if (cfg.position === 'right' || cfg.position === 'left') {
                    if (cfg.position === 'right') {
                        value.opposite = true;
                    }
                    yAxis.push(value);
                } else { // bottom
                    xAxis = value;
                }
            }

            Ext.Array.forEach(data.axes, function (axis) {
                putAxis(axis);
            });

            var seriesMap = {};
            data.store.each(function (rec) {
                me.putSeries(seriesMap, rec);
            });

            var container = me.child('panel');
            var result = {
                legend: {
                    enabled: false
                },
                credits: {
                    enabled: false
                },
                chart: {
                    renderTo: container.id
                },
                title: {
                    text: ''
                },
                xAxis: xAxis,
                yAxis: yAxis,
                series: Ext.Object.getValues(seriesMap)
            };

            if (Ext.isDefined(me.legendPosition)) {
                result.legend.enabled = true;
                if (me.legendPosition === 'bottom') {
                    result.legend.verticalAlign = 'bottom';
                } else if (me.legendPosition === 'left') {
                    result.legend.align = 'left';
                    result.legend.verticalAlign = 'middle';
                    result.legend.layout = 'vertical';
                } else if (me.legendPosition === 'right') {
                    result.legend.align = 'right';
                    result.legend.verticalAlign = 'middle';
                    result.legend.layout = 'vertical';
                } else {
                    throw 'Invalid legend position. Value: ' + me.legendPosition;
                }
            }

            return result;
        },

        showChart: function (params) {
            var me = this;
            var data = me.getNormalizedData(params);
            var config = me.getHighChartsConfig(data);
            var container = me.child('panel');
            container.removeAll(true);
            me.chart = new Highcharts.Chart(config);
        },

        listeners: {
            render: function () {
                var me = this;
                if (!Ext.isDefined(me.store)) {
                    return; // no-op
                }

                if (Ext.isString(me.store)) {
                    me.store = Ext.data.StoreManager.lookup(me.store);
                }

                me.store.on('load', function (thisStore, records) {
                    me.showChart({
                        records: records,
                        getSeriesValues: me.getSeriesValues,
                        scope: me
                    });
                });
            }
        }
    });
}());