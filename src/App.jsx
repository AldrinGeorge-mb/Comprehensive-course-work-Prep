import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import QuizEngine from './components/QuizEngine';
import ResultsView from './components/ResultsView';
import ReviewView from './components/ReviewView';

export default function App() {
  const [view, setView]               = useState('dashboard');
  const [subject, setSubject]         = useState(null);
  const [totalQ, setTotalQ]           = useState(50);
  const [isMixed, setIsMixed]         = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [mistakes, setMistakes]       = useState([]);

  const goHome = () => setView('dashboard');

  const startQuiz = (subj, numQ, mixed = false) => {
    setSubject(subj);
    setTotalQ(numQ);
    setIsMixed(mixed);
    setUserAnswers([]);
    setMistakes([]);
    setView('quiz');
  };

  const onComplete = (answers, errs) => {
    setUserAnswers(answers);
    setMistakes(errs);
    setView('results');
  };

  return (
    <>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px', position: 'relative', zIndex: 1 }}>

        {view === 'dashboard' && (
          <Dashboard startQuiz={startQuiz} startReview={() => setView('review')} />
        )}
        {view === 'quiz' && (
          <QuizEngine
            subject={subject}
            totalQ={totalQ}
            isMixedExam={isMixed}
            goHome={goHome}
            onComplete={onComplete}
          />
        )}
        {view === 'results' && (
          <ResultsView
            subject={subject}
            totalQ={totalQ}
            userAnswers={userAnswers}
            mistakes={mistakes}
            goHome={goHome}
          />
        )}
        {view === 'review' && (
          <ReviewView goHome={goHome} />
        )}
      </div>

      {/* AG signature */}
      <div className="ag-logo" title="">AG</div>
    </>
  );
}
