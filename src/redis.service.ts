import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly client: Redis;

  constructor(private configService: ConfigService) {
    this.client = new Redis({
      host: this.configService.get<string>('REDIS_HOST'),
      port: this.configService.get<number>('REDIS_PORT'),
    });
  }

  async set(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
  }

  async get(key: string): Promise<any> {
    const data = await this.client.get(key);
    return JSON.parse(data);
  }
}
