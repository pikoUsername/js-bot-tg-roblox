
const Keyboard = {
    reply_markup: {
        inline_keyboard: [
            [
                {
                    text: "👤Профиль👤", callback_data: "profile"
                }
            ],
            [
                {
                    text: "💸Купить R$💸", callback_data: "buyRobux"
                },
                {
                    text: "💲Вывести💲", callback_data: "giveaway"
                }
            ],
            [
                {
                    text: "🧍Поддержка🧍", callback_data: "helpAdmin"
                },
                {
                    text: "📰Новости📰", callback_data: "newsChanel"
                }
            ],
            [
                {
                    text: "💰Баланс💰", callback_data: "balance"
                },
                {
                    text: '🏦Калькулятор🏦', callback_data: "calculator"
                }
            ]
        ]
    }
}
const againMenu = {
    reply_markup: {
        keyboard: [
            [{ text: 'Вызвать меню' }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false,
    }
}