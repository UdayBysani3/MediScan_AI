import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DiseaseModel, getModelById } from '@/lib/models';
import { comprehensiveMedicalDatabase, normalResultGuidance, getUrgencyColor, getSeverityColor, Doctor, Medication } from '@/lib/comprehensive-medical-data';
import {
  Upload as UploadIcon,
  FileImage,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Brain,
  Clock,
  Camera,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Calculator,
  User,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Stethoscope,
  Activity,
  Pill,
  GraduationCap,
  Languages,
  Star,
  Eye,
  Scan,
  Zap,
  Award,
  TrendingUp,
  Users,
  ChevronDown,
  DollarSign,
  Image,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ModelSelector from '@/components/ModelSelector';
import BMICalculator from '@/components/BMICalculator';
import PaymentModal from '@/components/PaymentModal';
import { PricingPlan } from '@/lib/stripe';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { EnhancedLoader } from '@/components/ui/enhanced-loader';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
interface ScanResult {
  prediction: string;
  confidence: number;
  details: string;
  modelUsed: string;
  modelAccuracy: number;
  diseaseKey?: string;
  cbcValues?: {
    wbc?: number;
    rbc?: number;
    platelets?: number;
  };
}
const toTitleCase = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/[-_]/g, ' ') // Replace hyphens and underscores with a space
    .split(' ')           // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize the first letter of each word
    .join(' ');           // Join the words back together with spaces
};
const Upload: React.FC = () => {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'model' | 'upload' | 'analysis'>('model');
  const [selectedModel, setSelectedModel] = useState<DiseaseModel | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [cbcValues, setCbcValues] = useState({ wbc: '', rbc: '', platelets: '' });
  const [showDemoModal, setShowDemoModal] = useState(false);


  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Auto-select model from URL parameter
  React.useEffect(() => {
    const modelParam = searchParams.get('model');
    if (modelParam && !selectedModel) {
      const model = getModelById(modelParam);
      if (model) {
        setSelectedModel(model);
      }
    }
  }, [searchParams, selectedModel]);

  const handleCBCAnalyze = () => {
    if (!cbcValues.wbc || !cbcValues.rbc || !cbcValues.platelets) {
      setError('Please enter all CBC values');
      return;
    }

    const wbc = Number(cbcValues.wbc);
    const rbc = Number(cbcValues.rbc);
    const platelets = Number(cbcValues.platelets);

    let diseaseKey = 'normal';
    let details = 'Your counts are within normal range.';
    let prediction = 'Normal';

    // Check WBC
    if (wbc < 4000) { diseaseKey = 'low_wbc'; prediction = 'Low WBC'; details = 'Possible leukopenia.'; }
    else if (wbc > 11000) { diseaseKey = 'high_wbc'; prediction = 'High WBC'; details = 'Possible infection or inflammation.'; }

    // Check RBC
    if (rbc < 4.2) { diseaseKey = 'low_rbc'; prediction = 'Low RBC'; details = 'Possible anemia.'; }
    else if (rbc > 6.1) { diseaseKey = 'high_rbc'; prediction = 'High RBC'; details = 'Possible polycythemia.'; }

    // Check Platelets
    if (platelets < 150000) { diseaseKey = 'low_platelets'; prediction = 'Low Platelets'; details = 'Possible thrombocytopenia.'; }
    else if (platelets > 450000) { diseaseKey = 'high_platelets'; prediction = 'High Platelets'; details = 'Possible thrombocytosis.'; }

    const analysisResult: ScanResult = {
      prediction,
      confidence: 1, // not ML-based, so set to 100%
      details,
      modelUsed: "CBC Analysis",
      modelAccuracy: 100,
      diseaseKey,
      cbcValues: { wbc, rbc, platelets }
    };

    setResult(analysisResult);
    setCurrentStep('analysis');
  };

  const handleModelSelect = (model: DiseaseModel) => {
    setSelectedModel(model);
    // Automatically navigate to the appropriate step
    if (model.id === 'bmi-calculator') {
      setCurrentStep('analysis');
    } else {
      setCurrentStep('upload');
      // Show demo modal by default for image-based models
      if (model.id !== 'cbc-analysis') {
        setShowDemoModal(true);
      }
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return setError('Please select a valid image file');
    if (file.size > 10 * 1024 * 1024) return setError('File size must be less than 10MB');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const simulateProgress = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !user || !selectedModel || !token) return;

    if (user.maxScans - user.analysisCount <= 0) {
      navigate('/pricing');
      return;
    }

    setCurrentStep('analysis');
    setIsAnalyzing(true);
    setError('');
    const progressInterval = simulateProgress();

    try {
      const formData = new FormData();
      formData.append('imageFile', selectedFile);
      formData.append('modelId', selectedModel.id);

      // Create AbortController for 120-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds

      const response = await fetch(`${API_URL}/analyze`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
        signal: controller.signal, // Add abort signal
      });

      clearTimeout(timeoutId); // Clear timeout if request succeeds

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed on the server.');
      }

      const backendResult = await response.json();
      const analysisResult: ScanResult = {
        ...backendResult,
        modelUsed: selectedModel.name,
        modelAccuracy: selectedModel.accuracy,
        diseaseKey: backendResult.prediction.toLowerCase().replace(/\s+/g, '_')
      };

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // MODIFIED: Make the setTimeout callback async and call refreshUser
      setTimeout(async () => {
        setResult(analysisResult);
        setIsAnalyzing(false);
        await refreshUser(); // <-- REFRESH THE USER DATA HERE
      }, 500);

    } catch (err) {
      clearInterval(progressInterval);

      // Handle timeout specifically
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. The AI service may be waking up. Please try again in a moment.');
      } else {
        setError(err instanceof Error ? err.message : 'Analysis failed');
      }

      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handlePaymentSuccess = (plan: PricingPlan) => {
    setShowPaymentModal(false);
    refreshUser().then(() => {
      handleAnalyze();
    });
  };

  const getResultColor = (prediction: string) => {
    if (prediction === 'Normal' || prediction === 'No-Tumor') return 'text-green-600 bg-green-50 border-green-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getResultIcon = (prediction: string) => {
    if (prediction === 'Normal' || prediction === 'No-Tumor') return <CheckCircle className="h-6 w-6 text-green-600" />;
    return <AlertTriangle className="h-6 w-6 text-red-600" />;
  };

  // NEW: Severity calculation based on AI confidence level
  const calculateSeverity = (confidence: number, prediction: string): {
    level: string;
    color: string;
    bgColor: string;
    borderColor: string;
    description: string;
    icon: React.ReactElement;
  } => {
    const isNormal = prediction === 'Normal' || prediction === 'No-Tumor';
    const confidencePercent = confidence * 100;

    if (isNormal) {
      return {
        level: 'NORMAL',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-300',
        description: 'No immediate concerns detected',
        icon: <CheckCircle className="h-5 w-5 text-green-600" />
      };
    }

    // For abnormal results, severity increases with confidence
    if (confidencePercent > 80) {
      return {
        level: 'HIGH SEVERITY',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-400',
        description: 'High confidence detection - Consult a specialist immediately',
        icon: <AlertTriangle className="h-5 w-5 text-red-600" />
      };
    } else if (confidencePercent >= 60) {
      return {
        level: 'MODERATE SEVERITY',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-400',
        description: 'Moderate confidence - Schedule an appointment soon',
        icon: <AlertTriangle className="h-5 w-5 text-orange-600" />
      };
    } else {
      return {
        level: 'LOW SEVERITY',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-400',
        description: 'Lower confidence - Monitor symptoms and consult if needed',
        icon: <Clock className="h-5 w-5 text-yellow-600" />
      };
    }
  };

  const resetUpload = () => {
    setCurrentStep('model');
    setSelectedModel(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError('');
  };

  if (!user) return null;

  const scansRemaining = user.maxScans - user.analysisCount;

  const stepDescriptions = {
    model: "Choose the specialized AI model that best matches your medical imaging or CBC analysis needs.",
    upload: "Upload your medical image or enter your CBC values securely for instant AI-powered analysis.",
    analysis: "Our advanced AI is processing your data to provide accurate diagnosis and recommendations."
  };

  const renderDoctorCard = (doctor: Doctor, index: number) => (
    <motion.div
      key={index}
      className="bg-white rounded-xl border border-red-200 p-6 hover:shadow-lg transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      <div className="flex items-start space-x-4">
        <motion.div
          className="bg-red-100 rounded-full p-3"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.3 }}
        >
          <User className="h-6 w-6 text-red-600" />
        </motion.div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-red-900 mb-1">{doctor.name}</h3>
          <p className="text-red-700 font-medium mb-2">{doctor.specialty}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {doctor.experience && <div className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4 text-red-600" />
              <span className="text-gray-700">{doctor.experience} experience</span>
            </div>}
            {doctor.rating && <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-700">{doctor.rating}/5 rating</span>
            </div>}
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-red-600" />
              <span className="text-gray-700">{doctor.location}</span>
            </div>
            {doctor.availability && <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-red-600" />
              <span className="text-gray-700">{doctor.availability}</span>
            </div>}
          </div>

          <div className="mt-3">
            {doctor.education && <p className="text-sm text-gray-600 mb-2">
              <strong>Education:</strong> {doctor.education}
            </p>}
            {doctor.languages && doctor.languages.length > 0 && <div className="flex items-center space-x-2 mb-3">
              <Languages className="h-4 w-4 text-red-600" />
              <span className="text-sm text-gray-600">{doctor.languages.join(', ')}</span>
            </div>}
          </div>

          <motion.a
            href={`tel:${doctor.phone}`}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="h-4 w-4" />
            <span>Call {doctor.phone}</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );

  const renderMedicationCard = (medication: Medication, index: number, category: string) => (
    <motion.div
      key={index}
      className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-md transition-all duration-300"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-green-900 text-lg">{medication.name}</h4>
          {medication.genericName && (
            <p className="text-sm text-green-700">Generic: {medication.genericName}</p>
          )}
        </div>
        {medication.price && (
          <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded">
            <DollarSign className="h-3 w-3 text-green-600" />
            <span className="text-xs text-green-700">{medication.price}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <span className="font-medium text-gray-700">Dosage:</span>
          <p className="text-gray-600">{medication.dosage}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Frequency:</span>
          <p className="text-gray-600">{medication.frequency}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Duration:</span>
          <p className="text-gray-600">{medication.duration}</p>
        </div>
        <div>
          <span className="font-medium text-gray-700">Purpose:</span>
          <p className="text-gray-600">{medication.purpose}</p>
        </div>
      </div>

      {medication.sideEffects && medication.sideEffects.length > 0 && (
        <div className="mb-3">
          <span className="font-medium text-gray-700 text-sm">Side Effects:</span>
          <ul className="list-disc list-inside text-xs text-gray-600 mt-1">
            {medication.sideEffects.slice(0, 3).map((effect, idx) => (
              <li key={idx}>{effect}</li>
            ))}
          </ul>
        </div>
      )}

      {medication.contraindications && medication.contraindications.length > 0 && (
        <div>
          <span className="font-medium text-red-700 text-sm">Contraindications:</span>
          <ul className="list-disc list-inside text-xs text-red-600 mt-1">
            {medication.contraindications.slice(0, 2).map((contra, idx) => (
              <li key={idx}>{contra}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );

  const renderMedicalGuidance = () => {
    if (!result) return null;

    const isNormal = result.prediction === 'Normal' || result.prediction === 'No-Tumor';
    const diseaseInfo = result.diseaseKey ? comprehensiveMedicalDatabase[result.diseaseKey] : null;

    if (isNormal) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-green-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Preventive Care Recommendations
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-green-800 mb-2">General Precautions:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {normalResultGuidance.precautions.slice(0, 5).map((precaution, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-green-800 mb-2">Health Recommendations:</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {normalResultGuidance.recommendations.slice(0, 5).map((recommendation, index) => (
                    <li key={index} className="flex items-start">
                      <Stethoscope className="h-3 w-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Follow-up:</strong> {normalResultGuidance.followUp}
              </p>
            </div>
          </div>
        </motion.div>
      );
    }

    if (diseaseInfo) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Urgency Alert with Confidence-Based Severity */}
          <div className={`p-4 rounded-xl border-2 ${calculateSeverity(result.confidence, result.prediction).bgColor} ${calculateSeverity(result.confidence, result.prediction).borderColor}`}>
            <div className="flex items-center space-x-3 mb-2">
              {calculateSeverity(result.confidence, result.prediction).icon}
              <span className={`font-semibold ${calculateSeverity(result.confidence, result.prediction).color}`}>
                {diseaseInfo.urgency === 'emergency' ? 'EMERGENCY - Seek Immediate Care' :
                  diseaseInfo.urgency === 'urgent' ? 'URGENT - Schedule Appointment Soon' :
                    'ROUTINE - Schedule Regular Appointment'}
              </span>
            </div>
            <p className={`text-sm ${calculateSeverity(result.confidence, result.prediction).color}`}>
              Severity: <span className="font-medium">
                {calculateSeverity(result.confidence, result.prediction).level}
              </span> - {calculateSeverity(result.confidence, result.prediction).description}
            </p>
          </div>

          {/* Symptoms & Causes */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Symptoms
              </h4>
              <ul className="text-sm text-blue-700 space-y-2">
                {diseaseInfo.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-3 w-3 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    {symptom}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h4 className="font-semibold text-purple-900 mb-4 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Common Causes
              </h4>
              <ul className="text-sm text-purple-700 space-y-2">
                {diseaseInfo.causes.map((cause, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-3 w-3 text-purple-600 mr-2 mt-1 flex-shrink-0" />
                    {cause}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Precautions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <h4 className="font-semibold text-yellow-900 mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Immediate Precautions & Care
            </h4>
            <ul className="text-sm text-yellow-700 space-y-2">
              {diseaseInfo.precautions.map((precaution, index) => (
                <li key={index} className="flex items-start">
                  <Activity className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  {precaution}
                </li>
              ))}
            </ul>
          </div>

          {/* Comprehensive Doctor Recommendations */}
          {diseaseInfo.doctors && diseaseInfo.doctors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-900 mb-6 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Recommended Medical Specialists ({diseaseInfo.doctors.length} Available)
              </h4>
              <div className="grid gap-6">
                {diseaseInfo.doctors.map((doctor, index) => renderDoctorCard(doctor, index))}
              </div>

              <div className="mt-6 p-4 bg-red-100 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800 mb-1">Emergency Contacts:</p>
                    <p className="text-sm text-red-700">
                      • Emergency Services: 911 or 108<br />
                      • Poison Control: 1066<br />
                      • National Health Helpline: 104
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Comprehensive Medications */}
          {diseaseInfo.medications && (diseaseInfo.medications.painRelief.length > 0 || diseaseInfo.medications.treatment.length > 0 || diseaseInfo.medications.supplements.length > 0) && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="font-semibold text-green-900 mb-6 flex items-center">
                <Pill className="h-5 w-5 mr-2" />
                Comprehensive Medication Guide
              </h4>

              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Important:</strong> Always consult a healthcare provider before taking any medication. These are general guidelines based on medical literature.
                </AlertDescription>
              </Alert>

              {/* Pain Relief Medications */}
              {diseaseInfo.medications.painRelief.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-green-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                    Pain Relief & Symptom Management ({diseaseInfo.medications.painRelief.length} options)
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {diseaseInfo.medications.painRelief.map((med, index) =>
                      renderMedicationCard(med, index, 'painRelief')
                    )}
                  </div>
                </div>
              )}

              {/* Treatment Medications */}
              {diseaseInfo.medications.treatment.length > 0 && (
                <div className="mb-6">
                  <h5 className="font-medium text-green-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                    Primary Treatment Medications ({diseaseInfo.medications.treatment.length} options)
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {diseaseInfo.medications.treatment.map((med, index) =>
                      renderMedicationCard(med, index, 'treatment')
                    )}
                  </div>
                </div>
              )}

              {/* Supplements */}
              {diseaseInfo.medications.supplements.length > 0 && (
                <div>
                  <h5 className="font-medium text-green-800 mb-4 flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                    Supportive Supplements ({diseaseInfo.medications.supplements.length} options)
                  </h5>
                  <div className="grid md:grid-cols-2 gap-4">
                    {diseaseInfo.medications.supplements.map((med, index) =>
                      renderMedicationCard(med, index, 'supplements')
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lifestyle Recommendations */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <h4 className="font-semibold text-indigo-900 mb-4 flex items-center">
              <Stethoscope className="h-5 w-5 mr-2" />
              Lifestyle & Recovery Guidelines
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              {diseaseInfo.lifestyle.map((lifestyle, index) => (
                <motion.div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-white rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CheckCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-indigo-700">{lifestyle}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Follow-up & Emergency Signals */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Follow-up Care
              </h4>
              <p className="text-sm text-blue-800">{diseaseInfo.followUp}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Emergency Warning Signs
              </h4>
              <ul className="text-sm text-red-800 space-y-1">
                {diseaseInfo.emergencySignals.map((signal, index) => (
                  <li key={index} className="flex items-start">
                    <AlertTriangle className="h-3 w-3 text-red-600 mr-2 mt-1 flex-shrink-0" />
                    {signal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative pt-20">
      <Navbar />

      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4 -ml-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-2">
                AI Medical Analysis
              </h1>
              <TextGenerateEffect
                words={stepDescriptions[currentStep]}
                className="text-lg text-slate-600"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 font-semibold">
                <Sparkles className="h-4 w-4 mr-2" />
                {scansRemaining} scans remaining
              </Badge>
            </div>
          </div>

          {/* Progress Steps */}
          <motion.div
            className="flex items-center justify-center mt-8 space-x-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {['model', 'upload', 'analysis'].map((step, index) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${currentStep === step
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : index < ['model', 'upload', 'analysis'].indexOf(currentStep)
                      ? 'bg-green-600 border-green-600 text-white'
                      : 'border-gray-300 text-gray-400'
                    }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {index < ['model', 'upload', 'analysis'].indexOf(currentStep) ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>
                {index < 2 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${index < ['model', 'upload', 'analysis'].indexOf(currentStep)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                    }`} />
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>

        <AnimatePresence mode="wait">
          {/* Step 1: Model Selection */}
          {currentStep === 'model' && (
            <motion.div
              key="model"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl border-2 border-white/60 bg-white/95 backdrop-blur-xl">
                <CardContent className="p-8">
                  <ModelSelector
                    onModelSelect={handleModelSelect}
                    selectedModel={selectedModel}
                  />

                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: CBC Input */}
          {currentStep === 'upload' && selectedModel?.id === 'cbc-analysis' && (
            <motion.div
              key="cbc-upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl">Enter CBC Values</CardTitle>
                  <CardDescription>Provide your White Blood Cell, Red Blood Cell, and Platelet counts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="number"
                    placeholder="WBC Count (e.g., 7500) /µL"
                    value={cbcValues.wbc}
                    onChange={(e) => setCbcValues({ ...cbcValues, wbc: e.target.value })}
                    className="w-full border p-3 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="RBC Count (e.g., 5.1) millions/µL"
                    value={cbcValues.rbc}
                    onChange={(e) => setCbcValues({ ...cbcValues, rbc: e.target.value })}
                    className="w-full border p-3 rounded-lg"
                  />
                  <input
                    type="number"
                    placeholder="Platelet Count (e.g., 250000) /µL"
                    value={cbcValues.platelets}
                    onChange={(e) => setCbcValues({ ...cbcValues, platelets: e.target.value })}
                    className="w-full border p-3 rounded-lg"
                  />
                  <Button
                    onClick={handleCBCAnalyze}
                    className="w-full bg-gradient-to-r from-blue-600 via-green-600 to-red-600 py-6 text-lg"
                  >
                    Analyze CBC
                  </Button>
                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: File Upload for Image Models */}
          {currentStep === 'upload' && selectedModel?.id !== 'bmi-calculator' && selectedModel?.id !== 'cbc-analysis' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="shadow-2xl border-2 border-white/60 bg-white/95 backdrop-blur-xl">
                <CardHeader className="pb-6 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-3 text-3xl font-bold">
                        <Camera className="h-7 w-7 text-blue-600" />
                        <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Upload Medical Image</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-3 text-slate-600">
                        Upload your {selectedModel?.supportedFormats?.join(', ').toLowerCase() || 'medical images'} for {selectedModel?.name} analysis
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          onClick={() => setShowDemoModal(true)}
                          className="flex items-center space-x-2 border-2 border-purple-300 hover:border-purple-400 hover:bg-purple-50/50 text-purple-700"
                        >
                          <Image className="h-4 w-4" />
                          <span>Images Demo</span>
                        </Button>
                      </motion.div>
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep('model')}
                        className="flex items-center space-x-2 border-2 hover:border-blue-300 hover:bg-blue-50/50"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Change Model</span>
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 p-8">
                  {/* Selected Model Info */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 via-teal-50 to-green-50 border-2 border-blue-200/60 rounded-2xl p-5 shadow-inner"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{selectedModel?.icon}</div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900">{selectedModel?.name}</h3>
                        <p className="text-slate-600 text-sm font-medium">{selectedModel?.accuracy}% accuracy • {selectedModel?.trainingData}</p>
                      </div>
                    </div>
                  </motion.div>

                  {!selectedFile ? (
                    <div className="relative group">
                      {/* Decorative gradient border */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl opacity-20 group-hover:opacity-40 blur transition duration-300"></div>

                      {/* Main upload area */}
                      <div
                        className="relative border-2 border-dashed border-slate-300 rounded-2xl p-12 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:via-white hover:to-green-50/50"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        onClick={() => document.getElementById('file-input')?.click()}
                      >
                        {/* Floating icon */}
                        <motion.div
                          className="relative mb-6"
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"></div>
                          <div className="relative bg-gradient-to-br from-blue-100 to-green-100 p-6 rounded-2xl inline-block">
                            <UploadIcon className="h-16 w-16 text-blue-600" />
                          </div>
                        </motion.div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                          Drop your medical image here
                        </h3>

                        {/* Description */}
                        <p className="text-slate-600 mb-6 max-w-md mx-auto text-base">
                          or click to browse from your device
                        </p>

                        {/* Format info badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-700 mb-6">
                          <FileImage className="h-4 w-4 text-slate-500" />
                          <span className="font-medium">
                            {selectedModel?.supportedFormats?.join(', ').toUpperCase() || 'JPEG, PNG'}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="text-slate-500">Max 10MB</span>
                        </div>
                        {/* Hidden file input */}
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleFileInput}
                          className="hidden"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <motion.div
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex items-center space-x-4">
                          <FileImage className="h-10 w-10 text-teal-600" />
                          <div>
                            <p className="font-semibold text-slate-900 text-lg">{selectedFile.name}</p>
                            <p className="text-slate-600">
                              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready for analysis
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setResult(null);
                          }}
                        >
                          Remove
                        </Button>
                      </motion.div>

                      {previewUrl && (
                        <motion.div
                          className="flex justify-center"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4 }}
                        >
                          <div className="relative">
                            <img
                              src={previewUrl}
                              alt="Preview"
                              className="max-w-md max-h-80 object-contain rounded-xl border-2 border-slate-200 shadow-lg"
                            />
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleAnalyze}
                          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl"
                          size="lg"
                        >
                          <Brain className="mr-3 h-6 w-6" />
                          Analyze with {selectedModel?.name}
                          <Sparkles className="ml-3 h-5 w-5" />
                        </Button>
                      </motion.div>
                    </div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Analysis / BMI Calculator */}
          {currentStep === 'analysis' && (
            <div className="min-h-[80vh]">
              <motion.div
                key="analysis"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >

                {error ? (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-red-600">Analysis Failed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                      <Button onClick={() => setCurrentStep('upload')}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Back and Try Again
                      </Button>
                    </CardContent>
                  </Card>
                ) : selectedModel?.id === 'bmi-calculator' ? (
                  <BMICalculator />
                ) : isAnalyzing ? (
                  <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-12">
                      <EnhancedLoader
                        icon={selectedModel?.icon}
                        message={`Analyzing Your Medical Image with ${selectedModel?.name}...`}
                        progress={analysisProgress}
                      />
                    </CardContent>
                  </Card>
                ) : result ? (
                  <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Enhanced Main Result Card */}
                    <Card className={`shadow-2xl border-0 overflow-hidden relative ${getResultColor(result.prediction)}`}>
                      {/* Gradient Background Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30 pointer-events-none" />

                      <CardHeader className="relative z-10 pb-4">
                        <motion.div
                          className="flex items-center justify-between flex-wrap gap-4"
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <CardTitle className="flex items-center space-x-3 text-3xl">
                            <motion.div
                              animate={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5, delay: 0.3 }}
                            >
                              {getResultIcon(result.prediction)}
                            </motion.div>
                            <span className="font-black bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                              {toTitleCase(result.prediction)}
                            </span>
                          </CardTitle>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Badge
                              variant="secondary"
                              className="text-lg px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              {Math.round(result.confidence * 100)}% Confidence
                            </Badge>
                          </motion.div>
                        </motion.div>
                      </CardHeader>

                      <CardContent className="relative z-10 pt-2">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                          className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-inner"
                        >
                          <p className="text-gray-800 text-lg leading-relaxed">
                            {result.details}
                          </p>
                          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                            <Brain className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              Analyzed with: <span className="font-semibold text-gray-800">{result.modelUsed}</span>
                            </span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              Model Accuracy: {result.modelAccuracy}%
                            </Badge>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>

                    {renderMedicalGuidance()}

                    <motion.div
                      className="flex justify-center pt-4"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={resetUpload}
                        size="lg"
                        className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-12 py-7 text-lg shadow-2xl rounded-2xl"
                      >
                        <Sparkles className="mr-3 h-6 w-6" />
                        Analyze Another Scan
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : null}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Images Demo Modal */}
      <AnimatePresence>
        {showDemoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDemoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] shadow-2xl border-2 border-purple-200 relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-60"></div>

              {/* Close Button */}
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDemoModal(false);
                }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors shadow-lg cursor-pointer"
              >
                <X className="h-5 w-5 text-purple-700" />
              </motion.button>

              {/* Scrollable Content */}
              <div className="relative z-10 overflow-y-auto max-h-[85vh] p-8">
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
                    Sample Medical Images
                  </h2>
                  <p className="text-slate-600 text-lg">
                    Example images for each disease detection model
                  </p>
                </motion.div>

                {/* Demo Images Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Diabetic Retinopathy Demo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-teal-50 to-white p-6 rounded-2xl border-2 border-teal-200 hover:border-teal-400 hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-teal-400/10 to-blue-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-teal-100 rounded-full">
                            <Eye className="h-8 w-8 text-teal-600" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-teal-900 text-center mb-3">
                          Diabetic Retinopathy
                        </h3>

                        <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-teal-300 shadow-lg mb-4">
                          <img
                            src="/assets/eye.jpg"
                            alt="Diabetic Retinopathy Sample"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <p className="text-sm text-teal-700 text-center">
                          Retinal fundus image showing blood vessel abnormalities
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Brain Tumor Demo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border-2 border-slate-300 hover:border-slate-500 hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-400/10 to-gray-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-slate-200 rounded-full">
                            <Brain className="h-8 w-8 text-slate-700" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 text-center mb-3">
                          Brain Tumor Detection
                        </h3>

                        <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-slate-400 shadow-lg mb-4">
                          <img
                            src="/assets/brain.jpg"
                            alt="Brain Tumor Sample"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <p className="text-sm text-slate-700 text-center">
                          MRI scan for detecting brain abnormalities
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Skin Disease Demo */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group relative"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-2xl border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative z-10">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-blue-100 rounded-full">
                            <Scan className="h-8 w-8 text-blue-600" />
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-blue-900 text-center mb-3">
                          Skin Disease Detection
                        </h3>

                        <div className="w-full aspect-square rounded-xl overflow-hidden border-2 border-blue-300 shadow-lg mb-4">
                          <img
                            src="/assets/skin.jpg"
                            alt="Skin Disease Sample"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>

                        <p className="text-sm text-blue-700 text-center">
                          Dermatological image for skin condition analysis
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Footer Note */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-xl"
                >
                  <p className="text-center text-sm text-purple-800">
                    <strong>Note:</strong> These are sample images for demonstration purposes. Upload your own medical images for accurate AI-powered analysis.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
    </div >
  );
};

export default Upload;
