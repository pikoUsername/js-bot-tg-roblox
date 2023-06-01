import TelegramBot from 'node-telegram-bot-api';
import { startHandler, minusBalance, blockUserHandler } from './src/handlers.js'
import { callback } from './src/callback_handler.js'

const bot = new TelegramBot("5605036155:AAHgseuE-0PXQvkrGxP414W-cZMVZmxigHY", { polling: true });

let chatState = {};
let Dividednumber;

bot.on("callback_query", callback(bot))
bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    if (msg.text === "Вызвать меню") {
        bot.sendMessage(chatId, "Вот мое меню:", Keyboard)
    }
    if (chatState[chatId] === "waitMoneyAmount") {
        if (msg.text === msg.text) {
            if (msg.text > 0) {
                const number = msg.text
                Dividednumber = Math.round(number / 1.8)
                costnumber = number * 0.59
                chatState[chatId] = "waitMoneyAmount"
                const keyboardPayments = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Сбербанк", callback_data: "paySberbank"
                                },
                                {
                                    text: "Тинькофф", callback_data: "payTinkoff"
                                }
                            ],
                            [
                                {
                                    text: "QIWI кошельек", callback_data: "payQIWI"
                                }
                            ],
                            [
                                {
                                    text: "KaspiBank [тенге]", callback_data: "payKaspi"
                                }
                            ]
                        ]
                    }
                }
                bot.sendMessage(chatId, `Вы хотите приобрести ${number} робуксов\nК оплате: ${Dividednumber} рублей\nВыберите ваш метод оплаты:`, keyboardPayments).then(chatState[chatId] = "lol")
                return Dividednumber
            } else {
                bot.sendMessage(chatId, "Вы неправильно ввели сумму для платежа! Попробуйте еще раз")
            }
        }
    }
    else if (chatState[chatId] === "vivodMoney") {
        if (msg.text === msg.text) {
            if (msg.text > 0) {
                const number = msg.text
                vivodNumber = number * 0.59
                chatState[chatId] = "vivodMoney"
                const keyboardPayments = {
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Да", callback_data: "vivodDa"
                                }
                            ],
                            [
                                {
                                    text: "Нет", callback_data: "vivodNet"
                                }
                            ]
                        ]
                    }
                }
                bot.sendMessage(chatId, `Вы хотите вывести ${number} робуксов?\n`, keyboardPayments).then(chatState[chatId] = "lol")
                // Отправка сообщения в RabbitMQ
                // sendToRabbitMQ(message);
            } else {
                bot.sendMessage(chatId, "Вы неправильно ввели сумму для вывода! Попробуйте еще раз")
            }
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
    const url = msg.text;
    if (chatState[chatId] === "linkwait") {
        if (isValidHttpUrl(url)) {
            const chatId = msg.chat.id;
            const url = msg.text
            bot.sendMessage(chatId, `Бот принял вашу ссылку! Ваша заявка на вывод в очереди. Ваша ссылка -> ${url}`);
        } else {
            const chatId = msg.chat.id;
            const Keyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Отменить покупку", callback_data: "otmenaPayment"
                            }
                        ]
                    ]
                }
            }
            bot.sendMessage(chatId, "Ссылка не правильная, попробуй еще раз!", Keyboard)
        }
    }
})

bot.onText(/\/start/, startHandler(bot));


bot.onText(/\/addbalance (\d+) (\d+)/, addBalance(bot));

bot.onText(/\/minusbalance (\d+) (\d+)/, minusBalance(bot));

bot.onText(/\/blockuser (\d+)/, blockUserHandler(bot));

bot.onText(/\/support/, (msg) => {
    const chatId = msg.chat.id;

    // Отправка приветственного сообщения от технической поддержки
    bot.sendMessage(chatId, 'Добро пожаловать в службу технической поддержки. Как мы можем вам помочь?');
});


function handleUserMessage(chatId, message) {
    // Здесь вы можете добавить логику обработки сообщения пользователя
    // и предоставить соответствующий ответ или рекомендации от технической поддержки.
    // Например, вы можете сохранять сообщения пользователя в базе данных для дальнейшей обработки.

    // Пример обработки сообщений пользователя
    if (message.toLowerCase().includes('проблема')) {
        d
        bot.sendMessage(chatId, 'Кажется, у вас возникла проблема. Мы постараемся помочь вам в ближайшее время.',);
    } else if (message.toLowerCase().includes('вопрос')) {
        bot.sendMessage(chatId, 'Если у вас есть вопрос, с удовольствием на него ответим.');
    } else {
    }
}

bot.on('polling_error', (error) => {
    console.log(error);
});