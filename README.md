# VayuNet: Street-Level Air Quality Micro-Mapping & AI Health Advisories

> **One-Line Description**: A hyper-local air quality micro-mapping platform that uses low-cost sensor telemetry and spatial machine learning to interpolate street-level pollution, automatically synthesizing contextual, life-saving AI safety advisories for schools and outdoor workers under Indian CPCB standards.

---

## 🏆 Problem Statement Alignment (Code Kalam 2026 – Envelope No. 76)
- **Category**: Environment · Public Health
- **The Problem**: City air quality is reported from a handful of sparse stations, but pollution varies drastically street to street. Schools and hospitals receive no actionable local readings.
- **The Solution**: Micro-sensor spatial interpolation via scikit-learn coupled with automated, contextual AI health advisories for schools and outdoor workers.

---

## ⚡ What the AI Automates (The Hackathon Innovation)

```
+---------------------------+      +-------------------------------+      +---------------------------------+
|   Raw Telemetry Stream    | ---> |     Spatial ML Regressor      | ---> |     Contextual GenAI Engine     |
|  25 Low-Cost Micro-Sensors|      |  HistGradientBoostingRegressor|      |   OpenAI gpt-4o-mini / Fallback |
|  PM2.5, PM10, Temp, Hum   |      |  Street-level interpolation   |      |   Evaluates CPCB Breakpoints    |
+---------------------------+      +-------------------------------+      +---------------------------------+
                                                                                          |
                                                                                          v
                                                                          +---------------------------------+
                                                                          |   Actionable Safety Protocols   |
                                                                          |  - School Recess & PE Bans      |
                                                                          |  - Outdoor Shift Caps (45m)     |
                                                                          |  - N95 Respirator Mandates      |
                                                                          |  - HEPA Clean-Air Shelters      |
                                                                          +---------------------------------+
```

### The Core Automated Step
Instead of presenting raw, confusing pollution statistics (`PM2.5: 284.5 µg/m³`) to a school principal or labor contractor, VayuNet executes an automated reasoning pipeline:
1. **Telemetry Ingestion**: Gathers real-time PM2.5, PM10, and atmospheric telemetry across Delhi NCR.
2. **Spatial Machine Learning**: Uses a trained `HistGradientBoostingRegressor` to predict micro-pollution at any arbitrary street coordinate (even unmonitored schools).
3. **Contextual GenAI Reasoning**: Translates numerical severity into responsible, operational health protocols tailored for:
   - **Schools**: Outdoor recess suspensions, morning assembly relocation, bus transit N95 mandates, classroom HEPA purification speeds.
   - **Outdoor Workers**: Continuous exposure caps (e.g. 45-minute stints), mandatory N95 respirators, hydration pauses, and nearest clean-air shelter dispatch.

---

## 🚀 Quickstart: Run with Docker (Primary Method)

The entire application (PostgreSQL 16 database, FastAPI backend, and React Vite frontend) is containerized and starts with a single command:

```bash
# 1. Clone or navigate to repository
cd CODE_KALESH

# 2. (Optional) Set your OpenAI API key in .env
# If omitted, VayuNet automatically uses its built-in CPCB Automated Expert System
echo "OPENAI_API_KEY=your_key_here" >> .env

# 3. Start all services
docker compose up --build
```

### Access Points
- **Frontend Web App**: [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check API**: [http://localhost:8000/api/health](http://localhost:8000/api/health)
- **Map Telemetry API**: [http://localhost:8000/api/map-data](http://localhost:8000/api/map-data)

---

## 🛠️ Run in Local Development Mode

If you prefer running services directly on your host machine:

### 1. Prerequisites
- Python 3.11+
- Node.js 18+ & npm
- PostgreSQL 16 running on `localhost:5432` with database `airquality_db`

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server (auto-seeds 48h data and trains ML model on startup)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⏱️ Suggested 2-Minute Demo Script Outline for Judges

| Time | Action | What to Say / Point Out |
|---|---|---|
| **0:00 - 0:25** | **Show Hero Banner & Map** | *"Judges, city pollution reports rely on sparse government stations that hide toxic micro-pockets. VayuNet captures street-level reality using 25 low-cost optical sensors across Delhi NCR."* Point out the 3-line problem/solution banner and color-coded CPCB sensor markers. |
| **0:25 - 0:50** | **Click Unmonitored Map Point** | Click any empty street on the map. Point out the `< 1s` ML spatial interpolation: *"Notice that when I click an unmonitored road, our scikit-learn spatial regressor immediately computes the street-level PM2.5, PM10, and CPCB AQI."* |
| **0:50 - 1:20** | **Showcase AI Advisory Step** | Point to the side panel's **AI-Generated Advisory** badge. *"Here is our core automated step: Raw numbers automatically transform into contextual public health protocols. Notice the before/after flow."* Toggle between **School** and **Worker** context to show how language adapts dynamically. |
| **1:20 - 1:45** | **Switch to School Safety Mode** | Switch to the **School Safety Mode** tab. Show the 10 monitored campuses (DPS RK Puram, Mother's International, etc.). Point to the automated decision matrix: *"Principals get an immediate verdict: Outdoor recess is suspended, morning assembly moves to the auditorium, and N95 masks are mandated for bus transit."* |
| **1:45 - 2:00** | **Show AI Pipeline Inspector & Wrap Up** | Switch to **AI Pipeline** tab. Show the live 4-stage pipeline execution latency (~150ms). *"VayuNet is 100% demo-ready, fully Dockerized, backed by PostgreSQL and CPCB formulas, and ready to protect vulnerable citizens today."* |

---

## 📊 Database Schema (PostgreSQL 16)

The schema strictly implements all required entities:
- `sensors`: `id`, `name`, `lat`, `lng`, `type`, `is_active`
- `sensor_readings`: `id`, `sensor_id`, `pm25`, `pm10`, `temperature`, `humidity`, `recorded_at`
- `locations`: `id`, `name`, `type` (`school` \| `hospital` \| `area` \| `worker_zone`), `lat`, `lng`
- `predictions`: `id`, `location_id`, `predicted_pm25`, `predicted_pm10`, `aqi`, `category`, `created_at`
- `advisories`: `id`, `location_id`, `context` (`school` \| `worker`), `risk_level`, `advisory_text`, `generated_at`

---

## 🏛️ Indian CPCB NAQI Compliance

All AQI calculations follow the official linear sub-index interpolation formulas published by the **Central Pollution Control Board (CPCB) of India**:

$$\text{Sub-Index } I = I_{\text{low}} + \frac{I_{\text{high}} - I_{\text{low}}}{C_{\text{high}} - C_{\text{low}}} \times (C - C_{\text{low}})$$

$$\text{Overall AQI} = \max\left(I_{\text{PM2.5}}, I_{\text{PM10}}\right)$$

| AQI Range | Category | Color | Health Impact |
|---|---|---|---|
| 0 – 50 | Good | `#00B050` | Minimal impact |
| 51 – 100 | Satisfactory | `#92D050` | Minor breathing discomfort to sensitive people |
| 101 – 200 | Moderate | `#EAB308` | Breathing discomfort to people with lung disease, children & older adults |
| 201 – 300 | Poor | `#F97316` | Breathing discomfort to most people on prolonged exposure |
| 301 – 400 | Very Poor | `#EF4444` | Respiratory illness to people on prolonged exposure |
| 401 – 500+ | Severe | `#7F1D1D` | Severe respiratory effects even on healthy people |
