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

package boxdata.service.rest;

import boxdata.cdi.util.DtoBuilder;
import boxdata.service.ApplicationException;
import boxdata.service.bean.AuthenticationImpl;

import javax.annotation.security.RunAs;
import javax.ejb.EJB;
import javax.ejb.Stateless;
import javax.ejb.TransactionAttribute;
import javax.ejb.TransactionAttributeType;
import javax.inject.Inject;
import javax.ws.rs.FormParam;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import java.util.Set;

@Path("/authentication")
@RunAs("solution-admin")
@Stateless
@TransactionAttribute(TransactionAttributeType.SUPPORTS)
public class Authentication {

    @EJB
    private AuthenticationImpl authSrv;

    @Inject
    private DtoBuilder dtoBuilder;

    @POST
    @Produces("plain/text")
    public String authenticate(@FormParam("account") String account, @FormParam("password") String password) {
        final Set<String> groups = this.authSrv.authenticate(account, password);
        if (groups == null) {
            throw new ApplicationException("Bad user or password");
        }
        String result = groups.toString();
        result = result.substring(1, result.length() - 1);
        return result.replaceAll("\\s", "");
    }

}
