package org.mirea.backend.repositories.user

import org.mirea.backend.entities.user.UserEntity
import org.mirea.backend.jooq.generated.Tables.USERS
import org.mirea.backend.repositories.JooqScope
import org.mirea.backend.utils.ids.UserID
import org.springframework.stereotype.Repository

@Repository
class UserRepository(
    private val jooqScope: JooqScope,
    private val mapper: UserMapper,
) {
    suspend fun getById(id: UserID) =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(userMapping)
                .from(USERS)
                .where(USERS.ID.eq(id.value))
                .fetchOne()
                ?.toUserEntity()
        }

    suspend fun getByEmail(email: String) =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(userMapping)
                .from(USERS)
                .where(USERS.EMAIL.eq(email))
                .fetchOne()
                ?.toUserEntity()
        }

    suspend fun search(query: UserRepositorySearchQuery): List<UserEntity> =
        jooqScope.useDslContext { ctx ->
            ctx
                .select(userMapping)
                .from(USERS)
                .where(query.toCondition())
                .fetch()
                .map { it.toUserEntity() }
        }

    suspend fun upsert(entity: UserEntity) =
        jooqScope.useDslContext { ctx ->
            ctx
                .insertInto(USERS)
                .set(mapper.record(entity))
                .onDuplicateKeyUpdate()
                .set(mapper.updateRecord(entity))
                .returning(userMapping)
                .fetchOne()!!
                .toUserEntity()
        }
}