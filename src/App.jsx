import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import QuizEngine from './components/QuizEngine';
import ResultsView from './components/ResultsView';
import ReviewView from './components/ReviewView';

function App() {
  const [currentView, setCurrentView] = useState('dashboard'); // dashboard, quiz, results, review
  const [currentSubject, setCurrentSubject] = useState(null);
  const [isMixedExam, setIsMixedExam] = useState(false);
  const [totalQ, setTotalQ] = useState(50);
  
  // Shared state for the quiz
  const [userAnswers, setUserAnswers] = useState([]);
  const [mistakes, setMistakes] = useState([]);

  const goHome = () => setCurrentView('dashboard');
  
  const startQuiz = (subject, numQ, isMixed = false) => {
    setCurrentSubject(subject);
    setTotalQ(numQ);
    setIsMixedExam(isMixed);
    setUserAnswers([]);
    setMistakes([]);
    setCurrentView('quiz');
  };

  const showResults = (answers, missed) => {
    setUserAnswers(answers);
    setMistakes(missed);
    setCurrentView('results');
  };

  const startReview = () => {
    setCurrentView('review');
  };

  return (
    <div className="max-w-4xl mx-auto p-5 relative z-10">
      {currentView === 'dashboard' && (
        <Dashboard 
          startQuiz={startQuiz} 
          startReview={startReview}
        />
      )}
      
      {currentView === 'quiz' && (
        <QuizEngine 
          subject={currentSubject}
          totalQ={totalQ}
          isMixedExam={isMixedExam}
          goHome={goHome}
          onComplete={showResults}
        />
      )}
      
      {currentView === 'results' && (
        <ResultsView 
          subject={currentSubject}
          totalQ={totalQ}
          userAnswers={userAnswers}
          mistakes={mistakes}
          goHome={goHome}
        />
      )}
      
      {currentView === 'review' && (
        <ReviewView 
          goHome={goHome} 
        />
      )}

      {/* Hidden AG Logo */}
      <div 
        className="fixed bottom-3 right-3 text-xs font-black tracking-[0.15em] text-white/5 z-[2] cursor-default transition-all duration-700 select-none font-mono hover:text-indigo-500/70 hover:tracking-[0.35em] hover:scale-110 hover:shadow-glow"
        title=""
      >
        AG
      </div>
    </div>
  );
}

export default App;
