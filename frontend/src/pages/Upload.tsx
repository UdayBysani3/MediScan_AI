import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DiseaseModel } from '@/lib/models';
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
  Heart,
  Activity,
  Pill,
  GraduationCap,
  Languages,
  Star,
  DollarSign
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
  const { user,token,refreshUser } = useAuth();
  const navigate = useNavigate();
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


  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

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
  };

  const handleContinueToUpload = () => {
    if (selectedModel) {
      if (selectedModel.id === 'bmi-calculator') {
        setCurrentStep('analysis');
      } else {
        setCurrentStep('upload');
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

      const response = await fetch(`${API_URL}/analyze`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
      });

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
      setError(err instanceof Error ? err.message : 'Analysis failed');
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
                      <Heart className="h-3 w-3 text-green-600 mr-2 mt-1 flex-shrink-0" />
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
          {/* Urgency Alert */}
          <div className={`p-4 rounded-xl border-2 ${getUrgencyColor(diseaseInfo.urgency)}`}>
            <div className="flex items-center space-x-3 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {diseaseInfo.urgency === 'emergency' ? 'EMERGENCY - Seek Immediate Care' :
                  diseaseInfo.urgency === 'urgent' ? 'URGENT - Schedule Appointment Soon' :
                    'ROUTINE - Schedule Regular Appointment'}
              </span>
            </div>
            <p className="text-sm">
              Severity: <span className={`font-medium ${getSeverityColor(diseaseInfo.severity)}`}>
                {diseaseInfo.severity.toUpperCase()}
              </span>
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
              <Heart className="h-5 w-5 mr-2" />
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
      <Navbar />

      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundBeams className="opacity-10" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-green-600 to-red-600 bg-clip-text text-transparent mb-2">
                AI Medical Analysis
              </h1>
              <TextGenerateEffect
                words={stepDescriptions[currentStep]}
                className="text-lg text-gray-600"
              />
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-4 py-2">
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
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <ModelSelector
                    onModelSelect={handleModelSelect}
                    selectedModel={selectedModel}
                  />

                  {selectedModel && (
                    <motion.div
                      className="flex justify-center mt-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={handleContinueToUpload}
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 via-green-600 to-red-600 hover:from-blue-700 hover:via-green-700 hover:to-red-700 px-8 py-6 text-lg"
                        >
                          {selectedModel.id === 'bmi-calculator' ? (
                            <>
                              <Calculator className="mr-2 h-5 w-5" />
                              Open BMI Calculator
                            </>
                          ) : (
                            <>
                              Continue to Upload
                              <ArrowRight className="ml-2 h-5 w-5" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
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
              <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-3 text-2xl">
                        <Camera className="h-6 w-6" />
                        <span>Upload Medical Image</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Upload your {selectedModel?.supportedFormats?.join(', ').toLowerCase() || 'medical images'} for {selectedModel?.name} analysis
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('model')}
                      className="flex items-center space-x-2"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Change Model</span>
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Selected Model Info */}
                  <motion.div
                    className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{selectedModel?.icon}</div>
                      <div>
                        <h3 className="font-semibold text-blue-900">{selectedModel?.name}</h3>
                        <p className="text-blue-700 text-sm">{selectedModel?.accuracy}% accuracy • {selectedModel?.trainingData}</p>
                      </div>
                    </div>
                  </motion.div>

                  {!selectedFile ? (
                    <motion.div
                      className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-50 to-white"
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => document.getElementById('file-input')?.click()}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <FileImage className="h-16 w-16 text-gray-400 mx-auto mb-6" />
                      <h3 className="text-xl font-medium text-gray-900 mb-3">
                        Upload Your Medical Image
                      </h3>
                      <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Drag and drop your medical image here, or click to browse.
                        Supported formats: {selectedModel?.supportedFormats?.join(', ').toUpperCase() || 'JPEG, PNG'}. Max size: 10MB
                      </p>
                      <Button size="lg" variant="outline" className="px-8">
                        <UploadIcon className="mr-2 h-5 w-5" />
                        Choose File
                      </Button>
                      <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                    </motion.div>
                  ) : (
                    <div className="space-y-6">
                      <motion.div
                        className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
                        <div className="flex items-center space-x-4">
                          <FileImage className="h-10 w-10 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900 text-lg">{selectedFile.name}</p>
                            <p className="text-gray-600">
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
                              className="max-w-md max-h-80 object-contain rounded-xl border shadow-lg"
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
                          className="w-full bg-gradient-to-r from-blue-600 via-green-600 to-red-600 hover:from-blue-700 hover:via-green-700 hover:to-red-700 py-6 text-lg"
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
              <div className="space-y-6">
                <Card className={`shadow-xl border-2 ${getResultColor(result.prediction)}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-3 text-2xl">
                            {getResultIcon(result.prediction)}
                            <span>{toTitleCase(result.prediction)}</span>
                          </CardTitle>
                          <Badge variant="secondary" className="text-base">
                            {Math.round(result.confidence * 100)}% Confidence
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{result.details}</p>
                        <div className="text-xs text-gray-500 mt-4">
                          Analyzed with: {result.modelUsed} (Model Accuracy: {result.modelAccuracy}%)
                        </div>
                      </CardContent>
                    </Card>
                    {renderMedicalGuidance()}
                    <div className="flex justify-center pt-4"><Button onClick={resetUpload} size="lg" className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-6 text-lg"><Sparkles className="mr-2 h-5 w-5" />Analyze Another</Button></div>
              </div>
            ) : null}
            </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>

       <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} onSuccess={handlePaymentSuccess} />
    </div>
  );
};

export default Upload;