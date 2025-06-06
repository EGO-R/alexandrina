package org.mirea.backend.repositories

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.withContext
import org.jooq.DSLContext
import org.mirea.backend.services.TxDSL
import org.springframework.stereotype.Component
import reactor.core.scheduler.Schedulers
import kotlin.coroutines.coroutineContext

@Component
class JooqScope(
    private val dsl: DSLContext,
) {
    suspend fun <T> useDslContext(block: (DSLContext) -> T): T {
        val ctx = coroutineContext[TxDSL]?.tx?.dsl() ?: dsl
        return withContext(Dispatchers.IO) {
            block(ctx)
        }
    }
}
