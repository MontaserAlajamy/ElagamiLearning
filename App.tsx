import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { Layout } from './components/Layout';
import { Home } from './screens/Home';
import { QuizBuilder } from './screens/QuizBuilder';
import { ActiveQuiz } from './screens/ActiveQuiz';
import { Results } from './screens/Results';
import { Students } from './screens/Students';

const App: React.FC = () => {
  return (
    <AccessibilityProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/builder" element={<QuizBuilder />} />
            <Route path="/quiz" element={<ActiveQuiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/students" element={<Students />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AccessibilityProvider>
  );
};

export default App;