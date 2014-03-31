/**
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License") you may not use this file except in compliance with
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

package boxdata.cdi.util

import boxdata.data.dto.DiskUsageDto
import boxdata.data.dto.SystemLoadDto
import boxdata.data.dto.ThreadDto

import javax.enterprise.context.ApplicationScoped
import java.lang.management.MemoryUsage
import java.lang.management.ThreadInfo

@ApplicationScoped
class DtoBuilder {

    def buildThreadDto(info: ThreadInfo): ThreadDto = {
        val dto = new ThreadDto()
        dto.id = info.getThreadId
        dto.name = info.getThreadName
        dto.blockedCount = info.getBlockedCount
        dto.blockedTime = info.getBlockedTime
        dto.waitedCount = info.getWaitedCount
        dto.waitedTime = info.getWaitedTime
        dto.state = info.getThreadState.name()
        dto
    }

    def buildDiskUsageDto(path: String, total: Long, free: Long): DiskUsageDto = {
        val resourcePath = path.replaceAll("[^A-Za-z0-9]", "")
        val dto = new DiskUsageDto()
        dto.path = resourcePath
        dto.total = total
        dto.free = free
        dto
    }

    def buildSystemLoadDto(timestamp: Long, value: Double, totalMem: Long, freeMem: Long,
                           heap: MemoryUsage, nonHeap: MemoryUsage): SystemLoadDto = {
        val used = (totalMem - freeMem) / totalMem
        val dto = new SystemLoadDto()
        dto.timestamp = timestamp
        dto.load = value
        dto.usedMemory = used

        dto.heapInit = heap.getInit
        dto.heapMax = heap.getMax
        dto.heapCommitted = heap.getCommitted
        dto.heapUsed = heap.getUsed

        dto.nonHeapInit = nonHeap.getInit
        dto.nonHeapMax = nonHeap.getMax
        dto.nonHeapCommitted = nonHeap.getCommitted
        dto.nonHeapUsed = nonHeap.getUsed
        dto
    }
}
