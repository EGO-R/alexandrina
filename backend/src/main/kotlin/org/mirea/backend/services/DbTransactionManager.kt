package org.mirea.backend.services

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.withContext
import org.jooq.Configuration
import org.jooq.DSLContext
import org.springframework.stereotype.Component
import kotlin.coroutines.AbstractCoroutineContextElement
import kotlin.coroutines.CoroutineContext
import kotlin.coroutines.coroutineContext

@Component
class DbTransactionManager(
    private val ctx: DSLContext,
) {
    suspend fun <T> transactional(block: suspend () -> T): T {
        val tx = coroutineContext[TxDSL]?.tx
        return if (tx != null) {
            block()
        } else {
            withContext(Dispatchers.IO) {
                ctx.transactionPublisher { tx ->
                    mono {
                        withContext(TxDSL(tx)) { block() }
                    }
                }
            }.awaitSingle()
        }
    }
}

class TxDSL(val tx: Configuration) : AbstractCoroutineContextElement(Key) {
    companion object Key : CoroutineContext.Key<TxDSL>
}