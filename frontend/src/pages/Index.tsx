import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { 
  Shield, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  Brain,
  Clock,
  Award,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  Eye,
  Calculator,
  Scan
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const medicalServices = [
    {
      id: 'skin-lesion-detection',
      title: 'Skin Disease Detection',
      description: 'Advanced AI analysis for skin conditions including melanoma, acne, eczema, and other dermatological issues.',
      icon: <Scan className="h-12 w-12 text-blue-600" />,
      accuracy: '92%',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 'diabetic-retinopathy',
      title: 'Diabetic Retinopathy',
      description: 'Early detection and monitoring of diabetic eye complications to prevent vision loss.',
      icon: <Eye className="h-12 w-12 text-green-600" />,
      accuracy: '94%',
      bgColor: 'from-green-50 to-green-100',
      borderColor: 'border-green-200 hover:border-green-400'
    },
    {
      id: 'brain-tumor-detection',
      title: 'Brain Tumour Detection',
      description: 'Sophisticated MRI analysis for brain tumor identification and classification using advanced neural networks.',
      icon: <Brain className="h-12 w-12 text-red-600" />,
      accuracy: '89%',
      bgColor: 'from-red-50 to-red-100',
      borderColor: 'border-red-200 hover:border-red-400'
    },
    {
      id: 'bmi-calculator',
      title: 'BMI Calculator',
      description: 'Comprehensive body mass index calculation with health recommendations and lifestyle guidance.',
      icon: <Calculator className="h-12 w-12 text-blue-600" />,
      accuracy: '100%',
      bgColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-200 hover:border-blue-400'
    }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning models trained on thousands of medical images for accurate diagnosis assistance."
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Instant Results",
      description: "Get comprehensive analysis results in seconds, not hours. Fast, reliable, and always available."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "DPDP Act 2023 Compliant",
      description: "Your medical data is encrypted and secure. We follow India's Digital Personal Data Protection Act 2023."
    },
    {
      icon: <Award className="h-8 w-8 text-green-600" />,
      title: "Clinically Validated",
      description: "Our AI models are validated by medical professionals and continuously improved with new data."
    }
  ];

  const stats = [
    { number: "50K+", label: "Images Analyzed", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "92%", label: "Average Accuracy", icon: <Star className="h-5 w-5" /> },
    { number: "500+", label: "Healthcare Providers", icon: <Users className="h-5 w-5" /> },
    { number: "24/7", label: "Availability", icon: <Clock className="h-5 w-5" /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const handleServiceClick = (serviceId: string) => {
    if (user) {
      navigate('/upload');
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="text-center space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <div className="flex justify-center mb-8">
                <h1 className="text-6xl md:text-8xl font-bold text-blue-600">
                  MediScan AI
                </h1>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                AI-Powered
                <span className="block text-blue-600">
                  Medical Imaging
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Transform medical diagnosis with cutting-edge artificial intelligence. 
                Upload medical images and get instant, accurate analysis powered by advanced machine learning.
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              variants={itemVariants}
            >
              {user ? (
                <Button 
                  size="lg" 
                  className="text-xl px-12 py-8 bg-blue-600 hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl border-0"
                  onClick={() => navigate('/upload')}
                >
                  <Sparkles className="mr-3 h-6 w-6" />
                  Start Scanning
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="text-xl px-12 py-8 bg-green-600 hover:bg-green-700 transform hover:scale-105 transition-all duration-300 shadow-2xl border-0"
                    onClick={() => navigate('/register')}
                  >
                    <Sparkles className="mr-3 h-6 w-6" />
                    Get Started Free
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="text-xl px-12 py-8 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </>
              )}
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600"
              variants={itemVariants}
            >
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">5 Free Scans</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">No Credit Card Required</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">DPDP Act 2023 Compliant</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Medical Background Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-red-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </section>

      {/* Medical Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Medical AI Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our specialized AI models for comprehensive medical analysis across multiple specialties
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {medicalServices.map((service, index) => (
              <motion.div 
                key={service.id} 
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card 
                  className={`h-full border-2 ${service.borderColor} shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br ${service.bgColor}`}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-white rounded-2xl p-4 shadow-md">
                        {service.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {service.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6 text-sm">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Star className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">
                        {service.accuracy} Accuracy
                      </span>
                    </div>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 px-4 py-2 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleServiceClick(service.id);
                      }}
                    >
                      {user ? 'Start Analysis' : 'Get Started'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                variants={itemVariants}
              >
                <div className="bg-white border border-gray-200 rounded-2xl p-6 group-hover:shadow-lg group-hover:border-blue-300 transition-all duration-300">
                  <div className="flex justify-center mb-3 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose MediScan?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of medical imaging with our advanced AI technology
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 bg-white hover:border-blue-300">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="bg-gradient-to-br from-blue-50 via-green-50 to-red-50 rounded-2xl p-4">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Medical Diagnosis?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Join thousands of healthcare professionals using AI-powered medical imaging analysis
            </p>
            {!user && (
              <Button 
                size="lg" 
                className="text-xl px-12 py-8 bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-2xl border-0"
                onClick={() => navigate('/register')}
              >
                <Sparkles className="mr-3 h-6 w-6" />
                Start Your Free Trial
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 text-gray-900 py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <motion.img
                src="/assets/MediScanLogo.png"
                alt="MediScan Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="text-gray-600 text-sm">
              © 2025 MediScan. Advancing healthcare through AI.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;