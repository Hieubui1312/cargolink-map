export function randomStr(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export function debounce (fn, delay) {
    return (self, ...args) => {
        clearTimeout(fn.id)

        fn.id = setTimeout(() => {
            fn.call(self, ...args)
        }, delay)
    }
}
