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
import boxdata.data.dto.DirectoryUsageDto
import boxdata.data.dto.DiskUsageDto

import javax.ejb.Stateless
import javax.inject.Inject

@Stateless
class DiskUsageEjb {
    @Inject
    DtoBuilder builder;

    List<DiskUsageDto> getDiskUsage() {
        return File.listRoots().collect { File root ->
            return this.builder.buildDiskUsageDto(
                    root.absolutePath,
                    root.totalSpace,
                    root.freeSpace
            )
        }
    }

    List<DirectoryUsageDto> getDirectoryUsage() {
        def home = new File(System.getProperty("user.home"))
        def result = []
        home.eachFileRecurse { File file ->
            result << new DirectoryUsageDto(
                    path: file.absolutePath,
                    size: file.length()
            )
        }
        return result
    }
}
