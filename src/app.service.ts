import { Injectable } from '@nestjs/common';
import { FormBody } from './interfaces';
import { PDFDocument, PDFField } from 'pdf-lib';
import * as fs from 'fs';
import * as path from 'path';
import { google, Auth } from 'googleapis';
import { Readable } from 'stream';
import { processField } from './formUtils';
import { RedisService } from './redis.service';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;
  constructor(private readonly redisService: RedisService) {
    this.client = ClientProxyFactory.create({
      transport: Transport.REDIS,
      options: {
        host: 'localhost',
        port: 6379,
      },
    });
  }

  async generateForm(formBody: FormBody): Promise<string> {
    const pdfDoc = await this.loadPdfDocument();
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    fields.forEach((field: PDFField) => processField(field, formBody));
    form.flatten();

    const pdfBytes = await pdfDoc.save();
    const url = await this.uploadToGoogleDrive(pdfBytes);

    await this.redisService.set('status', 'finish');
    this.client.emit('document', { status: 'finish', url });

    return url;
  }

  private async loadPdfDocument(): Promise<PDFDocument> {
    const formPath = path.join(__dirname, '../Form.pdf');
    const existingPdfBytes = fs.readFileSync(formPath);
    return await PDFDocument.load(existingPdfBytes);
  }

  private async uploadToGoogleDrive(pdfBytes: Uint8Array): Promise<string> {
    const serviceAccountPath = path.join(__dirname, '../service-account.json');
    const auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountPath,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const authClient = await auth.getClient();
    const drive = google.drive({
      version: 'v3',
      auth: authClient as Auth.OAuth2Client,
    });

    const fileMetadata = {
      name: 'FilledForm.pdf',
      parents: ['1WWLLcem9kI_1-fX4UpC8I2_Ho4u_iINg'],
    };

    const media = {
      mimeType: 'application/pdf',
      body: Readable.from(Buffer.from(pdfBytes)),
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id',
    });

    const fileId = res.data.id;
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
}
