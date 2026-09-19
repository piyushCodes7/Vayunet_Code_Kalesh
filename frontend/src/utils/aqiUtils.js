/**
 * CPCB India National Air Quality Index (NAQI) Standard Utilities
 */

export const AQI_LEVELS = [
  {
    min: 0,
    max: 50,
    category: 'Good',
    color: '#00B050',
    textColor: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/40',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    description: 'Minimal impact. Air quality is considered satisfactory.',
    schoolRecess: 'Full outdoor activities and sports permitted.',
    workerExposure: 'Full 8-hour shift without atmospheric restrictions.'
  },
  {
    min: 51,
    max: 100,
    category: 'Satisfactory',
    color: '#92D050',
    textColor: 'text-lime-400',
    bgColor: 'bg-lime-500/15',
    borderColor: 'border-lime-500/40',
    badgeClass: 'bg-lime-500/20 text-lime-300 border-lime-500/30',
    description: 'Minor breathing discomfort to sensitive people.',
    schoolRecess: 'Outdoor play permitted. Monitor sensitive / asthmatic children.',
    workerExposure: 'Standard shifts with routine water breaks.'
  },
  {
    min: 101,
    max: 200,
    category: 'Moderate',
    color: '#EAB308',
    textColor: 'text-amber-400',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    description: 'Breathing discomfort to people with lung disease, children and older adults.',
    schoolRecess: 'Limit intense aerobic drills to 30 mins. Morning assembly indoors.',
    workerExposure: 'Mandatory 15-min rest every 90 mins. Particulate masks recommended.'
  },
  {
    min: 201,
    max: 300,
    category: 'Poor',
    color: '#F97316',
    textColor: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
    borderColor: 'border-orange-500/40',
    badgeClass: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    description: 'Breathing discomfort to most people on prolonged exposure.',
    schoolRecess: 'Cancel all outdoor sports & recess. Seal classrooms; run HEPA filters.',
    workerExposure: 'Cap continuous labor to 45 mins. Mandatory N95 masks.'
  },
  {
    min: 301,
    max: 400,
    category: 'Very Poor',
    color: '#EF4444',
    textColor: 'text-red-400',
    bgColor: 'bg-red-500/15',
    borderColor: 'border-red-500/40',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/30',
    description: 'Respiratory illness to people on prolonged exposure.',
    schoolRecess: 'Strict outdoor ban. Primary grades transition to hybrid/online.',
    workerExposure: 'Rotate shifts every 30 mins into filtered clean-air shelters.'
  },
  {
    min: 401,
    max: 9999,
    category: 'Severe',
    color: '#7F1D1D',
    textColor: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-600/50',
    badgeClass: 'bg-rose-900/40 text-rose-300 border-rose-700/50',
    description: 'Respiratory effects even on healthy people; serious impact on sensitive groups.',
    schoolRecess: 'Campus closure advised (GRAP Stage IV). Total online schooling.',
    workerExposure: 'Non-essential work stoppage. Essential staff restricted to 20 mins.'
  }
];

export function getAqiDetails(aqi) {
  const numericAqi = Number(aqi) || 0;
  for (const level of AQI_LEVELS) {
    if (numericAqi >= level.min && numericAqi <= level.max) {
      return level;
    }
  }
  return AQI_LEVELS[AQI_LEVELS.length - 1];
}

export function formatConcentration(val) {
  if (val === null || val === undefined) return '--';
  return `${Number(val).toFixed(1)} µg/m³`;
}
