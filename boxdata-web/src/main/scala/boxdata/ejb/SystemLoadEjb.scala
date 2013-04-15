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
import boxdata.data.dto.SystemLoadDto
import org.slf4j.LoggerFactory

import collection.mutable.ListBuffer

import javax.ejb.Lock
import javax.ejb.LockType
import javax.ejb.Singleton
import javax.inject.Inject
import java.lang.management.ManagementFactory

@Singleton(name = "SystemLoadEjb")
class SystemLoadEjb {
    val LOG = LoggerFactory.getLogger(getClass)
    val MAX_RECORDS = 10000

    val systemLoad: ListBuffer[SystemLoadDto] = ListBuffer()

    val osBean = ManagementFactory.getOperatingSystemMXBean
    val memoryBean = ManagementFactory.getMemoryMXBean

    @Inject
    var builder: DtoBuilder = _

    @Lock(LockType.WRITE)
    def readData() {
        LOG.debug("Reading system information (load)...")

        val runtime = Runtime.getRuntime
        val free = runtime.freeMemory()
        val total = runtime.totalMemory()

        val heap = memoryBean.getHeapMemoryUsage
        val nonHeap = memoryBean.getNonHeapMemoryUsage

        systemLoad += builder.buildSystemLoadDto(
            System.currentTimeMillis(),
            osBean.getSystemLoadAverage,
            total,
            free,
            heap,
            nonHeap
        )
        while (systemLoad.size > MAX_RECORDS) {
            systemLoad -= systemLoad.head
        }
    }

    @Lock(LockType.READ)
    def getSystemLoad: List[SystemLoadDto] = {
        systemLoad.iterator.toList
    }
}
