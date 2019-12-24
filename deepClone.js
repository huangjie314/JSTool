
const state = {
    info: {
        name: 'hj',
        full: {
            first: {
                name: 'huang'
            }
        }
    },
    data: [1]
}

function isPlainObject(value) {
    if (value && Array.isArray(value)) {
        return true;
    }
    if (!value || typeof value != 'object' || {}.toString.call(value) != '[object Object]') {
        return false;
    }

    return true;
}

let handleData = null;
const data = deepClone(state, (proxy) => {
    handleData = proxy;
})


function deepClone(data, fn) {
    const proxyObj = new Map();
    const copyObj = new Map();

    const handler = {
        get(target, key) {
            const data = copyObj.get(target) || target;
            return createProxy(data[key]);
        },
        set(target, key, value) {
            const copy = getCopy(target);
            copy[key] = value;
            return finalize(state);
        }
    }
    const createProxy = data => {
        if (isPlainObject(data)) {
            if (proxyObj.has(data)) {
                return proxyObj.get(data);
            }
            const proxy = new Proxy(data, handler);
            proxyObj.set(data, proxy);
            return proxy;
        }
        return data;
    }


    const getCopy = data => {
        if (copyObj.get(data)) {
            return copyObj.get(data);
        }
        const copy = Array.isArray(data) ? data.slice() : { ...data };
        copyObj.set(data, copy);
        return copy;
    }

    const finalize = data => {
        if (isPlainObject(data)) {
            if (!proxyObj.has(data) && !copyObj.has(data)) {
                return data;
            }
            const copy = getCopy(data);
            Object.keys(copy).forEach(key => {
                copy[key] = finalize(copy[key]);
            })
            return copy;
        }
        return data;
    }


    const proxy = createProxy(data);
    fn && fn(proxy);
    return finalize(data);
}









