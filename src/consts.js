export const QUEUE_NAME = "url_queue"
export const QUEUE_RETURN_NAME = "url_queue_return"
export const EXCHANGE_RETURN_KEY = "url_return"
export const EXCHANGE_KEY = "url"


export const STATUSCODES = { 
    200: "Успех", 
    500: "Провал, внутренная ошибка", 
    401: "Ошибка, попробуйте снова. Геймпасс уже куплен", 
    402: "Ошибка, внутренная проблема, нету доступных токенов", 
    400: "Ошибка, неправильный формат данных", 
    403: "Ошибка, количество робуксов которые вы хотели вывести и цена геймпасса отличаются!"
}
