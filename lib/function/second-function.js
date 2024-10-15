export function request() {
    console.log('request pass second function')

    return {

    }
}

export function response(ctx) {
    const currArr = ctx.prev.result;
    currArr.push(
        { id: 'demo3', version: '3.0', name: 'hello' }
    )
    return currArr
}