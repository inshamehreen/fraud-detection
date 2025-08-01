import React from 'react';
import AlgorithmCard from '../components/AlgorithmCard';

function MLAlgorithms() {
  const algorithms = [
    {
      name: 'Logistic Regression',
      pros: [
        'Simple and interpretable.',
        'Performs well on linearly separable data.'
      ],
      cons: [
        'Assumes linearity in the features.',
        'Not suitable for complex or highly imbalanced datasets like fraud detection.'
      ]
    },
    {
      name: 'Decision Tree',
      pros: [
        'Easy to visualize and understand.',
        'Can handle both numerical and categorical data.'
      ],
      cons: [
        'Prone to overfitting.',
        'Sensitive to small changes in data.'
      ]
    },
    {
      name: 'Random Forest',
      pros: [
        'Reduces overfitting compared to a single decision tree.',
        'Works well on imbalanced datasets.'
      ],
      cons: [
        'Less interpretable.',
        'Slower and more resource-intensive.'
      ]
    },
    {
      name: 'Support Vector Machine (SVM)',
      pros: [
        'Effective in high-dimensional spaces.',
        'Works well with clear margins of separation.'
      ],
      cons: [
        'Not scalable for large datasets.',
        'Requires careful kernel selection and tuning.'
      ]
    },
    {
      name: 'XGBoost',
      pros: [
        'Handles class imbalance well.',
        'High performance with low overfitting.',
        'Robust to outliers and missing values.'
      ],
      cons: [
        'Harder to interpret.',
        'Longer training time compared to simpler models.'
      ]
    }
  ];

  return (
    <div className="p-6 font-rubik bg-primary text-white min-h-screen">
      <h1 className="text-4xl font-slab text-[#FDF5A9] mb-6 text-center">
        ML Algorithms & Why We Chose XGBoost
      </h1>
      {algorithms.map((algo, index) => (
        <AlgorithmCard key={index} {...algo} />
      ))}
    </div>
  );
}

export default MLAlgorithms;
