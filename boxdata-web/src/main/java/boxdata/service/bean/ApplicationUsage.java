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

package boxdata.service.bean;

import boxdata.cdi.util.DtoBuilder;
import boxdata.data.dto.DiskUsageDto;
import boxdata.data.dto.MemoryUsageDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

@Singleton
@Startup
public class ApplicationUsage {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationUsage.class);

    private static final Integer MAX_RECORDS = 1000;

    @Inject
    private DtoBuilder builder;

    private AtomicLong id = new AtomicLong();
    private List<DiskUsageDto> diskUsage = new ArrayList<DiskUsageDto>();
    private List<MemoryUsageDto> memoryUsage = new ArrayList<MemoryUsageDto>();

    private List<DiskUsageDto> getCurrentDiskUsage() {
        final List<DiskUsageDto> result = new ArrayList<DiskUsageDto>();
        File[] roots = File.listRoots();
        Long currentTs = System.currentTimeMillis();
        for (File root : roots) {
            DiskUsageDto dto = this.builder.buildDiskUsageDto(
                    id.getAndIncrement(),
                    currentTs,
                    root.getAbsolutePath(),
                    root.getTotalSpace(),
                    root.getFreeSpace(),
                    root.getUsableSpace()
            );
            LOG.info(dto.toString());
            result.add(dto);
        }
        return result;
    }

    private MemoryUsageDto getCurrentMemUsage() {
        Long currentTs = System.currentTimeMillis();
        Long free = Runtime.getRuntime().freeMemory();
        Long total = Runtime.getRuntime().totalMemory();
        final MemoryUsageDto dto = this.builder.buildMemUsageDto(
                id.getAndIncrement(),
                currentTs,
                total,
                free
        );
        LOG.info(dto.toString());
        return dto;
    }

    @Schedule(minute = "*/3", hour = "*", persistent = false)
    public void readDiskUsageData() {
        LOG.info("Reading system information (disk)...");

        this.diskUsage.addAll(this.getCurrentDiskUsage());
        while (this.diskUsage.size() > MAX_RECORDS) {
            this.diskUsage.remove(0);
        }

    }

    @Schedule(minute = "*/1", hour = "*", persistent = false)
    public void readMemUsageData() {
        LOG.info("Reading system information (mem)...");

        this.memoryUsage.add(this.getCurrentMemUsage());
        while (this.memoryUsage.size() > MAX_RECORDS) {
            this.memoryUsage.remove(0);
        }
    }

    public List<DiskUsageDto> getDiskUsage() {
        return diskUsage;
    }

    public List<MemoryUsageDto> getMemoryUsageDto() {
        return memoryUsage;
    }

    @PostConstruct
    public void applicationStartup() {
        readDiskUsageData();
        readMemUsageData();
    }

    public MemoryUsageDto getCurrentMemoryUsageDto() {
        return this.getCurrentMemUsage();
    }
}
