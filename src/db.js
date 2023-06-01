import sqlite3 from 'sqlite3'; 
// const sqlite3 = sqlite3.verbose()
const NOT_IMPLEMENTED_ERROR = "Not implemented"


export class BasicDBConnector { 
    connect() { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }

    execute(query, args=[], callback) { 
        throw new Error(NOT_IMPLEMENTED_ERROR)
    }

    get(query, args=[], callback) { 
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
    
    connect() { 
        console.log(`FILENAME: ${this.dsn}`);

        this.conn = new sqlite3.Database(this.dsn)
        console.log('Creating database connection');
    }

    execute(query, args=[], cb=null) {        
        return this.conn.get(query, args, cb)
    }

    fetch(query, args=[], cb=null) {                 
        return this.conn.get(query, args, cb)
    }

    close() { 
        this.conn.close()
    }
}
