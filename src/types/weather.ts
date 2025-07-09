export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    wind_mph: number;
    wind_degree: number;
    wind_dir: string;
    pressure_mb: number;
    precip_mm: number;
    precip_in: number;
    humidity: number;
    cloud: number;
    feelslike_c: number;
    feelslike_f: number;
    vis_km: number;
    vis_miles: number;
    uv: number;
    gust_kph: number;
    gust_mph: number;
  };
  forecast?: {
    forecastday: ForecastDay[];
  };
}

export interface ForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    maxtemp_f: number;
    mintemp_c: number;
    mintemp_f: number;
    avgtemp_c: number;
    avgtemp_f: number;
    maxwind_kph: number;
    maxwind_mph: number;
    totalprecip_mm: number;
    totalprecip_in: number;
    avgvis_km: number;
    avgvis_miles: number;
    avghumidity: number;
    daily_chance_of_rain: number;
    daily_chance_of_snow: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    uv: number;
  };
  hour: HourlyForecast[];
}

export interface HourlyForecast {
  time: string;
  temp_c: number;
  temp_f: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
  wind_kph: number;
  wind_mph: number;
  wind_degree: number;
  wind_dir: string;
  pressure_mb: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  vis_km: number;
  vis_miles: number;
  gust_kph: number;
  gust_mph: number;
  chance_of_rain: number;
  chance_of_snow: number;
  uv: number;
}

export interface ClimbingConditions {
  overall: 'excellent' | 'good' | 'fair' | 'poor' | 'dangerous';
  temperature: {
    status: 'optimal' | 'warm' | 'cold' | 'extreme';
    description: string;
    recommendation: string;
  };
  wind: {
    status: 'calm' | 'light' | 'moderate' | 'strong' | 'dangerous';
    description: string;
    recommendation: string;
  };
  precipitation: {
    status: 'none' | 'light' | 'moderate' | 'heavy';
    description: string;
    recommendation: string;
  };
  visibility: {
    status: 'clear' | 'hazy' | 'poor';
    description: string;
    recommendation: string;
  };
  uv: {
    status: 'low' | 'moderate' | 'high' | 'very_high' | 'extreme';
    description: string;
    recommendation: string;
  };
  recommendations: string[];
  warnings: string[];
}

export interface WeatherRequest {
  location: string;
  days?: number;
} 