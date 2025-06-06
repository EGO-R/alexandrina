package org.mirea.backend.repositories.user

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.TableField
import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.entities.user.UserRole
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.jooq.generated.tables.records.UsersRecord
import org.mirea.backend.utils.ids.UserID
import org.mirea.backend.utils.repositories.TableMapper
import org.springframework.stereotype.Component

@Component
class UserMapper(
    dsl: DSLContext,
) : TableMapper<UserEntity, UsersRecord>(dsl) {
    override val updateIgnoreFields: Set<TableField<UsersRecord, *>> = emptySet()

    override fun map(entity: UserEntity): Map<TableField<UsersRecord, *>, *> = fields {
        if (entity.id != UserID.EMPTY) {
            USERS.ID set entity.id.value
        }
        USERS.NAME set entity.displayName
        USERS.EMAIL set entity.email
        USERS.ROLE set entity.role.value
        USERS.AVATAR set entity.avatarUrl
    }
}

internal val userMapping = listOf(
    USERS.ID,
    USERS.NAME,
    USERS.EMAIL,
    USERS.ROLE,
    USERS.AVATAR,
)

fun Record.toUserEntity() = UserEntity(
    id = UserID(get(USERS.ID)!!),
    displayName = get(USERS.NAME)!!,
    email = get(USERS.EMAIL)!!,
    role = UserRole.from(get(USERS.ROLE)),
    avatarUrl = get(USERS.AVATAR),
)
