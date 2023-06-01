import * as sqlite from 'sqlite';
import sqlite3 from 'sqlite3'; 
const NOT_IMPLEMENTED_ERROR = "Not implemented"


export class BasicDBConnector { 
    connect() { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }

    execute(query, args, callback) { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }

    get(query, args, callback) { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }

    close() { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }
}

export class SQLiteConnector extends BasicDBConnector { 
    constructor(dsn) { 
        super();

        this.dsn = dsn 
        this.conn = null 
    }
    
    async connect() { 
        console.log(`FILENAME: ${this.dsn}`);


        this.conn = new sqlite.Database({filename: this.dsn, driver: sqlite.Database});
        console.log('Creating database connection');
        await this.conn.open();
    }

    async execute(query, args, callback=null) { 
        await this.conn.run(query, args, callback)
    }

    async fetch(query, args, callback=null) { 
        await this.conn.get(query, args, callback)
    }

    async close() { 
        await this.conn.close()
    }
}
