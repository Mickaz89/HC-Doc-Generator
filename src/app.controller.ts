import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { FormBody } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('generate')
  generateForm(formBody: FormBody): Promise<string> {
    return this.appService.generateForm(formBody);
  }
}
