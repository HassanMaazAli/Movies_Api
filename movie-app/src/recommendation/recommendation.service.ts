import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getRecommendations(userId: number): Promise<number[]> {
    const pythonServiceUrl = this.configService.get<string>('PYTHON_SERVICE_URL') || 'http://localhost:5000';
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${pythonServiceUrl}/recommend/${userId}`)
      );
      return response.data.recommendations; // expects { recommendations: [...] }
    } catch (error) {
      console.error('Python service error:', error.message);
      throw new HttpException(
        'Recommendation service unavailable',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}