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

import boxdata.cdi.util.StringEncrypt;
import boxdata.data.entity.AuthenticationLog;
import boxdata.data.entity.AuthenticationLogType;
import boxdata.data.entity.User;
import boxdata.data.execution.BaseEAO;
import boxdata.data.execution.command.FindAllAuthenticationLog;

import javax.annotation.security.RolesAllowed;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Stateless
@RolesAllowed(value = {"solution-admin"})
public class AuthenticationImpl {
    @EJB
    private BaseEAO baseEAO;

    @EJB
    private UserImpl userSrv;

    @Inject
    private StringEncrypt encrypt;

    @TransactionAttribute(TransactionAttributeType.SUPPORTS)
    public Set<String> authenticate(String account, String password) {
        final AuthenticationLog log = new AuthenticationLog();
        log.setAccount(account);
        log.setDate(new Date());
        log.setLogType(AuthenticationLogType.SUCCESS);

        final User user = this.userSrv.getUser(account);
        Set<String> groups = null; // null means "bad user or password"
        if (user == null) {
            log.setLogType(AuthenticationLogType.BAD_USER);
        } else if (!this.encrypt.areEquivalent(password, user.getPassword(), user.getSalt())) {
            log.setLogType(AuthenticationLogType.BAD_PASSWORD);
        } else if (!user.getEnabled()) {
            log.setLogType(AuthenticationLogType.USER_DISABLED);
        } else {
            groups = user.getSecurityGroups();
            if (groups == null) {
                groups = new HashSet<String>();
            }
        }

        this.baseEAO.create(log);
        return groups;
    }

    public List<AuthenticationLog> getLog() {
        return this.baseEAO.execute(new FindAllAuthenticationLog());
    }
}
