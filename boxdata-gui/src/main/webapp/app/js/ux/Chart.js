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

            delete me.rawData;
            me.rawData = {};

            var index = 0;

            var xAxesMap = {};
            Ext.Array.forEach(axes.xAxis, function (axis) {
                xAxesMap[axis.id] = axis;
            });

            // build the categories array
            Ext.Array.forEach(data, function (item) {
                Ext.Array.forEach(me.series, function (chart) {
                    var axisId = chart.xId;
                    var x = me.getRowFieldValue(chart.xField, item);
                    if (x) {
                        if (me.xConfigs[axisId].type === 'category') {
                            Ext.Array.include(xAxesMap[axisId].categories, x);
                        }
                    }
                });
            });


            var seriesMap = {};
            Ext.Array.forEach(data, function (item) {
                Ext.Array.forEach(me.series, function (chart) {
                    var entry = {
                        x: me.getRowFieldValue(chart.xField, item),
                        y: me.getRowFieldValue(chart.yField, item),
                        id: index,
                        marker: {
                            enabled: (chart.marker ? true : false)
                        }
                    };
                    me.rawData[index] = item;
                    index = index + 1;

                    if (Ext.isEmpty(entry.x) || Ext.isEmpty(entry.y)) {
                        // There is a undefined value. Skip this line.
                        return;
                    }

                    var xAxisId = chart.xId;
                    var categories = Ext.valueFrom(xAxesMap[xAxisId].categories, []);
                    var seriesName = me.getSeriesName(chart, item);
                    if (!seriesMap[seriesName]) {
                        var dataArray = [];
                        seriesMap[seriesName] = {
                            xAxis: xAxisId,
                            yAxis: chart.yId,
                            type: me.yConfigs[chart.yId].type,
                            data: dataArray,
                            name: seriesName
                        };
                        Ext.Array.forEach(categories, function () {
                            dataArray.push(null);
                        });
                    }

                    var data = seriesMap[seriesName].data;
                    if (me.xConfigs[xAxisId].type === 'category') {
                        var categoryIndex = categories.indexOf(entry.x);
                        delete entry.x;
                        data[categoryIndex] = entry;
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
                        var tooltipFormatter = me.yConfigs[this.point.series.options.yAxis].tooltip;
                        if (!Ext.isDefined(tooltipFormatter)) {
                            return false;
                        }
                        var row = me.rawData[this.point.id];
                        return tooltipFormatter.call(me, row, this.point.series.name);
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
