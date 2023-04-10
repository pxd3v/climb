import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    const { password, ...body } = req.body; // don't log password
    const { method, originalUrl } = req;
    const params = JSON.stringify({
      query: req.query,
      body: body,
    });
    const { authorization, ...filteredHeaders } = req.headers; // don't log authorization
    const headers = JSON.stringify(filteredHeaders);

    this.logger.log(`
      [Request]: 
        method: ${method} 
        url: ${originalUrl} 
        params: ${params}
        headers: ${headers}
    `);

    res.on('finish', () => {
      const user = JSON.stringify(req.user);
      this.logger.log(`
      [Response]: 
        method: ${method} 
        url: ${originalUrl} 
        user: ${user}
        code: ${res.statusCode}
        params: ${params}
      `);
    });
    next();
  }
}
