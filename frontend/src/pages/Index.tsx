import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Brain,
  Eye,
  Scan,
  Sparkles,
  Stethoscope,
  Activity,
  Shield,
  Zap,
  Award,
  TrendingUp,
  Star,
  Users,
  Clock,
  ChevronDown
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { SparklesCore } from '@/components/ui/sparkles';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  const services = [
    {
      id: 'skin-disease',
      title: 'Skin Disease Detection',
      description: 'AI-powered analysis for 9+ skin conditions including melanoma, acne, eczema using state-of-the-art deep learning models',
      icon: <Scan className="h-12 w-12" />,
      accuracy: '92%',
      color: 'from-gray-50 to-white',
      iconColor: 'text-blue-600',
      accentColor: 'bg-blue-50',
    },
    {
      id: 'diabetic-retinopathy',
      title: 'Diabetic Retinopathy',
      description: 'Early detection of diabetic eye complications to prevent vision loss with clinical-grade accuracy',
      icon: <Eye className="h-12 w-12" />,
      accuracy: '94%',
      color: 'from-gray-50 to-white',
      iconColor: 'text-teal-600',
      accentColor: 'bg-teal-50',
    },
    {
      id: 'brain-tumor',
      title: 'Brain Tumor Detection',
      description: 'Advanced MRI analysis for glioma, meningioma, and pituitary adenoma detection using cutting-edge AI',
      icon: <Brain className="h-12 w-12" />,
      accuracy: '89%',
      color: 'from-gray-50 to-white',
      iconColor: 'text-slate-700',
      accentColor: 'bg-slate-50',
    },
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered",
      desc: "Advanced ML models trained on millions of medical images",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Results",
      desc: "Get comprehensive analysis in under 3 seconds",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      desc: "DPDP Act 2023 compliant with end-to-end encryption",
      gradient: "from-blue-600 to-green-500"
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Clinically Validated",
      desc: "Validated by 100+ medical professionals worldwide",
      gradient: "from-green-600 to-blue-500"
    },
  ];

  const stats = [
    { value: "50K+", label: "Images Analyzed", icon: <TrendingUp className="h-6 w-6" />, color: "from-blue-500 to-blue-600" },
    { value: "92%", label: "Avg Accuracy", icon: <Star className="h-6 w-6" />, color: "from-green-500 to-green-600" },
    { value: "500+", label: "Healthcare Providers", icon: <Users className="h-6 w-6" />, color: "from-blue-600 to-green-500" },
    { value: "24/7", label: "Always Available", icon: <Clock className="h-6 w-6" />, color: "from-green-600 to-blue-500" },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-20">
      <Navbar />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen pt-12 pb-20 overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-green-50/30">
        {/* Subtle Animated Background Orbs - Professional Gray Tones */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-96 h-96 bg-gray-200/40 rounded-full mix-blend-normal filter blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-10 w-96 h-96 bg-gray-300/25 rounded-full mix-blend-normal filter blur-3xl"
            animate={{
              x: [0, -100, 0],
              y: [0, 100, 0],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          <motion.div
            className="absolute bottom-20 left-1/2 w-96 h-96 bg-slate-200/30 rounded-full mix-blend-normal filter blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -50, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
        </div>

        <motion.div
          style={{ y, opacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center">
            {/* Floating Icons */}
            <motion.div
              className="flex items-center justify-center gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <Stethoscope className="h-16 w-16 text-blue-500" />
                  <motion.div
                    className="absolute inset-0 bg-blue-500 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </motion.div>

              <motion.h1
                className="text-7xl md:text-9xl font-black"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                  MediScan
                </span>{' '}
                <span className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
                  AI
                </span>
              </motion.h1>

              <motion.div
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                <div className="relative">
                  <Activity className="h-14 w-14 text-green-500" />
                  <motion.div
                    className="absolute inset-0 bg-green-500 rounded-full blur-2xl"
                    animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Sparkles Effect */}
            <div className="w-full max-w-lg mx-auto h-20 relative -mt-6 mb-8">
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-[2px] w-3/4 blur-sm mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px w-3/4 mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-green-500 to-transparent h-[5px] w-1/4 blur-sm mx-auto" />
              <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-green-500 to-transparent h-px w-1/4 mx-auto" />

              <SparklesCore
                background="transparent"
                minSize={0.4}
                maxSize={1.2}
                particleDensity={800}
                className="w-full h-full"
                particleColor="#2563eb"
              />

              {/* Radial Gradient to prevent sharp edges */}
              <div className="absolute inset-0 w-full h-full bg-white [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
            </div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mb-8"
            >
              <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Medical Diagnosis
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  with Advanced AI
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Upload medical images and get instant, accurate analysis powered by cutting-edge machine learning.
                <span className="font-semibold text-transparent bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text"> Trusted by 500+ healthcare providers worldwide.</span>
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => user ? navigate('/upload') : navigate('/register')}
                  size="lg"
                  className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white text-xl px-12 py-8 rounded-2xl shadow-2xl overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center gap-3">
                    <Sparkles className="h-6 w-6" />
                    {user ? 'Start Scanning Now' : 'Get Started Free'}
                    <ArrowRight className="h-6 w-6" />
                  </span>
                </Button>
              </motion.div>

            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap items-center justify-center gap-8 text-base"
            >
              {[
                { icon: CheckCircle, text: '5 Free Scans', color: 'text-green-500' },
                { icon: CheckCircle, text: 'No Credit Card', color: 'text-blue-500' },
                { icon: CheckCircle, text: 'DPDP Compliant', color: 'text-gray-700' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                  <span className="font-semibold text-gray-700">{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Services Section with 3D Cards */}
      <section className="py-32 px-4 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full text-sm font-semibold shadow-lg">
                🚀 Advanced Medical AI
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Our<span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"> AI-Powered </span>Services
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Specialized models trained on millions of medical images for unparalleled accuracy
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <CardContainer className="inter-var">
                  <CardBody className="relative group/card w-auto h-auto">
                    <motion.div
                      className="relative cursor-pointer"
                      whileHover={{ scale: 1.02 }}
                      onClick={() => user ? navigate('/upload') : navigate('/register')}
                    >
                      <CardItem
                        translateZ="100"
                        className={`w-full p-8 rounded-3xl bg-gradient-to-br ${service.color} border-2 border-gray-200 shadow-xl overflow-hidden`}
                      >
                        {/* Subtle Hover Glow */}
                        <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 bg-blue-50/30 rounded-3xl blur-xl"></div>
                        </div>

                        <CardItem translateZ="150" className="w-full flex justify-center mb-6">
                          <div className="relative">
                            <div className={`${service.accentColor} p-6 rounded-3xl ${service.iconColor}`}>
                              {service.icon}
                            </div>
                            <motion.div
                              className={`absolute inset-0 ${service.accentColor} rounded-3xl blur-xl opacity-50`}
                              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </div>
                        </CardItem>

                        <CardItem translateZ="120" className="text-3xl font-black text-gray-900 mb-4 text-center">
                          {service.title}
                        </CardItem>

                        <CardItem translateZ="100" className="text-gray-600 text-center mb-6 leading-relaxed">
                          {service.description}
                        </CardItem>

                        <CardItem translateZ="110" className="flex items-center justify-center gap-2 mb-6">
                          <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                          <span className="text-2xl font-bold text-gray-900">
                            {service.accuracy}
                          </span>
                          <span className="text-gray-500">Accuracy</span>
                        </CardItem>

                        <CardItem translateZ="120" className="w-full">
                          <Button
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all`}
                            onClick={(e) => {
                              e.stopPropagation();
                              user ? navigate('/upload') : navigate('/register');
                            }}
                          >
                            {user ? 'Start Analysis' : 'Try Now Free'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </Button>
                        </CardItem>
                      </CardItem>
                    </motion.div>
                  </CardBody>
                </CardContainer>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-green-600/10 to-blue-600/10"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, y: -10 }}
                className="text-center group cursor-pointer"
              >
                <div className="relative">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${stat.color} rounded-2xl text-white mb-4 group-hover:shadow-2xl transition-shadow`}>
                    {stat.icon}
                  </div>
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50`}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-6xl font-black text-white mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-semibold text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">MediScan?</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade medical AI at your fingertips
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="relative group"
              >
                <div className="relative z-10 bg-white border-2 border-gray-200 rounded-3xl p-8 h-full hover:border-transparent hover:shadow-2xl transition-all duration-500">
                  <div className={`inline-flex p-5 bg-gradient-to-br ${feature.gradient} text-white rounded-2xl mb-6 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-32 px-4 bg-gradient-to-r from-blue-600 to-green-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-2xl text-white/90 mb-12 leading-relaxed">
                Join thousands of healthcare professionals using MediScan AI to make faster, more accurate diagnoses
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => navigate('/register')}
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 text-2xl px-16 py-10 rounded-2xl shadow-2xl font-bold"
                >
                  <Sparkles className="mr-3 h-7 w-7" />
                  Start Your Free Trial
                  <ArrowRight className="ml-3 h-7 w-7" />
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* About Us Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-block mb-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm font-semibold shadow-lg">
                👥 Our Leadership Team
              </span>
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              Meet the <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Visionaries</span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
              Passionate experts bringing innovation to healthcare diagnostics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* CEO - Prathap */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative z-10 bg-white border-2 border-gray-200 rounded-3xl p-8 h-full hover:border-transparent hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-blue-200 shadow-xl group-hover:border-blue-400 transition-all duration-500">
                    <img
                      src="/assets/prathap.jpg"
                      alt="CEO - Pattupogula Venkata Sai Prathap"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="inline-flex px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-bold mb-4 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      Chief Executive Officer
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Pattupogula Venkata</h3>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Sai Prathap</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Leading with vision and passion to revolutionize medical diagnostics
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-green-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
              />
            </motion.div>
            {/* CTO - Uday */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative z-10 bg-white border-2 border-gray-200 rounded-3xl p-8 h-full hover:border-transparent hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-200 shadow-xl group-hover:border-purple-400 transition-all duration-500">
                    <img
                      src="/assets/uday.png"
                      alt="CTO - Bysani Uday Bhagavan"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="inline-flex px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full text-xs font-bold mb-4 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      Chief Technology Officer
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Bysani Uday</h3>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Bhagavan</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Driving technological innovation and building scalable AI solutions for healthcare
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
              />
            </motion.div>
            {/* CMO - Pradeep */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="relative group"
            >
              <div className="relative z-10 bg-white border-2 border-gray-200 rounded-3xl p-8 h-full hover:border-transparent hover:shadow-2xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10">
                  <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-green-200 shadow-xl group-hover:border-green-400 transition-all duration-500">
                    <img
                      src="/assets/Pradeep.jpg"
                      alt="CMO - Gora Pradeep Kumar Reddy"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="text-center">
                    <motion.div
                      className="inline-flex px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-bold mb-4 shadow-lg"
                      whileHover={{ scale: 1.1 }}
                    >
                      Chief Marketing Officer
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Gora Pradeep</h3>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Kumar Reddy</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Crafting strategies to make AI healthcare accessible to everyone
                    </p>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <Stethoscope className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                MediScan AI
              </span>
            </div>
            <p className="text-gray-400 text-center">
              © 2026 MediScan AI. Advancing healthcare through artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;