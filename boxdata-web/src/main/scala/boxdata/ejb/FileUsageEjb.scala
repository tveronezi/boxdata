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

import boxdata.data.dto.FileUsageDto
import org.slf4j.LoggerFactory

import java.io.File

import collection.mutable.MutableList

import javax.ejb.Lock
import javax.ejb.LockType
import javax.ejb.Singleton

@Singleton(name = "FileUsageEjb")
class FileUsageEjb {
    val LOG = LoggerFactory.getLogger(getClass)
    val MIN_SIZE = 1024 * 1024 * 1
    val fileUsage: MutableList[FileUsageDto] = MutableList()

    def buildUsage(root: File, index: Int) {
        def files = root.listFiles()
        if(files == null) {
          return
        }
        files.foreach {
            file =>
                if (file.isDirectory) {
                    buildUsage(file, index)
                } else {
                    val size = file.length()
                    if (size >= MIN_SIZE) {
                        val dto = new FileUsageDto()
                        dto.path = file.getAbsolutePath.substring(index)
                        dto.size = file.length()
                        fileUsage += dto
                    }
                }
        }
    }

    @Lock(LockType.WRITE)
    def readData() {
        LOG.debug("Reading system information (file usage)...")

        val home = new File(System.getProperty("user.home"))
        val index = home.getAbsolutePath.size
        fileUsage.clear()
        buildUsage(home, index)
    }

    @Lock(LockType.READ)
    def getUsage: List[FileUsageDto] = {
        fileUsage.iterator.toList
    }
}
