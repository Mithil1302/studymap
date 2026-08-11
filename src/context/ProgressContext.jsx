import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { courseNodes, courseEdges } from '../data/courseGraph';

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  // Load persisted progress or initialize with just the root node completed.
  const [completedNodes, setCompletedNodes] = useState(() => {
    const saved = localStorage.getItem('studymap_progress');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse progress", e);
      }
    }
    return new Set(['ml-basics']);
  });

  // Track in-progress nodes (e.g. from chat citations or partial interactions)
  const [inProgressNodes, setInProgressNodes] = useState(() => {
    const saved = localStorage.getItem('studymap_in_progress');
    if (saved) {
      try {
        return new Set(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse in-progress", e);
      }
    }
    return new Set();
  });

  const [studyTrail, setStudyTrail] = useState(() => {
    const saved = localStorage.getItem('studymap_study_trail');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse study_trail", e);
      }
    }
    return ['ml-basics']; // Root node always first
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('studymap_progress', JSON.stringify(Array.from(completedNodes)));
    localStorage.setItem('studymap_in_progress', JSON.stringify(Array.from(inProgressNodes)));
    localStorage.setItem('studymap_study_trail', JSON.stringify(studyTrail));
  }, [completedNodes, inProgressNodes, studyTrail]);

  const addToTrail = useCallback((nodeId) => {
    setStudyTrail(prev => {
      // Don't add if it's already the most recent interaction
      if (prev[prev.length - 1] === nodeId) return prev;
      return [...prev, nodeId];
    });
  }, []);

  const markNodeCompleted = useCallback((nodeId) => {
    setCompletedNodes(prev => {
      const next = new Set(prev);
      next.add(nodeId);
      return next;
    });
    // Remove from in-progress if it's there
    setInProgressNodes(prev => {
      if (prev.has(nodeId)) {
        const next = new Set(prev);
        next.delete(nodeId);
        return next;
      }
      return prev;
    });
    addToTrail(nodeId);
  }, [addToTrail]);

  const markNodeInProgress = useCallback((nodeId) => {
    setCompletedNodes(prevCompleted => {
      if (!prevCompleted.has(nodeId)) {
        setInProgressNodes(prevInProg => {
          const next = new Set(prevInProg);
          next.add(nodeId);
          return next;
        });
      }
      return prevCompleted;
    });
    addToTrail(nodeId);
  }, [addToTrail]);

  const resetProgress = useCallback(() => {
    setCompletedNodes(new Set(['ml-basics']));
    setInProgressNodes(new Set());
    setStudyTrail(['ml-basics']);
  }, []);

  // Node status calculation:
  // - 'completed': in completedNodes
  // - 'in-progress': in inProgressNodes
  // - 'available': all prerequisites (incoming edges) are 'completed'
  // - 'locked': one or more prerequisites are not 'completed'
  const getNodeStatus = (nodeId) => {
    if (completedNodes.has(nodeId)) return 'completed';
    if (inProgressNodes.has(nodeId)) return 'in-progress';
    
    // Find all incoming edges to this node
    const prerequisites = courseEdges
      .filter(edge => edge.target === nodeId)
      .map(edge => edge.source);
    
    if (prerequisites.length === 0) return 'available'; // No prereqs
    
    // Available if ALL prereqs are completed
    const allPrereqsCompleted = prerequisites.every(prereqId => completedNodes.has(prereqId));
    return allPrereqsCompleted ? 'available' : 'locked';
  };

  const getCourseProgress = () => {
    if (courseNodes.length === 0) return 0;
    return Math.round((completedNodes.size / courseNodes.length) * 100);
  };

  return (
    <ProgressContext.Provider value={{
      completedNodes,
      inProgressNodes,
      studyTrail,
      markNodeCompleted,
      markNodeInProgress,
      resetProgress,
      getNodeStatus,
      getCourseProgress,
      courseNodes,
      courseEdges
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
