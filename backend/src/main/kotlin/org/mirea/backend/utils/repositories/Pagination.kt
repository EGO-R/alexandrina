package org.mirea.backend.utils.repositories

import org.jooq.*
import org.mirea.backend.repositories.PaginationData

const val DEFAULT_PAGE_SIZE = 100

fun <R : Record, T> SelectConditionStep<R>.paginated(data: PaginationData<out R, T>?) = when {
    data == null -> this
    data.lastSelectedValue == null -> this
        .orderBy(data.getSorted())
        .limit(data.size ?: DEFAULT_PAGE_SIZE)
    else -> this
        .orderBy(data.getSorted())
        .seek(data.lastSelectedValue)
        .limit(data.size ?: DEFAULT_PAGE_SIZE)
}
