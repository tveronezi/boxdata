(function () {
    'use strict';

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    Ext.define('boxdata.ux.Chart', {
        extend: 'Ext.panel.Panel',
        layout: 'fit',
        requires: ['Ext.util.DelayedTask'],
        items: [
            {
                xtype: 'panel',
                padding: '5 5 5 5'
            }
        ],

        // configurable values
        xConfigs: {},
        yConfigs: {},
        series: [],
        seriesData: [],
        legend: undefined,  // 'bottom' or 'right'

        setData: function (data) {
            this.seriesData = data;
            this.showChart();
        },

        // private
        getRowFieldValue: function (field, row) {
            if (!field) {
                return null;
            }
            if (Ext.isFunction(field)) {
                return field.call(this, row);
            }
            if (row.isModel) {
                // this is a extjs record object
                return row.get(field);
            } else {
                return row[field];
            }
        },

        // private
        getSeriesName: function (chart, row) {
            if (Ext.isFunction(chart.seriesName)) {
                return chart.seriesName.call(this, row);
            }
            return chart.seriesName;
        },

        // private
        prepareData: function (axes) {
            var me = this;
            var data;
            if (Ext.isFunction(me.seriesData)) {
                data = me.seriesData();
            } else {
                data = me.seriesData;
            }

            var xAxesMap = {};
            Ext.Array.forEach(axes.xAxis, function (axis) {
                xAxesMap[axis.id] = axis;
            });

            // build the categories array
            Ext.Array.forEach(data, function (dataItem) {
                Ext.Array.forEach(me.series, function (seriesItem) {
                    var axisId = seriesItem.xId;
                    if (!axisId) {
                        return; // pies have no xId
                    }
                    if (me.xConfigs[axisId].type !== 'category') {
                        return; // no-op
                    }
                    var x = me.getRowFieldValue(seriesItem.xField, dataItem);
                    if (x) {
                        Ext.Array.include(xAxesMap[axisId].categories, x);
                    }
                });
            });

            var seriesMap = {};
            Ext.Array.forEach(data, function (dataItem) {
                Ext.Array.forEach(me.series, function (seriesItem) {
                    var seriesName = me.getSeriesName(seriesItem, dataItem);
                    var entry = {
                        ux: {
                            yId: seriesItem.yId,
                            xId: seriesItem.xId,
                            xField: seriesItem.xField,
                            yField: seriesItem.yField,
                            dataItem: dataItem,
                            seriesName: seriesName
                        },

                        x: me.getRowFieldValue(seriesItem.xField, dataItem),
                        y: me.getRowFieldValue(seriesItem.yField, dataItem),

                        marker: {
                            enabled: (seriesItem.marker ? true : false)
                        }
                    };

                    if (Ext.isEmpty(entry.x) || Ext.isEmpty(entry.y)) {
                        // There is a undefined value. Skip this line.
                        return;
                    }

                    var yConfig = Ext.valueFrom(me.yConfigs[seriesItem.yId], {});
                    var xAxisId = seriesItem.xId;
                    if (!seriesMap[seriesName]) {
                        var dataArray = [];
                        seriesMap[seriesName] = {
                            type: yConfig.type,
                            data: dataArray,
                            name: seriesName
                        };

                        if (yConfig.type === 'pie') {
                            if (Ext.isDefined(yConfig.center)) {
                                seriesMap[seriesName].center = yConfig.center;
                            }
                            if (Ext.isDefined(yConfig.size)) {
                                seriesMap[seriesName].size = yConfig.size;
                            }
                        }

                        if (!Ext.isEmpty(xAxisId)) {
                            seriesMap[seriesName].xAxis = xAxisId;
                            seriesMap[seriesName].yAxis = seriesItem.yId;

                            (function () {
                                var categories = Ext.valueFrom(xAxesMap[xAxisId].categories, []);
                                Ext.Array.forEach(categories, function () {
                                    dataArray.push(null);
                                });
                            }());
                        }
                    }

                    var data = seriesMap[seriesName].data;
                    if (!Ext.isEmpty(xAxisId) && me.xConfigs[xAxisId].type === 'category') {
                        (function () {
                            var categories = xAxesMap[xAxisId].categories;
                            var categoryIndex = categories.indexOf(entry.x);
                            delete entry.x;
                            data[categoryIndex] = entry;
                        }());

                    } else if (yConfig.type === 'pie') {
                        entry.name = entry.x;
                        delete entry.x;
                        data.push(entry);
                    } else {
                        data.push(entry);
                    }
                });
            });

            var result = Ext.Object.getValues(seriesMap);
            var removeMe = [];
            Ext.Array.forEach(result, function (series) {
                if (Ext.isEmpty(series.data)) {
                    removeMe.push(series);
                }
            });
            return Ext.Array.difference(result, removeMe);
        },

        // private
        prepareAxes: function () {
            var me = this;
            var xMap = {};
            var yMap = {};
            Ext.Object.each(me.xConfigs, function (xId, config) {
                var xType = Ext.valueFrom(config.type, 'datetime');
                if (xType === 'category') {
                    xMap[xId] = {
                        title: '',
                        categories: [],
                        id: xId
                    };

                } else {
                    xMap[xId] = {
                        title: '',
                        type: xType,
                        id: xId
                    };
                }
                if (Ext.isDefined(config.labels)) {
                    xMap[xId].labels = {
                        enabled: (config.labels ? true : false)
                    };
                    if(!xMap[xId].labels.enabled) {
                        xMap[xId].minorTickLength = 0;
                        xMap[xId].tickLength = 0;
                    }
                }
            });

            Ext.Object.each(me.yConfigs, function (yId, config) {
                var yType = Ext.valueFrom(config.type, 'line');
                yMap[yId] = {
                    title: '',
                    type: yType,
                    id: yId
                };
                if (config.formatter) {
                    yMap[yId].labels = {
                        formatter: function () {
                            return config.formatter.call(me, this.value);
                        }
                    };
                }

                if (config.right) {
                    yMap[yId].opposite = true;
                }
            });

            return {
                xAxis: Ext.Object.getValues(xMap),
                yAxis: Ext.Object.getValues(yMap)
            };
        },

        // private
        getChartConfig: function () {
            var me = this;
            var axes = me.prepareAxes();
            var data = me.prepareData(axes);

            return {
                chart: {
                },
                title: {
                    text: ''
                },
                xAxis: axes.xAxis,
                yAxis: axes.yAxis,
                series: data,
                credits: {
                    enabled: false
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    enabled: true,
                    shared: false,
                    useHTML: true,
                    formatter: function () {
                        var pOptions = this.point.options;
                        var tooltipFormatter = me.yConfigs[pOptions.ux.yId].tooltip;
                        if (!Ext.isDefined(tooltipFormatter)) {
                            return false;
                        }
                        return tooltipFormatter.call(me, pOptions.ux);
                    }
                },
                plotOptions: {
                    series: {
                        turboThreshold: 10000
                    },
                    column: {
                        stacking: 'normal'
                    },
                    area: {
                        stacking: 'normal'
                    }
                }
            };

        },

        // private
        showChart: function (params) {
            var me = this;

            if (params && params.delay) {
                if (me.showChartTask) {
                    me.showChartTask.cancel();
                } else {
                    me.showChartTask = new Ext.util.DelayedTask(function () {
                        me.showChart();
                    });
                }
                me.showChartTask.delay(params.delay);
                return;
            }

            if (!me.rendered) {
                return; // wait until it is rendered.
            }

            var container = me.child('panel');
            container.removeAll(true); // remove all the children, if any.

            // prepare HighChart config object.
            var config = me.getChartConfig();
            if (Ext.isEmpty(config.series)) {
                return; // nothing to show.
            }

            config.chart = config.chart || {};
            config.chart.renderTo = container.id;

            if (me.legend) {
                config.legend.enabled = true;
                if (me.legend === 'bottom') {
                    // nothing special to do. Apply defaults.

                } else if (me.legend === 'right') {
                    config.legend.layout = 'vertical';
                    config.legend.verticalAlign = 'middle';
                    config.legend.align = 'right';

                } else {
                    throw 'Invalid legend position. "' + me.legend + '"';
                }
            }

            // removing auxiliary 'pie' axis
            var removeMe = [];
            Ext.Array.each(config.yAxis, function (axis) {
                if (axis.type === 'pie') {
                    removeMe.push(axis);
                }
            });
            config.yAxis = Ext.Array.difference(config.yAxis, removeMe);
            if (Ext.isEmpty(config.yAxis)) {
                delete config.yAxis;
            }

            me.chart = new Highcharts.Chart(config);
        },

        listeners: {
            afterrender: function () {
                var me = this;
                me.showChart();
            },
            resize: function () {
                var me = this;
                me.showChart({
                    delay: 500
                });
            }
        }
    });
}());
