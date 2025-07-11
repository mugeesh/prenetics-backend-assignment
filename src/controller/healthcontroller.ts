import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { logger } from '../component/logger';

export const healthController = new class {
    // New health check method
    healthCheck = async (_request: Request, response: Response) => {
        try {
            const manager = getManager();
            await manager.query('SELECT 1');
            response.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                database: 'connected',
                uptime: process.uptime()
            });
        } catch (error) {
            logger.error(`Health check failed: ${error.message}`);
            response.status(503).json({
                status: 'unhealthy',
                error: error.message,
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
    }
};
