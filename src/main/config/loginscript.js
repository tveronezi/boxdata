/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = 'http://localhost:8080/boxdata/rest/authentication/';
var urlParameters = 'account=' + user + '&password=' + password;

function loop(values, callback) {
    var i;
    for (i = 0; i < values.length; i += 1) {
        callback(values[i], i);
    }
}

function getBytes(str) {
    var bytes = [];
    var i;
    for (i = 0; i < str.length; i += 1) {
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}

function authenticate() {
    var data = getBytes(urlParameters);
    var url = new java.net.URL(request);
    var conn = url.openConnection();
    conn.setDoOutput(true);
    conn.setDoInput(true);
    conn.setInstanceFollowRedirects(false);
    conn.setRequestMethod('POST');
    conn.setRequestProperty('Content-Type', 'application/x-www-form-urlencoded');
    conn.setRequestProperty('charset', 'utf-8');
    conn.setRequestProperty('Content-Length', '' + data.length);
    conn.setUseCaches(false);
    conn.getOutputStream().write(data);

    var reader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
    var lines = [];
    var line;
    var hasValues = false;
    while ((line = reader.readLine()) !== null) {
        hasValues = true;
        lines.push(line.trim());
    }
    reader.close();
    conn.disconnect();

    if (hasValues) {
        return lines.join('');
    } else {
        return null;
    }
}

function getGroupsList(authenticationResult) {
    if (!authenticationResult) {
        throw 'Bad user or password. The groups list is null.';
    }

    var result = new java.util.ArrayList();
    loop(authenticationResult.split(','), function (grp) {
        result.add(grp);
    });
    return result;
}

var auth = authenticate();

// Returning the groups
getGroupsList(auth);