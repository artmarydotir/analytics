Object.defineProperty(global, '__stack', {
  get() {
    const orig = Error.prepareStackTrace;
    Error.prepareStackTrace = (_, stack) => stack;
    const err = new Error();
    // eslint-disable-next-line no-caller, no-restricted-properties
    Error.captureStackTrace(err, arguments.callee);
    const { stack } = err;
    Error.prepareStackTrace = orig;
    return stack;
  },
});

Object.defineProperty(global, '__debugPoint', {
  get() {
    const points = [];
    // @ts-ignore
    __stack.forEach((stack, i) => {
      if (stack.getFileName().match(/^node:/) || i === 0) {
        return;
      }
      const trace = [
        stack.getFileName(),
        stack.getLineNumber(),
        stack.getColumnNumber(),
      ].join(':');
      const part = `${trace} [${
        stack.getFunctionName() || 'anonymous'
      }]`.replace('/app/api/', 'app/api/');
      points.push(part);
    });
    return JSON.stringify(points);
  },
});
