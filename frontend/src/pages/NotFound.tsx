import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50 relative overflow-hidden p-6">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Left Side - Confused Doctor Illustration */}
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated Search Icon */}
          <motion.div
            className="absolute top-10 left-10 bg-orange-100 p-4 rounded-full hidden lg:block"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <Search className="h-8 w-8 text-orange-600" />
          </motion.div>

          <svg width="400" height="500" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Question Marks Floating */}
            <motion.text
              x="80"
              y="100"
              fontSize="60"
              fill="#FB923C"
              fontWeight="bold"
              animate={{ y: [100, 90, 100], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ?
            </motion.text>
            <motion.text
              x="300"
              y="150"
              fontSize="60"
              fill="#F97316"
              fontWeight="bold"
              animate={{ y: [150, 140, 150], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              ?
            </motion.text>

            {/* Doctor - Lab Coat */}
            <path d="M150 200 L120 500 L280 500 L250 200 Z" fill="#FED7AA" stroke="#EA580C" strokeWidth="2" />

            {/* Body */}
            <ellipse cx="200" cy="220" rx="50" ry="70" fill="#FDBA74" />

            {/* Head */}
            <circle cx="200" cy="140" r="50" fill="#FED7AA" />

            {/* Hair */}
            <ellipse cx="200" cy="105" rx="52" ry="38" fill="#78350F" />

            {/* Confused Expression - Eyes */}
            <motion.g
              animate={{ scaleX: [1, 0.8, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <circle cx="180" cy="135" r="5" fill="#1E293B" />
              <circle cx="220" cy="135" r="5" fill="#1E293B" />
            </motion.g>

            {/* Confused/Worried Mouth */}
            <motion.path
              d="M 180 160 Q 200 155 220 160"
              stroke="#1E293B"
              strokeWidth="3"
              fill="none"
              animate={{ d: ["M 180 160 Q 200 155 220 160", "M 180 160 Q 200 165 220 160", "M 180 160 Q 200 155 220 160"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Scratching head arm */}
            <motion.g
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ellipse cx="240" cy="150" rx="15" ry="40" fill="#FED7AA" transform="rotate(30 240 150)" />
              <circle cx="250" cy="120" r="12" fill="#FED7AA" />
            </motion.g>

            {/* Other arm */}
            <ellipse cx="160" cy="240" rx="15" ry="35" fill="#FED7AA" transform="rotate(-20 160 240)" />

            {/* Stethoscope */}
            <motion.g
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <circle cx="150" cy="200" r="8" fill="#64748B" stroke="#475569" strokeWidth="2" />
              <path d="M 150 208 Q 170 230 190 260" stroke="#475569" strokeWidth="3" fill="none" />
            </motion.g>

            {/* Medical Badge */}
            <g transform="translate(200, 190)">
              <rect x="-4" y="-12" width="8" height="24" fill="#EA580C" />
              <rect x="-12" y="-4" width="24" height="8" fill="#EA580C" />
            </g>

            {/* Magnifying Glass on ground */}
            <motion.g
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <circle cx="120" cy="420" r="30" fill="none" stroke="#94A3B8" strokeWidth="4" />
              <line x1="140" y1="440" x2="165" y2="465" stroke="#94A3B8" strokeWidth="6" strokeLinecap="round" />
            </motion.g>
          </svg>

          {/* Large 404 Number */}
          <motion.div
            className="mt-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.h1
              className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              404
            </motion.h1>
          </motion.div>
        </motion.div>

        {/* Right Side - Error Message and Actions */}
        <motion.div
          className="space-y-6 text-center lg:text-left"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold text-slate-900 mb-3">
                Oops! Page Not Found
              </h2>
              <p className="text-xl text-slate-600 mb-4">
                Looks like we couldn't find what you're looking for.
              </p>
              <p className="text-slate-500">
                The page you're trying to access doesn't exist or may have been moved.
                Don't worry, our medical AI is here to help you find your way back!
              </p>
            </motion.div>
          </div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button asChild size="lg" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all">
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Return Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-400 transition-all flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </Button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            className="pt-8 border-t border-slate-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-sm text-slate-600 mb-4">Maybe you were looking for:</p>
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link to="/login" className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                Login
              </Link>
              <Link to="/register" className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                Register
              </Link>
              <Link to="/pricing" className="text-sm px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors">
                Pricing
              </Link>
            </div>
          </motion.div>

          {/* Medical Touch */}
          <motion.div
            className="pt-6 flex items-center justify-center lg:justify-start gap-3 text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Stethoscope className="h-5 w-5 text-orange-500" />
            <p className="text-sm italic">MediScan AI - Your Health, Our Priority</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}