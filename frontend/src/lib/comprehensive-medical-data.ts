// Comprehensive Medical Database with Doctors and Medications
export interface Doctor {
  name: string;
  specialty: string;
  location: string;
  phone?: string;
  experience?: string;
  rating?: number;
  availability?: string;
  education?: string;
  languages?: string[];
}

export interface Medication {
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  purpose: string;
  sideEffects?: string[];
  contraindications?: string[];
  price?: string;
}

export interface DiseaseInfo {
  name?: string;
  description?: string;
  severity: 'low' | 'moderate' | 'high';
  urgency: 'routine' | 'urgent' | 'emergency';
  symptoms: string[];
  causes: string[];
  precautions: string[];
  doctors: Doctor[];
  medications: {
    painRelief: Medication[];
    treatment: Medication[];
    supplements: Medication[];
  };
  lifestyle: string[];
  followUp: string;
  emergencySignals: string[];
}

export const comprehensiveMedicalDatabase: { [key: string]: DiseaseInfo } = {
  // =================================================================
// == BLOOD REPORT CONDITIONS
// =================================================================

low_wbc: {
  name: 'Low White Blood Cell Count (Leukopenia)',
  description: 'A condition where WBC levels fall below normal, weakening the immune system and increasing infection risk.',
  severity: 'high',
  urgency: 'urgent',
  symptoms: ['Frequent infections', 'Fever', 'Fatigue', 'Mouth ulcers'],
  causes: ['Bone marrow disorders', 'Chemotherapy', 'Autoimmune diseases', 'Viral infections'],
  precautions: ['Avoid infection exposure', 'Practice good hygiene', 'Regular monitoring of blood counts'],
  doctors: [
    { name: 'Dr. Sunita Rao', specialty: 'Internal Medicine', location: 'Apollo Hospital, Bangalore', phone: '+91-9876543241' },
    { name: 'Dr. C. S. Reddy', specialty: 'Hematology', location: 'Viswa Clinic, Kurnool', phone: 'Contact clinic' },
    { name: 'Dr. M. Prabhakar Reddy', specialty: 'Hematology', location: 'Apollo Hospital, Hyderabad', phone: '+91-40-23607777' }
  ],
  medications: {
    painRelief: [
      { name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6-8 hours', duration: 'As needed', purpose: 'Reduce fever or body pain' }
    ],
    treatment: [],
    supplements: []
  },
  lifestyle: ['Eat protein-rich foods', 'Maintain good hygiene', 'Avoid crowded places'],
  followUp: 'Hematology referral and weekly CBC monitoring until stable.',
  emergencySignals: ['High fever >101°F', 'Sepsis signs like confusion or low BP', 'Uncontrolled infections']
},

high_wbc: {
  name: 'High White Blood Cell Count (Leukocytosis)',
  description: 'Increased WBCs usually due to infection, inflammation, or blood cancers.',
  severity: 'moderate',
  urgency: 'urgent',
  symptoms: ['Fever', 'Night sweats', 'Fatigue', 'Unexplained weight loss'],
  causes: ['Infections', 'Inflammation', 'Leukemia', 'Severe stress'],
  precautions: ['Identify and treat underlying cause', 'Stay hydrated', 'Regular blood tests'],
  doctors: [
    { name: 'Dr. Sunita Rao', specialty: 'Internal Medicine', location: 'Apollo Hospital, Bangalore', phone: '+91-9876543241' },
    { name: 'Dr. I. V. Reddy', specialty: 'General Medicine', location: 'Kurnool Medical College, Kurnool', phone: '+91-8518-223344' },
    { name: 'Dr. A. Krishna Murthy', specialty: 'Hematology', location: 'Yashoda Hospitals, Hyderabad', phone: '+91-40-45674567' }
  ],
  medications: {
    painRelief: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'Every 6-8 hours', duration: 'As needed', purpose: 'Reduce fever' }],
    treatment: [],
    supplements: []
  },
  lifestyle: ['Maintain hydration', 'Reduce stress', 'Quit smoking'],
  followUp: 'CBC every 2-4 weeks depending on cause and treatment.',
  emergencySignals: ['Persistent fever', 'Severe fatigue', 'Uncontrolled bleeding or bruising']
},

low_rbc: {
  name: 'Low Red Blood Cell Count (Anemia)',
  description: 'A condition where RBCs or hemoglobin are low, reducing oxygen delivery to tissues.',
  severity: 'moderate',
  urgency: 'routine',
  symptoms: ['Fatigue', 'Pale skin', 'Shortness of breath', 'Dizziness'],
  causes: ['Iron deficiency', 'Vitamin B12 deficiency', 'Chronic illness', 'Blood loss'],
  precautions: ['Iron-rich diet', 'Treat underlying cause', 'Monitor hemoglobin regularly'],
  doctors: [
    { name: 'Dr. Sunita Rao', specialty: 'Internal Medicine', location: 'Apollo Hospital, Bangalore', phone: '+91-9876543241' },
    { name: 'Dr. K. V. T. Gopal', specialty: 'General Medicine', location: 'Ratnam\'s Clinic, Kurnool', phone: '+91-8518-334455' },
    { name: 'Dr. K. Sridhar', specialty: 'Hematology', location: 'Care Hospitals, Hyderabad', phone: '+91-40-30418888' }
  ],
  medications: {
    painRelief: [],
    treatment: [],
    supplements: [
      { name: 'Iron Supplements', dosage: 'As prescribed', frequency: 'Daily', duration: '3-6 months', purpose: 'Restore iron levels' }
    ]
  },
  lifestyle: ['Eat iron-rich foods like spinach, beans, and lean meats', 'Take Vitamin C for better absorption', 'Adequate rest'],
  followUp: 'Check CBC and iron studies every 1-3 months.',
  emergencySignals: ['Severe dizziness', 'Chest pain', 'Fainting episodes']
},

