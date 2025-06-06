package org.mirea.backend.utils.repositories

import org.jooq.Condition
import org.jooq.Field
import org.jooq.impl.DSL

private fun <T> T.transformIf(condition: Boolean, cb: T.() -> T) = if (condition) {
    this.cb()
} else {
    this
}

fun <T> Condition.andEq(field: Field<T>, value: T?, skipCondition: Boolean = value != null) =
    this.transformIf(skipCondition) { this.and(field.eq(value)) }

fun <T> Condition.orEq(field: Field<T>, value: T?, skipCondition: Boolean = value != null) =
    this.transformIf(skipCondition) { this.or(field.eq(value)) }

fun Condition.andLike(field: Field<String>, value: String?, skipCondition: Boolean = value != null) =
    this.transformIf(skipCondition) { this.and(field.likeIgnoreCase("%$value%")) }

fun <T> Condition.andIn(field: Field<T>, value: Collection<T>?, skipCondition: Boolean = value != null) =
    this.transformIf(skipCondition) { this.and(field.`in`(value)) }

fun Condition.and(cb: () -> Condition): Condition = this.and(cb())

fun Condition.or(value: Boolean): Condition = this.or(
    when (value) {
        true -> DSL.trueCondition()
        false -> DSL.falseCondition()
    }
)
