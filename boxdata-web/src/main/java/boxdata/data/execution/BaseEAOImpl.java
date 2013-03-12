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

import javax.ejb.Local;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Path;
import javax.persistence.criteria.Root;
import java.util.List;

@Stateless(name = "boxdata-BaseEAOImpl")
@Local(BaseEAO.class)
public class BaseEAOImpl implements BaseEAO {
    @PersistenceContext(unitName = "userPU")
    private EntityManager em;

    @Override
    public CriteriaBuilder getCriteriaBuilder() {
        return this.em.getCriteriaBuilder();
    }

    @Override
    public Query createQuery(String strQuery) {
        return this.em.createQuery(strQuery);
    }

    @Override
    public <T> TypedQuery<T> createQuery(CriteriaQuery<T> cq) {
        return this.em.createQuery(cq);
    }

    @Override
    public <E> E execute(DbCommand<E> cmd) {
        return cmd.execute(this);
    }

    @Override
    public <E extends BaseEntity> E create(E entity) {
        this.em.persist(entity);
        this.em.flush();
        return entity;
    }

    @Override
    public <E extends BaseEntity> void delete(E entity) {
        this.em.remove(entity);
    }

    @Override
    public <E extends BaseEntity> E find(Class<E> cls, Long uid) {
        return this.em.find(cls, uid);
    }

    @Override
    public <E extends BaseEntity> List<E> findAll(Class<E> cls) {
        final CriteriaBuilder cb = this.getCriteriaBuilder();
        final CriteriaQuery<E> cq = cb.createQuery(cls);
        final Root<E> root = cq.from(cls);
        final TypedQuery<E> q = em.createQuery(cq);
        return q.getResultList();
    }

    @Override
    public <E extends BaseEntity> List<Long> findAllUids(Class<E> cls) {
        final CriteriaBuilder cb = this.getCriteriaBuilder();
        final CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        final Root<E> root = cq.from(cls);
        final Path path = root.get("uid");
        cq.select(path);
        final TypedQuery<Long> q = em.createQuery(cq);
        return q.getResultList();
    }
}
