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

    function getTime(row) {
        var date = Ext.Date.parse(row.time, 'Y/m/d H:i:s', true);
        return date.getTime();
    }

    Ext.define('boxdata.view.AltenativeJvmMemory', {
        title: boxdata.i18n.get('application.system.jvm.memory'),
        extend: 'boxdata.ux.Chart',
        alias: 'widget.boxdata-alternative-jvm-mem-panel',
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
                // valid values: 'datetime' (default) or 'series'
                xType: 'datetime',

                // it can be the name of the field, or a function which receives the entire row as parameter
                xField: getTime,

                // valid values: 'line' (default) or 'column'
                yType: 'line',

                // it can be the name of the field, or a function which receives the entire row as parameter
                yField: 'my_y',

                // it can be the name of the field, or a function which receives the entire row as parameter
                seriesName: function (row) {
                    return 'aaa';
                }
            },
            {
                // valid values: 'datetime' (default) or 'series'
                xType: 'datetime',

                // it can be the name of the field, or a function which receives the entire row as parameter
                xField: getTime,

                // valid values: 'line' (default) or 'column'
                yType: 'column',

                // it can be the name of the field, or a function which receives the entire row as parameter
                yField: 'my_y2',

                // it can be the name of the field, or a function which receives the entire row as parameter
                seriesName: 'bbb'
            }
        ],

        listeners: {
            render: function () {
                var me = this;
                me.setSeries([
                    {
                        'time': "2013/04/03 16:30:00",
                        'my_y': 457298,
                        'my_y2': 1
                    },
                    {
                        'time': "2013/04/03 16:35:00",
                        'my_y': 520633,
                        'my_y2': 2
                    },
                    {
                        'time': "2013/04/03 16:45:00",
                        'my_y': 445535,
                        'my_y2': 3
                    },
                    {
                        'time': "2013/04/03 16:50:00",
                        'my_y': 480073,
                        'my_y2': 4
                    },
                    {
                        'time': "2013/04/03 16:55:00",
                        'my_y': 507179,
                        'my_y2': 5
                    },
                    {
                        'time': "2013/04/03 17:00:00",
                        'my_y': 498589,
                        'my_y2': 6
                    },
                    {
                        'time': "2013/04/03 17:05:00",
                        'my_y': 523142,
                        'my_y2': 7
                    },
                    {
                        'time': "2013/04/03 17:10:00",
                        'my_y': 479851,
                        'my_y2': 8
                    },
                    {
                        'time': "2013/04/03 17:15:00",
                        'my_y': 466907,
                        'my_y2': 9
                    },
                    {
                        'time': "2013/04/03 17:20:00",
                        'my_y': 471781,
                        'my_y2': 10
                    },
                    {
                        'time': "2013/04/03 17:25:00",
                        'my_y': 0,
                        'my_y2': 11
                    }
                ]);
            }
        }
    });

}());


