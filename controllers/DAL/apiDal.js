
class DatabaseAccess {

	constructor(config) {
		this.table = config.table
		this.primaryKey = config.key
	}
	
	// define what database engine the API will use
	get db() {
		switch (process.env.DB_ENGINE) {
		case 'postgres':
			return require('./postgresqlDAL')
		case 'mysql':
			return require('./mysqlDAL')
		case 'sqlite':
		default:
			return require('./sqliteDAL')
		}
	}

	// before SQLite, had automatic PK retreival. 
	// this would probably prove unreliable in production, though.
	/*async getKey() {
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
	}*/
}

module.exports = DatabaseAccess
