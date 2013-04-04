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

    Ext.define('boxdata.view.SystemLoad', {
        title: boxdata.i18n.get('application.system.load'),
        extend: 'boxdata.ux.Chart',
        alias: 'widget.boxdata-system-load-panel',
        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        charts: [
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'line',
                yField: function (row) {
                    var value = row.get('load');
                    if (value < 0) {
                        return undefined;
                    }
                    return value;
                },
                seriesName: 'system load'
            },
            {
                xType: 'datetime',
                xField: 'timestamp',
                yType: 'column',
                yField: 'used-mem',
                seriesName: 'used memory'
            }
        ],

        columnLabelsFormatter: function (value) {
            return (value * 100) + '%';
        },

        beforeInit: function () {
            var me = this;
            var store = Ext.getStore('SystemLoad');
            store.on('load', function (thisStore, records) {
                me.setSeries(records);
            });
        }
    });

}());


