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

    Ext.define('boxdata.view.SystemThreads', {
        title: boxdata.i18n.get('application.threads'),
        extend: 'boxdata.ux.Chart',
        alias: 'widget.boxdata-threads-panel',

        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        getCategoryName: function (row) {
            return 't' + row.get('id');
        },

        buildSeriesName: function (row, field) {
            var threadName = this.getCategoryName(row);
            return threadName + ' - ' + field;
        },

        legend: 'right',

        tooltip: true,




        xConfigs: {
            'category-axis': {
                type: 'category'
            }
        },

        yConfigs: {
            'count-axis': {
                right: true,
                type: 'column'
            }
        },

        getNonEmpty: function (row, column) {
            var value = row.get(column);
            if (value < 1) {
                return null;
            }
            return value;
        },

        getCountValue: function (row, column) {
            return this.getNonEmpty(row, column);
        },

        getTimeValue: function (row, column) {
            return this.getNonEmpty(row, column);
        },

        charts: [
            {
                xId: 'category-axis',
                yId: 'count-axis',
                xField: function (row) {
                    return this.getCategoryName(row);
                },
                yField: function (row) {
                    return this.getCountValue(row, 'blockedCount');
                },
                seriesName: function (row) {
                    return this.buildSeriesName(row, 'blockedCount');
                }
            },
            {
                xId: 'category-axis',
                yId: 'count-axis',
                xField: function (row) {
                    return this.getCategoryName(row);
                },
                yField: function (row) {
                    return this.getTimeValue(row, 'blockedTime');
                },
                seriesName: function (row) {
                    return this.buildSeriesName(row, 'blockedTime');
                }
            },
            {
                xId: 'category-axis',
                yId: 'count-axis',
                xField: function (row) {
                    return this.getCategoryName(row);
                },
                yField: function (row) {
                    return this.getCountValue(row, 'waitedCount');
                },
                seriesName: function (row) {
                    return this.buildSeriesName(row, 'waitedCount');
                }
            },
            {
                xId: 'category-axis',
                yId: 'count-axis',
                xField: function (row) {
                    return this.getCategoryName(row);
                },
                yField: function (row) {
                    return this.getTimeValue(row, 'waitedTime');
                },
                seriesName: function (row) {
                    return this.buildSeriesName(row, 'waitedTime');
                }
            }
        ],

        beforeInit: function () {
            var me = this;
            var store = Ext.getStore('SystemThreads');
            store.on('load', function (thisStore, records) {
                me.setSeries(records);
            });
        }

    });

}());
