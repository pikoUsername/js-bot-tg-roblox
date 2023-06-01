export function callback(bot) {
    return async (callbackQuery) => {  
        const chatId = callbackQuery.message.chat.id;
        const data = callbackQuery.data;
        const messageId = callbackQuery.message.message_id;
        if (data === "buyRobux") {
            const message = `Какое количество робуксов вы желаете купить?\nКурс робуксов: 1руб - 1робукс `;
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться назад",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            });
            chatState[chatId] = "waitMoneyAmount"
        } else if (data === "calculator") {
            bot.editMessageText("🧮 Я калькулятор, для подсчета робуксов \n[Курс робуксов -> 1 руб - 1.8 робукса]\n", {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Подсчитать стоимость геймпасса",
                                callback_data: "gamepassCostCalculator",
                            }
                        ],
                        [
                            {
                                text: "Подсчитать стоимость робуксов",
                                callback_data: "robuxCostCalculator",
                            }
                        ],
                        [
                            {
                                text: "Вернуться назад",
                                callback_data: "backToMenu",
                            }
                        ]
                    ]
                }
            })
        } else if (data === "giveaway") {
            const userId = callbackQuery.from.id;
            db.get(`SELECT userBalance FROM users WHERE userId = ?`, [userId], function (err, row) {
                if (err) {
                    return console.error(err.message);
                }
                const balance = row ? row.userBalance : 0;
                bot.editMessageText(`Ваш текующий баланс робуксов: ${balance}\nСколько робуксов вы хотите вывести?`, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Вернуться назад",
                                    callback_data: "backToMenu"
                                }
                            ]
                        ]
                    }
                })
                chatState[chatId] = "vivodMoney"
            })

        } else if (data === "profile") {
            const userId = callbackQuery.from.id;
            db.get(`SELECT userBalance FROM users WHERE userId = ?`, [userId], function (err, row) {
                if (err) {
                    return console.error(err.message);
                }
                const balance = row ? row.userBalance : 0;
                const profile = `
    👤 Ваш профиль: 
    🆔 Ваш айди - ${chatId}
    💰 Ваш баланс - ${balance} робуксов
            `
                bot.editMessageText(profile, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Пополнить баланс",
                                    callback_data: "buyRobux"
                                }
                            ],
                            [
                                {
                                    text: "Вернуться назад",
                                    callback_data: "backToMenu"
                                }
                            ]
                        ]
                    }
                })
            })

        } else if (data === "balance") {
            const userId = callbackQuery.from.id;
            db.get(`SELECT userBalance FROM users WHERE userId = ?`, [userId], function (err, row) {
                if (err) {
                    return console.error(err.message);
                }
                const balance = row ? row.userBalance : 0;
                bot.editMessageText(`Ваш текующий баланс: ${balance} робуксов\n Вы можете пополнить баланс по команде ниже`, {
                    chat_id: chatId,
                    message_id: messageId,
                    reply_markup: {
                        inline_keyboard: [
                            [
                                {
                                    text: "Пополнить баланс",
                                    callback_data: "buyRobux"
                                }
                            ],
                            [
                                {
                                    text: "Вернуться назад",
                                    callback_data: "backToMenu"
                                }
                            ]
                        ]
                    }
                })
            })

        } else if (data === "newsChanel") {
            bot.editMessageText(`Новостной канал:`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться назад",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "helpAdmin") {
            bot.editMessageText(`Тех поддержка в режиме 24/7 \nВоспользуйтесь командой ниже, чтобы наши операторы смогли с вами связаться`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться назад",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "backToMenu") {
            const message = "Вот мое меню:";
            chatState[chatId] = "userState"
            bot.editMessageText(message, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
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
                                text: "👤Профиль👤", callback_data: "profile"
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
            )
        } else if (data === "paySberbank") {
            payment = "Сбербанк"
            bot.editMessageText(`Сбер карта -> 2202 2023 4153 6872\n[Дмитрий Тимофеевич Ш.]\nОбязательно в качестве комментария пришлите ваш айди!\nВаш айди: ${chatId}\nПосле оплаты, жмите на эту кнопку`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Я оплатил",
                                callback_data: "userOplatil"
                            }
                        ],
                        [
                            {
                                text: "Назад",
                                callback_data: "buyRobux"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "payTinkoff") {
            payment = "Тинькофф"
            bot.editMessageText(`Тинькофф карта -> 2200 7007 1276 5014\n[Дмитрий Тимофеевич Ш.]\nОбязательно в качестве комментария пришлите ваш айди!\nВаш айди: ${chatId}\nПосле оплаты, жмите на эту кнопку`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Я оплатил",
                                callback_data: "userOplatil"
                            }
                        ],
                        [
                            {
                                text: "Назад",
                                callback_data: "buyRobux"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "payQIWI") {
            payment = "Киви"
            bot.editMessageText(`QIWI номер -> +7 961 439 77 99\nОбязательно в качестве комментария пришлите ваш айди!\nВаш айди: ${chatId}\nПосле оплаты, жмите на эту кнопку`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Я оплатил",
                                callback_data: "userOplatil"
                            }
                        ],
                        [
                            {
                                text: "Назад",
                                callback_data: "buyRobux"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "payKaspi") {
            payment = "Каспи"
            bot.editMessageText(`KASPIBANK номер -> +7 708 987 95 12\nОбязательно в качестве комментария пришлите ваш айди!\nВаш айди: ${chatId}\nПосле оплаты, жмите на эту кнопку`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Я оплатил",
                                callback_data: "userOplatil"
                            }
                        ],
                        [
                            {
                                text: "Назад",
                                callback_data: "buyRobux"
                            }
                        ]
                    ]
                }
            })
        } else if (data === "userOplatil") {
            bot.editMessageText(`Ваша заявка принята! \nОжидайте пополнение в течении 3-х часов!`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться в меню",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            })
            const keyboard = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Пополнить этой дуре баланс", callback_data: "avtoPopolnenyieDlyaZayavka"
                            }
                        ]
                    ]
                }
            }
            bot.sendMessage(809124390, `Поступила заявка от пользователя ${chatId}, на сумму ${Dividednumber} рублей!\nОплата была сделана через ${payment}`, keyboard)
            specialUserId = chatId
            return specialUserId
        } else if (data === "gamepassCostCalculator") {
        } else if (data === "gamepassCostCalculator") {
        } else if (data === "vivodDa") {
            bot.editMessageText(`Вы собираетесь выводить ${vivodNumber} робуксов! \nТеперь введите ссылку на геймпасс:`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться в меню",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            })
            chatState[chatId] = "linkwait"
            console.log(chatState[chatId])
        } else if (data === "otmenaPayment") {
            bot.editMessageText(`отменилась покупка`, {
                chat_id: chatId,
                message_id: messageId,
                reply_markup: {
                    inline_keyboard: [
                        [
                            {
                                text: "Вернуться в меню",
                                callback_data: "backToMenu"
                            }
                        ]
                    ]
                }
            })
            chatState[chatId] = "linkwait2"
            console.log(chatState[chatId])
        } else if (data === "avtoPopolnenyieDlyaZayavka") {
            function increaseUserBalance(userId, amount, callback) {
                db.run(
                    `UPDATE users SET userBalance = userBalance + ? WHERE userId = ?`,
                    [amount, userId],
                    function (err) {
                        if (err) {
                            console.error(err.message);
                            callback({ success: false });
                        } else {
                            callback({ success: true });
                        }
                    }
                );
            }
            const chatId = 809124390
            const adminUserId = 809124390
            const targetUserId = specialUserId
            const amount = Dividednumber * 1.8
            if (isAdminUser(adminUserId)) {
                // Вызов функции для пополнения баланса пользователя
                increaseUserBalance(targetUserId, amount, (result) => {
                    if (result.success) {
                        bot.sendMessage(chatId, `Баланс пользователя с ID ${targetUserId} успешно пополнен на ${amount}`);
                    } else {
                        bot.sendMessage(chatId, `Не удалось пополнить баланс пользователя с ID ${targetUserId}`);
                    }
                });
            } else {
                bot.sendMessage(chatId, "У вас нет прав на выполнение этой команды");
        }
    }} 
}