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

package boxdata.data.execution;

import boxdata.data.entity.BaseEntity;

import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import java.util.List;

public interface BaseEAO {
    CriteriaBuilder getCriteriaBuilder();

    Query createQuery(String strQuery);

    <T> TypedQuery<T> createQuery(CriteriaQuery<T> cq);

    <E> E execute(DbCommand<E> cmd);

    <E extends BaseEntity> E create(E entity);

    <E extends BaseEntity> void delete(E entity);

    <E extends BaseEntity> E find(Class<E> cls, Long uid);

    <E extends BaseEntity> List<E> findAll(Class<E> cls);

    <E extends BaseEntity> List<Long> findAllUids(Class<E> cls);
}
