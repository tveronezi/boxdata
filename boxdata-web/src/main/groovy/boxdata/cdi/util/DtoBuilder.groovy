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

import boxdata.data.dto.AuthenticationDto
import boxdata.data.dto.UserDto
import boxdata.data.entity.AuthenticationLog
import boxdata.data.entity.User

import javax.enterprise.context.ApplicationScoped

@ApplicationScoped
class DtoBuilder {

    UserDto buildUser(User user) {
        if (user == null) {
            return null
        }
        UserDto result = new UserDto()
        result.setId(user.getUid())
        result.setName(user.getName())
        result.setAccount(user.getAccount())

        Set<String> groups = user.getSecurityGroups()
        if (groups == null) {
            result.setGroups("")
        } else {
            String groupsStr = groups.toString()
            groupsStr = groupsStr.substring(1, groupsStr.length() - 1)
            groupsStr.replaceAll("\\s", "")
            result.setGroups(groupsStr)
        }
        return result
    }

    AuthenticationDto buildAuthenticationLog(AuthenticationLog log) {
        if (log == null) {
            return null
        }
        AuthenticationDto result = new AuthenticationDto()
        result.setId(log.getUid())
        result.setAccount(log.getAccount())
        result.setTimestamp(log.getDate().getTime())
        result.setType(log.getLogType().name())
        return result
    }

}
