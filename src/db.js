import * as sqlite from 'sqlite';
// import sqlite3 from 'sqlite3';

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
    
    connect() { 
        this.conn = new sqlite.Database(this.dsn)
    }

    execute(query, args, callback=null) { 
        this.conn.run(query, args, callback)
    }

    fetch(query, args, callback=null) { 
        this.conn.get(query, args, callback)
    }

    close() { 
        this.conn.close()
    }
}
