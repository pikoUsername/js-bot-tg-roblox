export class TransactionRepository { 
    static Instance = null 

    constructor(conn) { 
        this.conn = conn 
    }

    getByID(id) { 
        return this.conn.execute("SELECT * FROM transactions WHERE id = ?", [id]) 
    }

    acceptIt(id, userID) { 
        this.conn.execute(`
        UPDATE transactions SET accepted = true WHERE id = ? 
        `, [id])
        this.conn.execute(`
        UPDATE users SET balance = balance - (SELECT price FROM tranactions WHERE id = ? AND accepted = true LIMIT 1) WHERE id = ?
        `, [id, userID])
    }

    create(name, url, user_id, price) { 
        return this.conn.execute(`
            INSERT INTO transactions(name, url, user_id, price) VALUES (?, ?, ?, ?) RETURNING * 
        `, [name, url, user_id, price])
    }

    getUserByTransaction(id) {  
        return this.conn.get(`
            SELECT u.* FROM users AS u WHERE id IN (SELECT user_id FROM transactions AS tx WHERE user_id = ?) 
        `, [id])
    }

    createTable() { 
        this.conn.execute(`
        CREATE TABLE IF NOT EXISTS transactions( 
            id SERIAL PRIMARY KEY, 
            name VARCHAR(52) NOT NULL, 
            user_id INTEGER REFERENCE users(id) NOT NULL ON DELETE CASCADE, 
            url TEXT NOT NULL, 
            accepted BOOLEAN DEFAULT false, 
            status INTEGER, 
            price INTEGER); 
        `)
    }

    static getInstance() { 
        return TransactionRepository.Instance
    }

    static setInstance(ins) { 
        TransactionRepository.Instance = ins 
    }
}

export class UsersRepository { 
    static Instance = null 

    constructor(conn) { 
        this.conn = conn 
    }

    getByID(id) { 
        this.conn.fetch(
            `SELECT * FROM users WHERE id = ?;`, [id]
        )
    }

    create(tg_username, user_id) { 
        this.conn.execute(
            `INSERT INTO users(tg_username, user_id) VALUES (?, ?)`, [tg_username, user_id]
        )
    }

    createTable() { 
        this.conn.execute(
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tg_username VARCHAR(125),
                balance INTEGER DEFAULT 0,
                user_id INTEGER,
                timeReg TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                chatState VARCHAR(125) DEFAULT 'chat_state',
                allAmountBalance INTEGER DEFAULT 0 
            )`
        )
    }

    static getInstance() { 
        return TransactionRepository.Instance
    }

    static setInstance(ins) { 
        TransactionRepository.Instance = ins 
    }
}


export function createTables(conn) { 
    let trans = new TransactionRepository(conn)
    
    trans.createTable()
}
