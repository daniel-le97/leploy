export const NOTFOUND = createError({ message: 'Not Found', statusCode: 404 })
export const UNAUTHORIZED = createError({ message: 'Unauthorized', statusCode: 401 })
export const FORBIDDEN = createError({ message: 'Forbidden', statusCode: 403 })
export const BADREQUEST = createError({ message: 'Bad Request', statusCode: 400 })
export const SERVERERROR = createError({ message: 'Server Error', statusCode: 500 })
export const NOTIMPLEMENTED = createError({ message: 'Not Implemented', statusCode: 501 })
export const UNAVAILABLE = createError({ message: 'Service Unavailable', statusCode: 503 })
export const GATEWAYTIMEOUT = createError({ message: 'Gateway Timeout', statusCode: 504 })
export const BADGATEWAY = createError({ message: 'Bad Gateway', statusCode: 502 })
export const CONFLICT = createError({ message: 'Conflict', statusCode: 409 })
export const UNPROCESSABLE = createError({ message: 'Unprocessable', statusCode: 422 })
export const TOOEARLY = createError({ message: 'Too Early', statusCode: 425 })
export const TOOMANYREQUESTS = createError({ message: 'Too Many Requests', statusCode: 429 })
export const REQUESTTOOLARGE = createError({ message: 'Request Too Large', statusCode: 413 })
export const REQUESTURITOOLONG = createError({ message: 'Request URI Too Long', statusCode: 414 })
export const UNSUPPORTEDMEDIATYPE = createError({ message: 'Unsupported Media Type', statusCode: 415 })
export const PAYMENTREQUIRED = createError({ message: 'Payment Required', statusCode: 402 })
export const LENGTHREQUIRED = createError({ message: 'Length Required', statusCode: 411 })
export const PRECONDITIONFAILED = createError({ message: 'Precondition Failed', statusCode: 412 })
export const UPGRADEREQUIRED = createError({ message: 'Upgrade Required', statusCode: 426 })
export const PRECONDITIONREQUIRED = createError({ message: 'Precondition Required', statusCode: 428 })
export const MISDIRECTEDREQUEST = createError({ message: 'Misdirected Request', statusCode: 421 })
export const TOOMANYCONNECTIONS = createError({ message: 'Too Many Connections', statusCode: 421 })
export const UNORDEREDCOLLECTION = createError({ message: 'Unordered Collection', statusCode: 425 })
export const UNAVAILABLEFORLEGALREASONS = createError({ message: 'Unavailable For Legal Reasons', statusCode: 451 })
export const CLIENTCLOSEDREQUEST = createError({ message: 'Client Closed Request', statusCode: 499 })
export const INTERNALSERVERERROR = createError({ message: 'Internal Server Error', statusCode: 500 })
