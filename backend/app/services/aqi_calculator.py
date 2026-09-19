from typing import Tuple, Dict

# Official CPCB India Breakpoints for PM2.5 and PM10
# (C_low, C_high, I_low, I_high)
PM25_BREAKPOINTS = [
    (0.0, 30.0, 0, 50),
    (31.0, 60.0, 51, 100),
    (61.0, 90.0, 101, 200),
    (91.0, 120.0, 201, 300),
    (121.0, 250.0, 301, 400),
    (251.0, 500.0, 401, 500),
]

PM10_BREAKPOINTS = [
    (0.0, 50.0, 0, 50),
    (51.0, 100.0, 51, 100),
    (101.0, 250.0, 101, 200),
    (251.0, 350.0, 201, 300),
    (351.0, 430.0, 301, 400),
    (431.0, 600.0, 401, 500),
]

AQI_CATEGORIES = [
    (0, 50, "Good", "#00B050", "Minimal Risk"),
    (51, 100, "Satisfactory", "#92D050", "Minor Breathing Discomfort for Sensitive Groups"),
    (101, 200, "Moderate", "#EAB308", "Breathing Discomfort with Prolonged Exposure"),
    (201, 300, "Poor", "#F97316", "Breathing Discomfort to Most People"),
    (301, 400, "Very Poor", "#EF4444", "Significant Respiratory Impact on Prolonged Exposure"),
    (401, 9999, "Severe", "#7F1D1D", "Severe Health Impact on Healthy & Vulnerable Groups"),
]


def calculate_sub_index(conc: float, breakpoints: list) -> int:
    """Calculates CPCB linear sub-index for a pollutant concentration."""
    if conc <= 0:
        return 0
    
    for c_low, c_high, i_low, i_high in breakpoints:
        if c_low <= conc <= c_high:
            sub_index = i_low + ((i_high - i_low) / (c_high - c_low)) * (conc - c_low)
            return round(sub_index)
            
    # If concentration exceeds highest bracket
    c_low, c_high, i_low, i_high = breakpoints[-1]
    if conc > c_high:
        # Linear extrapolation with a cap at 500 (or beyond if severe)
        sub_index = i_low + ((i_high - i_low) / (c_high - c_low)) * (conc - c_low)
        return min(round(sub_index), 500)
        
    return 0


def calculate_cpcb_aqi(pm25: float, pm10: float) -> Tuple[int, str, str, str]:
    """
    Computes overall CPCB AQI as max(sub_pm25, sub_pm10),
    returning (aqi, category, hex_color, risk_level).
    """
    sub_pm25 = calculate_sub_index(pm25, PM25_BREAKPOINTS)
    sub_pm10 = calculate_sub_index(pm10, PM10_BREAKPOINTS)
    aqi = max(sub_pm25, sub_pm10)

    category = "Severe"
    color = "#7F1D1D"
    risk_level = "Severe Health Impact"

    for i_low, i_high, cat_name, hex_code, risk in AQI_CATEGORIES:
        if i_low <= aqi <= i_high:
            category = cat_name
            color = hex_code
            risk_level = risk
            break

    return aqi, category, color, risk_level


def get_aqi_category_info(aqi: int) -> Dict[str, str]:
    for i_low, i_high, cat_name, hex_code, risk in AQI_CATEGORIES:
        if i_low <= aqi <= i_high:
            return {
                "category": cat_name,
                "color": hex_code,
                "risk_level": risk
            }
    return {
        "category": "Severe",
        "color": "#7F1D1D",
        "risk_level": "Severe Health Impact on Healthy & Vulnerable Groups"
    }
