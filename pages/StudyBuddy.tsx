
import React, { useState } from 'react';
import * as geminiService from '../services/geminiService';
import type { StudyGuide } from '../services/geminiService';
import Spinner from '../components/common/Spinner';
import { SparklesIcon, LightBulbIcon, DocumentTextIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';


const StudyBuddy: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [studyGuide, setStudyGuide] = useState<StudyGuide | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!inputText.trim()) {
            setError('Please enter some text to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setStudyGuide(null);
        try {
            const result = await geminiService.generateStudyGuide(inputText);
            setStudyGuide(result);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <SparklesIcon className="w-16 h-16 text-brand-primary mx-auto mb-2"/>
                <h1 className="text-3xl font-extrabold text-dark-text-primary">AI-Powered Study Buddy</h1>
                <p className="text-dark-text-secondary mt-2">Paste your lecture notes or any text to get a summary, key points, and practice questions.</p>
            </div>
            
            <div className="bg-dark-card border border-dark-border rounded-xl p-6 mb-8">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste your text here..."
                    className="w-full h-48 bg-gray-900 border border-dark-border rounded-lg p-4 focus:ring-2 focus:ring-brand-primary focus:outline-none transition"
                    rows={10}
                />
                <button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center mt-4 bg-brand-primary text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-500"
                >
                    {isLoading ? 'Generating...' : 'Generate Study Guide'}
                </button>
                {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>

            {isLoading && <Spinner />}

            {studyGuide && (
                <div className="space-y-8 animate-fade-in">
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                        <h2 className="text-xl font-bold flex items-center mb-4"><DocumentTextIcon className="w-6 h-6 mr-2 text-brand-secondary"/>Summary</h2>
                        <p className="text-dark-text-secondary leading-relaxed">{studyGuide.summary}</p>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                        <h2 className="text-xl font-bold flex items-center mb-4"><LightBulbIcon className="w-6 h-6 mr-2 text-brand-secondary"/>Key Points</h2>
                        <ul className="list-disc list-inside space-y-2 text-dark-text-secondary">
                            {studyGuide.keyPoints.map((point, index) => <li key={index}>{point}</li>)}
                        </ul>
                    </div>
                    <div className="bg-dark-card border border-dark-border rounded-xl p-6">
                        <h2 className="text-xl font-bold flex items-center mb-4"><QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-brand-secondary"/>Practice Questions</h2>
                        <div className="space-y-4">
                            {studyGuide.practiceQuestions.map((qa, index) => (
                                <div key={index} className="border-b border-dark-border pb-2">
                                    <p className="font-semibold text-dark-text-primary">{qa.question}</p>
                                    <p className="text-sm text-green-400 mt-1">Answer: {qa.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyBuddy;
