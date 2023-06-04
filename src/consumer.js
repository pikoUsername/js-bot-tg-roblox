import { connect } from "amqplib";
import { EXCHANGE_KEY, QUEUE_NAME } from "./consts.js";


export const STATUSCODES = {
    200: "Геймпасс успешно приобретен!",
    500: "Провал, внутренная ошибка",
    401: "Ошибка, попробуйте снова. Геймпасс уже приобретен нашим аккаунтом!",
    402: "Ошибка, внутренная проблема, нету доступных токенов. Повторите ваш запрос позже.",
    400: "Ошибка, неправильный формат данных",
    403: "Ошибка, количество робуксов которые вы хотели вывести и цена геймпасса отличаются!"
}

export function createConsumerInfo(queue_name = QUEUE_NAME, exchange_key = EXCHANGE_KEY,) {
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

        this.onMessage = onMessage
        this.prefetch = 2
        this.running = false
    }

    async stop() {
        if (!this.running) {
            return
        }

        await this.channel.close()
        await this.connection.close()

        this.running = false
    }

    async _init_queues() {
        await this.channel.assertExchange(
            this.info.exchange_key,
            "direct",
            {
                durable: true,
                autoDelete: false,
                arguments: { "x-max-priority": 10 }
            }
        )
        await this.channel.assertQueue(
            this.info.queue_name,
            {
                durable: true,
                autoDelete: false,
                arguments: { "x-max-priority": 10 },
            }
        )
    }

    defaultOnMessage() {
        return async (body) => {
            console.log(`Accepted: ${body.content.toString()}`)
            try {
                let result = await this.onMessage(body)

                if (result) {
                    this.channel.ack(body)
                } else {
                    this.channel.reject(body, false)
                }
            } catch (err) {
                console.error(err)
                await this.stop()
            }
        }
    }

    async setup() {
        this.connection = await connect(this.dsn)
        this.channel = await this.connection.createChannel()

        await this._init_queues()

        console.log(`Binding to ${this.info.queue_name} queue, and ${this.info.exchange_key} exchange key`)
        await this.channel.assertExchange(this.info.exchange_key, "direct", { durable: true, autoDelete: false })
        await this.channel.assertQueue(this.info.queue_name, { arguments: { "x-max-priority": 10 }, durable: true, autoDelete: false })

        await this.channel.bindQueue(this.info.queue_name, this.info.exchange_key, 'url_queue_return')

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

    async runConsumer() {
        if (this.running === true) { return }
        this.running = true

        console.log("Running Shit, queue_name: %s", this.info.queue_name)
        this.channel.consume(
            this.info.queue_name,
            this.defaultOnMessage(),
            { noAck: false }
        )
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

export function runConsumer() {
    let cons = RabbitMQConsumer.getInstance()
    try {
        cons.runConsumer()

        console.log("Runned consumer")
    } catch (err) {
        console.error(err)
    }
}
