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

package boxdata.service;

import boxdata.cdi.util.DtoBuilder;
import boxdata.data.dto.MemoryUsageDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@Singleton
@Startup
public class MemoryUsageBean {
    private static final Logger LOG = LoggerFactory.getLogger(MemoryUsageBean.class);

    private static final Integer MAX_RECORDS = 1000;

    private List<MemoryUsageDto> memoryUsage = new ArrayList<MemoryUsageDto>();

    @Inject
    private DtoBuilder builder;

    private void getCurrentMemUsage() {
        Long currentTs = System.currentTimeMillis();
        Long free = Runtime.getRuntime().freeMemory();
        Long total = Runtime.getRuntime().totalMemory();
        final MemoryUsageDto dto = this.builder.buildMemUsageDto(
                currentTs,
                total,
                free
        );
        memoryUsage.add(dto);
        while (memoryUsage.size() > MAX_RECORDS) {
            memoryUsage.remove(0);
        }
    }

    @Schedule(minute = "*/1", hour = "*", persistent = false)
    public void readMemUsageData() {
        LOG.info("Reading system information (mem)...");
        this.getCurrentMemUsage();
    }

    public List<MemoryUsageDto> getMemoryUsage() {
        return this.memoryUsage;
    }

    @PostConstruct
    public void applicationStartup() {
        readMemUsageData();
    }
}
