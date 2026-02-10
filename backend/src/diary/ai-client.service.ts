import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface AIRewriteRequest {
  user_text: string;
  ielts_level: number;
}

export interface AIRewriteResponse {
  original_text: string;
  rewritten_text: string;
  new_words: Array<{
    english_word: string;
    turkish_meaning: string;
  }>;
  ielts_level: number;
}

@Injectable()
export class AiClientService {
  private readonly logger = new Logger(AiClientService.name);
  private readonly aiServiceUrl: string;

  constructor(private configService: ConfigService) {
    // AI Service URL'i environment'tan al
    this.aiServiceUrl = this.configService.get<string>('AI_SERVICE_URL') || 'http://localhost:8001';
  }

  /**
   * FastAPI servisine istek gönderir
   */
  async rewriteText(userText: string, ieltsLevel: number): Promise<AIRewriteResponse> {

    try {
        
        this.logger.log(`Sending text to AI service (level: ${ieltsLevel})`);

        const response = await fetch(`${this.aiServiceUrl}/rewrite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_text: userText,
                ielts_level: ieltsLevel,
            }),
        });

        if (!response.ok) {
            // HTTP hatası
            const error = await response.text();
            this.logger.error(`AI service error: ${error}`);
            throw new HttpException(
                'AI servisi yanıt vermedi',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }

        const data = await response.json();
        this.logger.log('AI service response received');

        return data as AIRewriteResponse;   

    } catch (error) {
        this.logger.error('Failed to connect to AI service ', error);

        if (error instanceof HttpException) {
            throw error;
        }

        throw new HttpException(
            'AI servisiyle iletişim hatası',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
}