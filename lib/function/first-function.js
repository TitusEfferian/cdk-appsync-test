export function request() {
    console.log('request pass first function')
    return {

    }
}

export function response(ctx) {
    return [
        { id: 'demo1', version: '1.0', name: 'hello' },
        { id: 'demo2', version: '2.0', name: 'hello' }
    ];
}