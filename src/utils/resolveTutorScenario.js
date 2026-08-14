/**
 * resolveTutorScenario
 *
 * Deterministic scenario resolver for the StudyMap course tutor.
 *
 * Two-layer scoring:
 *
 *  1. TOPIC KEYWORDS (weighted ×3)
 *     Each scenario has a list of multi-word and single-word phrases that
 *     represent the CONCEPTS it covers — not just its prompt text.
 *     Phrase length is used as a specificity multiplier (longer = stronger).
 *
 *  2. TOKEN OVERLAP (weighted ×1)
 *     Jaccard-like overlap between significant words in the query and the
 *     scenario's prompt text. Acts as a tie-breaker / catch-all.
 *
 * No external AI, no web search, no hardcoded exact-string if/else chains.
 * The supported responses are entirely defined by responses.json.
 */

import responsesData from '../../data/responses.json';

// ─── Stop words ────────────────────────────────────────────────────────────────
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','is','are','was','were','be','been','being','have','has','had','do',
  'does','did','will','would','could','should','may','might','shall','can',
  'i','we','you','he','she','it','they','me','us','him','her','them','my',
  'our','your','his','its','their','this','that','these','those','so','also',
  'just','more','very','too','all','any','some','not','no','nor','if','then',
  'than','as','up','out','into','about','over','after','before','between',
  'through','during','again','ever','once','here','there','now','still',
  'what','how','why','when','where','who','which','let','show','tell','give',
  'explain','help','please','could','would','can','make','does',
]);

