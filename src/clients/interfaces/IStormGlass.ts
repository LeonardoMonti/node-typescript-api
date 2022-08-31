export interface IStormGlassPointSource {
  [key: string]: number;
}

export interface IStormGlassPoint {
  readonly time: string;
  readonly swellDirection: IStormGlassPointSource;
  readonly swellHeight: IStormGlassPointSource;
  readonly swellPeriod: IStormGlassPointSource;
  readonly waveDirection: IStormGlassPointSource;
  readonly waveHeight: IStormGlassPointSource;
  readonly windDirection: IStormGlassPointSource;
  readonly windSpeed: IStormGlassPointSource;
}

export interface IStormGlassForecastResponse {
  hours: IStormGlassPoint[];
}

export interface IForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}
