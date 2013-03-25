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
import boxdata.data.dto.SystemLoadDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.PostConstruct;
import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.ejb.Startup;
import javax.inject.Inject;
import java.lang.management.ManagementFactory;
import java.lang.management.OperatingSystemMXBean;
import java.util.ArrayList;
import java.util.List;

@Singleton
@Startup
public class SystemLoadBean {
    private static final Logger LOG = LoggerFactory.getLogger(SystemLoadBean.class);

    private static final Integer MAX_RECORDS = 1000;

    private List<SystemLoadDto> systemLoad = new ArrayList<SystemLoadDto>();

    private OperatingSystemMXBean osBean = ManagementFactory.getOperatingSystemMXBean();

    @Inject
    private DtoBuilder builder;

    @Schedule(minute = "*/1", hour = "*", persistent = false)
    public void readSystemLoadData() {
        LOG.info("Reading system information (load)...");

        Long free = Runtime.getRuntime().freeMemory();
        Long total = Runtime.getRuntime().totalMemory();

        final SystemLoadDto dto = this.builder.buildSystemLoadDto(
                System.currentTimeMillis(),
                this.osBean.getSystemLoadAverage(),
                total,
                free
        );
        this.systemLoad.add(dto);
        while (this.systemLoad.size() > MAX_RECORDS) {
            this.systemLoad.remove(0);
        }
    }

    public List<SystemLoadDto> getSystemLoad() {
        return systemLoad;
    }

    @PostConstruct
    public void applicationStartup() {
        readSystemLoadData();
    }
}
