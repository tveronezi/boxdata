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

    Ext.define('boxdata.view.FileUsage', {
        title: boxdata.i18n.get('application.file.usage'),
        extend: 'boxdata.ux.Chart',
        alias: 'widget.boxdata-file-usage-panel',

        tools: [
            {
                itemId: 'refresh',
                type: 'refresh',
                handler: function (event, target, owner) {
                    owner.ownerCt.fireEvent('refreshpanel');
                }
            }
        ],

        legend: 'bottom',

        charts: [
            {
                pieValue: function (rec) {
                    return [rec.get('path'), rec.get('size')];
                }
            }
        ],

        beforeInit: function () {
            var me = this;
            var store = Ext.getStore('FileUsage');
            store.on('load', function (thisStore, records) {
                me.setSeries(records);
            });
        }

    });

}());




