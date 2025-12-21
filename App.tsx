
import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  ChevronRight, 
  ChevronLeft, 
  LayoutDashboard, 
  Map, 
  Users, 
  Target,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { QUESTIONS, DOMAIN_COLORS } from './constants';
import { InterestDomain, InterestScores, RecommendationResponse } from './types';
import { generateCareerRecommendations } from './services/geminiService';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

type AppState = 'landing' | 'assessment' | 'loading' | 'results';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('landing');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [recommendations, setRecommendations] = useState<RecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interestScores = useMemo(() => {
    // Explicitly typed records for totals and counts to avoid inference issues during arithmetic.
    const totals: Record<string, number> = {};
    const counts: Record<string, number> = {};

    Object.values(InterestDomain).forEach(d => {
      totals[d] = 0;
      counts[d] = 0;
    });

    QUESTIONS.forEach(q => {
      if (answers[q.id] !== undefined) {
        totals[q.domain] = (totals[q.domain] || 0) + answers[q.id];
        counts[q.domain] = (counts[q.domain] || 0) + 5; // Max possible per question
      }
    });

    const results: InterestScores = {} as any;
    Object.values(InterestDomain).forEach(v => {
      const d = v as InterestDomain;
      const t = totals[v] || 0;
      const c = counts[v] || 0;
      // Perform division on ensured numeric types.
      results[d] = c > 0 ? (t / c) * 10 : 0;
    });

    return results;
  }, [answers]);

  const chartData = useMemo(() => {
    // Explicitly cast Object.entries to ensure score is recognized as a number for the arithmetic operation on line 63.
    return (Object.entries(interestScores) as [string, number][]).map(([domain, score]) => ({
      domain: domain.split(' ')[0], // Shorten name for display
      fullDomain: domain,
      score: Math.round(score * 10) / 10,
    }));
  }, [interestScores]);

  const handleStart = () => setState('assessment');

  const handleAnswer = (score: number) => {
    const qId = QUESTIONS[currentQuestionIndex].id;
    setAnswers(prev => ({ ...prev, [qId]: score }));
    
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      processResults();
    }
  };

  const processResults = async () => {
    setState('loading');
    setError(null);
    try {
      const result = await generateCareerRecommendations(interestScores);
      setRecommendations(result);
      setState('results');
    } catch (err) {
      setError("Failed to generate recommendations. Please check your connection or API key.");
      setState('results'); // Show chart at least
    }
  };

  const LandingPage = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-8 p-4 bg-blue-600 rounded-2xl text-white">
        <Map size={48} strokeWidth={2.5} />
      </div>
      <h1 className="text-5xl font-extrabold mb-4 tracking-tight text-slate-900">
        Find Your Path with <span className="text-blue-600">CareerMap</span>
      </h1>
      <p className="text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Personalized career guidance based on your unique interests, strengths, and passions. 
        Forget generic tests—discover a structured roadmap to your future.
      </p>
      <button 
        onClick={handleStart}
        className="px-10 py-5 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-200 flex items-center gap-3 group"
      >
        Start Assessment <ArrowRight className="group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl">
        {[
          { icon: Target, title: "Precision Analysis", desc: "Detailed interest mapping across 10 distinct domains." },
          { icon: LayoutDashboard, title: "AI Roadmaps", desc: "Step-by-step educational and skill-building pathways." },
          { icon: Users, title: "Industry Aligned", desc: "Recommendations mapped to current job market trends." }
        ].map((item, i) => (
          <div key={i} className="p-8 rounded-2xl bg-white border border-slate-200 text-left">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const Assessment = () => {
    const q = QUESTIONS[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100;

    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-2 bg-blue-600 transition-all duration-500" style={{ width: `${progress}%` }} />
          
          <div className="flex justify-between items-center mb-10">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</span>
            <div className="flex gap-2">
              <button 
                disabled={currentQuestionIndex === 0}
                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30"
              >
                <ChevronLeft size={20} />
              </button>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-slate-800 mb-12 min-h-[100px] leading-snug">
            {q.text}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {[
              { label: "Strongly Agree", score: 5, color: "hover:border-green-500 hover:bg-green-50" },
              { label: "Agree", score: 4, color: "hover:border-blue-500 hover:bg-blue-50" },
              { label: "Neutral", score: 3, color: "hover:border-slate-400 hover:bg-slate-50" },
              { label: "Disagree", score: 2, color: "hover:border-orange-500 hover:bg-orange-50" },
              { label: "Strongly Disagree", score: 1, color: "hover:border-red-500 hover:bg-red-50" }
            ].map((option) => (
              <button
                key={option.score}
                onClick={() => handleAnswer(option.score)}
                className={`w-full p-5 text-left border-2 border-slate-100 rounded-2xl transition-all font-medium flex justify-between items-center group ${option.color}`}
              >
                {option.label}
                <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const Loading = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-400 blur-3xl opacity-20 animate-pulse"></div>
        <Loader2 size={64} className="text-blue-600 animate-spin relative" />
      </div>
      <h2 className="text-3xl font-bold mb-4">Mapping Your Future...</h2>
      <div className="space-y-3 max-w-xs mx-auto">
        <p className="text-slate-500 flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: '0s' }}>
          <Sparkles size={16} /> Analyzing interest domains
        </p>
        <p className="text-slate-500 flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: '0.2s' }}>
          <Sparkles size={16} /> Identifying career matches
        </p>
        <p className="text-slate-500 flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: '0.4s' }}>
          <Sparkles size={16} /> Generating personal roadmap
        </p>
      </div>
    </div>
  );

  const Results = () => (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Career Map Analysis</h1>
          <p className="text-slate-500">Discover where your passions align with professional reality.</p>
        </div>
        <button 
          onClick={() => {
            setState('landing');
            setCurrentQuestionIndex(0);
            setAnswers({});
          }}
          className="px-6 py-3 bg-slate-200 text-slate-700 rounded-full font-bold hover:bg-slate-300 transition-all"
        >
          Retake Assessment
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Interest Profile Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Target className="text-blue-600" /> Your Interest Profile
          </h2>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="domain" tick={{ fill: '#64748b', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                <Radar
                  name="Interests"
                  dataKey="score"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-6 space-y-4">
            {chartData.sort((a,b) => b.score - a.score).slice(0, 3).map((d, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: DOMAIN_COLORS[d.fullDomain as InterestDomain] }} />
                  <span className="font-medium text-slate-700">{d.fullDomain}</span>
                </div>
                <span className="font-bold text-blue-600">{d.score}/10</span>
              </div>
            ))}
          </div>
        </div>

        {/* Career Recommendations */}
        <div className="lg:col-span-7 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center gap-3">
              <span>⚠️</span> {error}
            </div>
          )}

          {recommendations?.profileSummary && (
            <div className="p-6 bg-blue-50 border border-blue-100 rounded-3xl italic text-blue-800 leading-relaxed shadow-sm">
              <div className="flex items-center gap-2 mb-2 font-bold not-italic">
                <Sparkles size={18} className="text-blue-600" /> AI Insights
              </div>
              "{recommendations.profileSummary}"
            </div>
          )}

          <div className="grid grid-cols-1 gap-8">
            {recommendations?.topCareers.map((career, i) => (
              <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 transition-all hover:translate-y-[-4px]">
                <div className="p-8">
                  <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-1">
                        <Briefcase size={16} /> {career.domain}
                      </div>
                      <h3 className="text-3xl font-extrabold text-slate-900">{career.role}</h3>
                    </div>
                    <div className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-bold text-lg">
                      {career.matchScore}% Match
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-8 leading-relaxed text-lg">{career.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Target size={18} className="text-blue-500" /> Core Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.map((skill, j) => (
                          <span key={j} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium border border-slate-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Map size={18} className="text-blue-500" /> Certifications
                      </h4>
                      <ul className="text-slate-600 space-y-1">
                        {career.certifications.map((cert, j) => (
                          <li key={j} className="text-sm">• {cert}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-6">
                      <ChevronRight size={18} className="text-blue-500" /> Your Roadmap
                    </h4>
                    <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
                      {career.roadmap.map((step, j) => (
                        <div key={j} className="relative">
                          <div className="absolute -left-10 top-1 w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                          <div className="flex justify-between items-baseline mb-1">
                            <h5 className="font-bold text-slate-900 text-lg">{step.title}</h5>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">{step.timeframe}</span>
                          </div>
                          <p className="text-slate-500 leading-relaxed">{step.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <footer className="mt-24 pt-12 border-t border-slate-200 text-center text-slate-400 pb-12">
        <p className="mb-2">© 2025 CareerMap Project Team</p>
        <p className="text-xs uppercase tracking-widest">Amal Jyothi College of Engineering</p>
      </footer>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-100">
      {state === 'landing' && <LandingPage />}
      {state === 'assessment' && <Assessment />}
      {state === 'loading' && <Loading />}
      {state === 'results' && <Results />}
    </div>
  );
};

export default App;
