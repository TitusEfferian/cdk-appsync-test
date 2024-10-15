export function request() {
  console.log('request pass resolver function')

  return {
  }
}

export function response(ctx) {
  return ctx.prev.result;
}