export const courseNodes = [
  // Core Start
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    description: "Foundational concepts in supervised and unsupervised learning.",
    type: "core",
    week: 1,
    lectureId: "lec_01"
  },
  
  // Week 1
  {
    id: "linear-models",
    title: "Linear Models",
    description: "The simplest useful hypothesis class: a weighted sum of inputs.",
    week: 1,
    lectureId: "lec_01",
    slides: [2, 3]
  },
  {
    id: "loss-functions",
    title: "Loss Functions",
    description: "Measuring model errors to optimize predictions.",
    week: 1,
    lectureId: "lec_01",
    slides: [4, 6, 7, 10]
  },

  // Week 2
  {
    id: "gradient-descent",
    title: "Gradient Descent",
    description: "Differentiate, step downhill, repeat.",
    week: 2,
    lectureId: "lec_02",
    slides: [2, 3, 4, 14]
  },
  {
    id: "learning-rate",
    title: "Learning Rate",
    description: "How far we move on each step.",
    week: 2,
    lectureId: "lec_02",
    slides: [4]
  },
  {
    id: "batch-stochastic",
    title: "Batch / Stochastic",
    description: "Trade-offs between gradient quality and hardware utilization.",
    week: 2,
    lectureId: "lec_02",
    slides: [5]
  },
  {
    id: "chain-rule",
    title: "Chain Rule",
    description: "Composition of functions for neural networks.",
    week: 2,
    lectureId: "lec_02",
    slides: [6]
  },
  {
    id: "backpropagation",
    title: "Backpropagation",
    description: "Applying the chain rule systematically.",
    week: 2,
    lectureId: "lec_02",
    slides: [7, 8]
  },
  {
    id: "vanishing-gradient",
    title: "Vanishing Gradient",
    description: "Gradients shrinking exponentially through layers.",
    week: 2,
    lectureId: "lec_02",
    slides: [9, 10]
  },
  {
    id: "relu",
    title: "ReLU",
    description: "Fixing vanishing gradients with Rectified Linear Units.",
    week: 2,
    lectureId: "lec_02",
    slides: [11]
  },
  {
    id: "momentum",
    title: "Momentum",
    description: "Accumulating a running average of past gradients.",
    week: 2,
    lectureId: "lec_02",
    slides: [12]
  },
  {
    id: "adam",
    title: "Adam",
    description: "Running average of gradient and its square.",
    week: 2,
    lectureId: "lec_02",
    slides: [13]
  },
  {
    id: "diagnostics",
    title: "Training Diagnostics",
    description: "Diagnosing failed training runs.",
    week: 2,
    lectureId: "lec_02",
    slides: [14]
  },

  // Week 3
  {
    id: "generalization",
    title: "Generalization",
    description: "Applying learned rules to unseen data.",
    week: 3,
    lectureId: "lec_03",
    slides: [2, 3]
  },
  {
    id: "regularization",
    title: "Regularization",
    description: "Constraining models to reduce complexity.",
    week: 3,
    lectureId: "lec_03",
    slides: [4, 5]
  },
  {
    id: "l2-penalty",
    title: "L2 Penalty",
    description: "Ridge regression: shrinking weights toward zero.",
    week: 3,
    lectureId: "lec_03",
    slides: [6, 8]
  },
  {
    id: "l1-penalty",
    title: "L1 Penalty",
    description: "Lasso regression: setting weights exactly to zero.",
    week: 3,
    lectureId: "lec_03",
    slides: [6, 8]
  },
  {
    id: "overfitting",
    title: "Overfitting",
    description: "Fitting noise in the training sample.",
    week: 3,
    lectureId: "lec_03",
    slides: [4, 10]
  },
  {
    id: "bias-variance",
    title: "Bias-Variance",
    description: "Trade-off between model simplicity and flexibility.",
    week: 3,
    lectureId: "lec_03",
    slides: [2, 4]
  },
  {
    id: "dropout",
    title: "Dropout",
    description: "Randomly dropping units to prevent co-adaptation.",
    week: 3,
    lectureId: "lec_03",
    slides: [7] // Example placeholder
  },
  {
    id: "early-stopping",
    title: "Early Stopping",
    description: "Halting training when validation loss rises.",
    week: 3,
    lectureId: "lec_03",
    slides: [10]
  },
  {
    id: "data-splits",
    title: "Train/Val/Test",
    description: "Evaluating model generalizability properly.",
    week: 3,
    lectureId: "lec_03",
    slides: [11]
  },
  {
    id: "cross-validation",
    title: "Cross-validation",
    description: "Robust evaluation across multiple folds.",
    week: 3,
    lectureId: "lec_03",
    slides: [12]
  },
  {
    id: "data-augmentation",
    title: "Data Augmentation",
    description: "Increasing dataset diversity artificially.",
    week: 3,
    lectureId: "lec_03",
    slides: [14]
  }
];

export const courseEdges = [
  // Week 1 Sequence
  { source: "ml-basics", target: "linear-models" },
  { source: "linear-models", target: "loss-functions" },
  { source: "loss-functions", target: "gradient-descent" },

  // Week 2 Sequences
  { source: "gradient-descent", target: "learning-rate" },
  { source: "gradient-descent", target: "batch-stochastic" },
  { source: "gradient-descent", target: "diagnostics" },
  { source: "gradient-descent", target: "chain-rule" },
  { source: "chain-rule", target: "backpropagation" },
  { source: "backpropagation", target: "vanishing-gradient" },
  { source: "vanishing-gradient", target: "relu" },
  { source: "gradient-descent", target: "momentum" },
  { source: "momentum", target: "adam" },

  // Week 3 Sequences
  { source: "gradient-descent", target: "regularization" },
  { source: "regularization", target: "l2-penalty" },
  { source: "regularization", target: "l1-penalty" },
  { source: "l1-penalty", target: "generalization" },
  { source: "l2-penalty", target: "generalization" },
  
  { source: "generalization", target: "overfitting" },
  { source: "overfitting", target: "early-stopping" },
  { source: "overfitting", target: "dropout" },
  { source: "overfitting", target: "bias-variance" },
  
  { source: "overfitting", target: "data-splits" },
  { source: "data-splits", target: "cross-validation" },
  { source: "data-splits", target: "data-augmentation" }
];
