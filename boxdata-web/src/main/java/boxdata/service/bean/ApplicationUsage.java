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

@Singleton
@Startup
public class ApplicationUsage {
    private static final Logger LOG = LoggerFactory.getLogger(ApplicationUsage.class);

    @Inject
    private DtoBuilder builder;

    private List<DiskUsageDto> diskUsage = new ArrayList<DiskUsageDto>();
    private List<MemoryUsageDto> memoryUsage = new ArrayList<MemoryUsageDto>();

    private List<DiskUsageDto> getCurrentDiskUsage() {
        final List<DiskUsageDto> result = new ArrayList<DiskUsageDto>();
        File[] roots = File.listRoots();
        Long currentTs = System.currentTimeMillis();
        for (File root : roots) {
            DiskUsageDto dto = this.builder.buildDiskUsageDto(
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
                currentTs,
                total,
                free
        );
        LOG.info(dto.toString());
        return dto;
    }

    @Schedule(minute = "*/5", hour = "*", persistent = false)
    public void readData() {
        LOG.info("Reading system information....");

        this.diskUsage.addAll(this.getCurrentDiskUsage());
        while (this.diskUsage.size() > 200) {
            this.diskUsage.remove(0);
        }

        this.memoryUsage.add(this.getCurrentMemUsage());
        if (this.memoryUsage.size() > 200) {
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
        readData();
    }

}