// ─── Text utilities ────────────────────────────────────────────────────────────
function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[?!.,;:'"()[\]{}/\\–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSignificantWords(text) {
  return normalize(text).split(' ').filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

// ─── TOPIC KEYWORD GROUPS ──────────────────────────────────────────────────────
// Each scenario id maps to phrases that describe WHAT IT COVERS.
// Multi-word phrases score proportionally higher (specificity bonus).
// Keep phrases lowercase and punctuation-free (matching normalize() output).
const TOPIC_KEYWORDS = {
  greeting: [
    'hello', 'hey', 'howdy', 'hi there', 'good morning', 'good evening',
  ],

  // "Why is the sigmoid derivative at most 0.25?" — covers vanishing gradients mathematically
  math: [
    'vanishing gradient', 'vanishing gradients', 'gradient vanish', 'gradients vanish',
    'gradient disappear', 'gradients disappear', 'gradient problem', 'gradient shrink',
    'gradients shrink', 'gradient shrinks',
    'repeated multiplication', 'multiplication of derivatives', 'multiply derivatives',
    'multiplying derivatives', 'repeated derivatives', 'chained derivatives',
    'derivative product', 'product of derivatives',
    'derivatives become small', 'derivatives become tiny', 'derivatives get small',
    'derivative becomes small', 'gradient becomes small', 'gradients become small',
    'gradient gets smaller', 'tiny gradient', 'very small gradient', 'extremely small gradient',
    'sigmoid derivative', 'derivative of sigmoid', 'sigmoid function', 'sigmoid',
    '0 25', 'at most 0', 'bounded by', 'upper bound derivative',
    'mathematically', 'mathematical proof', 'prove mathematically', 'show mathematically',
    'deep network gradient', 'depth gradient', 'many layers gradient', 'multiple layers',
    'shrinking gradient', 'exploding gradient', 'gradient magnitude', 'gradient norm',
    'activation derivative', 'derivative chain', 'chain of derivatives',
  ],

  // "Explain everything about backpropagation." — also covers vanishing gradients in depth
  long: [
    'backpropagation', 'back propagation', 'backprop', 'backward pass',
    'backward propagation', 'forward pass', 'chain rule', 'chain rule backprop',
    'neural network training', 'computing gradients', 'gradient flow', 'gradient computation',
    'deep network training', 'how neural networks learn', 'propagate gradient',
    'automatic differentiation', 'autodiff',
    'relu', 'dying relu', 'leaky relu', 'rectified linear',
    'residual connection', 'skip connection', 'batch normalization', 'batch norm',
    'he initialisation', 'xavier initialisation', 'weight initialisation',
    'two layer network', 'hidden layer', 'delta', 'delta computation',
    'activation function', 'non linearity',
  ],

  // "Show me how gradient descent is implemented." — code + learning rate
  code: [
    'gradient descent', 'implement gradient', 'gradient descent code',
    'gradient descent implementation', 'gradient descent algorithm',
    'python code', 'show code', 'implementation', 'code for',
    'learning rate', 'weight update', 'update weights', 'update rule',
    'optimization loop', 'training loop', 'training step', 'gradient step',
    'descent algorithm', 'gradient update', 'epoch', 'iterations',
    'stochastic gradient', 'sgd', 'mini batch', 'batch gradient', 'batch size',
    'step size', 'converge', 'convergence', 'diverge', 'divergence',
    'gradient check', 'numerical gradient',
  ],

  // "What is the difference between supervised and unsupervised learning?"
  plain: [
    'supervised learning', 'unsupervised learning', 'supervised vs unsupervised',
    'difference between supervised', 'labelled data', 'labeled data', 'labels',
    'ground truth', 'annotation', 'clustering', 'dimensionality reduction',
    'representation learning', 'feature learning', 'model learns',
  ],

  // "Compare the regularization techniques we covered."
  table: [
    'regularization', 'regularisation', 'l1 regularization', 'l2 regularization',
    'l1 and l2', 'l1 vs l2', 'compare l1', 'compare l2',
    'ridge regression', 'lasso regression', 'lasso', 'ridge',
    'dropout', 'early stopping', 'weight penalty', 'weight decay',
    'overfitting', 'overfit', 'generalisation', 'generalization',
    'regularize', 'prevent overfitting', 'reduce overfitting', 'variance reduction',
    'training loss', 'validation loss', 'test loss', 'bias variance',
  ],

  // "When is the final exam?" — out-of-course refusal
  refusal: [
    'final exam', 'exam schedule', 'exam date', 'exam time', 'when is the exam',
    'midterm schedule', 'midterm date', 'assignment due', 'due date', 'deadline',
    'grading', 'my grade', 'grades', 'office hours', 'professor email',
    'professor contact', 'syllabus', 'course schedule', 'class schedule',
    'homework due', 'project due', 'submission',
  ],

  // "Walk me through the midterm solutions." — intentional mid-stream error scenario
  'error-midstream': [
    'midterm solutions', 'midterm answers', 'exam solutions', 'solution to midterm',
    'walk me through midterm', 'midterm walkthrough', 'midterm problems',
    'solutions to midterm',
  ],

  // "Summarise the whole course so far." — intentionally slow scenario
  slow: [
    'summarize the course', 'summarise the course', 'course summary',
    'whole course', 'entire course', 'course so far', 'all three weeks',
    'all weeks', 'what have we covered', 'recap the course',
    'overview of everything', 'everything we learned', 'course overview',
  ],
};

// ─── Phrase-based topic scoring ────────────────────────────────────────────────
/**
 * Score query against the concept keywords for one scenario.
 * Each matching phrase contributes its word-count (specificity).
 */
function topicKeywordScore(normQuery, scenarioId) {
  const phrases = TOPIC_KEYWORDS[scenarioId];
  if (!phrases) return 0;

  let score = 0;
  for (const phrase of phrases) {
    if (normQuery.includes(phrase)) {
      score += phrase.split(' ').length; // longer phrase = more specific = higher weight
    }
  }
  return score;
}

// ─── Token overlap scoring ─────────────────────────────────────────────────────
function overlapScore(queryWords, scenarioWords) {
  const qSet = new Set(queryWords);
  const sSet = new Set(scenarioWords);
  if (qSet.size === 0 || sSet.size === 0) return 0;
  let matches = 0;
  for (const w of qSet) { if (sSet.has(w)) matches++; }
  return matches / Math.min(qSet.size, sSet.size);
}

// ─── Public API ────────────────────────────────────────────────────────────────
/**
 * Map a student's free-text query to the best supported scenario ID.
 *
 * Scoring per scenario:
 *   total = (topicKeywordScore × 3) + tokenOverlapScore
 *
 * Returns a scenario id from responses.json, or 'fallback'.
 */
export function resolveTutorScenario(query) {
  if (!query?.trim()) return 'fallback';

  const norm = normalize(query);

  // Greeting shortcut
  if (/^(hi|hello|hey|howdy|greetings)\b/.test(norm)) return 'greeting';

  const queryWords = getSignificantWords(query);
  let bestId = 'fallback';
  let bestScore = 0;

  for (const scenario of responsesData.scenarios) {
    if (scenario.id === 'fallback') continue;

    // Exact normalized prompt match → immediate return
    if (norm === normalize(scenario.prompt)) return scenario.id;

    const topicScore   = topicKeywordScore(norm, scenario.id);
    const promptWords  = getSignificantWords(scenario.prompt);
    const tokenScore   = overlapScore(queryWords, promptWords);

    // Topic keywords weighted 3×; token overlap is a secondary signal
    const total = topicScore * 3 + tokenScore;

    if (total > bestScore) {
      bestScore = total;
      bestId    = scenario.id;
    }
  }

  // Require at least ONE meaningful signal:
  //   - A topic keyword matched (topicScore > 0 means total ≥ 3), OR
  //   - Token overlap is above the 25% threshold
  const winnerTopicScore  = topicKeywordScore(norm, bestId);
  const winnerPromptWords = getSignificantWords(
    responsesData.scenarios.find(s => s.id === bestId)?.prompt || ''
  );
  const winnerTokenScore  = overlapScore(queryWords, winnerPromptWords);

  if (winnerTopicScore === 0 && winnerTokenScore < 0.25) {
    return 'fallback';
  }

  return bestId;
}

/**
 * Return the list of supported scenario prompts for UI display.
 * Used by the empty state to show clickable example prompts.
 */
export function getSuggestedPrompts() {
  return responsesData.scenarios
    .filter(s => !['fallback'].includes(s.id))
    .map(s => ({ id: s.id, prompt: s.prompt }));
}
