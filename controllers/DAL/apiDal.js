const mysql = require('./mySqlDal')
const postgres = require('./postgreSqlDal')
const sqlite = require('./sqliteDal')

let dbEngine = () => {
	switch (process.env.DB_ENGINE) {
	case 'postgres':
		return postgres
	case 'mysql':
		return mysql
	case 'sqlite':
		return sqlite
	default:
		return sqlite
	}
}

class databaseAccess {
	
	constructor(tableName/* , primaryKey */) {
		this.table = tableName
		// this.pkey = primaryKey
	}

	async getKey() {
		try {
			let sql, pk
			switch (process.env.DB_ENGINE) {
			case 'postgres':
				sql = `SELECT split_part(split_part(indexdef, '(', 2), ')', 1) 
					AS column_name FROM pg_indexes WHERE tablename = ?`
				pk = await this.db.execute(sql, [this.table])
				return pk[0].column_name
			case 'mysql':
				sql = `SELECT k.column_name
					FROM information_schema.table_constraints t
					JOIN information_schema.key_column_usage k
					USING(constraint_name, table_schema,table_name)
					WHERE t.constraint_type='PRIMARY KEY'
					AND t.table_schema=?
					AND t.table_name=?;`
				pk = await this.db.execute(sql, [dbEngine().settings.database, this.table])
				return pk[0].column_name || 'id'
			case 'sqlite':
				return 'ROWID'
			default:
				break
			}
		} catch (ex) {
			throw ex
		}
	}

	get db() {
		return dbEngine()
	}
}

module.exports = databaseAccess