high_rbc: {
  name: 'High Red Blood Cell Count (Polycythemia)',
  description: 'A condition where RBC count is above normal, thickening the blood and raising clot risk.',
  severity: 'high',
  urgency: 'urgent',
  symptoms: ['Headaches', 'Dizziness', 'Blurred vision', 'Reddened skin'],
  causes: ['Smoking', 'Dehydration', 'Polycythemia vera', 'Chronic lung disease'],
  precautions: ['Avoid smoking', 'Stay hydrated', 'Regular monitoring'],
  doctors: [
    { name: 'Dr. Ravi Mehta', specialty: 'Pulmonologist', location: 'Sir Ganga Ram Hospital, Delhi', phone: '+91-9876543240' },
    { name: 'Dr. C. S. Reddy', specialty: 'General Medicine', location: 'Viswa Clinic, Kurnool', phone: 'Contact clinic' },
    { name: 'Dr. Pradeep Kumar', specialty: 'Hematology', location: 'Apollo Hospitals, Hyderabad', phone: '+91-40-23607777' }
  ],
  medications: { painRelief: [], treatment: [], supplements: [] },
  lifestyle: ['Stay hydrated', 'Exercise regularly', 'Avoid high altitudes'],
  followUp: 'Monthly CBC monitoring and hematology referral.',
  emergencySignals: ['Sudden chest pain', 'Stroke-like symptoms', 'Severe headache']
},

low_platelets: {
  name: 'Low Platelet Count (Thrombocytopenia)',
  description: 'A condition where platelets are below normal, increasing bleeding risk.',
  severity: 'high',
  urgency: 'emergency',
  symptoms: ['Easy bruising', 'Prolonged bleeding', 'Nosebleeds', 'Red spots on skin'],
  causes: ['Dengue fever', 'Bone marrow disorders', 'Immune conditions', 'Certain medicines'],
  precautions: ['Avoid injury', 'Stop blood-thinners unless advised', 'Monitor platelet count'],
  doctors: [
    { name: 'Dr. Sunita Rao', specialty: 'Internal Medicine', location: 'Apollo Hospital, Bangalore', phone: '+91-9876543241' },
    { name: 'Dr. I. V. Reddy', specialty: 'General Medicine', location: 'Kurnool Medical College, Kurnool', phone: '+91-8518-223344' },
    { name: 'Dr. P. Anuradha', specialty: 'Hematology', location: 'Yashoda Hospitals, Hyderabad', phone: '+91-40-45674567' }
  ],
  medications: {
    painRelief: [{ name: 'Paracetamol', dosage: '500mg', frequency: 'As needed', duration: 'As needed', purpose: 'Safe fever reducer (avoid aspirin/NSAIDs)' }],
    treatment: [],
    supplements: []
  },
  lifestyle: ['Avoid contact sports', 'Use soft toothbrush', 'Avoid alcohol'],
  followUp: 'Daily platelet counts if <50,000/μL; hospital admission if <20,000/μL.',
  emergencySignals: ['Severe bleeding', 'Blood in stool/urine', 'Neurological changes (brain bleed)']
},

