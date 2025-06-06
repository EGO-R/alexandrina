package org.mirea.backend.utils.repositories

import org.jooq.DSLContext
import org.jooq.Record
import org.jooq.Table
import org.jooq.TableField

abstract class TableMapper<E, R : Record>(
    private val dsl: DSLContext,
) {
    abstract val updateIgnoreFields: Set<TableField<R, *>>

    protected abstract fun map(entity: E): Map<TableField<R, *>, *>

    fun record(entity: E): R {
        val fieldsMap = map(entity)
        return setFields(fieldsMap)
    }

    fun updateRecord(entity: E): R {
        val fieldsMap = map(entity)
            .filterKeys { it !in updateIgnoreFields }
        return setFields(fieldsMap)
    }

    private fun setFields(fieldsMap: Map<TableField<R, *>, Any?>): R {
        val newRecord = dsl.newRecord(getTable(fieldsMap))

        fieldsMap.forEach { (k, v) ->
            newRecord.setValue(k, v)
        }

        return newRecord
    }

    private fun getTable(fieldsMap: Map<TableField<R, *>, Any?>): Table<R> {
        require(fieldsMap.isNotEmpty()) { "Fields must not be empty!" }

        return fieldsMap.keys.first().table ?: throw RuntimeException("Table can't be empty")
    }

    @Suppress("UNCHECKED_CAST")
    private fun <T> Record.setValue(field: TableField<out Record, T>, value: Any?) {
        this[field as TableField<Record, T>] = value as T
    }

    class RecordBuilder<R : Record> {
        private val values = mutableMapOf<TableField<R, *>, Any?>()

        infix fun <T> TableField<R, T>.set(value: T) {
            values[this] = value
        }

        fun build(): Map<TableField<R, *>, Any?> = values
    }

    fun <R : Record> fields(block: RecordBuilder<R>.() -> Unit): Map<TableField<R, *>, Any?> {
        return RecordBuilder<R>().apply(block).build()
    }

}