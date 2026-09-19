/**
 * Street Corridors & Micro-Locations for Street-to-Street Air Quality Mapping
 * Covers major transit corridors, market lanes, school streets, and junctions in Delhi NCR.
 */

export const STREET_CORRIDORS = [
  {
    id: 'ring-road-south',
    name: 'Ring Road (South Ext. — Lajpat Nagar — Ashram)',
    type: 'arterial_transit',
    coordinates: [
      [28.5720, 77.2180],
      [28.5700, 77.2260],
      [28.5685, 77.2340],
      [28.5670, 77.2480],
      [28.5695, 77.2590]
    ],
    aqi: 345,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 235.0,
    pm10: 390.0,
    characteristic: 'Heavy diesel bus & truck corridor with vehicle exhaust buildup.',
    pedestrianAdvice: 'Avoid walking/jogging along this road; use interior colony streets.',
    driverAdvice: 'Keep vehicle windows closed; set AC to internal recirculation mode.'
  },
  {
    id: 'connaught-place-radial',
    name: 'Connaught Place (Inner Circle & Radial Roads)',
    type: 'commercial_street',
    coordinates: [
      [28.6335, 77.2180],
      [28.6345, 77.2205],
      [28.6330, 77.2225],
      [28.6310, 77.2215],
      [28.6315, 77.2185],
      [28.6335, 77.2180]
    ],
    aqi: 235,
    category: 'Poor',
    color: '#F97316',
    pm25: 145.0,
    pm10: 255.0,
    characteristic: 'Dense commercial traffic, idling taxis, and high pedestrian shopping density.',
    pedestrianAdvice: 'Wear a regular mask if shopping for more than 1 hour.',
    driverAdvice: 'Avoid unnecessary engine idling while parking.'
  },
  {
    id: 'shanti-path-boulevard',
    name: 'Shanti Path (Chanakyapuri Diplomatic Avenue)',
    type: 'green_boulevard',
    coordinates: [
      [28.5990, 77.1840],
      [28.5940, 77.1920],
      [28.5880, 77.2010],
      [28.5820, 77.2100]
    ],
    aqi: 140,
    category: 'Moderate',
    color: '#EAB308',
    pm25: 82.0,
    pm10: 150.0,
    characteristic: 'Wide tree-lined boulevard with large green buffers and lower particle density.',
    pedestrianAdvice: 'Relatively safe for morning/evening walking and cycling.',
    driverAdvice: 'Maintain standard speed; clean corridor.'
  },
  {
    id: 'chandni-chowk-heritage',
    name: 'Chandni Chowk Main Road (Red Fort to Fatehpuri)',
    type: 'heritage_market',
    coordinates: [
      [28.6560, 77.2410],
      [28.6562, 77.2340],
      [28.6568, 77.2280],
      [28.6570, 77.2240]
    ],
    aqi: 320,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 210.0,
    pm10: 360.0,
    characteristic: 'High pedestrian footfall, electric rickshaws, and resuspended street dust.',
    pedestrianAdvice: 'Wear an N95 mask; avoid peak afternoon shopping rush.',
    driverAdvice: 'Pedestrianized zone; motor vehicles restricted.'
  },
  {
    id: 'vikas-marg-corridor',
    name: 'Vikas Marg (ITO Crossing — Yamuna Bridge — Laxmi Nagar)',
    type: 'bridge_corridor',
    coordinates: [
      [28.6289, 77.2405],
      [28.6295, 77.2510],
      [28.6310, 77.2650],
      [28.6325, 77.2780]
    ],
    aqi: 365,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 260.0,
    pm10: 420.0,
    characteristic: 'Major trans-Yamuna commuter bottleneck with extreme stop-and-go congestion.',
    pedestrianAdvice: 'Avoid bridge walkway during 8 AM – 11 AM peak smog.',
    driverAdvice: 'Keep cabin AC on recirculate; two-wheeler riders must wear N95.'
  },
  {
    id: 'aurobindo-marg',
    name: 'Sri Aurobindo Marg (AIIMS — Green Park — IIT Gate)',
    type: 'institutional_road',
    coordinates: [
      [28.5670, 77.2090],
      [28.5580, 77.2060],
      [28.5480, 77.2010],
      [28.5390, 77.1970]
    ],
    aqi: 260,
    category: 'Poor',
    color: '#F97316',
    pm25: 165.0,
    pm10: 280.0,
    characteristic: 'Passes major hospitals and colleges; moderate vehicular flow with traffic signals.',
    pedestrianAdvice: 'Limit jogging on roadside; use Aurobindo Ashram or Siri Fort greens.',
    driverAdvice: 'School bus operators keep windows closed during morning run.'
  },
  {
    id: 'barapullah-elevated',
    name: 'Barapullah Elevated Road (Sarai Kale Khan to INA)',
    type: 'expressway',
    coordinates: [
      [28.5880, 77.2620],
      [28.5830, 77.2440],
      [28.5800, 77.2300],
      [28.5770, 77.2180]
    ],
    aqi: 305,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 198.0,
    pm10: 330.0,
    characteristic: 'High-speed elevated corridor; high wind movement but elevated vehicular emissions.',
    pedestrianAdvice: 'No pedestrian access permitted.',
    driverAdvice: 'Keep car windows closed.'
  },
  {
    id: 'mall-road-du',
    name: 'Mall Road (Delhi University North Campus — Ridge)',
    type: 'campus_avenue',
    coordinates: [
      [28.6910, 77.2070],
      [28.6935, 77.2160],
      [28.6930, 77.2240]
    ],
    aqi: 185,
    category: 'Moderate',
    color: '#EAB308',
    pm25: 115.0,
    pm10: 210.0,
    characteristic: 'Flanked by northern ridge forest; lower pollution during daytime hours.',
    pedestrianAdvice: 'Good avenue for student commute; outdoor sports permitted in afternoon.',
    driverAdvice: 'Speed limit 30 km/h; watch for students.'
  },
  {
    id: 'mathura-road-artery',
    name: 'Mathura Road (Ashram — Apollo — Okhla Border)',
    type: 'industrial_artery',
    coordinates: [
      [28.5700, 77.2600],
      [28.5510, 77.2740],
      [28.5360, 77.2860],
      [28.5180, 77.3000]
    ],
    aqi: 390,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 290.0,
    pm10: 460.0,
    characteristic: 'Heavy truck freight corridor connected to Okhla and Badarpur industrial zones.',
    pedestrianAdvice: 'High risk zone; wear N95 mask at all times near roadside.',
    driverAdvice: 'Heavy dust zone; avoid driving with open windows.'
  },
  {
    id: 'arya-samaj-karol-bagh',
    name: 'Arya Samaj Road (Karol Bagh Shopping District)',
    type: 'market_street',
    coordinates: [
      [28.6520, 77.1850],
      [28.6505, 77.1910],
      [28.6485, 77.1970]
    ],
    aqi: 285,
    category: 'Poor',
    color: '#F97316',
    pm25: 180.0,
    pm10: 310.0,
    characteristic: 'Crowded retail street with two-wheelers and street vendor activity.',
    pedestrianAdvice: 'Limit shopping to under 90 minutes; stay hydrated.',
    driverAdvice: 'Severe parking congestion; prefer metro.'
  }
];

