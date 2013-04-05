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
        items: [
            {
                xtype: 'panel',
                padding: '5 5 5 5'
            }
        ],

        // configurable values
        charts: [],
        series: [],
        tooltip: undefined,
        legend: undefined,  // 'bottom' or 'right'

        setSeries: function (series) {
            this.series = series;
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
            if (Ext.isFunction(me.series)) {
                data = me.series();
            } else {
                data = me.series;
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
                Ext.Array.forEach(me.charts, function (chart) {
                    var x = me.getRowFieldValue(chart.xField, item);
                    if(x) {
                        if (chart.xType === 'category') {
                            Ext.Array.include(xAxesMap['categoryAxis'].categories, x);
                        }
                    }
                });
            });

            var categories = (Ext.isDefined(xAxesMap['categoryAxis']) ? xAxesMap['categoryAxis'].categories : []);

            var seriesMap = {};
            Ext.Array.forEach(data, function (item) {
                Ext.Array.forEach(me.charts, function (chart) {
                    var seriesName = me.getSeriesName(chart, item);
                    if (!seriesMap[seriesName]) {
                        var dataArray = [];
                        seriesMap[seriesName] = {
                            xAxis: chart.xType + 'Axis',
                            yAxis: chart.yType + 'Axis',
                            type: chart.yType,
                            data: dataArray,
                            name: seriesName
                        };

                        Ext.Array.forEach(categories, function() {
                            dataArray.push(null);
                        });
                    }

                    var entry = {
                        x: me.getRowFieldValue(chart.xField, item),
                        y: me.getRowFieldValue(chart.yField, item),
                        id: index
                    };
                    me.rawData[index] = item;
                    index = index + 1;

                    entry.marker = {
                        enabled: false
                    };
                    if (chart.marker) {
                        entry.marker.enabled = true;
                    }

                    if (!Ext.isDefined(entry.x) || !Ext.isDefined(entry.y)) {
                        // There is a undefined value. Skip this line.
                        return;
                    }

                    var data = seriesMap[seriesName].data;
                    if (chart.xType === 'category') {
                        var categoryIndex = categories.indexOf(entry.x);
                        delete entry.x;
                        data[categoryIndex] = entry;
                    } else {
                        data.push(entry);
                    }
                });
            });

            var result = Ext.Object.getValues(seriesMap);
            Ext.Array.forEach(result, function (series) {
                if (Ext.isEmpty(series.data)) {
                    series.showInLegend = false;
                }
            });
            return result;
        },

        // private
        prepareAxes: function () {
            var me = this;
            var charts = me.charts;
            var xMap = {};
            var yMap = {};
            Ext.Array.forEach(charts, function (chartConfig) {
                var xType = Ext.valueFrom(chartConfig.xType, 'line'); // or column
                var yType = Ext.valueFrom(chartConfig.yType, 'datetime'); // or category

                if (!Ext.isDefined(xMap[xType])) {
                    if (xType === 'category') {
                        xMap[xType] = {
                            title: '',
                            categories: [],
                            id: xType + 'Axis'
                        };

                    } else {
                        xMap[xType] = {
                            title: '',
                            type: xType,
                            id: xType + 'Axis'
                        };
                    }
                }

                if (!Ext.isDefined(yMap[yType])) {
                    yMap[yType] = {
                        title: '',
                        type: yType,
                        id: yType + 'Axis'
                    };
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
                plotOptions: {
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
        showChart: function () {
            var me = this;
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

            // preparing the 'tooltip' object that HighCharts understands.
            if (me.tooltip) {
                config.tooltip = config.tooltip || {};
                config.tooltip.shared = true;
                config.tooltip.useHTML = true;
                config.tooltip.formatter = function () {
                    var points = this.points;
                    var rows = [];
                    Ext.Array.forEach(points, function (item) {
                        rows.push(me.rawData[item.point.id]);
                    });
                    var formatter = me.tooltip;
                    return formatter.call(me, rows);
                };
            }


            if(me.legend) {
                config.legend.enabled = true;
                if(me.legend === 'bottom') {
                    // nothing special to do. Apply defaults.

                } else if(me.legend === 'right') {
                    config.legend.layout = 'vertical';
                    config.legend.verticalAlign = 'middle';
                    config.legend.align = 'right';

                } else {
                    throw 'Invalid legend position. "' + me.legend + '"' ;
                }
            }

            me.chart = new Highcharts.Chart(config);
        },

        listeners: {
            afterrender: function () {
                var me = this;
                me.showChart();
            }
        }
    });
}());
