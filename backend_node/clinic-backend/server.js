const express = require('express');
const cors = require('cors');
const pool = require('./db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- AUTHENTICATION ROUTES ---

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
  const { nic, password } = req.body; // We will use NIC as their login username

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

    // Success! 
    res.json({ message: "Login successful", user: { id: user.midwife_id, name: user.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- DASHBOARD STATISTICS & ALERTS ---

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
    // Grabbing the most recent problematic visits
    const alertsResult = await pool.query(`
      SELECT p.patient_id, p.first_name, p.last_name, c.visit_date, c.bp_systolic, c.bp_diastolic, c.poa
      FROM clinic_care c
      JOIN patient p ON c.patient_id = p.patient_id
      WHERE c.bp_systolic >= 140 OR c.bp_diastolic >= 90
      ORDER BY c.visit_date DESC
      LIMIT 5
    `);

    // 4. Missing Birth Plans (Patients who don't have a record in birth_plan)
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

// --- PATIENT MANAGEMENT ---
// Get Pending Patients (from mobile app)
app.get('/api/patients/pending', async (req, res) => {
  try {
    const patients = await pool.query("SELECT * FROM patient WHERE status = 'PENDING' ORDER BY registration_date DESC");
    res.json(patients.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Confirm Pregnancy (Change status to ACTIVE)
app.put('/api/patients/confirm/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updated = await pool.query(
      "UPDATE patient SET status = 'ACTIVE' WHERE patient_id = $1 RETURNING *", [id]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search Active Patients
app.get('/api/patients/search', async (req, res) => {
  const { q } = req.query;
  try {
    const patients = await pool.query(
      "SELECT * FROM patient WHERE status = 'ACTIVE' AND (first_name ILIKE $1 OR last_name ILIKE $1 OR contact_number ILIKE $1)",
      [`%${q}%`]
    );
    res.json(patients.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MULTIPLE VISIT TABLES (Prenatal Field Note) ---
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

// --- SECTION A: SINGLE ENTRY ROUTES (Medical History Example) ---

// GET Medical History
app.get('/api/medical-history/:patientId', async (req, res) => {
  try {
    const history = await pool.query("SELECT * FROM medical_surgical_history WHERE patient_id = $1", [req.params.patientId]);
    res.json(history.rows[0] || null); // Return single object or null
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPSERT (Insert or Update) Medical History
app.post('/api/medical-history', async (req, res) => {
  const { patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions } = req.body;
  try {
    // ON CONFLICT requires a UNIQUE constraint on patient_id in the database
    const upsertQuery = `
      INSERT INTO medical_surgical_history (patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (patient_id) 
      DO UPDATE SET 
        diabetes = EXCLUDED.diabetes, hypertension = EXCLUDED.hypertension, 
        cardiac_diseases = EXCLUDED.cardiac_diseases, bronchial_asthma = EXCLUDED.bronchial_asthma, 
        other_conditions = EXCLUDED.other_conditions
      RETURNING *`;
    const result = await pool.query(upsertQuery, [patient_id, diabetes, hypertension, cardiac_diseases, bronchial_asthma, other_conditions]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- SECTION C: MULTI-VISIT ROUTES (Clinic Care Example) ---

// GET Clinic Visits 
app.get('/api/clinic-care/:patientId', async (req, res) => {
  try {
    const visits = await pool.query("SELECT * FROM clinic_care WHERE patient_id = $1 ORDER BY visit_date DESC", [req.params.patientId]);
    res.json(visits.rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ADD New Clinic Visit
app.post('/api/clinic-care', async (req, res) => {
  const { 
    patient_id, visit_date, poa, weight, urine_sugar, urine_albumin,
    pallor, oedema_ankle, oedema_facial, bp_systolic, bp_diastolic,
    fundal_height, foetal_lie, presentation, engagement, fm, fhs,
    iron, folate, calcium, vitamin_c, food_supplementation, officer_signature, designation 
  } = req.body;
  
  try {
    const newVisit = await pool.query(
      `INSERT INTO clinic_care 
        (patient_id, visit_date, poa, weight, urine_sugar, urine_albumin, pallor, oedema_ankle, oedema_facial, 
         bp_systolic, bp_diastolic, fundal_height, foetal_lie, presentation, engagement, fm, fhs, 
         iron, folate, calcium, vitamin_c, food_supplementation, officer_signature, designation) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24) 
       RETURNING *`,
      [
        patient_id, visit_date, poa, weight || null, urine_sugar, urine_albumin, pallor, oedema_ankle, oedema_facial,
        bp_systolic || null, bp_diastolic || null, fundal_height, foetal_lie, presentation, engagement, fm, fhs,
        iron, folate, calcium, vitamin_c, food_supplementation, officer_signature, designation
      ]
    );
    res.json(newVisit.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PAST OBSTETRIC HISTORY ROUTES ---

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

// --- ROUTINE INVESTIGATIONS & LABS ---

// GET Lab Results
app.get('/api/labs/:patientId', async (req, res) => {
  try {
    const labs = await pool.query("SELECT * FROM routine_investigations WHERE patient_id = $1", [req.params.patientId]);
    res.json(labs.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPSERT Lab Results
// UPSERT Lab Results
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
    const upsertQuery = `
      INSERT INTO routine_investigations 
        (patient_id, syphilis_poa, syphilis_sample_date, syphilis_result_date, syphilis_result, syphilis_referral_date,
         bs_1_poa, bs_1_result, bs_2_poa, bs_2_result, hb_1_poa, hb_1_result, hb_2_poa, hb_2_result,
         hiv_sample_date, hiv_result_date, malaria_poa, malaria_result, other_investigations)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      ON CONFLICT (patient_id) 
      DO UPDATE SET 
        syphilis_poa = EXCLUDED.syphilis_poa, syphilis_sample_date = EXCLUDED.syphilis_sample_date, 
        syphilis_result_date = EXCLUDED.syphilis_result_date, syphilis_result = EXCLUDED.syphilis_result, 
        syphilis_referral_date = EXCLUDED.syphilis_referral_date,
        bs_1_poa = EXCLUDED.bs_1_poa, bs_1_result = EXCLUDED.bs_1_result, 
        bs_2_poa = EXCLUDED.bs_2_poa, bs_2_result = EXCLUDED.bs_2_result,
        hb_1_poa = EXCLUDED.hb_1_poa, hb_1_result = EXCLUDED.hb_1_result, 
        hb_2_poa = EXCLUDED.hb_2_poa, hb_2_result = EXCLUDED.hb_2_result,
        hiv_sample_date = EXCLUDED.hiv_sample_date, hiv_result_date = EXCLUDED.hiv_result_date,
        malaria_poa = EXCLUDED.malaria_poa, malaria_result = EXCLUDED.malaria_result, 
        other_investigations = EXCLUDED.other_investigations
      RETURNING *`;
      
    const result = await pool.query(upsertQuery, [
      patient_id, 
      syphilis_poa, syphilis_sample_date || null, syphilis_result_date || null, syphilis_result, syphilis_referral_date || null,
      bs_1_poa, bs_1_result, bs_2_poa, bs_2_result,
      hb_1_poa, hb_1_result, hb_2_poa, hb_2_result,
      hiv_sample_date || null, hiv_result_date || null,
      malaria_poa, malaria_result, other_investigations
    ]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- BIRTH & EMERGENCY PREPAREDNESS PLAN ---

// GET Birth Plan
app.get('/api/birth-plan/:patientId', async (req, res) => {
  try {
    const plan = await pool.query("SELECT * FROM birth_plan WHERE patient_id = $1", [req.params.patientId]);
    res.json(plan.rows[0] || null);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// UPSERT Birth Plan
app.post('/api/birth-plan', async (req, res) => {
  const { 
    patient_id, 
    delivery_hospital, delivery_transport, delivery_cost, delivery_distance, delivery_time,
    emergency_hospital, emergency_transport, emergency_cost, emergency_distance, emergency_time
  } = req.body;
  
  try {
    const upsertQuery = `
      INSERT INTO birth_plan 
        (patient_id, delivery_hospital, delivery_transport, delivery_cost, delivery_distance, delivery_time,
         emergency_hospital, emergency_transport, emergency_cost, emergency_distance, emergency_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      ON CONFLICT (patient_id) 
      DO UPDATE SET 
        delivery_hospital = EXCLUDED.delivery_hospital, 
        delivery_transport = EXCLUDED.delivery_transport, 
        delivery_cost = EXCLUDED.delivery_cost, 
        delivery_distance = EXCLUDED.delivery_distance, 
        delivery_time = EXCLUDED.delivery_time,
        emergency_hospital = EXCLUDED.emergency_hospital, 
        emergency_transport = EXCLUDED.emergency_transport, 
        emergency_cost = EXCLUDED.emergency_cost, 
        emergency_distance = EXCLUDED.emergency_distance, 
        emergency_time = EXCLUDED.emergency_time
      RETURNING *`;
      
    const result = await pool.query(upsertQuery, [
      patient_id, 
      delivery_hospital, delivery_transport, delivery_cost, delivery_distance, delivery_time,
      emergency_hospital, emergency_transport, emergency_cost, emergency_distance, emergency_time
    ]);
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));