import TelegramBot from 'node-telegram-bot-api';
import { sendURLToRabbitMq, connectToRabbitMQ } from './src/publisher.js';
import { createConsumer, createConsumerInfo, runConsumer } from './src/consumer.js';
import { SQLiteConnector } from './src/db.js';
import { TransactionRepository, UsersRepository, createTables } from './src/repos.js';
import { QUEUE_NAME, QUEUE_RETURN_NAME, EXCHANGE_RETURN_KEY } from './src/consts.js'
const bot = new TelegramBot("5605925167:AAHEJZgNsc7NyKtcSCfJ1C0emJc5PCvVjNs", { polling: true });
const amqpUrl = 'amqp://user:password@localhost:5672/test?heartbeat=0' 


let conn = new SQLiteConnector("./database.db")


// Инициализация
try {    
    conn.connect()
    createTables(conn)
    connectToRabbitMQ(amqpUrl, QUEUE_NAME);
    createConsumer(amqpUrl, createConsumerInfo(QUEUE_RETURN_NAME, EXCHANGE_RETURN_KEY), TgOnMessageHandler).then(() => {
        runConsumer()
    })
} catch (err) { 
    console.error(err)
}

bot.on("polling_error", (msg) => console.error(msg));

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const dummy_price = 10; 

    if (IsState(INPUT_PRICE) && text) {
        await bot.sendMessage(chatId, "Введите сумму")       
    }

    if (isValidHttpUrl(url)) {  

        // Отправка сообщения в RabbitMQ
        let users = UsersRepository.getInstance()

        users.getByTgID(msg.from.id, async (err, currentUser) => { 
            if (err) { 
                console.error(err)
                return 
            }

            if (currentUser === null || currentUser === undefined) { 
                await bot.sendMessage(chatId, "Напишите /start что бы зарегетрироватся")
                return 
            }
            
            console.log(`Current user: ${currentUser}`)

            let trans = TransactionRepository.getInstance()
            trans.create("spisanie_balansa", url, currentUser.id, dummy_price, async (err, tx) => { 
                if (err) { 
                    console.error(err)
                    return 
                }
                console.log(`Transaction info: ${getKeys(tx)}`)

                await sendURLToRabbitMq(url, dummy_price, tx.id);
            }) 
            
            await bot.sendMessage(chatId, 'Нурстварьнеумеетписатьраздельно получил ваше сообщение удачно');
        })
    } 
});

bot.onText(/\/price/, (msg) => { 
    setState(msg, PRICE_STATE)
    bot.sendMessage(msg.chat.id, "Введите сумму которую вы хотите вывести")
})

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id 

    let users = UsersRepository.getInstance()

    users.getByTgID(userId, (err, row) => {
        if (err) { 
            console.error(err)
            return 
        }

        if (row === null || row === undefined) { 
            users.create(msg.from.username, userId, (row) => console.log(`Current user: ${row}`))
        }
        bot.sendMessage(chatId, "Отправь любую ссылку nurs тварь же")
     })

})

console.log("Running bot")
