import { StormGlass } from '@src/clients/stormGlass';
import { IForecastPoint } from '@src/clients/interfaces/IStormGlass';
import { InternalError } from '@src/util/errors/internal-error';
import { IBeach } from '@src/models/beach';

export interface IBeachForecast extends Omit<IBeach, 'user'>, IForecastPoint {}

export interface ITimeForecast {
  time: string;
  forecast: IBeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: IBeach[]
  ): Promise<ITimeForecast[]> {
    const pointsWithCorrectSources: IBeachForecast[] = [];

    try {
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);

        const enrichedBeachData = this.enrichedBeachData(points, beach);

        pointsWithCorrectSources.push(...enrichedBeachData);
      }

      return this.mapForecastByTime(pointsWithCorrectSources);
    } catch (err) {
      throw new ForecastProcessingInternalError((err as Error).message);
    }
  }

  private enrichedBeachData(
    points: IForecastPoint[],
    beach: IBeach
  ): IBeachForecast[] {
    const enrichedBeachData = points.map((e) => ({
      ...{},
      ...{
        lat: beach.lat,
        lng: beach.lng,
        name: beach.name,
        position: beach.position,
        rating: 1,
      },
      ...e,
    }));
    return enrichedBeachData;
  }

  private mapForecastByTime(forecast: IBeachForecast[]): ITimeForecast[] {
    const forecastByTime: ITimeForecast[] = [];

    for (const point of forecast) {
      const timePoint = forecastByTime.find((f) => f.time === point.time);
      if (timePoint) {
        timePoint.forecast.push(point);
      }
      forecastByTime.push({
        time: point.time,
        forecast: [point],
      });
    }
    return forecastByTime;
  }
}
