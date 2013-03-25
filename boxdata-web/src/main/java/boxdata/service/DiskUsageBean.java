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
import boxdata.data.dto.DiskUsageDto;

import javax.ejb.Stateless;
import javax.inject.Inject;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DiskUsageBean {

    @Inject
    private DtoBuilder builder;

    public List<DiskUsageDto> getDiskUsage() {
        final List<DiskUsageDto> result = new ArrayList<DiskUsageDto>();
        File[] roots = File.listRoots();
        for (File root : roots) {
            DiskUsageDto dto = this.builder.buildDiskUsageDto(
                    root.getAbsolutePath(),
                    root.getTotalSpace(),
                    root.getFreeSpace(),
                    root.getUsableSpace()
            );
            result.add(dto);
        }
        return result;
    }
}
