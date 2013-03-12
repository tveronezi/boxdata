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

package boxdata.data.entity

import javax.persistence.*

@Entity
@Table(name = 'boxdata_user_tbl', uniqueConstraints = @UniqueConstraint(columnNames = ['usr_account']))
class User extends BaseEntity {

    @Column(name = 'usr_name', nullable = false)
    String name

    @Column(name = 'usr_account', nullable = false)
    String account

    @Column(name = 'usr_pass', nullable = false)
    byte[] password

    @Column(name = 'pass_salt', nullable = false)
    byte[] salt

    @ElementCollection(fetch = FetchType.EAGER)
    Set<String> securityGroups = new HashSet()

    @Column(name = 'usr_enabled', nullable = false)
    Boolean enabled = Boolean.FALSE

}
