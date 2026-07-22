import { useContext, useEffect, useState } from 'react';
import { Sparkles, RefreshCw, TrendingUp, TrendingDown, Minus, AlertCircle, Lightbulb } from 'lucide-react';
import { ThemeContext } from '../../context/ThemeContext';
import { useAIAnalysis } from '../../context/AIAnalysisContext';

const trendIcon = (trend) => {
  switch (trend) {
    case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
    case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
    case 'plateauing': return <Minus className="w-4 h-4 text-amber-500" />;
    default: return null;
  }
};

const trendColor = (trend, theme) => {
  switch (trend) {
    case 'improving': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
    case 'declining': return theme === 'dark' ? 'text-red-400' : 'text-red-600';
    case 'plateauing': return theme === 'dark' ? 'text-amber-400' : 'text-amber-600';
    default: return theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  }
};

const weightColor = (weight, theme) => {
  if (weight >= 8) return theme === 'dark' ? 'bg-red-900/30 text-red-400 border-red-800' : 'bg-red-50 text-red-700 border-red-200';
  if (weight >= 5) return theme === 'dark' ? 'bg-amber-900/30 text-amber-400 border-amber-800' : 'bg-amber-50 text-amber-700 border-amber-200';
  return theme === 'dark' ? 'bg-blue-900/30 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200';
};

export default function AIReport() {
  const { theme } = useContext(ThemeContext);
  const { aiAnalysis, loadingAnalysis, analysisError, hasFetched, fetchAnalysis } = useAIAnalysis();
  const [showAllPoints, setShowAllPoints] = useState(false);

  useEffect(() => {
    if (!hasFetched && !loadingAnalysis) {
      fetchAnalysis(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cardClasses = `rounded-xl p-6 ${theme === 'dark'
    ? 'bg-gray-800 border border-gray-700'
    : 'bg-white border border-gray-200 shadow-sm'
    }`;

  const subtleText = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const chipBg = theme === 'dark' ? 'bg-gray-700/40' : 'bg-gray-50/60';

  return (
    <div className={cardClasses}>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold">AI Report</h2>
            <p className={`text-sm ${subtleText}`}>Diagnosis of your weak topics, rating trend and consistency</p>
          </div>
        </div>

        <button
          onClick={() => fetchAnalysis(true)}
          disabled={loadingAnalysis}
          className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed ${theme === 'dark'
            ? 'bg-gray-700/60 border-gray-600 hover:bg-gray-700 text-gray-200'
            : 'bg-gray-50 border-gray-300 hover:bg-gray-100 text-gray-700'
            }`}
        >
          <RefreshCw className={`w-4 h-4 ${loadingAnalysis ? 'animate-spin' : ''}`} />
          {loadingAnalysis ? 'Analyzing...' : 'Regenerate'}
        </button>
      </div>

      {loadingAnalysis && !aiAnalysis && (
        <div className={`flex items-center gap-2 py-8 justify-center ${subtleText}`}>
          <RefreshCw className="w-4 h-4 animate-spin" />
          Generating your personalized report...
        </div>
      )}

      {!loadingAnalysis && analysisError && !aiAnalysis && (
        <div className={`flex items-start gap-2 p-4 rounded-lg ${theme === 'dark' ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-700'}`}>
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-sm">{analysisError}</span>
        </div>
      )}

      {aiAnalysis && (
        <div className="space-y-6">
          {analysisError && (
            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${theme === 'dark' ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-700'}`}>
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {/* Summary */}
          {aiAnalysis.summary && (
            <p className="text-sm leading-relaxed">{aiAnalysis.summary}</p>
          )}

          {/* Strengths */}
          {aiAnalysis.strengths?.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${subtleText}`}>Strengths</h3>
              <div className="flex flex-wrap gap-2">
                {aiAnalysis.strengths.map((s, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-xs font-medium ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weak Topics */}
          {aiAnalysis.weakTopics?.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${subtleText}`}>Weak Topics</h3>
              <div className="space-y-3">
                {aiAnalysis.weakTopics.map((w, i) => (
                  <div key={i} className={`p-3 rounded-lg ${chipBg}`}>
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <span className="font-medium text-sm">{w.topic}</span>
                    </div>
                    {w.reason && <p className={`text-xs mt-0.5 mb-2 ${subtleText}`}>{w.reason}</p>}
                    <div className="flex flex-wrap gap-1.5">
                      {w.tags?.map((t, ti) => (
                        <span
                          key={ti}
                          title="Exact tag used to filter your SmartSheet"
                          className={`px-2 py-0.5 rounded-md text-xs font-mono border flex items-center gap-1 ${weightColor(t.weight, theme)}`}
                        >
                          {t.tag}
                          <span className="opacity-70">·{t.weight}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rating Analysis */}
          {aiAnalysis.ratingAnalysis && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${subtleText}`}>Rating Trend</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {Object.entries(aiAnalysis.ratingAnalysis).map(([platform, info]) => (
                  info?.trend && info.trend !== 'no-data' ? (
                    <div key={platform} className={`p-3 rounded-lg ${chipBg}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium capitalize">{platform}</span>
                        {trendIcon(info.trend)}
                      </div>
                      <span className={`text-xs font-semibold capitalize ${trendColor(info.trend, theme)}`}>{info.trend}</span>
                      {info.note && <p className={`text-xs mt-1 ${subtleText}`}>{info.note}</p>}
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Consistency */}
          {(aiAnalysis.consistencyAnalysis?.note || aiAnalysis.consistencyAnalysis?.recommendation) && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${subtleText}`}>Consistency</h3>
              <div className={`p-3 rounded-lg ${chipBg} space-y-1`}>
                {aiAnalysis.consistencyAnalysis.note && <p className="text-sm">{aiAnalysis.consistencyAnalysis.note}</p>}
                {aiAnalysis.consistencyAnalysis.recommendation && (
                  <p className={`text-xs flex items-start gap-1.5 ${subtleText}`}>
                    <Lightbulb className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {aiAnalysis.consistencyAnalysis.recommendation}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Key Points */}
          {aiAnalysis.keyPoints?.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-2 ${subtleText}`}>Key Points</h3>
              <ul className="space-y-1.5">
                {(showAllPoints ? aiAnalysis.keyPoints : aiAnalysis.keyPoints.slice(0, 4)).map((k, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{k}</span>
                  </li>
                ))}
              </ul>
              {aiAnalysis.keyPoints.length > 4 && (
                <button
                  onClick={() => setShowAllPoints(!showAllPoints)}
                  className={`text-xs font-medium mt-2 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
                >
                  {showAllPoints ? 'Show less' : `Show ${aiAnalysis.keyPoints.length - 4} more`}
                </button>
              )}
            </div>
          )}

          {aiAnalysis.lastUpdated && (
            <p className={`text-xs ${subtleText}`}>
              Last generated {new Date(aiAnalysis.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
