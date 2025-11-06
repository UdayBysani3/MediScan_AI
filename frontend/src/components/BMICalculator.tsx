import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Calculator, 
  Scale, 
  Ruler, 
  TrendingUp, 
  Heart, 
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  description: string;
  recommendations: string[];
}

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState('');

  const calculateBMI = () => {
    setError('');
    
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    
    if (!heightNum || !weightNum || heightNum <= 0 || weightNum <= 0) {
      setError('Please enter valid height and weight values');
      return;
    }
    
    let bmi: number;
    
    if (unit === 'metric') {
      // Height in cm, weight in kg
      const heightInMeters = heightNum / 100;
      bmi = weightNum / (heightInMeters * heightInMeters);
    } else {
      // Height in inches, weight in pounds
      bmi = (weightNum / (heightNum * heightNum)) * 703;
    }
    
    const getBMICategory = (bmi: number): BMIResult => {
      if (bmi < 18.5) {
        return {
          bmi,
          category: 'Underweight',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          description: 'You may need to gain weight for optimal health.',
          recommendations: [
            'Consult with a healthcare provider',
            'Consider a balanced diet with more calories',
            'Include strength training exercises',
            'Monitor your health regularly'
          ]
        };
      } else if (bmi >= 18.5 && bmi < 25) {
        return {
          bmi,
          category: 'Normal Weight',
          color: 'text-green-600 bg-green-50 border-green-200',
          description: 'You have a healthy weight for your height.',
          recommendations: [
            'Maintain your current lifestyle',
            'Continue regular physical activity',
            'Eat a balanced, nutritious diet',
            'Regular health check-ups'
          ]
        };
      } else if (bmi >= 25 && bmi < 30) {
        return {
          bmi,
          category: 'Overweight',
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          description: 'You may benefit from weight management.',
          recommendations: [
            'Aim for gradual weight loss',
            'Increase physical activity',
            'Focus on portion control',
            'Consult a nutritionist if needed'
          ]
        };
      } else {
        return {
          bmi,
          category: 'Obese',
          color: 'text-red-600 bg-red-50 border-red-200',
          description: 'Consider consulting with a healthcare provider for weight management.',
          recommendations: [
            'Seek professional medical advice',
            'Consider supervised weight loss program',
            'Focus on sustainable lifestyle changes',
            'Regular monitoring of health markers'
          ]
        };
      }
    };
    
    setResult(getBMICategory(bmi));
  };

  const resetCalculator = () => {
    setHeight('');
    setWeight('');
    setResult(null);
    setError('');
  };

  const getBMIIcon = (category: string) => {
    switch (category) {
      case 'Normal Weight': return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'Underweight': return <TrendingUp className="h-6 w-6 text-blue-600" />;
      case 'Overweight': return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
      case 'Obese': return <AlertTriangle className="h-6 w-6 text-red-600" />;
      default: return <Calculator className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2">
          <Calculator className="h-8 w-8 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900">BMI Calculator</h2>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Calculate your Body Mass Index (BMI) and get personalized health recommendations 
          based on WHO standards for optimal wellness.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-blue-600" />
            <span>Calculate Your BMI</span>
          </CardTitle>
          <CardDescription>
            Enter your height and weight to calculate your Body Mass Index
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Unit Selection */}
          <div className="flex justify-center space-x-4">
            <Button
              variant={unit === 'metric' ? 'default' : 'outline'}
              onClick={() => setUnit('metric')}
              className="flex-1"
            >
              Metric (cm/kg)
            </Button>
            <Button
              variant={unit === 'imperial' ? 'default' : 'outline'}
              onClick={() => setUnit('imperial')}
              className="flex-1"
            >
              Imperial (in/lbs)
            </Button>
          </div>

          {/* Input Fields */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center space-x-2">
                <Ruler className="h-4 w-4" />
                <span>Height {unit === 'metric' ? '(cm)' : '(inches)'}</span>
              </Label>
              <Input
                id="height"
                type="number"
                placeholder={unit === 'metric' ? 'e.g., 175' : 'e.g., 69'}
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="text-lg py-6"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center space-x-2">
                <Scale className="h-4 w-4" />
                <span>Weight {unit === 'metric' ? '(kg)' : '(lbs)'}</span>
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder={unit === 'metric' ? 'e.g., 70' : 'e.g., 154'}
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="text-lg py-6"
              />
            </div>
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={calculateBMI}
            className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            size="lg"
          >
            <Calculator className="mr-2 h-5 w-5" />
            Calculate BMI
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* BMI Score */}
              <div className={`p-8 rounded-xl border-2 ${result.color}`}>
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center space-x-3">
                    {getBMIIcon(result.category)}
                    <h3 className="text-2xl font-bold">{result.category}</h3>
                  </div>
                  <div className="text-5xl font-bold">
                    {result.bmi.toFixed(1)}
                  </div>
                  <p className="text-lg opacity-80">
                    {result.description}
                  </p>
                </div>
              </div>

              {/* BMI Scale */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  BMI Categories (WHO Standards)
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Underweight</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Below 18.5
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Normal Weight</span>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      18.5 - 24.9
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Overweight</span>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                      25.0 - 29.9
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Obese</span>
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      30.0 and above
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Health Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2 text-blue-800">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex space-x-4">
                <Button onClick={resetCalculator} variant="outline" className="flex-1">
                  Calculate Again
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-600 to-blue-600">
                  <Heart className="mr-2 h-4 w-4" />
                  Save Results
                </Button>
              </div>
            </motion.div>
          )}

          {/* Disclaimer */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Medical Disclaimer:</strong> BMI is a screening tool and not a diagnostic measure. 
              It may not accurately reflect health status for athletes, elderly, or individuals with high muscle mass. 
              Consult healthcare professionals for comprehensive health assessment.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default BMICalculator;