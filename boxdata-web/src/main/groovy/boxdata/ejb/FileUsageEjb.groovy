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

import boxdata.data.dto.DirectoryUsageDto
import org.slf4j.Logger
import org.slf4j.LoggerFactory

import javax.ejb.Lock
import javax.ejb.LockType
import javax.ejb.Schedule

@Singleton
class FileUsageEjb {
    private static final Logger LOG = LoggerFactory.getLogger(FileUsageEjb)

    private List<DirectoryUsageDto> data = []

    @Schedule(minute = "*/15", hour = "*", persistent = false)
    @Lock(LockType.WRITE)
    void readData() {
        LOG.debug("Reading system information (file usage)...")
        def home = new File(System.getProperty("user.home"))
        Integer index = home.absolutePath.size()
        this.data.clear()
        home.eachFileRecurse { File file ->
            this.data << new DirectoryUsageDto(
                    path: file.absolutePath.substring(index),
                    size: file.length()
            )
        }
    }

    @Lock(LockType.READ)
    List<DirectoryUsageDto> getDirectoryUsage() {
        return this.data
    }
}
