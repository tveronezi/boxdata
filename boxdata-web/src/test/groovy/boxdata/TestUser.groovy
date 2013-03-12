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

package boxdata

import junit.framework.Assert
import org.junit.Before
import org.junit.Test

import javax.ejb.EJBException
import javax.ejb.embeddable.EJBContainer

class TestUser {
    private EJBContainer container

    @Before
    public void setUp() throws Exception {
        def p = [:] as Properties
        this.container = EJBContainer.createEJBContainer(p)
    }

    @Test
    void testCreateUser() {
        def context = this.container.context

        try {
            def service = context.lookup('java:global/boxdata-web/faceid-UserImpl')
            service.createUser('michael', 'jackson', 'bad')
            try {
                service.createUser('michael', 'jackson', 'bad')
                Assert.fail()
            } catch (EJBException e) {
                // expected
            }
        } finally {
            context.close()
        }
    }
}
