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

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

    Ext.Loader.setConfig({
        enabled: true,
        disableCaching: false,
        paths: {
            'boxdata': window.ux.ROOT_URL + 'app/js'
        }
    });

    Ext.application({
        name: 'boxdata',
        appFolder: 'app/js',

        requires: [
            'boxdata.console',
            'boxdata.i18n'
        ],

        controllers: [
            'DiskUsage',
            'MemUsage',
            'SystemLoad'
        ],

        launch: function () {
            window.console.log('init application...');

            var title = Ext.get(Ext.dom.Query.selectNode('title'));
            title.update(boxdata.i18n.get('application.name'));

            Ext.create('boxdata.view.ApplicationViewport');
        }
    });
}());