export const STREET_MICRO_LOCATIONS = [
  {
    id: 'str-1',
    name: 'ITO Traffic Junction (Vikas Marg Crossing)',
    street: 'Vikas Marg & Bahadur Shah Zafar Marg',
    type: 'junction',
    icon: '🚦',
    lat: 28.6289,
    lng: 77.2405,
    aqi: 350,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 245.0,
    pm10: 395.0,
    traffic: 'Heavy Stop-and-Go',
    advice: 'Pedestrians use underground subway; avoid standing at signal.'
  },
  {
    id: 'str-2',
    name: 'Janpath Street Vendor Lane',
    street: 'Janpath Road (CP to Windsor Place)',
    type: 'market_street',
    icon: '🛍️',
    lat: 28.6265,
    lng: 77.2190,
    aqi: 225,
    category: 'Poor',
    color: '#F97316',
    pm25: 140.0,
    pm10: 240.0,
    traffic: 'Moderate Pedestrian & Auto',
    advice: 'Street vendors advised to wear cloth or N95 masks.'
  },
  {
    id: 'str-3',
    name: 'Lajpat Nagar Central Market Crossing',
    street: 'Veer Savarkar Marg',
    type: 'market_street',
    icon: '🛍️',
    lat: 28.5682,
    lng: 77.2425,
    aqi: 275,
    category: 'Poor',
    color: '#F97316',
    pm25: 175.0,
    pm10: 295.0,
    traffic: 'High Footfall & Rickshaws',
    advice: 'Mask recommended for shoppers with asthma or allergies.'
  },
  {
    id: 'str-4',
    name: 'Dhaula Kuan Underpass Intersection',
    street: 'National Highway 48 & Ring Road',
    type: 'junction',
    icon: '🛣️',
    lat: 28.5925,
    lng: 77.1585,
    aqi: 330,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 220.0,
    pm10: 360.0,
    traffic: 'Continuous High Speed Transit',
    advice: 'Keep vehicle AC on recirculate mode.'
  },
  {
    id: 'str-5',
    name: 'Chandni Chowk Gauri Shankar Lane',
    street: 'Netaji Subhash Marg Junction',
    type: 'heritage_street',
    icon: '🕌',
    lat: 28.6558,
    lng: 77.2345,
    aqi: 315,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 205.0,
    pm10: 345.0,
    traffic: 'Dense Pedestrian & E-Rickshaws',
    advice: 'N95 respirator recommended for market porters.'
  },
  {
    id: 'str-6',
    name: 'South Extension Ring Road Bus Bay',
    street: 'Mahatma Gandhi Marg (South Ext. 1)',
    type: 'transit_stop',
    icon: '🚌',
    lat: 28.5710,
    lng: 77.2210,
    aqi: 340,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 230.0,
    pm10: 380.0,
    traffic: 'Continuous Bus & Auto Transit',
    advice: 'Commuters waiting at bus stop should wear masks.'
  },
  {
    id: 'str-7',
    name: 'Hauz Khas Village Entry Lane',
    street: 'Hauz Khas Village Road',
    type: 'colony_street',
    icon: '🏘️',
    lat: 28.5535,
    lng: 77.1945,
    aqi: 190,
    category: 'Moderate',
    color: '#EAB308',
    pm25: 118.0,
    pm10: 215.0,
    traffic: 'Low Vehicle Speed',
    advice: 'Adjacent to deer park; cleaner air than main road.'
  },
  {
    id: 'str-8',
    name: 'Rajouri Garden Metro Street Crossing',
    street: 'Najafgarh Road & Ring Road',
    type: 'junction',
    icon: '🚦',
    lat: 28.6495,
    lng: 77.1225,
    aqi: 295,
    category: 'Poor',
    color: '#F97316',
    pm25: 185.0,
    pm10: 320.0,
    traffic: 'Heavy Commercial & Metro Commute',
    advice: 'Pedestrians take metro concourse instead of crossing surface road.'
  },
  {
    id: 'str-9',
    name: 'Kashmere Gate ISBT Entry Gate',
    street: 'Lothian Road & Ring Road',
    type: 'transit_stop',
    icon: '🚌',
    lat: 28.6675,
    lng: 77.2280,
    aqi: 360,
    category: 'Very Poor',
    color: '#EF4444',
    pm25: 250.0,
    pm10: 410.0,
    traffic: 'Interstate Diesel Buses',
    advice: 'High particulate zone; wear N95 while boarding buses.'
  },
  {
    id: 'str-10',
    name: 'Mayur Vihar Phase-1 Pocket 1 Lane',
    street: 'Trilokpuri Road Crossing',
    type: 'colony_street',
    icon: '🏘️',
    lat: 28.6080,
    lng: 77.2950,
    aqi: 270,
    category: 'Poor',
    color: '#F97316',
    pm25: 170.0,
    pm10: 290.0,
    traffic: 'Residential & Local Commercial',
    advice: 'Children play in indoor colony parks during morning hours.'
  },
  {
    id: 'str-11',
    name: 'AIIMS Ansari Nagar Pedestrian Walkway',
    street: 'Ring Road & Aurobindo Marg Flyover',
    type: 'pedestrian_lane',
    icon: '🚶',
    lat: 28.5685,
    lng: 77.2115,
    aqi: 260,
    category: 'Poor',
    color: '#F97316',
    pm25: 165.0,
    pm10: 280.0,
    traffic: 'Ambulance & Hospital Transit',
    advice: 'Patients and visitors should wear masks on hospital approach road.'
  },
  {
    id: 'str-12',
    name: 'DPS R.K. Puram Gate 2 Road',
    street: 'Kaifi Azmi Marg',
    type: 'school_street',
    icon: '🏫',
    lat: 28.5668,
    lng: 77.1818,
    aqi: 245,
    category: 'Poor',
    color: '#F97316',
    pm25: 155.0,
    pm10: 265.0,
    traffic: 'School Vans & Buses',
    advice: 'Turn off school van engines while waiting for student dispersal.'
  }
];

export const STREET_QUICK_JUMPS = [
  { name: 'Connaught Place', lat: 28.6328, lng: 77.2197, zoom: 15 },
  { name: 'Ring Road (South Ext)', lat: 28.5695, lng: 77.2340, zoom: 15 },
  { name: 'Chandni Chowk', lat: 28.6562, lng: 77.2300, zoom: 16 },
  { name: 'ITO Mega Junction', lat: 28.6289, lng: 77.2405, zoom: 16 },
  { name: 'Shanti Path Avenue', lat: 28.5910, lng: 77.1950, zoom: 15 },
  { name: 'Lajpat Nagar Market', lat: 28.5682, lng: 77.2425, zoom: 16 },
  { name: 'DU North Campus', lat: 28.6920, lng: 77.2170, zoom: 15 },
  { name: 'AIIMS & Safdarjung', lat: 28.5685, lng: 77.2100, zoom: 15 }
];
