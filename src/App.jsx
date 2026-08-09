import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/Overview';
import Conversation from './pages/Conversation';
import LearningMap from './pages/LearningMap';
import LectureDetail from './pages/LectureDetail';
import { StudyMapProvider } from './context/StudyMapContext';
import { ProgressProvider } from './context/ProgressContext';

function App() {
  return (
    <ProgressProvider>
      <StudyMapProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Overview />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/learning-map" element={<LearningMap />} />
              <Route path="/lectures/:id" element={<LectureDetail />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </StudyMapProvider>
    </ProgressProvider>
  );
}

export default App;
