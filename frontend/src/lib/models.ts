export interface DiseaseModel {
  id: string;
  name: string;
  description: string;
  icon: string;
  accuracy: number;
  trainingData: string;
  modelPath: string;
  supportedFormats: string[];
  category: string;
}

export const availableModels: DiseaseModel[] = [
  {
    id: 'skin-disease',
    name: 'Skin Disease Detection',
    description: 'Advanced AI model for detecting various skin conditions including melanoma, basal cell carcinoma, and other dermatological conditions.',
    icon: '🔬',
    accuracy: 96.46,
    trainingData: '6700+ dermatological images',
    modelPath: 'models/skinDisease.keras',
    supportedFormats: ['jpg', 'jpeg', 'png'],
    category: 'Dermatology'
  },
  {
    id: 'diabetic-retinopathy',
    name: 'Diabetic Retinopathy Detection',
    description: 'Specialized model for early detection of diabetic retinopathy from retinal fundus photographs.',
    icon: '👁️',
    accuracy: 95.22,
    trainingData: '8400+ retinal images',
    modelPath: 'models/diabeticRetinopathy.keras',
    supportedFormats: ['jpg', 'jpeg', 'png'],
    category: 'Ophthalmology'
  },
  {
    id: 'brain-tumor',
    name: 'Brain Tumor Detection',
    description: 'High-precision model for detecting and classifying brain tumors from MRI scans.',
    icon: '🧠',
    accuracy: 94.67,
    trainingData: '8800+ MRI brain scans',
    modelPath: 'models/brainTumor.keras',
    supportedFormats: ['jpg', 'jpeg', 'png', 'dcm'],
    category: 'Neurology'
  },
  {
    id: 'cbc-analysis',
    name: 'CBC Analysis',
    description: 'Analyze your Complete Blood Count (CBC) report values for potential health indicators.',
    icon: '🩸',
    accuracy: 100,
    trainingData: 'Rule-based Analysis',
    modelPath: '/analyzer/cbc',
    supportedFormats: [],
    category: 'Hematology'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index and get health recommendations based on WHO standards.',
    icon: '⚖️',
    accuracy: 100,
    trainingData: 'WHO BMI standards',
    modelPath: '/calculator/bmi',
    supportedFormats: ['input'],
    category: 'Health Calculator'
  }
];

export const getModelById = (id: string): DiseaseModel | undefined => {
  return availableModels.find(model => model.id === id);
};

export const getModelsByCategory = (category: string): DiseaseModel[] => {
  return availableModels.filter(model => model.category === category);
};

export const getAllCategories = (): string[] => {
  return [...new Set(availableModels.map(model => model.category))];
};