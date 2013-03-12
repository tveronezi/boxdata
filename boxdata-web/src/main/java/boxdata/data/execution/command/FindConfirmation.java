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

package boxdata.data.execution.command;

import boxdata.data.entity.UserConfirmation;
import boxdata.data.execution.BaseEAO;
import boxdata.data.execution.DbCommand;

import javax.persistence.NoResultException;
import javax.persistence.Query;

public class FindConfirmation implements DbCommand<UserConfirmation> {
    private final String username;
    private final String key;

    public FindConfirmation(String username, String key) {
        this.username = username;
        this.key = key;
    }

    @Override
    public UserConfirmation execute(BaseEAO eao) {
        final Query query = eao.createQuery("SELECT c FROM UserConfirmation c " +
                "WHERE c.user.account = :pUserName AND c.key = :pKey");
        query.setParameter("pUserName", username);
        query.setParameter("pKey", key);

        UserConfirmation result;
        try {
            final Object obj = query.getSingleResult();
            result = UserConfirmation.class.cast(obj);
        } catch (NoResultException e) {
            result = null;
        }
        return result;
    }
}
