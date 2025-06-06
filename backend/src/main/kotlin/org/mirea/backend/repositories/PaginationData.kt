package org.mirea.backend.repositories

import org.jooq.Record
import org.jooq.TableField

interface PaginationData<R : Record, T> {
    val field: TableField<R, T>

    val size: Int?

    val direction: SortDirection

    val lastSelectedValue: T?

    fun getSorted() = when(direction) {
        SortDirection.ASC -> field.asc()
        SortDirection.DESC -> field.desc()
    }
}