import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Overview from './pages/Overview';
import Conversation from './pages/Conversation';
import LearningMap from './pages/LearningMap';
import LectureDetail from './pages/LectureDetail';

function App() {
  return (
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
  );
}

export default App;
