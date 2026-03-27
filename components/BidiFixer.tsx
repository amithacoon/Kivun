
import React, { useState, useRef } from 'react';
import {
  Check, Eraser, Eye, EyeOff, ClipboardCopy, BarChart3,
  Zap, ArrowRightLeft, Hash, HelpCircle, Globe2, Cpu, Monitor
} from 'lucide-react';
import { statsService } from '../services/statsService';
import {
    LANGUAGE_FACTS,
    getWordFriendlyHtml,
    getHebrewOfficeHtml,
    processContent,
    FixStats
} from '../utils/bidiProcessor';

export const BidiFixer: React.FC = () => {
  const [outputText, setOutputText] = useState<string>('');
  const [outputRichHtml, setOutputRichHtml] = useState<string>('');
  const [stats, setStats] = useState<FixStats | null>(null);
  const [activeFact, setActiveFact] = useState<typeof LANGUAGE_FACTS[0] | null>(null);
  const [copied, setCopied] = useState<'rich' | 'rich-heb' | 'plain' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRawInput, setShowRawInput] = useState(false);
  const [viewMode, setViewMode] = useState<'raw' | 'formatted'>('formatted');

  const inputRef = useRef<HTMLDivElement>(null);
  const outputFormattedRef = useRef<HTMLDivElement>(null);
  const [charCount, setCharCount] = useState(0);

  const handleInput = () => {
    if (inputRef.current) setCharCount(inputRef.current.innerText.length);
  };

  const handleFix = () => {
    const currentHtml = inputRef.current?.innerHTML || '';
    const plainText = inputRef.current?.innerText || '';
    if (plainText.length > 10000) {
      alert('הטקסט ארוך מדי. אנא הגבל את הקלט ל-10,000 תווים.');
      return;
    }
    setIsProcessing(true);
    const randomFact = LANGUAGE_FACTS[Math.floor(Math.random() * LANGUAGE_FACTS.length)];
    setTimeout(() => {
      const result = processContent(currentHtml);
      statsService.updateStats(result.stats.totalChars, result.stats.replaced + result.stats.anchored).catch(console.error);
      setOutputText(result.text);
      setOutputRichHtml(result.html);
      setStats(result.stats);
      setActiveFact(randomFact);
      setViewMode('formatted');
      setIsProcessing(false);
    }, 400);
  };

  const handleCopyRich = async () => {
    try {
      const richContent = outputFormattedRef.current?.innerHTML || outputRichHtml;
      const wordHtml = getWordFriendlyHtml(richContent);
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([wordHtml], { type: 'text/html' }),
        'text/plain': new Blob([outputText], { type: 'text/plain' }),
      })]);
      setCopied('rich');
      setTimeout(() => setCopied(null), 2000);
    } catch { handleCopyPlain(); }
  };

  const handleCopyRichHebrew = async () => {
    try {
      const richContent = outputFormattedRef.current?.innerHTML || outputRichHtml;
      const wordHtml = getHebrewOfficeHtml(richContent);
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([wordHtml], { type: 'text/html' }),
        'text/plain': new Blob([outputText], { type: 'text/plain' }),
      })]);
      setCopied('rich-heb');
      setTimeout(() => setCopied(null), 2000);
    } catch { alert("העתקה נכשלה"); }
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(outputText);
    setCopied('plain');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-0 max-w-4xl mx-auto pb-20 overflow-x-hidden">

      {/* INPUT LABEL */}
      <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
        <span>// input — mixed text</span>
        <div className="flex gap-4">
          <button
            onClick={() => setShowRawInput(!showRawInput)}
            className="text-slate-400 hover:text-amber-600 transition-colors flex items-center gap-1.5"
          >
            {showRawInput ? <EyeOff size={12} /> : <Eye size={12} />}
            {showRawInput ? 'NORMAL' : 'RAW'}
          </button>
          <button
            onClick={() => {
              if (inputRef.current) inputRef.current.innerHTML = '';
              setOutputText(''); setOutputRichHtml(''); setStats(null); setActiveFact(null); setCharCount(0);
            }}
            className="text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors"
          >
            <Eraser size={12} /> CLEAR
          </button>
        </div>
      </div>

      {/* INPUT EDITOR */}
      <div
        ref={inputRef}
        contentEditable
        onInput={handleInput}
        className="editor-content border-[1.5px] border-[#0a0a0a] dark:border-slate-600 min-h-[160px] p-5 text-base leading-[1.75] text-[#0a0a0a] dark:text-slate-100 focus:outline-none max-h-[400px] overflow-y-auto bg-white dark:bg-slate-800 transition-colors"
        dir={showRawInput ? 'ltr' : 'rtl'}
        style={{ textAlign: showRawInput ? 'left' : 'right' }}
        spellCheck={false}
      />

      {/* CHAR COUNT */}
      <div className="flex justify-end py-1.5">
        <span className={`font-mono text-[10px] tracking-wider ${charCount > 10000 ? 'text-red-500 font-bold' : 'text-slate-300 dark:text-slate-600'}`}>
          {charCount.toLocaleString()} / 10,000
        </span>
      </div>

      {/* ACTION BUTTON */}
      <div className="flex justify-center py-5">
        <button
          onClick={handleFix}
          disabled={isProcessing}
          className="bg-[#0a0a0a] dark:bg-white hover:bg-[#1a1a1a] dark:hover:bg-slate-100 text-white dark:text-[#0a0a0a] px-12 py-4 font-mono text-xs font-semibold tracking-[3px] uppercase flex items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isProcessing
            ? <span className="animate-spin text-base">⌛</span>
            : <span className="text-amber-600 text-lg leading-none">⇄</span>
          }
          Fix Hebrew Direction
        </button>
      </div>

      {/* OUTPUT LABEL */}
      <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
        <span>// output — processed</span>
        <div className="flex">
          <button
            onClick={() => setViewMode('formatted')}
            className={`font-mono text-[10px] font-semibold tracking-[2px] px-3 py-1 border border-slate-200 dark:border-slate-700 transition-colors ${
              viewMode === 'formatted'
                ? 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] border-[#0a0a0a] dark:border-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            FORMATTED
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`font-mono text-[10px] font-semibold tracking-[2px] px-3 py-1 border border-slate-200 dark:border-slate-700 transition-colors ${
              viewMode === 'raw'
                ? 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] border-[#0a0a0a] dark:border-white'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            UNICODE RAW
          </button>
        </div>
      </div>

      {/* OUTPUT AREA */}
      <div className="border-[1.5px] border-[#0a0a0a] dark:border-slate-600 border-r-4 border-r-amber-600 min-h-[160px] relative bg-white dark:bg-slate-800 transition-colors">
        {viewMode === 'raw' ? (
          <div
            className="p-5 font-mono text-sm text-slate-500 dark:text-slate-400 min-h-[160px] max-h-[400px] whitespace-pre-wrap overflow-auto select-all bg-slate-50/50 dark:bg-slate-800 transition-colors"
            dir="ltr"
          >
            {outputText}
          </div>
        ) : (
          <div
            ref={outputFormattedRef}
            contentEditable
            className="p-6 text-[#0a0a0a] dark:text-slate-100 text-lg leading-[1.75] min-h-[160px] max-h-[400px] overflow-y-auto focus:outline-none transition-colors"
            dir="rtl"
            dangerouslySetInnerHTML={{ __html: outputRichHtml }}
          />
        )}
        {!outputRichHtml && !outputText && !isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-300 dark:text-slate-700 pointer-events-none">
            <span className="italic font-mono text-xs tracking-wider">הטקסט המיוצב יופיע כאן</span>
          </div>
        )}
      </div>

      {/* COPY BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-2 mt-3">
        <div className="flex-[2] flex flex-col gap-2">
          <button
            onClick={handleCopyRich}
            disabled={!outputRichHtml && !outputText}
            className={`w-full flex items-center justify-center gap-3 py-4 font-mono text-[10px] font-semibold tracking-[2px] uppercase transition-all active:scale-[0.98] disabled:opacity-30 ${
              copied === 'rich'
                ? 'bg-amber-600 text-white'
                : 'bg-[#0a0a0a] dark:bg-white text-white dark:text-[#0a0a0a] hover:bg-[#1a1a1a] dark:hover:bg-slate-100'
            }`}
          >
            {copied === 'rich'
              ? <Check size={16} />
              : <span className="text-amber-600 text-base leading-none">⇄</span>
            }
            {copied === 'rich' ? 'Copied!' : 'Copy to Word'}
          </button>
          <button
            onClick={handleCopyRichHebrew}
            disabled={!outputRichHtml && !outputText}
            className="w-full flex items-center justify-center gap-2 py-2 font-mono text-[10px] font-semibold tracking-[1.5px] uppercase border-[1.5px] border-slate-200 dark:border-slate-700 hover:border-amber-600 text-slate-400 hover:text-amber-600 transition-all active:scale-[0.98] disabled:opacity-30 bg-white dark:bg-[#0a0a0a]"
          >
            {copied === 'rich-heb' ? <Check size={12} className="text-amber-600" /> : <Monitor size={12} />}
            {copied === 'rich-heb' ? 'Copied!' : 'Hebrew Office (Bold Fix)'}
          </button>
        </div>
        <button
          onClick={handleCopyPlain}
          disabled={!outputText}
          className={`flex-1 flex items-center justify-center gap-2 py-4 font-mono text-[10px] font-semibold tracking-[2px] uppercase border-[1.5px] transition-all active:scale-[0.98] disabled:opacity-30 ${
            copied === 'plain'
              ? 'border-amber-600 text-amber-600 bg-amber-50 dark:bg-amber-900/10'
              : 'border-[#0a0a0a] dark:border-slate-600 text-[#0a0a0a] dark:text-slate-300 bg-white dark:bg-[#0a0a0a] hover:bg-slate-50 dark:hover:bg-slate-900'
          }`}
        >
          {copied === 'plain' ? <Check size={16} /> : <ClipboardCopy size={16} />}
          Plain Text
        </button>
      </div>

      {/* STATS DASHBOARD */}
      <div className={`transition-all duration-500 overflow-hidden ${stats ? 'max-h-[1200px] opacity-100 mt-10' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="space-y-0">

          {/* Analysis Header */}
          <div className="font-mono text-[10px] font-semibold tracking-[3px] uppercase text-slate-400 dark:text-slate-500 py-3 border-t-2 border-[#0a0a0a] dark:border-slate-600 flex items-center gap-2 transition-colors">
            <BarChart3 size={12} /> // processing report
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 border-r border-slate-200 dark:border-slate-800">
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <Hash size={18} className="text-slate-300 dark:text-slate-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.totalChars || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">chars processed</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <ArrowRightLeft size={18} className="text-amber-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.replaced || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">replacements</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <Zap size={18} className="text-amber-600 mb-2" />
              <span className="block font-serif text-3xl font-black text-[#0a0a0a] dark:text-white tracking-tight transition-colors">{stats?.anchored || 0}</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400">anchors</span>
            </div>
            <div className="p-5 border-l border-b border-slate-200 dark:border-slate-800 transition-colors">
              <span className="block font-serif text-3xl font-black text-amber-600 tracking-tight">{(stats?.interventionRate || 0).toFixed(1)}%</span>
              <span className="font-mono text-[9px] font-semibold tracking-[2px] uppercase text-slate-400 mt-5 block">readability</span>
            </div>
          </div>

          {/* Fact Card */}
          {activeFact && (
            <div className="border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row gap-5 items-center md:items-start relative overflow-hidden mt-4 transition-colors">
              <div className="bg-[#0a0a0a] dark:bg-white p-3 text-white dark:text-[#0a0a0a] shrink-0">
                <HelpCircle size={24} />
              </div>
              <div className="space-y-2 text-center md:text-right">
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <h4 className="font-serif font-bold text-[#0a0a0a] dark:text-white transition-colors">הידעת?</h4>
                  <span className="text-amber-600 font-mono text-[9px] font-semibold tracking-[2px] uppercase border border-amber-600/30 px-2 py-0.5">
                    {activeFact.title}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors">
                  {activeFact.content}
                </p>
              </div>
              <div className="absolute -left-4 -bottom-4 opacity-[0.03] rotate-12 pointer-events-none">
                <Globe2 size={100} />
              </div>
            </div>
          )}

          <div className="flex justify-center items-center gap-2 opacity-20 py-8">
            <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
            <Cpu size={14} className="text-slate-400 dark:text-slate-600" />
            <div className="w-1 h-1 bg-slate-400 dark:bg-slate-600 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
