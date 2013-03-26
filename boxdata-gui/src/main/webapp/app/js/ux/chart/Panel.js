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

    Ext.define('boxdata.ux.chart.Panel', {
        extend: 'Ext.panel.Panel',

        layout: 'fit',

        items: [
            {
                xtype: 'panel',
                padding: '5 5 5 5'
            }
        ],

        store: undefined,
        tooltipFormatter: undefined,
        getChartConfig: function () {
            throw 'You should override the getChartConfig method';
        },

        showChart: function () {
            var me = this;
            var container = me.child('panel');
            container.removeAll(true);
            var config = me.getChartConfig();

            config.chart = config.chart || {};
            config.chart.renderTo = container.id;

            if (me.tooltipFormatter) {
                config.tooltip = config.tooltip || {};
                config.tooltip.formatter = function () {
                    var points;
                    if (this.point) {
                        points = [this.point];

                    } else {
                        points = this.points;
                    }
                    var formatter = me.tooltipFormatter;
                    return formatter.apply(me, [points]);
                };
            }

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

                me.store.on('datachanged', function () {
                    me.showChart();
                });
            }
        }
    });
}());