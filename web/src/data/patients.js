// data/patients.js (10 patients with doctorId: 1 and nurseId: 2)
export const patients = [
  {
    id: 1,
    firstName: 'Maria',
    lastName: 'Garcia',
    dateOfBirth: '1990-05-15',
    age: 33,
    email: 'maria.garcia@email.com',
    phone: '+1 555 123 4567',
    address: '123 Main St, Cityville',
    bloodGroup: 'A+',
    allergies: ['Penicillin'],
    doctorId: 1, // Dr. Sarah Johnson
    nurseId: 2, // Nurse Emily Williams
    emergencyContact: {
      name: 'John Garcia',
      relationship: 'Husband',
      phone: '+1 555 987 6543'
    },
    pregnancy: {
      status: 'Active',
      weeks: 28,
      dueDate: '2024-12-15',
      gravida: 2,
      para: 1,
      abortions: 0,
      highRisk: false,
      complications: []
    },
    medicalHistory: {
      previousPregnancies: 1,
      previousDeliveries: 1,
      complications: ['None'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 1,
        date: '2024-01-15',
        chiefComplaint: 'Routine checkup',
        findings: 'Normal fetal heartbeat, good movement',
        assessment: 'Healthy pregnancy progressing well',
        notes: 'Continue regular checkups'
      }
    ],
    vitalSigns: [
      {
        id: 1,
        date: '2024-01-15',
        temperature: 36.8,
        pulse: 72,
        respiratoryRate: 16,
        bloodPressure: '120/80',
        weight: 68.5,
        height: 165,
        bmi: 25.2
      }
    ],
    vaccinations: [
      {
        id: 1,
        type: 'Tetanus Toxoid',
        dose: 1,
        date: '2024-01-15',
        batchNumber: 'TT-2024-001'
      }
    ],
    investigations: [
      {
        id: 1,
        date: '2024-01-10',
        type: 'Blood Sample',
        bloodSugar: 92,
        hemoglobin: 12.5,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'A+',
        notes: 'All results normal'
      }
    ],
    ultrasound: {
      edd: '2024-12-15',
      correctedEdd: '2024-12-15',
      poaAtScan: 20,
      findings: 'Normal fetal development, good amniotic fluid',
      doctorNotes: 'Scan shows healthy growth'
    }
  },
  {
    id: 2,
    firstName: 'Jessica',
    lastName: 'Williams',
    dateOfBirth: '1988-08-22',
    age: 35,
    email: 'jessica.w@email.com',
    phone: '+1 555 234 5678',
    address: '456 Oak Ave, Townsville',
    bloodGroup: 'B-',
    allergies: ['Latex'],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Robert Williams',
      relationship: 'Husband',
      phone: '+1 555 876 5432'
    },
    pregnancy: {
      status: 'Active - High Risk',
      weeks: 32,
      dueDate: '2024-11-01',
      gravida: 3,
      para: 2,
      abortions: 0,
      highRisk: true,
      complications: ['Gestational Diabetes']
    },
    medicalHistory: {
      previousPregnancies: 2,
      previousDeliveries: 2,
      complications: ['Gestational Diabetes'],
      miscarriages: 0,
      diabetes: true,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 2,
        date: '2024-01-20',
        chiefComplaint: 'Blood sugar monitoring',
        findings: 'Elevated fasting glucose',
        assessment: 'Gestational diabetes management needed',
        notes: 'Started insulin therapy'
      }
    ],
    vitalSigns: [
      {
        id: 2,
        date: '2024-01-20',
        temperature: 37.0,
        pulse: 80,
        respiratoryRate: 18,
        bloodPressure: '130/85',
        weight: 75.2,
        height: 162,
        bmi: 28.7
      }
    ],
    vaccinations: [
      {
        id: 2,
        type: 'Tetanus Toxoid',
        dose: 2,
        date: '2024-01-20',
        batchNumber: 'TT-2024-002'
      },
      {
        id: 3,
        type: 'COVID Vaccine',
        dose: 1,
        date: '2024-01-20',
        batchNumber: 'CV-2024-001'
      }
    ],
    investigations: [
      {
        id: 2,
        date: '2024-01-18',
        type: 'Blood Sample',
        bloodSugar: 145,
        hemoglobin: 11.8,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'B-',
        notes: 'Elevated blood sugar, monitor closely'
      }
    ],
    ultrasound: {
      edd: '2024-11-01',
      correctedEdd: '2024-11-05',
      poaAtScan: 28,
      findings: 'Normal growth, fetal movements good',
      doctorNotes: 'Continue regular monitoring'
    }
  },
  {
    id: 3,
    firstName: 'Sarah',
    lastName: 'Johnson',
    dateOfBirth: '1992-03-10',
    age: 32,
    email: 'sarah.j@email.com',
    phone: '+1 555 345 6789',
    address: '789 Pine St, Villagetown',
    bloodGroup: 'O+',
    allergies: [],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Michael Johnson',
      relationship: 'Husband',
      phone: '+1 555 765 4321'
    },
    pregnancy: {
      status: 'Active',
      weeks: 20,
      dueDate: '2025-01-15',
      gravida: 1,
      para: 0,
      abortions: 0,
      highRisk: false,
      complications: []
    },
    medicalHistory: {
      previousPregnancies: 0,
      previousDeliveries: 0,
      complications: ['None'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 3,
        date: '2024-01-25',
        chiefComplaint: 'First pregnancy checkup',
        findings: 'All vitals normal',
        assessment: 'Healthy first pregnancy',
        notes: 'Continue routine care'
      }
    ],
    vitalSigns: [
      {
        id: 3,
        date: '2024-01-25',
        temperature: 36.6,
        pulse: 75,
        respiratoryRate: 16,
        bloodPressure: '115/75',
        weight: 65.0,
        height: 168,
        bmi: 23.0
      }
    ],
    vaccinations: [
      {
        id: 4,
        type: 'Tetanus Toxoid',
        dose: 1,
        date: '2024-01-25',
        batchNumber: 'TT-2024-003'
      }
    ],
    investigations: [
      {
        id: 3,
        date: '2024-01-23',
        type: 'Blood Sample',
        bloodSugar: 88,
        hemoglobin: 13.0,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'O+',
        notes: 'All results normal'
      }
    ],
    ultrasound: {
      edd: '2025-01-15',
      correctedEdd: '2025-01-15',
      poaAtScan: 16,
      findings: 'Normal fetal development',
      doctorNotes: 'Healthy first pregnancy'
    }
  },
  {
    id: 4,
    firstName: 'Emma',
    lastName: 'Brown',
    dateOfBirth: '1985-11-05',
    age: 38,
    email: 'emma.b@email.com',
    phone: '+1 555 456 7890',
    address: '321 Elm St, Citytown',
    bloodGroup: 'AB+',
    allergies: ['Sulfa Drugs'],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'David Brown',
      relationship: 'Husband',
      phone: '+1 555 654 3210'
    },
    pregnancy: {
      status: 'Active - High Risk',
      weeks: 34,
      dueDate: '2024-10-20',
      gravida: 4,
      para: 3,
      abortions: 0,
      highRisk: true,
      complications: ['Pre-eclampsia', 'Advanced Maternal Age']
    },
    medicalHistory: {
      previousPregnancies: 3,
      previousDeliveries: 3,
      complications: ['Pre-eclampsia'],
      miscarriages: 0,
      diabetes: false,
      hypertension: true,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 4,
        date: '2024-01-30',
        chiefComplaint: 'High blood pressure',
        findings: 'BP 145/95, protein in urine',
        assessment: 'Pre-eclampsia management needed',
        notes: 'Monitor BP daily, medication started'
      }
    ],
    vitalSigns: [
      {
        id: 4,
        date: '2024-01-30',
        temperature: 37.0,
        pulse: 85,
        respiratoryRate: 18,
        bloodPressure: '145/95',
        weight: 80.5,
        height: 160,
        bmi: 31.4
      }
    ],
    vaccinations: [
      {
        id: 5,
        type: 'Tetanus Toxoid',
        dose: 2,
        date: '2024-01-30',
        batchNumber: 'TT-2024-004'
      }
    ],
    investigations: [
      {
        id: 4,
        date: '2024-01-28',
        type: 'Blood Sample',
        bloodSugar: 95,
        hemoglobin: 11.5,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'AB+',
        notes: 'Protein in urine, monitoring pre-eclampsia'
      }
    ],
    ultrasound: {
      edd: '2024-10-20',
      correctedEdd: '2024-10-22',
      poaAtScan: 30,
      findings: 'Growth restricted, close monitoring needed',
      doctorNotes: 'High risk case, weekly scans'
    }
  },
  {
    id: 5,
    firstName: 'Lisa',
    lastName: 'Anderson',
    dateOfBirth: '1993-07-18',
    age: 30,
    email: 'lisa.a@email.com',
    phone: '+1 555 567 8901',
    address: '654 Maple St, Countryside',
    bloodGroup: 'A-',
    allergies: [],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Mark Anderson',
      relationship: 'Husband',
      phone: '+1 555 543 2109'
    },
    pregnancy: {
      status: 'Active',
      weeks: 16,
      dueDate: '2025-02-10',
      gravida: 2,
      para: 1,
      abortions: 0,
      highRisk: false,
      complications: []
    },
    medicalHistory: {
      previousPregnancies: 1,
      previousDeliveries: 1,
      complications: ['None'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 5,
        date: '2024-02-05',
        chiefComplaint: 'Routine followup',
        findings: 'Normal, all vitals stable',
        assessment: 'Pregnancy progressing well',
        notes: 'Continue routine care'
      }
    ],
    vitalSigns: [
      {
        id: 5,
        date: '2024-02-05',
        temperature: 36.7,
        pulse: 74,
        respiratoryRate: 16,
        bloodPressure: '118/78',
        weight: 70.0,
        height: 163,
        bmi: 26.3
      }
    ],
    vaccinations: [
      {
        id: 6,
        type: 'Tetanus Toxoid',
        dose: 1,
        date: '2024-02-05',
        batchNumber: 'TT-2024-005'
      }
    ],
    investigations: [
      {
        id: 5,
        date: '2024-02-03',
        type: 'Blood Sample',
        bloodSugar: 90,
        hemoglobin: 12.8,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'A-',
        notes: 'All results normal'
      }
    ],
    ultrasound: {
      edd: '2025-02-10',
      correctedEdd: '2025-02-10',
      poaAtScan: 12,
      findings: 'Normal fetal development, good heartbeat',
      doctorNotes: 'Healthy pregnancy'
    }
  },
  {
    id: 6,
    firstName: 'Amanda',
    lastName: 'Taylor',
    dateOfBirth: '1987-12-12',
    age: 36,
    email: 'amanda.t@email.com',
    phone: '+1 555 678 9012',
    address: '987 Cedar St, Lakeview',
    bloodGroup: 'O-',
    allergies: ['Penicillin', 'Aspirin'],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Chris Taylor',
      relationship: 'Husband',
      phone: '+1 555 432 1098'
    },
    pregnancy: {
      status: 'Active - High Risk',
      weeks: 30,
      dueDate: '2024-11-15',
      gravida: 3,
      para: 2,
      abortions: 1,
      highRisk: true,
      complications: ['Gestational Diabetes', 'Anemia']
    },
    medicalHistory: {
      previousPregnancies: 2,
      previousDeliveries: 2,
      complications: ['Anemia'],
      miscarriages: 1,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 6,
        date: '2024-02-10',
        chiefComplaint: 'Fatigue and high blood sugar',
        findings: 'Hemoglobin 10.2, Blood sugar 160',
        assessment: 'Started iron and insulin therapy',
        notes: 'Monitor closely'
      }
    ],
    vitalSigns: [
      {
        id: 6,
        date: '2024-02-10',
        temperature: 37.0,
        pulse: 82,
        respiratoryRate: 18,
        bloodPressure: '128/82',
        weight: 78.0,
        height: 161,
        bmi: 30.1
      }
    ],
    vaccinations: [
      {
        id: 7,
        type: 'Tetanus Toxoid',
        dose: 2,
        date: '2024-02-10',
        batchNumber: 'TT-2024-006'
      }
    ],
    investigations: [
      {
        id: 6,
        date: '2024-02-08',
        type: 'Blood Sample',
        bloodSugar: 160,
        hemoglobin: 10.2,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'O-',
        notes: 'Anemia and gestational diabetes'
      }
    ],
    ultrasound: {
      edd: '2024-11-15',
      correctedEdd: '2024-11-18',
      poaAtScan: 26,
      findings: 'Normal growth, some concerns with anemia',
      doctorNotes: 'High risk, weekly monitoring'
    }
  },
  {
    id: 7,
    firstName: 'Rachel',
    lastName: 'Martinez',
    dateOfBirth: '1991-09-25',
    age: 32,
    email: 'rachel.m@email.com',
    phone: '+1 555 789 0123',
    address: '147 Birch St, Mountainview',
    bloodGroup: 'B+',
    allergies: [],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Jose Martinez',
      relationship: 'Husband',
      phone: '+1 555 321 0987'
    },
    pregnancy: {
      status: 'Active',
      weeks: 24,
      dueDate: '2024-12-30',
      gravida: 1,
      para: 0,
      abortions: 0,
      highRisk: false,
      complications: []
    },
    medicalHistory: {
      previousPregnancies: 0,
      previousDeliveries: 0,
      complications: ['None'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 7,
        date: '2024-02-15',
        chiefComplaint: 'Routine checkup',
        findings: 'Normal, good fetal movement',
        assessment: 'Healthy pregnancy',
        notes: 'Continue routine care'
      }
    ],
    vitalSigns: [
      {
        id: 7,
        date: '2024-02-15',
        temperature: 36.8,
        pulse: 76,
        respiratoryRate: 16,
        bloodPressure: '122/80',
        weight: 67.5,
        height: 164,
        bmi: 25.1
      }
    ],
    vaccinations: [
      {
        id: 8,
        type: 'Tetanus Toxoid',
        dose: 1,
        date: '2024-02-15',
        batchNumber: 'TT-2024-007'
      }
    ],
    investigations: [
      {
        id: 7,
        date: '2024-02-13',
        type: 'Blood Sample',
        bloodSugar: 88,
        hemoglobin: 13.2,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'B+',
        notes: 'All results normal'
      }
    ],
    ultrasound: {
      edd: '2024-12-30',
      correctedEdd: '2024-12-30',
      poaAtScan: 20,
      findings: 'Normal development, good heartbeat',
      doctorNotes: 'Healthy pregnancy'
    }
  },
  {
    id: 8,
    firstName: 'Megan',
    lastName: 'Thomas',
    dateOfBirth: '1984-04-20',
    age: 40,
    email: 'megan.t@email.com',
    phone: '+1 555 890 1234',
    address: '258 Willow St, Riverside',
    bloodGroup: 'AB-',
    allergies: ['Latex'],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'James Thomas',
      relationship: 'Husband',
      phone: '+1 555 210 9876'
    },
    pregnancy: {
      status: 'Active - High Risk',
      weeks: 36,
      dueDate: '2024-10-01',
      gravida: 5,
      para: 4,
      abortions: 0,
      highRisk: true,
      complications: ['Placenta Previa', 'Advanced Maternal Age']
    },
    medicalHistory: {
      previousPregnancies: 4,
      previousDeliveries: 4,
      complications: ['Placenta Previa'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 8,
        date: '2024-02-20',
        chiefComplaint: 'Bleeding with placenta previa',
        findings: 'Complete placenta previa',
        assessment: 'Emergency monitoring required',
        notes: 'Bed rest, prepare for C-section'
      }
    ],
    vitalSigns: [
      {
        id: 8,
        date: '2024-02-20',
        temperature: 37.2,
        pulse: 88,
        respiratoryRate: 18,
        bloodPressure: '135/88',
        weight: 82.0,
        height: 159,
        bmi: 32.4
      }
    ],
    vaccinations: [
      {
        id: 9,
        type: 'Tetanus Toxoid',
        dose: 2,
        date: '2024-02-20',
        batchNumber: 'TT-2024-008'
      }
    ],
    investigations: [
      {
        id: 8,
        date: '2024-02-18',
        type: 'Blood Sample',
        bloodSugar: 92,
        hemoglobin: 11.8,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'AB-',
        notes: 'Placenta previa confirmed, prepare for delivery'
      }
    ],
    ultrasound: {
      edd: '2024-10-01',
      correctedEdd: '2024-09-28',
      poaAtScan: 32,
      findings: 'Complete placenta previa, growth normal',
      doctorNotes: 'High risk, C-section planned'
    }
  },
  {
    id: 9,
    firstName: 'Stephanie',
    lastName: 'Jackson',
    dateOfBirth: '1994-02-28',
    age: 30,
    email: 'stephanie.j@email.com',
    phone: '+1 555 901 2345',
    address: '369 Spruce St, Hilltop',
    bloodGroup: 'A+',
    allergies: [],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'William Jackson',
      relationship: 'Husband',
      phone: '+1 555 109 8765'
    },
    pregnancy: {
      status: 'Active',
      weeks: 18,
      dueDate: '2025-01-25',
      gravida: 2,
      para: 1,
      abortions: 0,
      highRisk: false,
      complications: []
    },
    medicalHistory: {
      previousPregnancies: 1,
      previousDeliveries: 1,
      complications: ['None'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 9,
        date: '2024-02-25',
        chiefComplaint: 'Routine checkup',
        findings: 'Normal, good progress',
        assessment: 'Healthy second pregnancy',
        notes: 'Continue routine care'
      }
    ],
    vitalSigns: [
      {
        id: 9,
        date: '2024-02-25',
        temperature: 36.7,
        pulse: 73,
        respiratoryRate: 16,
        bloodPressure: '116/76',
        weight: 69.0,
        height: 166,
        bmi: 25.0
      }
    ],
    vaccinations: [
      {
        id: 10,
        type: 'Tetanus Toxoid',
        dose: 1,
        date: '2024-02-25',
        batchNumber: 'TT-2024-009'
      }
    ],
    investigations: [
      {
        id: 9,
        date: '2024-02-23',
        type: 'Blood Sample',
        bloodSugar: 86,
        hemoglobin: 13.5,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'A+',
        notes: 'All results normal'
      }
    ],
    ultrasound: {
      edd: '2025-01-25',
      correctedEdd: '2025-01-25',
      poaAtScan: 14,
      findings: 'Normal development',
      doctorNotes: 'Healthy pregnancy'
    }
  },
  {
    id: 10,
    firstName: 'Nicole',
    lastName: 'White',
    dateOfBirth: '1986-06-08',
    age: 37,
    email: 'nicole.w@email.com',
    phone: '+1 555 012 3456',
    address: '741 Aspen St, Lakeside',
    bloodGroup: 'B+',
    allergies: ['Codeine'],
    doctorId: 1,
    nurseId: 2,
    emergencyContact: {
      name: 'Daniel White',
      relationship: 'Husband',
      phone: '+1 555 098 7654'
    },
    pregnancy: {
      status: 'Active - High Risk',
      weeks: 26,
      dueDate: '2024-12-01',
      gravida: 3,
      para: 2,
      abortions: 0,
      highRisk: true,
      complications: ['Twin Pregnancy', 'Gestational Diabetes']
    },
    medicalHistory: {
      previousPregnancies: 2,
      previousDeliveries: 2,
      complications: ['Gestational Diabetes'],
      miscarriages: 0,
      diabetes: false,
      hypertension: false,
      cardiacDiseases: false,
      thyroidDisorders: false
    },
    clinicalRecords: [
      {
        id: 10,
        date: '2024-03-01',
        chiefComplaint: 'Twin pregnancy with diabetes',
        findings: 'Both twins growing well',
        assessment: 'High risk twin pregnancy',
        notes: 'Weekly monitoring needed'
      }
    ],
    vitalSigns: [
      {
        id: 10,
        date: '2024-03-01',
        temperature: 37.0,
        pulse: 84,
        respiratoryRate: 18,
        bloodPressure: '130/84',
        weight: 82.5,
        height: 162,
        bmi: 31.4
      }
    ],
    vaccinations: [
      {
        id: 11,
        type: 'Tetanus Toxoid',
        dose: 2,
        date: '2024-03-01',
        batchNumber: 'TT-2024-010'
      }
    ],
    investigations: [
      {
        id: 10,
        date: '2024-02-28',
        type: 'Blood Sample',
        bloodSugar: 155,
        hemoglobin: 12.0,
        syphilis: 'Negative',
        hiv: 'Negative',
        bloodGroup: 'B+',
        notes: 'Twin pregnancy, monitoring diabetes'
      }
    ],
    ultrasound: {
      edd: '2024-12-01',
      correctedEdd: '2024-12-05',
      poaAtScan: 22,
      findings: 'Twin pregnancy, both healthy',
      doctorNotes: 'Close monitoring for twins'
    }
  }
];