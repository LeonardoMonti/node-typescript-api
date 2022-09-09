import { IBeach, IBeachPosition } from './../models/beach';

// meters
const waveHeights = {
  ankleToKnee: {
    min: 0.3,
    max: 1.0,
  },
  waistHigh: {
    min: 1.0,
    max: 2.0,
  },
  headHigh: {
    min: 2.0,
    max: 2.5,
  },
};

export class Rating {
  constructor(private beach: IBeach) {}

  public getRatingBasedOnWindAndWavePositions(
    waveDirection: IBeachPosition,
    windDirection: IBeachPosition
  ): number {
    if (waveDirection === windDirection) {
      return 1;
    } else if (this.isWindOffShore(waveDirection, windDirection)) {
      return 5;
    }
    return 3;
  }

  public getRatingForSwellPeriod(period: number): number {
    if (period >= 7 && period < 10) {
      return 2;
    }

    if (period >= 10 && period < 14) {
      return 4;
    }

    if (period >= 14) {
      return 5;
    }

    return 1;
  }

  public getRatingForSwellSize(height: number): number {
    if (
      height >= waveHeights.ankleToKnee.min &&
      height < waveHeights.ankleToKnee.max
    ) {
      return 2;
    }

    if (
      height >= waveHeights.waistHigh.min &&
      height < waveHeights.waistHigh.max
    ) {
      return 3;
    }

    if (height >= waveHeights.headHigh.min) {
      return 5;
    }

    return 1;
  }

  public getPositionFromLocation(coordinates: number): IBeachPosition {
    if (coordinates >= 310 || (coordinates < 50 && coordinates >= 0)) {
      return IBeachPosition.N;
    }
    if (coordinates >= 50 && coordinates < 120) {
      return IBeachPosition.E;
    }
    if (coordinates >= 120 && coordinates < 220) {
      return IBeachPosition.S;
    }
    if (coordinates >= 220 && coordinates < 310) {
      return IBeachPosition.W;
    }
    return IBeachPosition.E;
  }

  private isWindOffShore(
    waveDirection: string,
    windDirection: string
  ): boolean {
    return (
      (waveDirection === IBeachPosition.N &&
        windDirection === IBeachPosition.S &&
        this.beach.position === IBeachPosition.N) ||
      (waveDirection === IBeachPosition.S &&
        windDirection === IBeachPosition.N &&
        this.beach.position === IBeachPosition.S) ||
      (waveDirection === IBeachPosition.E &&
        windDirection === IBeachPosition.W &&
        this.beach.position === IBeachPosition.E) ||
      (waveDirection === IBeachPosition.W &&
        windDirection === IBeachPosition.E &&
        this.beach.position === IBeachPosition.W)
    );
  }
}
