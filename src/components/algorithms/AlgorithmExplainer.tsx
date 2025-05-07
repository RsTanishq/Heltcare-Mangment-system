
import { Info } from "lucide-react";

interface Variable {
  name: string;
  description: string;
}

interface AlgorithmExplainerProps {
  title: string;
  description: string;
  formula: string;
  variables: Variable[];
}

const AlgorithmExplainer: React.FC<AlgorithmExplainerProps> = ({
  title,
  description,
  formula,
  variables
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-start mb-4">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
          <Info className="text-blue-600" size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-xl">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      
      <div className="border rounded-md bg-gray-50 p-4 mb-4">
        <p className="font-mono text-lg text-center py-2">{formula}</p>
      </div>
      
      <h4 className="font-medium mb-2">Variables Explained:</h4>
      <div className="space-y-2">
        {variables.map((variable, index) => (
          <div key={index} className="flex items-start">
            <span className="font-mono font-medium text-blue-600 w-20">{variable.name}:</span>
            <span className="text-gray-700">{variable.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmExplainer;
