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

import boxdata.data.entity.User;

import javax.annotation.security.RunAs;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.jms.JMSException;
import javax.jms.Message;
import java.util.HashSet;
import java.util.Set;

@Stateless(name = "FaceIdSudo")
@RunAs("solution-admin")
public class Sudo {

    @EJB
    private UserImpl userSrv;

    public void createUserFromMessage(Message message) throws JMSException {
        final String userAccount = message.getStringProperty("userAccount");
        final String userPassword = message.getStringProperty("userPassword");
        final String group = message.getStringProperty("userGroup");

        final User existing = this.userSrv.getUser(userAccount);
        if (existing == null) {
            final String userName = message.getStringProperty("userName");

            final Set<String> groups = new HashSet<String>();
            groups.add(group);

            this.userSrv.createUser(userName, userAccount, userPassword, groups, false);
        } else {
            this.userSrv.addGroupToUser(userAccount, userPassword, group);
        }
    }

    public void confirmUser(String from, String content) {
        this.userSrv.confirmUser(from, content);
    }
}
