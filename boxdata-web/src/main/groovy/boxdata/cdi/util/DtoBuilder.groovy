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

    ThreadDto buildThreadDto(ThreadInfo info) {
        return new ThreadDto(
                id: info.threadId,
                name: info.threadName,
                blockedCount: info.blockedCount,
                blockedTime: info.blockedTime,
                waitedCount: info.waitedCount,
                waitedTime: info.waitedTime,
                state: info.threadState.name()
        )
    }

    DiskUsageDto buildDiskUsageDto(String path, Long total, Long free) {
        def resourcePath = path.replaceAll('[^A-Za-z0-9]', '')
        return new DiskUsageDto(
                path: resourcePath,
                total: total,
                free: free
        )
    }

    SystemLoadDto buildSystemLoadDto(Long timestamp, Double value, Long totalMem, Long freeMem,
                                     MemoryUsage heap, MemoryUsage nonHeap) {
        Double used = (totalMem - freeMem) / totalMem
        return new SystemLoadDto(
                timestamp: timestamp,
                load: value,
                usedMemory: used,

                heapInit: heap.init,
                heapMax: heap.max,
                heapCommitted: heap.committed,
                heapUsed: heap.used,

                nonHeapInit: nonHeap.init,
                nonHeapMax: nonHeap.max,
                nonHeapCommitted: nonHeap.committed,
                nonHeapUsed: nonHeap.used
        )
    }
}