high_platelets: {
  name: 'High Platelet Count (Thrombocytosis)',
  description: 'A condition where platelet count is high, increasing clotting risk.',
  severity: 'moderate',
  urgency: 'urgent',
  symptoms: ['Headache', 'Chest pain', 'Dizziness', 'Numbness in hands/feet'],
  causes: ['Bone marrow disorders', 'Chronic inflammation', 'Iron deficiency', 'Cancer'],
  precautions: ['Monitor counts', 'Stay hydrated', 'Avoid smoking'],
  doctors: [
    { name: 'Dr. Sunita Rao', specialty: 'Internal Medicine', location: 'Apollo Hospital, Bangalore', phone: '+91-9876543241' },
    { name: 'Dr. K. V. T. Gopal', specialty: 'General Medicine', location: 'Ratnam\'s Clinic, Kurnool', phone: '+91-8518-334455' },
    { name: 'Dr. K. Sridhar', specialty: 'Hematology', location: 'Care Hospitals, Hyderabad', phone: '+91-40-30418888' }
  ],
  medications: { painRelief: [], treatment: [], supplements: [] },
  lifestyle: ['Drink fluids regularly', 'Balanced diet', 'Exercise moderately'],
  followUp: 'Monthly follow-up with hematologist.',
  emergencySignals: ['Sudden chest pain', 'Stroke symptoms', 'Severe headache']
},

  // =================================================================
  // == SKIN CONDITIONS
  // =================================================================
  'acne': {
    name: 'Acne Vulgaris',
    description: 'Common skin condition characterized by pimples, blackheads, and whiteheads, primarily affecting teenagers and young adults.',
    severity: 'moderate',
    urgency: 'routine',
    symptoms: ['Blackheads', 'Whiteheads', 'Pimples', 'Cysts', 'Oily skin', 'Scarring'],
    causes: ['Hormonal changes', 'Excess oil production', 'Bacteria', 'Genetics', 'Stress'],
    precautions: ['Gentle cleansing twice daily', 'Avoid picking or squeezing', 'Use non-comedogenic products', 'Manage stress levels'],
    doctors: [
      {
        name: 'Dr. Priya Sharma',
        specialty: 'Dermatologist',
        experience: '12 years',
        location: 'Apollo Hospital, Delhi',
        phone: '+91-9876543210',
        rating: 4.8,
        availability: 'Mon-Sat 10AM-6PM',
        education: 'MBBS, MD Dermatology (AIIMS)',
        languages: ['English', 'Hindi', 'Punjabi']
      },
      {
        name: 'Dr. Rajesh Kumar',
        specialty: 'Dermatologist',
        experience: '8 years',
        location: 'Max Hospital, Mumbai',
        phone: '+91-9876543211',
        rating: 4.6,
        availability: 'Tue-Sun 9AM-5PM',
        education: 'MBBS, MD Dermatology (KEM)',
        languages: ['English', 'Hindi', 'Marathi']
      }
    ],
    medications: {
      painRelief: [
        {
          name: 'Ibuprofen',
          genericName: 'Ibuprofen',
          dosage: '400mg',
          frequency: 'Twice daily after meals',
          duration: '5-7 days (for inflammation)',
          purpose: 'Reduce inflammation and pain from cystic acne',
          sideEffects: ['Stomach upset', 'Nausea', 'Dizziness'],
          contraindications: ['Stomach ulcers', 'Kidney disease', 'Pregnancy (3rd trimester)'],
          price: '₹20-40'
        }
      ],
      treatment: [
        {
          name: 'Clindamycin Gel',
          genericName: 'Clindamycin Phosphate',
          dosage: '1% gel',
          frequency: 'Twice daily (morning and night)',
          duration: '8-12 weeks',
          purpose: 'Antibiotic treatment for acne-causing bacteria',
          sideEffects: ['Skin dryness', 'Peeling', 'Redness', 'Burning sensation'],
          contraindications: ['Allergy to clindamycin', 'History of colitis'],
          price: '₹150-300'
        },
        {
          name: 'Tretinoin Cream',
          genericName: 'Tretinoin',
          dosage: '0.025% or 0.05%',
          frequency: 'Once daily at night',
          duration: '12-16 weeks minimum',
          purpose: 'Unclog pores and prevent new acne formation',
          sideEffects: ['Initial breakout', 'Dryness', 'Peeling', 'Sun sensitivity'],
          contraindications: ['Pregnancy', 'Breastfeeding', 'Eczema'],
          price: '₹200-500'
        }
      ],
      supplements: [
        {
          name: 'Zinc Supplements',
          genericName: 'Zinc Gluconate',
          dosage: '30-40mg',
          frequency: 'Once daily with food',
          duration: '3-6 months',
          purpose: 'Reduce inflammation and support skin healing',
          sideEffects: ['Nausea', 'Stomach upset', 'Metallic taste'],
          contraindications: ['Copper deficiency'],
          price: '₹300-600'
        }
      ]
    },
    lifestyle: [
      'Use gentle, fragrance-free cleansers',
      'Moisturize daily with non-comedogenic products',
      'Avoid touching face frequently',
      'Change pillowcases regularly',
      'Maintain a balanced diet low in dairy and high-glycemic foods',
      'Stay hydrated'
    ],
    followUp: 'Follow up with dermatologist after 6-8 weeks of treatment to assess progress and adjust medications if needed.',
    emergencySignals: ['Severe cystic acne with fever', 'Signs of infection (pus, warmth, red streaking)', 'Severe allergic reaction to medications']
  },
  atopic_dermatitis: {
    urgency: 'routine',
    severity: 'moderate',
    name: 'Atopic Dermatitis (Eczema)',
    description: 'Chronic inflammatory skin condition causing red, itchy, and dry patches, commonly affecting children and adults.',
    symptoms: [
      'Dry, itchy, and inflamed skin',
      'Red to brownish-gray patches',
      'Small, raised bumps which may leak fluid and crust over when scratched',
      'Thickened, cracked, scaly skin'
    ],
    causes: [
      'A combination of genetic factors, an overactive immune system, and environmental triggers.',
      'Stress and allergens can trigger flare-ups.'
    ],
    precautions: [
      'Avoid scratching, as it can lead to infection.',
      'Identify and avoid personal triggers (e.g., certain foods, fabrics, soaps).'
    ],
    doctors: [
        { name: 'Dr. R. Raghunatha Reddy', specialty: 'Dermatology', location: 'Dr. Reddy\'s Skin & Hair Clinic, Bengaluru', phone: '+91-9845922255' },
        { name: 'Dr. Reena Rai', specialty: 'Dermatology', location: 'Dr. Reena\'s Skin Clinic, Kochi', phone: '+91-484-2358822' },
        { name: 'Dr. C. S. Reddy', specialty: 'Dermatology', location: 'Viswa Skin Clinic, Kurnool', phone: 'Contact clinic' }
    ],
    medications: {
      painRelief: [
        { name: 'Antihistamine Tablets', genericName: 'e.g., Cetirizine, Loratadine', dosage: 'As directed', frequency: 'Usually at night', duration: 'As needed', purpose: 'Helps control itching, especially to improve sleep.' }
      ],
      treatment: [
        { name: 'Topical Corticosteroids', genericName: 'Varies by strength', dosage: 'Prescription Only', frequency: 'As directed', duration: 'Short-term', purpose: 'The most common treatment to reduce inflammation and itching during flare-ups.' }
      ],
      supplements: []
    },
    lifestyle: [
      'Moisturize daily with a fragrance-free cream, especially after bathing.',
      'Use a mild, pH-balanced cleanser and avoid harsh soaps.',
      'Take short, lukewarm showers instead of hot ones.'
    ],
    followUp: 'Management of this chronic condition involves a consistent skincare routine and regular check-ins with a dermatologist to manage flare-ups.',
    emergencySignals: [
      'Signs of skin infection (pus, yellow crusts, fever)',
      'Itching that becomes severe and uncontrollable'
    ]
  },
  actinic_keratosis: {
    urgency: 'urgent',
    severity: 'moderate',
    symptoms: [
      'Rough, dry, or scaly patch on the skin',
      'Usually appears on sun-exposed areas like the face, lips, ears, scalp, and hands',
      'Can be flat or slightly raised',
      'May be pink, red, or brown in color'
    ],
    causes: [
      'Long-term exposure to ultraviolet (UV) radiation from the sun.'
    ],
    precautions: [
      'This is a pre-cancerous condition that can develop into squamous cell carcinoma. Medical evaluation is essential.',
      'Strict and consistent sun protection is mandatory to prevent new lesions.'
    ],
    doctors: [
      { name: 'Dr. Maya Vedamurthy', specialty: 'Dermatology', location: 'Apollo Hospitals, Chennai', phone: '+91-44-28293333' },
      { name: 'Dr. B. S. Chandrashekar', specialty: 'Dermatology', location: 'CUTIS Clinic, Bengaluru', phone: '+91-80-41518080' },
      { name: 'Dr. I. V. Reddy', specialty: 'Dermatology', location: 'Dr. I V Reddy Skin Clinic, Kurnool', phone: '+91-8518-223344' }
    ],
    medications: {
      painRelief: [],
      treatment: [
        { name: 'Fluorouracil (5-FU) Cream', genericName: 'Fluorouracil', dosage: 'Prescription Only', frequency: 'As directed', duration: 'Weeks', purpose: 'Topical chemotherapy cream that destroys pre-cancerous cells.' },
        { name: 'Imiquimod Cream', genericName: 'Imiquimod', dosage: 'Prescription Only', frequency: 'As directed', duration: 'Weeks', purpose: 'Stimulates the immune system to attack the abnormal cells.' }
      ],
      supplements: []
    },
    lifestyle: [
      'Apply broad-spectrum sunscreen (SPF 30+) daily, even on cloudy days.',
      'Wear protective clothing, including wide-brimmed hats and sunglasses.',
      'Seek shade during peak sun hours (10 a.m. to 4 p.m.).'
    ],
    followUp: 'Regular skin checks with a dermatologist are necessary to monitor for recurrence and check for any signs of skin cancer.',
    emergencySignals: [
      'A lesion that grows rapidly',
      'A lesion that becomes painful, bleeds, or ulcerates'
    ]
  },
  benign_keratosis: {
    urgency: 'routine',
    severity: 'moderate',
    symptoms: [
      'Waxy or wart-like growths',
      'Can be brown, black, or light tan',
      'Appear "stuck on" the skin',
      'Usually found on the chest, back, head, or neck'
    ],
    causes: [
      'The exact cause is unknown, but they are very common and tend to run in families.',
      'They are non-cancerous and not contagious.'
    ],
    precautions: [
      'These growths are harmless. Treatment is not medically necessary.',
      'Any sudden change in a growth or the appearance of many growths at once should be evaluated by a dermatologist to rule out other issues.'
    ],
    doctors: [
      { name: 'Dr. Radha Shah', specialty: 'Dermatology', location: 'Oliva Skin & Hair Clinic, Hyderabad' },
      { name: 'Dr. Feroz K', specialty: 'Dermatology', location: 'Lisie Hospital, Kochi', phone: '+91-484-2402044' },
      { name: 'Dermatology Department', specialty: 'Dermatology', location: 'Kurnool Medical College', phone: 'Contact hospital' }
    ],
    medications: {
      painRelief: [],
      treatment: [],
      supplements: []
    },
    lifestyle: [
      'Practice good sun protection, as this is beneficial for overall skin health.'
    ],
    followUp: 'No follow-up is required unless a growth becomes irritated or you desire cosmetic removal. Always see a doctor for any new or changing skin spots.',
    emergencySignals: [
      'A growth that rapidly changes in size, shape, or color',
      'A growth that bleeds, itches, or becomes painful'
    ]
  },
  candidiasis_ringworm_tinea: {
    urgency: 'routine',
    severity: 'moderate',
    symptoms: [
      'For Ringworm (Tinea): Red, scaly, itchy, ring-shaped rash.',
      'For Candidiasis: Red rash, itching, and burning, often in skin folds (e.g., underarms, groin).',
      'For Athlete\'s Foot (Tinea Pedis): Itching, stinging, and burning between the toes and on the soles of the feet.'
    ],
    causes: [
      'Caused by different types of fungi.',
      'Thrives in warm, moist environments.'
    ],
    precautions: [
      'Keep the affected area clean and dry.',
      'Avoid sharing towels, clothing, or personal items to prevent spreading.',
      'Wear breathable clothing and footwear.'
    ],
    doctors: [
      { name: 'Dermatology Department', specialty: 'Dermatology', location: 'Madras Medical College, Chennai', phone: 'Contact hospital' },
      { name: 'Dermatology Department', specialty: 'Dermatology', location: 'St. John\'s Medical College Hospital, Bengaluru', phone: '080-22065000' },
      { name: 'Department of DVL', specialty: 'Dermatology', location: 'Guntur Medical College Hospital, Guntur', phone: 'Contact hospital' }
    ],
    medications: {
      painRelief: [],
      treatment: [
        { name: 'Antifungal Cream', genericName: 'Clotrimazole, Miconazole, or Terbinafine', dosage: 'Over-the-counter or Prescription', frequency: '1-2 times daily', duration: 'As directed (often 2-4 weeks)', purpose: 'Applied directly to the skin to kill the fungus.' },
        { name: 'Oral Antifungal Tablets', genericName: 'Fluconazole or Terbinafine', dosage: 'Prescription Only', frequency: 'As directed', duration: 'Varies', purpose: 'Used for widespread, severe, or stubborn infections (like on the scalp or nails).' }
      ],
      supplements: []
    },
    lifestyle: [
      'Change socks and underwear daily.',
      'Dry thoroughly after bathing, especially between toes and in skin folds.'
    ],
    followUp: 'Consult a doctor if the infection does not improve with over-the-counter treatment or if it is widespread.',
    emergencySignals: [
      'Signs of a secondary bacterial infection (increased pain, swelling, pus)',
      'If the rash spreads rapidly or is accompanied by a fever'
    ]
  },
  dermatofibroma: {
    urgency: 'routine',
    severity: 'moderate',
    symptoms: [
      'A small, firm bump or nodule under the skin.',
      'Often pink, brown, or purplish.',
      'May dimple or pucker inwards when pinched.',
      'Can be itchy or tender, but is often asymptomatic.'
    ],
    causes: [
      'The exact cause is unknown, but they can sometimes appear after a minor injury like an insect bite or splinter.',
      'They are benign (harmless) collections of fibrous tissue.'
    ],
    precautions: [
      'These are harmless and do not require treatment.',
      'Surgical removal is an option if the growth is bothersome, but it can leave a scar.'
    ],
    doctors: [
       { name: 'Dr. K. V. T. Gopal', specialty: 'Dermatology', location: 'Dr. Ratnam\'s Skin Centre, Vijayawada', phone: '+91-866-2434455' },
       { name: 'Dr. C. S. Reddy', specialty: 'Dermatology', location: 'Viswa Skin Clinic, Kurnool', phone: 'Contact clinic' },
       { name: 'Dermatology Department', specialty: 'Dermatology', location: 'Osmania General Hospital, Hyderabad', phone: 'Contact hospital' }
    ],
    medications: {
      painRelief: [],
      treatment: [],
      supplements: []
    },
    lifestyle: [],
    followUp: 'No follow-up needed unless the spot changes significantly, which is rare. Always consult a dermatologist to confirm the diagnosis of any new skin growth.',
    emergencySignals: [
      'Rapid change in size, shape, or color (unlikely for a typical dermatofibroma).'
    ]
  },
  melanocytic_nevus: {
    urgency: 'routine',
    severity: 'moderate',
    symptoms: [
      'A common mole.',
      'Usually a small, well-defined spot on the skin.',
      'Can be flat or raised, and range in color from pink to dark brown or black.',
      'Typically stable and unchanging over time.'
    ],
    causes: [
      'Clusters of melanocytes (pigment-producing cells).',
      'They are benign (harmless).'
    ],
    precautions: [
      'The most important action is to monitor your moles for any changes.',
      'Use the "ABCDE" rule to check for signs of melanoma: Asymmetry, irregular Border, uneven Color, Diameter larger than a pencil eraser, Evolving or changing.'
    ],
    doctors: [
      { name: 'Dr. Murugusundram', specialty: 'Dermatology', location: 'Skin & Cosmetology Clinic, Chennai', phone: '+91-44-24991142' },
      { name: 'Dr. B. N. Reddy', specialty: 'Dermatology', location: 'Care Hospitals, Hyderabad', phone: '+91-40-30418888' },
      { name: 'Department of Dermatology', specialty: 'Dermatology', location: 'Amrita Institute (AIMS), Kochi', phone: '+91-484-2851234' }
    ],
    medications: {
      painRelief: [],
      treatment: [],
      supplements: []
    },
    lifestyle: [
      'Practice diligent sun protection to reduce the risk of moles developing into skin cancer.'
    ],
    followUp: 'Perform monthly self-skin checks and get an annual professional skin exam from a dermatologist.',
    emergencySignals: [
      'Any mole that is changing, itching, bleeding, or meets any of the ABCDE criteria.'
    ]
  },
  melanoma: {
    urgency: 'emergency',
    severity: 'high',
    symptoms: [
      'A new, unusual growth or a change in an existing mole.',
      'Look for the "ABCDE" signs: Asymmetry, irregular Border, multiple Colors, Diameter >6mm, Evolving (changing).',
      'Can appear anywhere on the body, even in areas not exposed to the sun.'
    ],
    causes: [
      'Develops when melanocytes (pigment cells) grow out of control.',
      'UV radiation exposure is a major risk factor.'
    ],
    precautions: [
      'This is the most serious type of skin cancer and requires immediate medical attention from a dermatologist or oncologist.',
      'Do not wait or attempt to self-treat. Early detection is critical.'
    ],
    doctors: [
      { name: 'Dermatology Department', specialty: 'Dermatology/Oncology', location: 'Christian Medical College (CMC), Vellore', phone: '+91-416-2281000' },
      { name: 'Senior Dermatologists', specialty: 'Dermato-oncology', location: 'Christian Medical College (CMC), Vellore' },
      { name: 'Dr. Maya Vedamurthy', specialty: 'Dermatology', location: 'Apollo Hospitals, Chennai', phone: '+91-44-28293333' }
    ],
    medications: {
      painRelief: [],
      treatment: [
        { name: 'Immunotherapy', genericName: 'e.g., Pembrolizumab, Nivolumab', dosage: 'Specialist Use Only', frequency: 'IV infusion', duration: 'As per protocol', purpose: 'Helps the body\'s own immune system to recognize and fight cancer cells.' },
        { name: 'Targeted Therapy', genericName: 'e.g., BRAF inhibitors', dosage: 'Specialist Use Only', frequency: 'Oral tablets', duration: 'As per protocol', purpose: 'Drugs that target specific genetic mutations within the cancer cells.' }
      ],
      supplements: []
    },
    lifestyle: [
      'Strict, lifelong sun avoidance is necessary.',
      'Wear UPF clothing, hats, and sunglasses.',
      'Follow your oncology team\'s dietary advice to support your body during treatment.'
    ],
    followUp: 'Treatment almost always begins with surgical excision. This is followed by a rigorous schedule of follow-up appointments, scans, and skin checks with a specialized team.',
    emergencySignals: [
      'Any new or changing mole.',
      'The appearance of new bumps on the skin near the original site.',
      'Unexplained symptoms like weight loss, fatigue, or pain.'
    ]
  },
  squamous_cell_carcinoma: {
    urgency: 'emergency',
    severity: 'high',
    symptoms: [
      'A firm, red nodule.',
      'A flat sore with a scaly crust.',
      'A new sore or raised area on an old scar or ulcer.',
      'A rough, scaly patch on your lip that may evolve to an open sore.'
    ],
    causes: [
      'Prolonged exposure to ultraviolet (UV) radiation.',
      'Often develops from a pre-cancerous actinic keratosis.'
    ],
    precautions: [
      'This is a form of skin cancer that requires prompt medical evaluation and treatment.',
      'Can grow deep into the skin and spread to other parts of the body if left untreated.'
    ],
    doctors: [
      { name: 'Dermatology Department', specialty: 'Dermatology/Oncology', location: 'Christian Medical College (CMC), Vellore', phone: '+91-416-2281000' },
      { name: 'Senior Dermatologists', specialty: 'Dermato-oncology', location: 'Christian Medical College (CMC), Vellore' },
      { name: 'Dr. I. V. Reddy', specialty: 'Dermatology', location: 'Dr. I V Reddy Skin Clinic, Kurnool', phone: '+91-8518-223344' }
    ],
    medications: {
      painRelief: [],
      treatment: [
        { name: 'Immunotherapy', genericName: 'e.g., Cemiplimab', dosage: 'Specialist Use Only', frequency: 'IV infusion', duration: 'As per protocol', purpose: 'Used for advanced cases where surgery or radiation is not an option.' }
      ],
      supplements: []
    },
    lifestyle: [
      'Lifelong, strict sun protection is essential to prevent recurrence.',
      'Perform regular self-skin exams to check for new or changing lesions.'
    ],
    followUp: 'Treatment usually involves surgery. Regular follow-up with a dermatologist is crucial to monitor for recurrence.',
    emergencySignals: [
      'Any new, rapidly growing, or non-healing sore on the skin.'
    ]
  },
  vascular_lesion: {
    urgency: 'routine',
    severity: 'moderate',
    symptoms: [
      'A very broad category including birthmarks (like port-wine stains) or growths (like cherry angiomas or hemangiomas).',
      'Appearance varies widely from flat, red/purple patches to raised, bright red nodules.'
    ],
    causes: [
      'An abnormal collection or growth of blood vessels.',
      'Most are benign.'
    ],
    precautions: [
      'The vast majority are harmless, but any new or rapidly changing vascular spot should be diagnosed by a doctor.',
      'For certain types in infants (hemangiomas), early evaluation is important.'
    ],
    doctors: [
      { name: 'Dermatology Department', specialty: 'Dermatology', location: 'Manipal Hospital, Vijayawada', phone: '+91-866-2499999' },
      { name: 'Dr. Reena Rai', specialty: 'Dermatology', location: 'Dr. Reena\'s Skin Clinic, Kochi', phone: '+91-484-2358822' },
      { name: 'Dermatology Department', specialty: 'Dermatology', location: 'Amrita Institute (AIMS), Kochi', phone: '+91-484-2851234' }
    ],
    medications: {
      painRelief: [],
      treatment: [
        { name: 'Propranolol', genericName: 'Propranolol', dosage: 'Prescription Only Liquid', frequency: 'As directed by a pediatrician/dermatologist', duration: 'Months', purpose: 'Oral beta-blocker used to shrink certain types of hemangiomas in infants.' }
      ],
      supplements: []
    },
    lifestyle: [],
    followUp: 'Depends on the type. Many require no treatment. Others may be treated with lasers, medication, or surgery.',
    emergencySignals: [
      'A vascular lesion that starts to bleed and doesn\'t stop with pressure.',
      'A lesion that grows very rapidly or develops an ulcer.'
    ]
  },
  
  // =================================================================
  // == EYE CONDITIONS
  // =================================================================
  'diabetic_retinopathy': {
    name: 'Diabetic Retinopathy',
    description: 'Diabetes complication affecting retinal blood vessels, potentially leading to vision loss if untreated.',
    severity: 'high',
    urgency: 'urgent',
    symptoms: ['Blurred vision', 'Floaters', 'Dark spots in vision', 'Difficulty seeing at night', 'Vision loss'],
    causes: ['Prolonged high blood sugar', 'High blood pressure', 'High cholesterol', 'Pregnancy', 'Smoking'],
    precautions: ['Strict blood sugar control', 'Regular eye exams', 'Blood pressure management', 'Cholesterol control'],
    doctors: [
      {
        name: 'Dr. Vikram Singh',
        specialty: 'Retinal Specialist',
        experience: '18 years',
        location: 'Sankara Nethralaya, Chennai',
        phone: '+91-9876543230',
        rating: 4.9,
        availability: 'Mon-Sat 9AM-6PM',
        education: 'MBBS, MS Ophthalmology, Fellowship in Vitreoretinal Surgery',
        languages: ['English', 'Hindi', 'Tamil']
      },
      {
        name: 'Dr. Meera Joshi',
        specialty: 'Ophthalmologist',
        experience: '14 years',
        location: 'LV Prasad Eye Institute, Hyderabad',
        phone: '+91-9876543231',
        rating: 4.8,
        availability: 'Tue-Sun 8AM-5PM',
        education: 'MBBS, MS Ophthalmology, Fellowship in Retina',
        languages: ['English', 'Hindi', 'Telugu']
      }
    ],
    medications: {
      painRelief: [
        {
          name: 'Artificial Tears',
          genericName: 'Carboxymethylcellulose',
          dosage: '1-2 drops',
          frequency: '4-6 times daily',
          duration: 'As needed',
          purpose: 'Relieve dry eyes associated with diabetes',
          sideEffects: ['Temporary blurred vision'],
          contraindications: ['Allergy to preservatives'],
          price: '₹100-300'
        }
      ],
      treatment: [
        {
          name: 'Anti-VEGF Injections',
          genericName: 'Ranibizumab/Bevacizumab',
          dosage: 'Intravitreal injection',
          frequency: 'Monthly initially, then as needed',
          duration: 'Ongoing as required',
          purpose: 'Reduce retinal swelling and prevent vision loss',
          sideEffects: ['Eye pain', 'Increased eye pressure', 'Infection risk'],
          contraindications: ['Active eye infection', 'Recent stroke'],
          price: '₹25,000-50,000 per injection'
        }
      ],
      supplements: [
        {
          name: 'Lutein & Zeaxanthin',
          genericName: 'Carotenoids',
          dosage: '10mg Lutein + 2mg Zeaxanthin',
          frequency: 'Once daily with meals',
          duration: 'Long-term',
          purpose: 'Support retinal health and reduce oxidative stress',
          sideEffects: ['Rare allergic reactions'],
          contraindications: [],
          price: '₹800-1500'
        }
      ]
    },
    lifestyle: [
      'Maintain HbA1c below 7%',
      'Monitor blood pressure daily',
      'Follow diabetic diet strictly',
      'Regular exercise as approved by doctor',
      'Quit smoking completely'
    ],
    followUp: 'Immediate ophthalmology referral, then follow-up every 3-4 months or as directed by retinal specialist.',
    emergencySignals: ['Sudden vision loss', 'Severe eye pain', 'Flashing lights', 'Curtain-like shadow in vision', 'Sudden increase in floaters']
  },

  // =================================================================
  // == RESPIRATORY CONDITIONS
  // =================================================================
  'pneumonia': {
    name: 'Pneumonia',
    description: 'Infection causing inflammation in air sacs of lungs, which may fill with fluid or pus.',
    severity: 'high',
    urgency: 'urgent',
    symptoms: ['Cough with phlegm', 'Fever and chills', 'Shortness of breath', 'Chest pain', 'Fatigue', 'Nausea'],
    causes: ['Bacterial infection', 'Viral infection', 'Fungal infection', 'Aspiration', 'Weakened immune system'],
    precautions: ['Complete antibiotic course', 'Rest and hydration', 'Avoid smoking', 'Practice good hygiene'],
    doctors: [
      {
        name: 'Dr. Ravi Mehta',
        specialty: 'Pulmonologist',
        experience: '20 years',
        location: 'Sir Ganga Ram Hospital, Delhi',
        phone: '+91-9876543240',
        rating: 4.9,
        availability: 'Mon-Sat 9AM-6PM',
        education: 'MBBS, MD Medicine, DM Pulmonology',
        languages: ['English', 'Hindi']
      },
      {
        name: 'Dr. Sunita Rao',
        specialty: 'Internal Medicine',
        experience: '15 years',
        location: 'Apollo Hospital, Bangalore',
        phone: '+91-9876543241',
        rating: 4.8,
        availability: 'Mon-Fri 8AM-5PM',
        education: 'MBBS, MD Internal Medicine',
        languages: ['English', 'Hindi', 'Kannada']
      }
    ],
    medications: {
      painRelief: [
        {
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          dosage: '500-1000mg',
          frequency: 'Every 6-8 hours',
          duration: 'As needed for fever/pain',
          purpose: 'Reduce fever and relieve chest pain',
          sideEffects: ['Rare liver toxicity with overdose'],
          contraindications: ['Severe liver disease'],
          price: '₹20-50'
        }
      ],
      treatment: [
        {
          name: 'Amoxicillin-Clavulanate',
          genericName: 'Amoxicillin + Clavulanic Acid',
          dosage: '625mg',
          frequency: 'Three times daily',
          duration: '7-10 days',
          purpose: 'First-line antibiotic for bacterial pneumonia',
          sideEffects: ['Diarrhea', 'Nausea', 'Skin rash'],
          contraindications: ['Penicillin allergy', 'Severe kidney disease'],
          price: '₹200-400'
        }
      ],
      supplements: [
        {
          name: 'Vitamin C',
          genericName: 'Ascorbic Acid',
          dosage: '1000mg',
          frequency: 'Once daily',
          duration: '2-4 weeks',
          purpose: 'Support immune system and recovery',
          sideEffects: ['Stomach upset', 'Diarrhea with high doses'],
          contraindications: ['Kidney stones history'],
          price: '₹200-500'
        }
      ]
    },
    lifestyle: [
      'Complete bed rest initially',
      'Drink plenty of fluids (8-10 glasses daily)',
      'Use humidifier or steam inhalation',
      'Avoid smoking and secondhand smoke',
      'Eat nutritious foods to support recovery'
    ],
    followUp: 'Follow-up within 48-72 hours if outpatient, chest X-ray in 6-8 weeks to ensure complete resolution.',
    emergencySignals: ['Difficulty breathing at rest', 'Chest pain worsening', 'High fever >102°F persistent', 'Confusion or altered mental state', 'Bluish lips or fingernails']
  },

  // =================================================================
  // == BRAIN TUMOR DATA
  // =================================================================
  glioma: {
    urgency: 'emergency',
    severity: 'high',
    symptoms: [
      'Persistent headaches, often worse in the morning',
      'Seizures',
      'Nausea and vomiting',
      'Changes in personality or behavior',
      'Weakness or numbness in parts of the body',
      'Vision, speech, or hearing problems'
    ],
    causes: [
      'The exact cause is unknown',
      'Exposure to ionizing radiation is a known risk factor',
      'Certain rare genetic syndromes'
    ],
    precautions: [
      'Do not ignore neurological symptoms. Seek immediate medical evaluation.',
      'Follow the prescribed medication schedule for seizures and swelling strictly.',
      'Avoid activities that could be dangerous if a seizure occurs (e.g., driving, swimming alone).'
    ],
    doctors: [
      { name: 'Dr. Manas Panigrahi', specialty: 'Neurosurgery', location: 'KIMS Hospitals, Secunderabad', phone: '+91-40-44885000' },
      { name: 'Dr. Ravi Gopal Varma', specialty: 'Neurosurgery', location: 'Apollo Hospitals, Bengaluru', phone: '+91-80-26304050' },
      { name: 'Department of Neurological Sciences', specialty: 'Neuro-Oncology', location: 'CMC, Vellore', phone: '+91-416-2281000' }
    ],
    medications: {
      painRelief: [
        { name: 'Dexamethasone', genericName: 'Dexamethasone', dosage: 'Prescription Only', frequency: 'As directed', duration: 'As prescribed', purpose: 'Reduces brain swelling (edema) to relieve headache pressure.' },
      ],
      treatment: [
        { name: 'Temozolomide', genericName: 'Temozolomide', dosage: 'Prescription Only', frequency: 'As directed', duration: 'Cycles as prescribed', purpose: 'Oral chemotherapy agent used to treat gliomas.' },
        { name: 'Levetiracetam', genericName: 'Levetiracetam', dosage: 'Prescription Only', frequency: 'As directed', duration: 'As prescribed', purpose: 'Anti-convulsant to prevent or control seizures.' }
      ],
      supplements: []
    },
    lifestyle: [
      'Prioritize 7-9 hours of quality sleep per night.',
      'Adopt an anti-inflammatory diet rich in fruits, vegetables, and omega-3s.',
      'Incorporate stress-reduction techniques like meditation or deep breathing.'
    ],
    followUp: 'Requires continuous monitoring by a neuro-oncology team, including regular MRI scans to track tumor response to treatment.',
    emergencySignals: [
      'Sudden onset of a severe headache',
      'Uncontrolled or new type of seizure',
      'Sudden weakness, numbness, or paralysis',
      'Abrupt change in mental status or consciousness'
    ]
  },
  meningioma: {
    urgency: 'urgent',
    severity: 'moderate',
    symptoms: [
      'Often slow-growing and may have no symptoms for years',
      'Headaches that worsen over time',
      'Vision changes, such as double vision or blurriness',
      'Hearing loss or ringing in the ears',
      'Weakness in arms or legs'
    ],
    causes: [
      'The exact cause is unknown',
      'Exposure to ionizing radiation is a known risk factor',
      'More common in women'
    ],
    precautions: [
      'Attend all follow-up imaging appointments as recommended by your neurosurgeon.',
      'Report any new or worsening neurological symptoms to your doctor immediately.'
    ],
    doctors: [
      { name: 'Dr. K Sridhar', specialty: 'Neurosurgery', location: 'Gleneagles Global Health City, Chennai', phone: '+91-44-44777000' },
      { name: 'Dr. Satish Rudrappa', specialty: 'Neurosurgery', location: 'Sakra World Hospital, Bengaluru', phone: '+91-80-49694969' },
      { name: 'Dr. Alok Ranjan', specialty: 'Neurosurgery', location: 'Apollo Hospitals, Jubilee Hills, Hyderabad', phone: '+91-40-23607777' }
    ],
    medications: {
      painRelief: [
        { name: 'Dexamethasone', genericName: 'Dexamethasone', dosage: 'Prescription Only', frequency: 'As directed', duration: 'As prescribed', purpose: 'May be used short-term to reduce swelling around the tumor if it is causing symptoms.' },
      ],
      treatment: [],
      supplements: []
    },
    lifestyle: [
      'Maintain a healthy lifestyle with regular exercise and a balanced diet.',
      'Ensure adequate sleep to support overall brain health.'
    ],
    followUp: 'Treatment can range from observation with periodic MRI scans ("watch and wait") to surgery or radiation. The plan is highly individualized.',
    emergencySignals: [
      'Sudden, severe neurological changes (vision loss, weakness)',
      'New onset of seizures'
    ]
  },
  pituitary_adenoma: {
    urgency: 'urgent',
    severity: 'moderate',
    symptoms: [
      'Vision problems, especially loss of peripheral vision (tunnel vision)',
      'Hormonal imbalances (e.g., irregular periods, erectile dysfunction, unexplained weight changes)',
      'Headaches',
      'Fatigue'
    ],
    causes: [
      'The exact cause is unknown, but they are almost always benign (non-cancerous).',
      'A small fraction are linked to genetic conditions.'
    ],
    precautions: [
      'Regular vision tests are crucial to monitor for any compression of the optic nerves.',
      'Follow up with both a neurosurgeon and an endocrinologist is often required.'
    ],
    doctors: [
      { name: 'Department of Neurosurgery', specialty: 'Neurosurgery', location: 'NIMHANS, Bengaluru', phone: '080-26995200' },
      { name: 'Neurosciences Department', specialty: 'Neurosurgery', location: 'NIMS, Hyderabad', phone: '040-23489000' },
      { name: 'Dr. Dilip Panikar', specialty: 'Neurosurgery', location: 'Aster Medcity, Kochi', phone: '+91-484-6699999' }
    ],
    medications: {
      painRelief: [],
      treatment: [],
      supplements: []
    },
    lifestyle: [
      'Follow the specific dietary advice given by your endocrinologist, especially if hormone levels are affected.',
      'Manage stress, as it can influence hormone balance.'
    ],
    followUp: 'Requires a multi-disciplinary approach involving neurosurgeons, endocrinologists, and ophthalmologists to manage the tumor, hormone levels, and vision.',
    emergencySignals: [
      'Sudden, severe headache',
      'Rapid deterioration of vision'
    ]
  },
};

export const normalResultGuidance = {
  precautions: [
    'Maintain regular health check-ups',
    'Follow a balanced, nutritious diet',
    'Exercise regularly as per your fitness level',
    'Get adequate sleep (7-8 hours daily)',
    'Stay hydrated throughout the day',
  ],
  recommendations: [
    'Continue current healthy lifestyle habits',
    'Regular preventive screenings as age-appropriate',
    'Maintain healthy weight through diet and exercise',
    'Practice good mental health and stress management',
    'Protect skin from excessive sun exposure',
  ],
  followUp: 'Schedule routine health check-ups annually or as recommended by your healthcare provider. Continue monitoring your health and report any new symptoms promptly.'
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'routine': return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300';
    case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
    default: return 'bg-gray-100 text-gray-800 border-gray-300';
  }
};

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'low': return 'text-green-700';
    case 'moderate': return 'text-yellow-700';
    case 'high': return 'text-red-700';
    default: return 'text-gray-700';
  }
};
