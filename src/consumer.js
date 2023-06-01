import { connect } from "amqplib"; 


export const STATUSCODES = { 
    200: "Успех", 
    500: "Провал, внутренная ошибка", 
    401: "Ошибка, попробуйте снова. Геймпасс уже куплен", 
    402: "Ошибка, внутренная проблема, нету доступных токенов", 
    400: "Ошибка, неправильный формат данных", 
    403: "Ошибка, количество робуксов которые вы хотели вывести и цена геймпасса отличаются!"
}

export function createConsumerInfo(queue_name=QUEUE_NAME, exchange_key=EXCHANGE_KEY, ) { 
    return { 
        queue_name: queue_name, 
        exchange_key: exchange_key, 
    }
}

export class RabbitMQConsumer { 
    static Instance = null 

    constructor(queue_dsn, info, onMessage) { 
        this.dsn = queue_dsn
        this.info = info 
        this.connection = null 
        this.channel = null

        if (onMessage === null || onMessage === undefined) {  
            this.onMessage = this.defaultOnMessage  
        } else { 
            this.onMessage = onMessage
        }

        this.prefetch = 2 
        this.running = false 
    }

    async _init_queues() { 
        await this.channel.assertExchange(
            this.info.exchange_key, 
            "direct",
            {
                durable: true,
                autoDelete: false,
                arguments: {"x-max-priority": 10}
            }
        )
        await this.channel.assertQueue( 
            this.info.queue_name, 
            {
                durable: true, 
                autoDelete: false, 
                arguments: {"x-max-priority": 10}, 
            }
        )
    }

    defaultOnMessage(body) { 
        console.log(`Accepted: ${body.content.toString()}`)

        this.channel.ack(body)
    }

    async setup() { 
        this.connection = await connect(this.dsn)
        this.channel = await this.connection.createChannel()

        await this._init_queues()

        await this.channel.bindQueue(this.info.queue_name, this.info.exchange_key, '')

        this.channel.on("error", this.errorHandler)
        this.channel.on("close", this.handleChannelClose)

        this.setPrefetch() 
    }

    errorHandler(err) { 
        console.error(err)
    }

    handleChannelClose(reason) { 
        console.log(`Reason is ${reason}`)
    }

    setPrefetch() { 
        console.log("Set prefetch to 2")
        this.channel.prefetch(this.prefetch)
    }

    runConsumer() { 
        if (this.running === true) { return }
        this.running = true 

        this.channel.bindQueue(this.info.queue_name, this.info.exchange_key, '').then(() => {
            console.log("Running Shit")
            this.channel.consume(this.info.queue_name, this.onMessage, {noAck: false})
        }) 
    }

    static setInstance(ins) { 
        RabbitMQConsumer.Instance = ins 
    }

    static getInstance() { 
        // singleton 
        return RabbitMQConsumer.Instance
    }
}

export async function createConsumer(dsn, info, onMessage) { 
    let ins = new RabbitMQConsumer(dsn, info, onMessage)
    RabbitMQConsumer.setInstance(ins)

    await ins.setup() 
} 

export async function runConsumer() { 
    let cons = RabbitMQConsumer.getInstance()
    try { 
        cons.runConsumer()

        console.log("Runned consumer")
    } catch(err) { 
        console.error(err)
    }
}
