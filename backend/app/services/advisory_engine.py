import os
import json
import logging
from typing import Dict, Any, List
from datetime import datetime, timezone
from app.config import settings

logger = logging.getLogger("vayu_advisory")

# Try importing OpenAI client
try:
    from openai import OpenAI
    openai_available = True
except ImportError:
    openai_available = False

def generate_fallback_advisory(
    location_name: str,
    pm25: float,
    pm10: float,
    aqi: int,
    category: str,
    context: str = "school"
) -> Dict[str, Any]:
    """
    High-fidelity, CPCB-aligned rule-based expert advisory engine.
    Guarantees the demo never breaks even without an OpenAI API key or internet access.
    """
    ctx = context.lower()
    
    if aqi <= 50:  # Good
        risk_level = "Low Risk"
        if ctx == "school":
            advisory = (
                f"Air quality at {location_name} is currently Good (AQI {aqi}). "
                "Atmospheric conditions are optimal for normal academic and outdoor operations. "
                "Children and faculty can participate freely in outdoor sports, assemblies, and physical education."
            )
            protocols = [
                "Proceed with scheduled outdoor physical education and playtime.",
                "Maintain natural cross-ventilation in classrooms.",
                "No respiratory protective equipment required."
            ]
            recess_shift = "Normal outdoor recess and physical training permitted."
            mask = "No mask required."
            purifier_shelter = "Classroom air purifiers can remain in eco / ambient mode."
        else:
            advisory = (
                f"Air quality in the {location_name} zone is Good (AQI {aqi}). "
                "Outdoor labor, delivery operations, and construction shifts may proceed without environmental duration restrictions."
            )
            protocols = [
                "Full scheduled outdoor shift duration authorized.",
                "Standard industrial PPE required; no extra smog protection needed.",
                "Maintain routine hydration."
            ]
            recess_shift = "Standard 8-hour outdoor shifts without air-quality interruptions."
            mask = "Standard occupational dust masks sufficient for dusty work."
            purifier_shelter = "Normal break areas operational."

    elif aqi <= 100:  # Satisfactory
        risk_level = "Minor Risk"
        if ctx == "school":
            advisory = (
                f"Air quality at {location_name} is Satisfactory (AQI {aqi}). "
                "Overall conditions are acceptable, though unusually sensitive children with known asthmatic conditions "
                "should be casually observed for cough or mild wheezing during heavy exertion."
            )
            protocols = [
                "Outdoor recess and sports permitted with normal hydration breaks.",
                "Ensure emergency inhalers are accessible in the school infirmary.",
                "Avoid intense sustained aerobic sprints during peak morning traffic."
            ]
            recess_shift = "Outdoor play permitted; monitor asthmatic students."
            mask = "Optional for sensitive individuals."
            purifier_shelter = "Run purifiers at low-to-medium speed in early morning hours."
        else:
            advisory = (
                f"Air quality in {location_name} is Satisfactory (AQI {aqi}). "
                "Outdoor personnel with preexisting cardiovascular or respiratory sensitivities should take scheduled hydration pauses."
            )
            protocols = [
                "Standard work shifts with regular 10-minute water breaks every 2 hours.",
                "Offer clean air resting zones for sensitive workers.",
                "Deploy baseline dust suppression at construction locations."
            ]
            recess_shift = "Standard shift durations permitted."
            mask = "Dust masks recommended in unpaved traffic areas."
            purifier_shelter = "Filtered break cabins available on request."

    elif aqi <= 200:  # Moderate
        risk_level = "Moderate Risk"
        if ctx == "school":
            advisory = (
                f"Air quality at {location_name} has deteriorated to Moderate (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Prolonged vigorous exertion outdoors may trigger coughing or shortness of breath in children. "
                "School administration should consider reducing intense outdoor physical training."
            )
            protocols = [
                "Limit intense outdoor sports (football, track sprints) to 30 minutes maximum.",
                "Conduct morning assembly in semi-covered or well-ventilated auditoriums.",
                "Advise parents of students with respiratory ailments to pack N95 masks.",
                "Keep classroom windows facing major roadways closed during morning rush."
            ]
            recess_shift = "Moderate outdoor recess; substitute heavy aerobic drills with skill-based training."
            mask = "Recommended during morning bus transit and gate pickup."
            purifier_shelter = "Operate classroom HEPA filters on medium setting throughout school hours."
        else:
            advisory = (
                f"Air quality in {location_name} is Moderate (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Outdoor workers, transit staff, and delivery riders face cumulative particulate exposure. "
                "Precautionary hydration and periodic shaded rest are advised."
            )
            protocols = [
                "Institute mandatory 15-minute rest breaks every 90 minutes.",
                "Distribute multi-layer particulate masks to traffic police and delivery riders.",
                "Activate localized water misting around construction and loading docks.",
                "Schedule heaviest physical demolition or digging during early afternoon ventilation."
            ]
            recess_shift = "Max continuous outdoor exertion: 90 minutes before mandatory shelter rest."
            mask = "N95 / FFP2 masks strongly recommended for street-level personnel."
            purifier_shelter = "Clean-air hydration stations active with filtered air."

    elif aqi <= 300:  # Poor
        risk_level = "High Risk"
        if ctx == "school":
            advisory = (
                f"WARNING: Air quality at {location_name} is Poor (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Breathing discomfort is probable for healthy children, and significant respiratory distress may occur in asthmatic students. "
                "Immediate administrative controls are required under CPCB guidelines."
            )
            protocols = [
                "Cancel all outdoor sports, athletic meets, and physical education drills.",
                "Move morning assemblies indoors or broadcast over classroom PA systems.",
                "Enforce indoor recess with quiet educational activities.",
                "Seal classroom perimeter doors and keep all HEPA air cleaners at high speed.",
                "Advise mandatory N95 masks for all students boarding open auto-rickshaws or walking to school."
            ]
            recess_shift = "All outdoor recess suspended; students remain in filtered classrooms."
            mask = "Mandatory N95 / FFP2 masks during school transit and outdoor dispersal."
            purifier_shelter = "Classroom air purifiers at maximum capacity; close all dampers."
        else:
            advisory = (
                f"CAUTION: Air quality in {location_name} is Poor (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Continuous outdoor exposure poses serious health risks to outdoor workers, traffic wardens, and gig economy riders. "
                "Workplace safety interventions must be enforced."
            )
            protocols = [
                "Cap continuous outdoor physical labor to 45 minutes per cycle.",
                "Mandate certified N95 respirators for all active outdoor personnel.",
                "Provide air-conditioned or filtered rest tents with clean drinking water and electrolytes.",
                "Halt non-essential dust-generating activities (dry cutting, uncontained earthmoving).",
                "Reassign workers over age 50 or with cardiovascular conditions to indoor assignments."
            ]
            recess_shift = "Maximum 45-minute continuous outdoor stints followed by 15-minute filtered rest."
            mask = "Strict N95 / KN95 respirator compliance enforced by site supervisors."
            purifier_shelter = "Designated clean-air resting pods with active HEPA filtration."

    elif aqi <= 400:  # Very Poor
        risk_level = "Critical Risk"
        if ctx == "school":
            advisory = (
                f"HEALTH ALERT: Air quality at {location_name} is Very Poor (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Severe respiratory irritation may affect all students upon sustained exposure. "
                "School leadership should trigger emergency air quality contingency protocols."
            )
            protocols = [
                "Strict prohibition of any student stepping outdoors during school hours.",
                "Keep students indoors in sealed, purified environments with double-glazed doors.",
                "Transition primary grades (Nursery to Grade 5) to hybrid or online learning if sustained.",
                "School buses must operate with closed windows and internal cabin recirculation.",
                "Equip infirmaries with medical nebulizers and oxygen concentrators on standby."
            ]
            recess_shift = "Complete outdoor activity ban; zero outdoor exposure permitted."
            mask = "Strict N95 / FFP2 mask mandate from doorstep to classroom."
            purifier_shelter = "Full HEPA air scrubbers active 24/7; monitor indoor PM2.5 levels hourly."
        else:
            advisory = (
                f"HEALTH ALERT: Air quality in {location_name} is Very Poor (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Toxic particulate concentration presents immediate occupational health hazards. "
                "Employers are urged to reschedule heavy physical shifts."
            )
            protocols = [
                "Mandatory 50% shift rotation: 30 minutes outdoor work followed by 30 minutes in clean shelter.",
                "Provide employer-supplied, seal-tested N95 / FFP3 respirators replaced daily.",
                "Halt all unmitigated roadwork, diesel generator operation, and exterior painting.",
                "Provide gig riders with air quality hazard pay and allow route pauses during peak smog hours.",
                "Deploy mist cannons and heavy water sprinkling across all logistics yards."
            ]
            recess_shift = "Maximum 30 minutes continuous work; overall outdoor hours capped at 4 hours/day."
            mask = "Mandatory fit-tested N95 / FFP3 respirators; cloth/surgical masks strictly prohibited."
            purifier_shelter = "Mandatory access to sealed clean-air shelters within 100 meters of work stations."

    else:  # Severe (401+)
        risk_level = "Hazardous / Emergency"
        if ctx == "school":
            advisory = (
                f"EMERGENCY ADVISORY: Air quality at {location_name} has reached Hazardous / Severe levels (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "CPCB GRAP Stage IV emergency measures should be observed. "
                "Immediate closure of physical school premises and transition to remote online instruction is strongly recommended."
            )
            protocols = [
                "Immediate recommendation: Suspend physical classes and switch to remote learning.",
                "If children are already on campus, enforce complete lockdown inside air-purified rooms.",
                "Do not allow students to assemble in corridors or unsealed courtyards.",
                "Urgent notification sent to parents advising immediate indoor sheltering at home.",
                "Cancel all inter-school competitions, bus transit, and extracurriculars."
            ]
            recess_shift = "Physical campus closure advised; zero outdoor exposure."
            mask = "Hospital-grade N95 / FFP3 respirators required for any urgent transit."
            purifier_shelter = "Continuous medical-grade HEPA purification; seal all exterior air intake vents."
        else:
            advisory = (
                f"EMERGENCY ADVISORY: Air quality in {location_name} is Severe / Hazardous (AQI {aqi}, PM2.5: {pm25} µg/m³). "
                "Prolonged exposure induces acute cardiovascular and pulmonary stress even in healthy adults. "
                "Non-essential outdoor commercial and construction operations should be halted."
            )
            protocols = [
                "Halt all non-essential outdoor labor, construction, and manual parcel handling.",
                "For essential services (traffic police, emergency responders): maximum 20-minute shifts.",
                "Provide pressurized clean-air shelter vans with medical oxygen support.",
                "Immediate employer liability notification: distribute fresh N95 / FFP3 respirators.",
                "Cease all diesel equipment and unpaved vehicle movement immediately."
            ]
            recess_shift = "Non-essential work stoppage recommended; essential personnel restricted to 20-min shifts."
            mask = "Mandatory hospital-grade N95 / FFP3 respirators with exhalation valves."
            purifier_shelter = "Continuous clean air shelter retreat; medical monitoring on site."

    return {
        "context": context,
        "risk_level": risk_level,
        "advisory_text": advisory,
        "actionable_protocols": protocols,
        "recess_or_shift_guidance": recess_shift,
        "mask_mandate": mask,
        "air_purifier_or_shelter": purifier_shelter,
        "engine_used": "CPCB Automated Expert System (Local Fallback)"
    }


