import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { availableModels, DiseaseModel } from '@/lib/models';
import { Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ModelSelectorProps {
  onModelSelect: (model: DiseaseModel) => void;
  selectedModel: DiseaseModel | null;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelSelect, selectedModel }) => {
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
        duration: 0.5
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Select AI Model
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the specialized AI model that best matches your medical imaging needs. 
          Each model is trained on thousands of medical images for accurate analysis.
        </p>
      </div>

      <motion.div 
        className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {availableModels.map((model) => (
          <motion.div key={model.id} variants={itemVariants}>
            <Card 
              className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
                selectedModel?.id === model.id 
                  ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-200' 
                  : 'hover:shadow-lg bg-white border-gray-200'
              }`}
              onClick={() => onModelSelect(model)}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{model.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          {model.accuracy}% Accuracy
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedModel?.id === model.id && (
                    <CheckCircle className="h-6 w-6 text-blue-500" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {model.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {model.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {model.trainingData}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ModelSelector;