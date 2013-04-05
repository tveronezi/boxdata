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

import boxdata.cdi.util.DtoBuilder
import boxdata.data.dto.ThreadDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.ejb.Stateless
import javax.inject.Inject
import java.lang.management.ManagementFactory

@Stateless
class SystemThreadsEjb {
    private static final Logger LOG = LoggerFactory.getLogger(SystemThreadsEjb)

    private def threadBean = ManagementFactory.getThreadMXBean()

    @Inject
    private DtoBuilder builder

    public List<ThreadDto> getThreadsInfo() {
        def uids = this.threadBean.allThreadIds
        return uids.collect { id ->
            def info = this.threadBean.getThreadInfo(id)
            return this.builder.buildThreadDto(info)
        }
    }
}
