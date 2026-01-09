// Structured logging utility

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  function: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class Logger {
  private functionName: string;
  private requestId: string;
  private userId?: string;
  private startTime: number;

  constructor(functionName: string, requestId?: string) {
    this.functionName = functionName;
    this.requestId = requestId || crypto.randomUUID();
    this.startTime = Date.now();
  }

  setUserId(userId: string) {
    this.userId = userId;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      function: this.functionName,
      requestId: this.requestId,
      userId: this.userId,
      duration: Date.now() - this.startTime,
      metadata,
    };

    const output = JSON.stringify(entry);
    
    switch (level) {
      case 'error':
        console.error(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'debug':
        console.debug(output);
        break;
      default:
        console.log(output);
    }
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    this.log('error', message, {
      ...metadata,
      error: error ? { name: error.name, message: error.message, stack: error.stack } : undefined,
    });
  }

  // Log request start
  request(method: string, path: string) {
    this.info(`${method} ${path}`, { method, path });
  }

  // Log request completion
  response(status: number) {
    this.info(`Response: ${status}`, { status, duration: Date.now() - this.startTime });
  }
}

export function createLogger(functionName: string, req?: Request): Logger {
  const requestId = req?.headers.get('x-request-id') || undefined;
  return new Logger(functionName, requestId);
}
