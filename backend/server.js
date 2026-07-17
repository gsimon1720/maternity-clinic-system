const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// HELPER: AUTO-GENERATE REGISTRATION NUMBER
// ==========================================
const generateRegistrationNumber = async () => {
  const currentYear = new Date().getFullYear();
  const result = await pool.query(
    "SELECT COUNT(*) FROM patient WHERE registration_number LIKE $1",
    [`ANC-${currentYear}-%`]
  );
  const currentCount = parseInt(result.rows[0].count, 10);
  const nextSequence = String(currentCount + 1).padStart(4, '0');
  return `ANC-${currentYear}-${nextSequence}`;
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. MIDWIFE SIGNUP
app.post('/api/auth/signup', async (req, res) => {
  const { name, age, nic, license_number, password } = req.body;

  try {
    // Check if the NIC or License is already registered
    const existingUser = await pool.query(
      'SELECT * FROM midwives WHERE nic = $1 OR license_number = $2',
      [nic, license_number]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "A midwife with this NIC or License Number is already registered." });
    }

    // Hash the password securely
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Save the new midwife to the database
    const newMidwife = await pool.query(
      `INSERT INTO midwives (name, age, nic, license_number, password_hash)
       VALUES ($1, $2, $3, $4, $5) RETURNING midwife_id, name, nic`,
      [name, age, nic, license_number, passwordHash]
    );

    res.status(201).json({ message: "Registration successful!", user: newMidwife.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. MIDWIFE LOGIN
app.post('/api/auth/login', async (req, res) => {
  const { nic, password } = req.body;

  try {
    // Find the user by NIC
    const userQuery = await pool.query('SELECT * FROM midwives WHERE nic = $1', [nic]);
    
    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: "Invalid NIC or Password" });
    }

    const user = userQuery.rows[0];

    // Compare the typed password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid NIC or Password" });
    }

    res.json({ message: "Login successful", user: { id: user.midwife_id, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// DASHBOARD STATISTICS & ALERTS
// ==========================================
app.get('/api/dashboard', async (req, res) => {
  try {
    // 1. Total Patients
    const totalPatientsResult = await pool.query('SELECT COUNT(*) FROM patient');
    const totalPatients = parseInt(totalPatientsResult.rows[0].count, 10);

    // 2. Recent Clinic Visits (Last 7 Days)
    const recentVisitsResult = await pool.query(`
      SELECT COUNT(*) FROM clinic_care
      WHERE visit_date >= CURRENT_DATE - INTERVAL '7 days'
    `);
    const recentVisits = parseInt(recentVisitsResult.rows[0].count, 10);

    // 3. High Blood Pressure Alerts (Systolic >= 140 OR Diastolic >= 90)
    const alertsResult = await pool.query(`
      SELECT p.patient_id, p.first_name, p.last_name, c.visit_date, c.bp_systolic, c.bp_diastolic, c.poa
      FROM clinic_care c
      JOIN patient p ON c.patient_id = p.patient_id
      WHERE c.bp_systolic >= 140 OR c.bp_diastolic >= 90
      ORDER BY c.visit_date DESC
      LIMIT 5
    `);

    // 4. Missing Birth Plans
    const missingPlansResult = await pool.query(`
      SELECT p.patient_id, p.first_name, p.last_name
      FROM patient p
      LEFT JOIN birth_plan b ON p.patient_id = b.patient_id
      WHERE b.plan_id IS NULL
      LIMIT 5
    `);

    res.json({
      totalPatients,
      recentVisits,
      alerts: alertsResult.rows,
      missingPlans: missingPlansResult.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   ZONES
================================= */

// Get all zones
app.get("/api/zones", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM zones ORDER BY area_code, zone_code"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ==============================
   PATIENT MANAGEMENT
================================= */

// Pending patients
app.get('/api/patients/pending', async (req, res) => {
  try {
    const patients = await pool.query(`
      SELECT patient_id, first_name, nic, contact_number, email, registration_date
      FROM patient
      WHERE status = 'PENDING'
      ORDER BY registration_date DESC
    `);

    res.json(patients.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search active patients
app.get('/api/patients/search', async (req, res) => {
  const q = req.query.q || '';

  try {
    const patients = await pool.query(
      `
      SELECT 
        p.patient_id,
        p.first_name,
        p.last_name,
        p.nic,
        p.contact_number,
        p.email,
        p.registration_number,
        p.visit_zone,
        z.zone_name
      FROM patient p
      LEFT JOIN zones z ON p.visit_zone = z.zone_code
      WHERE p.status = 'ACTIVE'
      AND (
        p.first_name ILIKE $1
        OR p.last_name ILIKE $1
        OR p.nic ILIKE $1
        OR p.contact_number ILIKE $1
        OR p.email ILIKE $1
      )
      ORDER BY p.first_name ASC
      `,
      [`%${q.trim()}%`]
    );

    res.json(patients.rows);
  } catch (err) {
    console.error("Search Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get single patient
app.get("/api/patients/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        p.*,
        z.zone_name
      FROM patient p
      LEFT JOIN zones z ON p.visit_zone = z.zone_code
      WHERE p.patient_id = $1
      `,
      [req.params.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate + update patient
app.put('/api/patients/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const data = req.body;

    if (!data.registration_number) {
      data.registration_number = await generateRegistrationNumber();
    }

    data.status = 'ACTIVE';

    // ONLY allow real DB columns
    const allowedFields = [
      "first_name",
      "last_name",
      "nic",
      "email",
      "contact_number",
      "address",

      "blood_group",
      "bmi",
      "height_cm",
      "allergies",
      "antenatal_risk_conditions",

      "emergency_contact_name",
      "emergency_contact_phone",
      "emergency_contact_address",

      "spouse_name",
      "spouse_age",

      "pregnant_mother_register_date",
      "grama_niladhari_division",
      "phm_area",
      "moh_area",
      "phm_phone",
      "moh_phone",

      "visit_zone",   // IMPORTANT: must exist in DB
      "registration_number",
      "status"
    ];

    const fields = [];
    const values = [];

    allowedFields.forEach((key) => {
      let value = data[key];

      // ❌ skip undefined or empty strings
      if (value === undefined || value === "") return;

      // convert empty numeric safety
      if (["bmi", "height_cm", "spouse_age"].includes(key)) {
        value = value === "" ? null : Number(value);
      }

      fields.push(key);
      values.push(value);
    });

    if (fields.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const setClause = fields
      .map((field, index) => `${field} = $${index + 2}`)
      .join(", ");

    const query = `
      UPDATE patient
      SET ${setClause}
      WHERE patient_id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("UPDATE PATIENT ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ error: err.message });
  }
});
// 5. Get Midwife's 3-Day Territory Map
app.get('/api/midwife/:midwifeId/territory', async (req, res) => {
  try {
    const query = `
      SELECT patient_id, first_name, last_name, contact_number, address, 
             latitude, longitude, visit_zone, assigned_visit_day, antenatal_risk_conditions
      FROM patient 
      WHERE assigned_midwife_id = $1 AND status = 'ACTIVE' AND visit_zone IS NOT NULL
      ORDER BY visit_zone ASC, first_name ASC
    `;
    const result = await pool.query(query, [req.params.midwifeId]);
    
    const territoryPlan = { "Zone A": [], "Zone B": [], "Zone C": [] };
    result.rows.forEach(patient => {
      if (territoryPlan[patient.visit_zone]) territoryPlan[patient.visit_zone].push(patient);
    });

    res.json(territoryPlan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// MULTIPLE VISIT TABLES (Prenatal Field Note)
// ==========================================

// Get visits for a specific patient
app.get('/api/visits/:patientId', async (req, res) => {
  const { patientId } = req.params;
  try {
    const visits = await pool.query("SELECT * FROM prenatal_field_note WHERE patient_id = $1 ORDER BY visit_number ASC", [patientId]);
    res.json(visits.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a new visit record
app.post('/api/visits', async (req, res) => {
  const { patient_id, visit_number, weeks_into_pregnancy, anemia, swelling, fundal_height, fetal_heart_rate } = req.body;
  try {
    const newVisit = await pool.query(
      `INSERT INTO prenatal_field_note
      (patient_id, visit_number, weeks_into_pregnancy, anemia, swelling, fundal_height, fetal_heart_rate)
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [patient_id, visit_number, weeks_into_pregnancy, anemia, swelling, fundal_height, fetal_heart_rate]
    );
    res.json(newVisit.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// SECTION A: SINGLE ENTRY ROUTES (Medical History)
// ==========================================

// GET Medical History
app.get('/api/medical-history/:patientId', async (req, res) => {
  try {
    console.log(`\n--- 🔍 GET REQUEST for Patient ID: ${req.params.patientId} ---`);
    const history = await pool.query("SELECT * FROM medical_surgical_history WHERE patient_id = $1", [req.params.patientId]);
   
    console.log("Database Row Returned to Frontend:", history.rows[0]);
    res.json(history.rows[0] || null);
  } catch (err) {
    console.error("Backend GET Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// INSERT ONLY Medical History (Blocks all modifications if record exists)
app.post('/api/medical-history', async (req, res) => {
  try {
    console.log("\n--- 📤 POST REQUEST received from React ---");
    console.log("Incoming req.body:", req.body);

    const { patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions } = req.body;

    // 1. Strict Check: If a row exists for this patient, reject right away
    const existingCheck = await pool.query(
      "SELECT 1 FROM medical_surgical_history WHERE patient_id = $1",
      [patient_id]
    );

    if (existingCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: "Medical history has already been established for this patient and cannot be updated." 
      });
    }

    // 2. Perform safe, secondary insert knowing no conflict exists
    const insertQuery = `
      INSERT INTO medical_surgical_history (patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`;

    const result = await pool.query(insertQuery, [patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions]);
    
    console.log("Database Row AFTER Insertion Execution:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Backend POST Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SECTION C: MULTI-VISIT ROUTES (Clinic Care)
// ==========================================

// GET Clinic Visits (Read-Only)
app.get('/api/clinic-care/:patientId', async (req, res) => {
  try {
    const visits = await pool.query(
      "SELECT * FROM clinic_care WHERE patient_id = $1 ORDER BY visit_date DESC",
      [req.params.patientId]
    );
    res.json(visits.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PAST OBSTETRIC HISTORY ROUTES
// ==========================================

// GET All Past Pregnancies for a Patient
app.get('/api/past-obstetric-history/:patientId', async (req, res) => {
  try {
    const history = await pool.query(
      "SELECT * FROM past_obstetric_history WHERE patient_id = $1 ORDER BY pregnancy_number ASC",
      [req.params.patientId]
    );
    res.json(history.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// INSERT New Past Pregnancy Record
app.post('/api/past-obstetric-history', async (req, res) => {
  const { patient_id, pregnancy_number, year_of_birth, outcome, sex, birth_weight, mode_of_delivery, complications } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO past_obstetric_history
      (patient_id, pregnancy_number, year_of_birth, outcome, sex, birth_weight, mode_of_delivery, complications)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [patient_id, pregnancy_number, year_of_birth, outcome, sex, birth_weight, mode_of_delivery, complications]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// GET Basic Patient Details (for headers/titles)
app.get('/api/patients/details/:id', async (req, res) => {
  try {
    const patient = await pool.query(
      "SELECT first_name, last_name FROM patient WHERE patient_id = $1",
      [req.params.id]
    );
    if (patient.rows.length === 0) return res.status(404).json({ error: "Patient not found" });
    res.json(patient.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// ROUTINE INVESTIGATIONS & LABS
// ==========================================


// GET Lab Results for a specific patient
app.get('/api/labs/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    // Query to find the record
    const result = await pool.query(
      "SELECT * FROM routine_investigations WHERE patient_id = $1", 
      [patientId]
    );

    // Return the record if it exists, otherwise return null
    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error("Error fetching lab results:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post('/api/labs', async (req, res) => {
  const {
    patient_id,
    syphilis_poa, syphilis_sample_date, syphilis_result_date, syphilis_result, syphilis_referral_date,
    bs_1_poa, bs_1_result, bs_2_poa, bs_2_result,
    hb_1_poa, hb_1_result, hb_2_poa, hb_2_result,
    hiv_sample_date, hiv_result_date,
    malaria_poa, malaria_result, other_investigations
  } = req.body;

  try {
    const query = `
      INSERT INTO routine_investigations (
        patient_id,
        syphilis_poa, syphilis_sample_date, syphilis_result_date, syphilis_result, syphilis_referral_date,
        bs_1_poa, bs_1_result, bs_2_poa, bs_2_result,
        hb_1_poa, hb_1_result, hb_2_poa, hb_2_result,
        hiv_sample_date, hiv_result_date,
        malaria_poa, malaria_result, other_investigations
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,
        $7,$8,$9,$10,
        $11,$12,$13,$14,
        $15,$16,
        $17,$18,$19
      )
      ON CONFLICT (patient_id)
      DO UPDATE SET
        syphilis_poa = COALESCE(EXCLUDED.syphilis_poa, routine_investigations.syphilis_poa),
        syphilis_sample_date = COALESCE(EXCLUDED.syphilis_sample_date, routine_investigations.syphilis_sample_date),
        syphilis_result_date = COALESCE(EXCLUDED.syphilis_result_date, routine_investigations.syphilis_result_date),
        syphilis_result = COALESCE(EXCLUDED.syphilis_result, routine_investigations.syphilis_result),
        syphilis_referral_date = COALESCE(EXCLUDED.syphilis_referral_date, routine_investigations.syphilis_referral_date),

        bs_1_poa = COALESCE(EXCLUDED.bs_1_poa, routine_investigations.bs_1_poa),
        bs_1_result = COALESCE(EXCLUDED.bs_1_result, routine_investigations.bs_1_result),
        bs_2_poa = COALESCE(EXCLUDED.bs_2_poa, routine_investigations.bs_2_poa),
        bs_2_result = COALESCE(EXCLUDED.bs_2_result, routine_investigations.bs_2_result),

        hb_1_poa = COALESCE(EXCLUDED.hb_1_poa, routine_investigations.hb_1_poa),
        hb_1_result = COALESCE(EXCLUDED.hb_1_result, routine_investigations.hb_1_result),
        hb_2_poa = COALESCE(EXCLUDED.hb_2_poa, routine_investigations.hb_2_poa),
        hb_2_result = COALESCE(EXCLUDED.hb_2_result, routine_investigations.hb_2_result),

        hiv_sample_date = COALESCE(EXCLUDED.hiv_sample_date, routine_investigations.hiv_sample_date),
        hiv_result_date = COALESCE(EXCLUDED.hiv_result_date, routine_investigations.hiv_result_date),

        malaria_poa = COALESCE(EXCLUDED.malaria_poa, routine_investigations.malaria_poa),
        malaria_result = COALESCE(EXCLUDED.malaria_result, routine_investigations.malaria_result),

        other_investigations = COALESCE(EXCLUDED.other_investigations, routine_investigations.other_investigations)

      RETURNING *;
    `;

    const values = [
      patient_id,
      syphilis_poa, syphilis_sample_date || null, syphilis_result_date || null, syphilis_result, syphilis_referral_date || null,
      bs_1_poa, bs_1_result, bs_2_poa, bs_2_result,
      hb_1_poa, hb_1_result, hb_2_poa, hb_2_result,
      hiv_sample_date || null, hiv_result_date || null,
      malaria_poa, malaria_result,
      other_investigations
    ];

    const result = await pool.query(query, values);

    res.status(200).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// ==========================================
// BIRTH & EMERGENCY PREPAREDNESS PLAN
// ==========================================

// GET Birth Plan
app.get('/api/birth-plan/:patientId', async (req, res) => {
  try {
    const plan = await pool.query("SELECT * FROM birth_plan WHERE patient_id = $1", [req.params.patientId]);
    res.json(plan.rows[0] || null);
  }catch (err) {
  console.error("BIRTH PLAN ERROR:", err); // 👈 IMPORTANT
  res.status(500).json({ error: err.message });
}
});

// UPSERT Birth Plan
app.post('/api/birth-plan', async (req, res) => {
  try {
    const {
      patient_id,
      plan_date,
      intended_delivery_facility,
      emergency_transport_mode,
      birth_companion_name,
      support_phone,
      blood_donor_name,
      blood_donor_phone,
      emergency_funds_arranged
    } = req.body;

    const upsertQuery = `
      INSERT INTO birth_plan (
        patient_id,
        plan_date,
        intended_delivery_facility,
        emergency_transport_mode,
        birth_companion_name,
        support_phone,
        blood_donor_name,
        blood_donor_phone,
        emergency_funds_arranged
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)

      ON CONFLICT (patient_id)
      DO UPDATE SET
        plan_date = EXCLUDED.plan_date,
        intended_delivery_facility = EXCLUDED.intended_delivery_facility,
        emergency_transport_mode = EXCLUDED.emergency_transport_mode,
        birth_companion_name = EXCLUDED.birth_companion_name,
        support_phone = EXCLUDED.support_phone,
        blood_donor_name = EXCLUDED.blood_donor_name,
        blood_donor_phone = EXCLUDED.blood_donor_phone,
        emergency_funds_arranged = EXCLUDED.emergency_funds_arranged

      RETURNING *;
    `;

    const values = [
      patient_id,
      plan_date,
      intended_delivery_facility,
      emergency_transport_mode,
      birth_companion_name,
      support_phone,
      blood_donor_name,
      blood_donor_phone,
      emergency_funds_arranged
    ];

    const result = await pool.query(upsertQuery, values);
    res.json(result.rows[0]);

  } catch (err) {
    console.error("BIRTH PLAN ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POSTNATAL CARE (PNC) VISITS
// ==========================================

// GET all postnatal checkups for a specific patient
app.get('/api/pnc-visits/:patientId', async (req, res) => {
  try {
    const visits = await pool.query(
      "SELECT * FROM pnc_visits WHERE patient_id = $1 ORDER BY visit_date ASC",
      [req.params.patientId]
    );

    res.json(visits.rows);
  } catch (err) {
    console.error("PNC GET ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// POST a new postnatal checkup log entry
app.post('/api/pnc-visits', async (req, res) => {
  try {
    const {
      patient_id,
      visit_date,
      visit_type,
      infant_care_edu,
      danger_signs_newborn_edu,
      exclusive_breastfeeding_edu,
      breastfeeding_positioning_edu,
      breastfeeding_supply_edu,
      pnc_danger_signs_edu,
      family_planning_importance,
      family_planning_methods,
      next_clinic_date,
      mother_left_area,
      referral_letter_issued,
      mother_temp,
      mother_anemia,
      mother_breasts,
      uterine_involution,
      lochia_type,
      lochia_foul_smell,
      perineal_wound_status,
      perineal_wound_infected,
      gauze_retained,
      mood_changes,
      upper_abdominal_pain,
      diarrhoea,
      vomiting,
      difficulty_breathing,
      blurred_vision_headache,
      calf_pain_dvt,
      epds_status,
      child_distress_signs,
      child_fever,
      child_skin_color,
      umbilical_cord_status,
      child_grunting,
      child_sucking_ability,
      child_attachment_observed,
      child_micronutrients,
      bcg_vaccination,
      neonatal_death,
      death_age_window,
      death_investigated,
      cause_of_death,
      other_remarks
    } = req.body;

    // IMPORTANT: prevent empty strings breaking DB types
    const clean = (val) => (val === "" ? null : val);

    const query = `
      INSERT INTO pnc_visits (
        patient_id, visit_date, visit_type,
        infant_care_edu, danger_signs_newborn_edu,
        exclusive_breastfeeding_edu, breastfeeding_positioning_edu, breastfeeding_supply_edu,
        pnc_danger_signs_edu, family_planning_importance, family_planning_methods,
        next_clinic_date, mother_left_area, referral_letter_issued,
        mother_temp, mother_anemia, mother_breasts,
        uterine_involution, lochia_type, lochia_foul_smell,
        perineal_wound_status, perineal_wound_infected, gauze_retained,
        mood_changes, upper_abdominal_pain, diarrhoea, vomiting,
        difficulty_breathing, blurred_vision_headache, calf_pain_dvt,
        epds_status, child_distress_signs, child_fever, child_skin_color,
        umbilical_cord_status, child_grunting, child_sucking_ability,
        child_attachment_observed, child_micronutrients, bcg_vaccination,
        neonatal_death, death_age_window, death_investigated,
        cause_of_death, other_remarks
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
        $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
        $21,$22,$23,$24,$25,$26,$27,$28,$29,$30,
        $31,$32,$33,$34,$35,$36,$37,$38,$39,$40,
        $41,$42,$43,$44,$45
      )
      RETURNING *;
    `;

    const values = [
      patient_id,
      visit_date,
      visit_type,

      infant_care_edu,
      danger_signs_newborn_edu,
      exclusive_breastfeeding_edu,
      breastfeeding_positioning_edu,
      breastfeeding_supply_edu,
      pnc_danger_signs_edu,
      family_planning_importance,
      family_planning_methods,

      clean(next_clinic_date),
      mother_left_area,
      referral_letter_issued,

      clean(mother_temp),
      mother_anemia,
      mother_breasts,

      clean(uterine_involution),
      lochia_type,
      lochia_foul_smell,

      perineal_wound_status,
      perineal_wound_infected,
      gauze_retained,

      mood_changes,
      upper_abdominal_pain,
      diarrhoea,
      vomiting,
      difficulty_breathing,
      blurred_vision_headache,
      calf_pain_dvt,

      epds_status,
      child_distress_signs,
      child_fever,
      child_skin_color,
      umbilical_cord_status,
      child_grunting,
      child_sucking_ability,
      child_attachment_observed,
      child_micronutrients,
      bcg_vaccination,

      neonatal_death,
      death_age_window,
      death_investigated,
      cause_of_death,
      other_remarks
    ];

    const result = await pool.query(query, values);

    res.json(result.rows[0]);

  } catch (err) {
    console.error("PNC POST ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// SERVER INITIALIZATION
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));