def generate_ai_advisory(
    location_name: str,
    pm25: float,
    pm10: float,
    aqi: int,
    category: str,
    context: str = "school"
) -> Dict[str, Any]:
    """
    Generates contextual AI advisory using OpenAI API if key is present,
    otherwise cleanly falls back to CPCB expert system.
    """
    api_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")

    if api_key and openai_available:
        try:
            client = OpenAI(api_key=api_key)
            prompt = (
                f"You are the Chief Environmental Safety Officer for an Indian Municipal Health Authority. "
                f"Analyze the following real-time air quality telemetry and generate a highly responsible, "
                f"structured safety advisory tailored specifically for {context.upper()} stakeholders.\n\n"
                f"Telemetry Data:\n"
                f"- Location: {location_name}\n"
                f"- PM2.5: {pm25} µg/m³\n"
                f"- PM10: {pm10} µg/m³\n"
                f"- CPCB AQI: {aqi} ({category})\n"
                f"- Stakeholder Context: {'Schools (students, teachers, outdoor recess, school buses)' if context == 'school' else 'Outdoor Workers (construction, gig delivery riders, street vendors, traffic police)'}\n\n"
                f"Output MUST be valid JSON with the exact keys:\n"
                f"{{\n"
                f'  "risk_level": "Low Risk | Minor Risk | Moderate Risk | High Risk | Critical Risk | Hazardous",\n'
                f'  "advisory_text": "2-3 sentences of clear executive guidance. Use responsible non-medical language like \'consider limiting outdoor activity\'.",\n'
                f'  "actionable_protocols": ["Specific protocol 1", "Specific protocol 2", "Specific protocol 3", "Specific protocol 4"],\n'
                f'  "recess_or_shift_guidance": "Concrete guidance on recess/PE duration or work shift limits",\n'
                f'  "mask_mandate": "Specific N95 / FFP2 respirator mandate or advice",\n'
                f'  "air_purifier_or_shelter": "Specific indoor air filtration or clean-air shelter directive"\n'
                f"}}"
            )

            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a public health AI assistant specialized in Indian CPCB air quality guidelines. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=500,
                response_format={"type": "json_object"}
            )

            content = response.choices[0].message.content
            parsed = json.loads(content)
            parsed["context"] = context
            parsed["engine_used"] = "OpenAI (gpt-4o-mini)"
            return parsed

        except Exception as e:
            logger.warning(f"OpenAI API call failed: {e}. Falling back to CPCB Expert Engine.")
            fallback = generate_fallback_advisory(location_name, pm25, pm10, aqi, category, context)
            fallback["engine_used"] = f"CPCB Automated Expert System (Fallback: {str(e)[:40]}...)"
            return fallback

    # If no OpenAI API key is configured
    return generate_fallback_advisory(location_name, pm25, pm10, aqi, category, context)
