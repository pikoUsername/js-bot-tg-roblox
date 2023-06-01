import { connect } from "amqplib"


export class RabbitMQPublisher { 
    static Instance = null 

    constructor(dsn, queue_name) { 
        this.queue_name = queue_name 
        this.dsn = dsn 
        this.connection = null 
        this.channel = null 
    }

    async _connect() { 
        this.connection = await connect(this.dsn) 
        this.channel = await this.connection.createChannel()
    }

    async setup() { 
        if (this.connection === null || this.channel === null) { 
            await this._connect() 
        } 
        await this.channel.assertQueue(this.queue, {durable: true, autoDelete: false, arguments: {"x-max-priority": 10}});
    }

    async checkConnection() { 
        if (this.connection === null || this.channel === null) { 
            await this._connect()            
        }
    }

    send(body) { 
        const messageBuffer = Buffer.from(body);

        this.channel.sendToQueue(this.queue_name, messageBuffer, {contentType: "application/json"});
    }

    sendUrl(url, price, tx_id) { 
        console.log(`URL: ${url}, Price: ${price}, TX_ID: ${tx_id}`)
        this.send(`{"url": "${url}", "price": ${price}, "tx_id": ${tx_id}}`)
    }

    static setInstance(ins) { 
        RabbitMQPublisher.Instance = ins  
    }

    static getInstance() { 
        // singleton 
        return RabbitMQPublisher.Instance
    }
}


// реализация паттерна фасад
export async function sendURLToRabbitMq(url, price, tx_id) {
    
    try {
        const publisher = RabbitMQPublisher.getInstance() 

        await publisher.sendUrl(url, price, tx_id)

        console.log('Message sent to RabbitMQ');
    } catch (error) {
        console.error('Failed to send message to RabbitMQ', error);
    }
}

export async function connectToRabbitMQ(amqp_url, queue_name) {
    console.log(`Publisher DSN: ${amqp_url}, with queue_name ${queue_name}`)
    const publisher = new RabbitMQPublisher(amqp_url, queue_name)
    RabbitMQPublisher.setInstance(publisher)
    await publisher.setup()
}

