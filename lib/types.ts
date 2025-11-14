export interface RunData {
  date: string;
  person: string;
  miles: number;
}

export interface ProcessedData {
  rawData: RunData[];
  overallMetrics: {
    totalRuns: number;
    totalMiles: number;
    averageMiles: number;
    minMiles: number;
    maxMiles: number;
  };
  personMetrics: {
    [person: string]: {
      totalRuns: number;
      totalMiles: number;
      averageMiles: number;
      minMiles: number;
      maxMiles: number;
    };
  };
  chartData: {
    date: string;
    [person: string]: number | string;
  }[];
}

export interface ValidationError {
  row: number;
  field: string;
  message: string;
}