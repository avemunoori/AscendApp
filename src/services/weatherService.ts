import { WeatherData, ClimbingConditions, WeatherRequest } from '../types/weather';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL } from '@env';

class WeatherService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = WEATHER_API_KEY;
    this.baseUrl = WEATHER_API_BASE_URL;
  }

  async getWeatherData(request: WeatherRequest): Promise<WeatherData> {
    const { location, days = 3 } = request;
    const url = `${this.baseUrl}/forecast.json?key=${this.apiKey}&q=${encodeURIComponent(location)}&days=${days}&aqi=no`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Weather API request failed:', error);
      throw error;
    }
  }

  analyzeClimbingConditions(weatherData: WeatherData): ClimbingConditions {
    const { current } = weatherData;
    const conditions: ClimbingConditions = {
      overall: 'good',
      temperature: this.analyzeTemperature(current.temp_c),
      wind: this.analyzeWind(current.wind_kph),
      precipitation: this.analyzePrecipitation(current.precip_mm),
      visibility: this.analyzeVisibility(current.vis_km),
      uv: this.analyzeUV(current.uv),
      recommendations: [],
      warnings: [],
    };

    // Determine overall conditions
    const scores = [
      this.getScore(conditions.temperature.status),
      this.getScore(conditions.wind.status),
      this.getScore(conditions.precipitation.status),
      this.getScore(conditions.visibility.status),
      this.getScore(conditions.uv.status),
    ];

    const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    if (averageScore >= 4.5) conditions.overall = 'excellent';
    else if (averageScore >= 3.5) conditions.overall = 'good';
    else if (averageScore >= 2.5) conditions.overall = 'fair';
    else if (averageScore >= 1.5) conditions.overall = 'poor';
    else conditions.overall = 'dangerous';

    // Generate recommendations and warnings
    this.generateRecommendations(conditions, current);
    this.generateWarnings(conditions, current);

    return conditions;
  }

  private analyzeTemperature(tempC: number) {
    if (tempC >= 15 && tempC <= 25) {
      return {
        status: 'optimal' as const,
        description: `Perfect climbing temperature at ${tempC}°C`,
        recommendation: 'Ideal conditions for sending hard!',
      };
    } else if (tempC > 25 && tempC <= 30) {
      return {
        status: 'warm' as const,
        description: `Warm at ${tempC}°C - stay hydrated`,
        recommendation: 'Bring extra water and take breaks in shade',
      };
    } else if (tempC >= 10 && tempC < 15) {
      return {
        status: 'cold' as const,
        description: `Cool at ${tempC}°C - good for friction`,
        recommendation: 'Warm up properly and bring layers',
      };
    } else {
      return {
        status: 'extreme' as const,
        description: `Extreme temperature at ${tempC}°C`,
        recommendation: 'Consider indoor climbing or wait for better conditions',
      };
    }
  }

  private analyzeWind(windKph: number) {
    if (windKph < 10) {
      return {
        status: 'calm' as const,
        description: 'Calm conditions',
        recommendation: 'Perfect for outdoor climbing',
      };
    } else if (windKph < 20) {
      return {
        status: 'light' as const,
        description: `Light breeze at ${windKph} km/h`,
        recommendation: 'Good climbing conditions',
      };
    } else if (windKph < 35) {
      return {
        status: 'moderate' as const,
        description: `Moderate wind at ${windKph} km/h`,
        recommendation: 'Be cautious on exposed routes',
      };
    } else if (windKph < 50) {
      return {
        status: 'strong' as const,
        description: `Strong wind at ${windKph} km/h`,
        recommendation: 'Avoid high exposure routes',
      };
    } else {
      return {
        status: 'dangerous' as const,
        description: `Dangerous wind at ${windKph} km/h`,
        recommendation: 'Not recommended for climbing',
      };
    }
  }

  private analyzePrecipitation(precipMm: number) {
    if (precipMm === 0) {
      return {
        status: 'none' as const,
        description: 'No precipitation',
        recommendation: 'Dry conditions for climbing',
      };
    } else if (precipMm < 2.5) {
      return {
        status: 'light' as const,
        description: `Light precipitation (${precipMm}mm)`,
        recommendation: 'Rock may be slightly damp',
      };
    } else if (precipMm < 7.5) {
      return {
        status: 'moderate' as const,
        description: `Moderate precipitation (${precipMm}mm)`,
        recommendation: 'Avoid climbing - rock will be wet',
      };
    } else {
      return {
        status: 'heavy' as const,
        description: `Heavy precipitation (${precipMm}mm)`,
        recommendation: 'Dangerous conditions - stay indoors',
      };
    }
  }

  private analyzeVisibility(visKm: number) {
    if (visKm >= 10) {
      return {
        status: 'clear' as const,
        description: 'Excellent visibility',
        recommendation: 'Great for route finding',
      };
    } else if (visKm >= 5) {
      return {
        status: 'hazy' as const,
        description: 'Reduced visibility',
        recommendation: 'Take extra care with route finding',
      };
    } else {
      return {
        status: 'poor' as const,
        description: 'Poor visibility',
        recommendation: 'Not recommended for climbing',
      };
    }
  }

  private analyzeUV(uv: number) {
    if (uv <= 2) {
      return {
        status: 'low' as const,
        description: 'Low UV index',
        recommendation: 'Minimal sun protection needed',
      };
    } else if (uv <= 5) {
      return {
        status: 'moderate' as const,
        description: 'Moderate UV index',
        recommendation: 'Use sunscreen and seek shade',
      };
    } else if (uv <= 7) {
      return {
        status: 'high' as const,
        description: 'High UV index',
        recommendation: 'Use strong sunscreen and limit sun exposure',
      };
    } else if (uv <= 10) {
      return {
        status: 'very_high' as const,
        description: 'Very high UV index',
        recommendation: 'Climb in shade and use maximum protection',
      };
    } else {
      return {
        status: 'extreme' as const,
        description: 'Extreme UV index',
        recommendation: 'Avoid climbing during peak sun hours',
      };
    }
  }

  private getScore(status: string): number {
    const scores: { [key: string]: number } = {
      optimal: 5,
      good: 4,
      fair: 3,
      poor: 2,
      dangerous: 1,
      calm: 5,
      light: 4,
      moderate: 3,
      strong: 2,
      none: 5,
      clear: 5,
      low: 5,
      warm: 3,
      cold: 3,
      extreme: 1,
      hazy: 3,
      very_high: 2,
    };
    return scores[status] || 3;
  }

  private generateRecommendations(conditions: ClimbingConditions, current: any) {
    const { recommendations } = conditions;
    
    if (current.temp_c > 25) {
      recommendations.push('Bring extra water and electrolytes');
      recommendations.push('Take breaks in shaded areas');
    }
    
    if (current.temp_c < 15) {
      recommendations.push('Wear appropriate layers');
      recommendations.push('Warm up thoroughly before climbing');
    }
    
    if (current.uv > 5) {
      recommendations.push('Apply sunscreen with SPF 30+');
      recommendations.push('Wear a hat and protective clothing');
    }
    
    if (current.wind_kph > 20) {
      recommendations.push('Avoid exposed routes');
      recommendations.push('Bring wind protection');
    }
    
    if (current.precip_mm > 0) {
      recommendations.push('Check rock conditions before climbing');
      recommendations.push('Bring a towel for drying holds');
    }
    
    if (conditions.overall === 'excellent') {
      recommendations.push('Perfect conditions - go send that project!');
    }
  }

  private generateWarnings(conditions: ClimbingConditions, current: any) {
    const { warnings } = conditions;
    
    if (current.temp_c > 35 || current.temp_c < 0) {
      warnings.push('Extreme temperatures - consider indoor climbing');
    }
    
    if (current.wind_kph > 50) {
      warnings.push('Dangerous wind conditions - avoid climbing');
    }
    
    if (current.precip_mm > 5) {
      warnings.push('Wet rock conditions - climbing not recommended');
    }
    
    if (current.uv > 10) {
      warnings.push('Extreme UV - avoid climbing during peak hours');
    }
    
    if (current.vis_km < 2) {
      warnings.push('Poor visibility - climbing not safe');
    }
  }
}

export const weatherService = new WeatherService(); 