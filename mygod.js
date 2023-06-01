import TelegramBot from 'node-telegram-bot-api';
import { RabbitMQPublisher, sendURLToRabbitMq, connectToRabbitMQ } from './src/publisher.js';
import { createConsumer, createConsumerInfo, runConsumer } from './src/consumer.js';
import { SQLiteConnector } from './src/db.js';
import { createTables } from './src/repos.js';
import { QUEUE_NAME, EXCHANGE_KEY } from './src/consts.js'
const bot = new TelegramBot("5605925167:AAHEJZgNsc7NyKtcSCfJ1C0emJc5PCvVjNs", { polling: true });
const amqpUrl = 'amqp://user:password@localhost:5672/test?heartbeat=0' 


function validateReturnData(data) { 
    if (typeof data.tx_id !== "number") { 
        throw new Error("Validation error: number is not number")
    }
    else if (!data.errors instanceof Array) { 
        throw new Error("Validation error: errors are not list")
    }
    else if (typeof data.info !== "string") { 
        throw new Error("Validation error: info is not string")
    } 
    else if (typeof data.status_code !== "int") { 
        throw new Error("Validation error: status code is not integer")
    }
    try {  
        STATUSCODES[data.status_code]
    } catch (err) { 
        throw new Error("Validation error: Status code does not exists")
    }
}

function isValidHttpUrl(string) {
    try {
      const newUrl = new URL(string);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
}

async function TgOnMessageHandler(body) { 
    let content = body.content.toString()
    let data = JSON.parse(content)

    console.log(`Validation return data: ${data}`)

    validateReturnData(data)

    let status_code_info = STATUSCODES[data.status_code]
    let tx_id = data.tx_id 

    let ins = repos.TransactionRepository.getInstance()
    let tx = ins.getByID(tx_id)
    if (tx === null || tx === undefined) { 
        return 
    }
    let user = ins.getUserByTransaction(tx_id) 
    await bot.sendMessage(user.userId, `Ваша транзакция обработана, вот её результат: \n ${status_code_info}`)
}

let conn = new SQLiteConnector("./database.db")
conn.connect().then(() => { 
    createTables(conn)
}).catch((reason) => console.error(reason))

// Вызов функции для подключения к RabbitMQ
try { 
    connectToRabbitMQ(amqpUrl, QUEUE_NAME);
    createConsumer(amqpUrl, createConsumerInfo(QUEUE_NAME, EXCHANGE_KEY), TgOnMessageHandler).then(() => {
        runConsumer()
    })
} catch (err) { 
    console.error(err)
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const url = msg.text;

    if (isValidHttpUrl(url)) { 
        // Отправка сообщения в RabbitMQ
        await publisher.sendURLToRabbitMq(url);
    } 

    await bot.sendMessage(chatId, 'Нурстварьнеумеетписатьраздельно получил ваше сообщение удачно');
});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, "Отправь любую ссылку nurs тварь же")
})

console.log("Running bot")

// Вызов функции для отправки сообщения в RabbitMQ
// sendToRabbitMQ('Тестовое сообщение');