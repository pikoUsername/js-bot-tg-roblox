
export function validateReturnData(data) { 
    if (typeof data.tx_id !== "number") { 
        throw new Error("Validation error: tx_id is not number")
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

export function isValidHttpUrl(string) {
    try {
      const newUrl = new URL(string);
      return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
    } catch (err) {
      return false;
    }
}

export var getKeys = function(obj){
    var keys = [];
    for(var key in obj){
       keys.push(key);
    }
    return keys;
}

export function isAdminUser(userId) {
    const adminUserIds = [809124390, 789012];
    return adminUserIds.includes(userId);
}
