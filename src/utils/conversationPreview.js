import { courseNodes } from '../data/courseGraph';

/**
 * Selects a relevant conversation snippet for the laptop preview.
 * 
 * Logic:
 * 1. Find the most recently active learning concept (from inProgressNodes).
 * 2. Search the actual conversation history for messages mentioning this concept.
 * 3. Return the user message, the tutor response, and its citation.
 * 4. Fallback: If no matching conversation exists, return the most recent complete exchange.
 * 
 * @param {Array} messages - The full array of conversation messages.
 * @param {Array} inProgressNodes - Array of node IDs currently in progress.
 * @returns {Array} - A curated array of messages (usually 2) for the preview.
 */
export function getPreviewMessages(messages, inProgressNodes = []) {
  if (!messages || messages.length === 0) return [];

  // Try to find the most recently interacted node
  // We assume the last item in inProgressNodes might be the most recent,
  // or we just pick the first one we find matching.
  let targetConcept = null;
  if (inProgressNodes.length > 0) {
    const latestNodeId = inProgressNodes[inProgressNodes.length - 1];
    const node = courseNodes.find(n => n.id === latestNodeId);
    if (node) {
      targetConcept = node;
    }
  }

  // 1. If we have a target concept, search backwards for a relevant exchange
  if (targetConcept) {
    const terms = [targetConcept.title.toLowerCase(), ...(targetConcept.aliases || []).map(a => a.toLowerCase())];
    
    // Find a user message containing any of these terms
    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      if (msg.role === 'user') {
        const text = msg.content.toLowerCase();
        if (terms.some(term => text.includes(term))) {
          // Found a matching user question. Check if the next message is a tutor response
          if (i + 1 < messages.length && messages[i+1].role === 'assistant') {
            return [messages[i], messages[i+1]];
          }
        }
      }
    }
  }

  // 2. Fallback: Return the most recent complete exchange (user -> assistant)
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'assistant') {
      // Find the preceding user message
      if (i - 1 >= 0 && messages[i-1].role === 'user') {
        return [messages[i-1], messages[i]];
      }
    }
  }

  // 3. Absolute fallback: Just return the last two messages
  return messages.slice(-2);
}
