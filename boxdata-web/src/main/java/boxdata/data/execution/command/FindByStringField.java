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

import boxdata.data.execution.BaseEAO;
import boxdata.data.execution.DbCommand;

import javax.persistence.NoResultException;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;

public class FindByStringField<T> implements DbCommand<T> {

    public final Class<T> cls;
    public final String name;
    public String value;

    public FindByStringField(Class<T> cls, String name) {
        this.cls = cls;
        this.name = name;
    }

    @Override
    public T execute(BaseEAO eao) {
        final CriteriaBuilder cb = eao.getCriteriaBuilder();
        final CriteriaQuery<T> cq = cb.createQuery(this.cls);
        final Root<T> root = cq.from(this.cls);
        cq.select(root);
        final Path<String> pathName = root.get(this.name);
        final Predicate pValue = cb.equal(pathName, this.value);
        cq.where(pValue);
        final TypedQuery<T> q = eao.createQuery(cq);

        try {
            return q.getSingleResult();
        } catch (NoResultException e) {
            return null;
        }
    }
}
