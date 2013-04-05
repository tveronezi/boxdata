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

    Ext.define('boxdata.view.ApplicationContainer', {
        extend: 'Ext.panel.Panel',
        alias: 'widget.boxdata-application-container',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        border: false,
        items: [
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'start'
                },
                border: false,
                items: [
                    {
                        padding: '5 5 0 5',
                        xtype: 'boxdata-disk-usage-panel',
                        flex: 1
                    },
                    {
                        padding: '5 5 5 5',
                        xtype: 'boxdata-file-usage-panel',
                        flex: 1
                    }
                ],
                width: 250
            },
            {
                xtype: 'panel',
                layout: {
                    type: 'vbox',
                    align: 'stretch',
                    pack: 'start'
                },
                border: false,
                items: [
                    {
                        padding: '5 5 0 0',
                        xtype: 'boxdata-system-load-panel',
                        flex: 1
                    },
                    {
                        padding: '5 5 0 0',
                        xtype: 'boxdata-jvm-mem-panel',
                        flex: 1
                    },
                    {
                        padding: '5 5 5 0',
                        xtype: 'boxdata-threads-panel',
                        flex: 1
                    }
                ],
                flex: 1
            }
        ]
    });
}());
