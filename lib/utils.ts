import { RunData, ProcessedData, ValidationError } from './types';
import { format, parse } from 'date-fns';

export function processCSVData(csvText: string): { data: ProcessedData | null; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const lines = csvText.trim().split('\n');
  
  if (lines.length < 2) {
    errors.push({ row: 0, field: 'file', message: 'CSV file is empty or has no data rows' });
    return { data: null, errors };
  }

  // Validate headers
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const expectedHeaders = ['date', 'person', 'miles run'];
  const headerErrors = expectedHeaders.filter(h => !headers.includes(h));
  
  if (headerErrors.length > 0) {
    errors.push({ 
      row: 0, 
      field: 'headers', 
      message: `Missing required headers: ${headerErrors.join(', ')}` 
    });
    return { data: null, errors };
  }

  const runData: RunData[] = [];
  const dateIndex = headers.indexOf('date');
  const personIndex = headers.indexOf('person');
  const milesIndex = headers.indexOf('miles run');

  // Process data rows
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i].split(',').map(c => c.trim());
    
    // Date validation
    let date = cells[dateIndex];
    if (!date) {
      errors.push({ row: i, field: 'date', message: 'Date is required' });
      continue;
    }

    // Person validation
    const person = cells[personIndex];
    if (!person) {
      errors.push({ row: i, field: 'person', message: 'Person name is required' });
      continue;
    }

    // Miles validation
    const milesStr = cells[milesIndex];
    if (!milesStr) {
      errors.push({ row: i, field: 'miles run', message: 'Miles run is required' });
      continue;
    }

    const miles = parseFloat(milesStr);
    if (isNaN(miles) || miles < 0) {
      errors.push({ row: i, field: 'miles run', message: 'Miles must be a positive number' });
      continue;
    }

    runData.push({ date, person, miles });
  }

  if (runData.length === 0) {
    errors.push({ row: 0, field: 'data', message: 'No valid data rows found' });
    return { data: null, errors };
  }

  return { data: calculateMetrics(runData), errors };
}

function calculateMetrics(runData: RunData[]): ProcessedData {
  // Overall metrics
  const totalRuns = runData.length;
  const totalMiles = runData.reduce((sum, run) => sum + run.miles, 0);
  const averageMiles = totalMiles / totalRuns;
  const minMiles = Math.min(...runData.map(run => run.miles));
  const maxMiles = Math.max(...runData.map(run => run.miles));

  // Per-person metrics
  const personMetrics: ProcessedData['personMetrics'] = {};
  const people = [...new Set(runData.map(run => run.person))];
  
  people.forEach(person => {
    const personRuns = runData.filter(run => run.person === person);
    const personTotalMiles = personRuns.reduce((sum, run) => sum + run.miles, 0);
    const personAverage = personTotalMiles / personRuns.length;
    const personMin = Math.min(...personRuns.map(run => run.miles));
    const personMax = Math.max(...personRuns.map(run => run.miles));

    personMetrics[person] = {
      totalRuns: personRuns.length,
      totalMiles: personTotalMiles,
      averageMiles: personAverage,
      minMiles: personMin,
      maxMiles: personMax
    };
  });

  // Chart data - group by date and person
  const chartData: ProcessedData['chartData'] = [];
  const dateGroups: { [date: string]: { [person: string]: number } } = {};

  runData.forEach(run => {
    if (!dateGroups[run.date]) {
      dateGroups[run.date] = {};
    }
    dateGroups[run.date][run.person] = run.miles;
  });

  Object.keys(dateGroups).sort().forEach(date => {
    const dayData: ProcessedData['chartData'][0] = { date };
    people.forEach(person => {
      dayData[person] = dateGroups[date][person] || 0;
    });
    chartData.push(dayData);
  });

  return {
    rawData: runData,
    overallMetrics: {
      totalRuns,
      totalMiles,
      averageMiles,
      minMiles,
      maxMiles
    },
    personMetrics,
    chartData
  };
}