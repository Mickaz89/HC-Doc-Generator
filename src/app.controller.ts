import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { FormBody } from './interfaces';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern('generate')
  generateForm(formBody: FormBody): Promise<string> {
    console.log('CONTROLLER ', formBody);
    return this.appService.generateForm(formBody);
  }
}
