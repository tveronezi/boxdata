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

package boxdata.ejb

import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.annotation.PostConstruct
import javax.ejb.*

@Singleton
@DependsOn(['SystemLoadEjb', 'FileUsageEjb'])
@Startup
class SchedulerEjb {
    private static final Logger LOG = LoggerFactory.getLogger(SchedulerEjb)

    @EJB
    private FileUsageEjb file

    @EJB
    private SystemLoadEjb load

    @Schedule(minute = "*/15", hour = "*", persistent = false)
    void readFileUsage() {
        this.file.readData()
    }

    @Schedule(second = "*/10", minute = "*", hour = "*", persistent = false)
    void readSystemLoad() {
        this.load.readData()
    }

    @PostConstruct
    void postConstruct() {
        LOG.info("boxdata SCHEDULER started...")
        this.readFileUsage()
        this.readSystemLoad()
    }
}
