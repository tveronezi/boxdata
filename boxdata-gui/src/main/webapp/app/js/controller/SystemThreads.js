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

    Ext.define('boxdata.controller.SystemThreads', {
        extend: 'Ext.app.Controller',

        views: [
            'ApplicationContainer',
            'SystemThreads'
        ],

        stores: [
            'SystemThreads'
        ],

        refs: [
            {
                ref: 'threadsView',
                selector: 'boxdata-threads-panel'
            }
        ],

        loadData: function () {
            var self = this;
            this.getSystemThreadsStore().load();
        },

        init: function () {
            var self = this;

            self.control({
                'boxdata-threads-panel': {
                    render: function () {
                        self.loadData();
                    },
                    refreshpanel: function () {
                        self.getSystemThreadsStore().load();
                    }
                }
            });

            var store = self.getSystemThreadsStore();
            store.on('beforeload', function () {
                self.getThreadsView().mask(boxdata.i18n.get('loading.data'));
            });
            store.on('load', function (thisStore, records) {
                var data = records;
                if (!data) {
                    data = [];
                }
                window.console.log('SystemThreadsStore -> ' + data.length + ' items');
                self.getThreadsView().unmask();
                self.getThreadsView().setData(data);
            });

        }
    });

}());
