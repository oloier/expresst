module.exports = class DatabaseAccess {

	/**
	 *Creates an instance of DatabaseAccess.
	 * @param {Object} config - The properties to configure database table details. 
	 * Includes {string} table name, {string} primaryKey column, and selectableColumns {Array}
	 * 
	 */
	constructor(config) {
		this.tableName = config.tableName
		this.primaryKey = config.key
		this.selectColumns = config.selectColumns || ''
	}
	
	// define what database engine the API will use
	get db() {
		switch (process.env.DB_ENGINE) {
		case 'postgres':
			return new (require('./postgresqlDAL'))
		case 'mysql':
			return new (require('./mysqlDAL'))
		case 'sqlite': default:
			return new (require('./sqliteDAL'))
		}
	}

}
