
import React, { useState, useRef } from 'react';
import { 
  Check, Eraser, Eye, EyeOff, ClipboardCopy, Wand2, BarChart3, Languages, Globe2, 
  Zap, ArrowRightLeft, Hash, Sparkles, HelpCircle, Smile, FileText, Cpu, Monitor
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
      if (inputRef.current) {
          setCharCount(inputRef.current.innerText.length);
      }
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
        
        // Async update (fire and forget to not block UI)
        statsService.updateStats(result.stats.totalChars, result.stats.replaced + result.stats.anchored)
            .catch(console.error);
        
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
        const data = [new ClipboardItem({
            'text/html': new Blob([wordHtml], { type: 'text/html' }),
            'text/plain': new Blob([outputText], { type: 'text/plain' }),
        })];
        await navigator.clipboard.write(data);
        setCopied('rich');
        setTimeout(() => setCopied(null), 2000);
    } catch (err) {
        handleCopyPlain();
    }
  };

  // Dedicated handler for Hebrew Office users
  const handleCopyRichHebrew = async () => {
    try {
        const richContent = outputFormattedRef.current?.innerHTML || outputRichHtml;
        const wordHtml = getHebrewOfficeHtml(richContent);
        const data = [new ClipboardItem({
            'text/html': new Blob([wordHtml], { type: 'text/html' }),
            'text/plain': new Blob([outputText], { type: 'text/plain' }),
        })];
        await navigator.clipboard.write(data);
        setCopied('rich-heb');
        setTimeout(() => setCopied(null), 2000);
    } catch (err) {
        console.error(err);
        alert("העתקה נכשלה");
    }
  };

  const handleCopyPlain = () => {
    navigator.clipboard.writeText(outputText);
    setCopied('plain');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto pb-20 overflow-x-hidden">
      
      {/* INPUT AREA */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden transition-all hover:shadow-md">
        <div className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 px-5 py-3 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Languages size={16} className="text-blue-500" />
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">טקסט מקור מעורב 📝</span>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setShowRawInput(!showRawInput)} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-xs flex items-center gap-1.5">
                    {showRawInput ? <EyeOff size={14} /> : <Eye size={14} />} {showRawInput ? 'תצוגה רגילה' : 'תצוגת קוד'}
                </button>
                <button onClick={() => {if(inputRef.current) inputRef.current.innerHTML = ''; setOutputText(''); setOutputRichHtml(''); setStats(null); setActiveFact(null); setCharCount(0);}} className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1.5 transition-colors">
                    <Eraser size={14} /> נקה
                </button>
            </div>
        </div>
        <div 
            ref={inputRef}
            contentEditable
            onInput={handleInput}
            className="editor-content min-h-[180px] p-6 text-lg leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none max-h-[400px] overflow-y-auto"
            dir={showRawInput ? "ltr" : "rtl"}
            style={{ textAlign: showRawInput ? 'left' : 'right' }}
            spellCheck={false}
        />
        <div className="bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 px-5 py-2 flex justify-end items-center">
            <span className={`text-xs font-mono ${charCount > 10000 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                {charCount.toLocaleString()} / 10,000
            </span>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-center -my-4 z-10 relative gap-3">
         <button 
            onClick={handleFix} 
            disabled={isProcessing} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full shadow-xl flex items-center gap-3 font-black transition-all active:scale-95 hover:scale-105 disabled:opacity-70 group overflow-hidden"
         >
            <div className={`absolute inset-0 bg-white/20 transition-transform duration-1000 ${isProcessing ? 'translate-x-full' : '-translate-x-full'}`} />
            {isProcessing ? <span className="animate-spin text-xl">⌛</span> : <Wand2 size={24} className="group-hover:rotate-12 transition-transform" />}
            שנה לעברית תקינה
         </button>
      </div>

      {/* OUTPUT AREA */}
      <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
              <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800/50 p-1 rounded-lg">
                  <button onClick={() => setViewMode('formatted')} className={`px-5 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'formatted' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                      תצוגה מעובדת
                  </button>
                  <button onClick={() => setViewMode('raw')} className={`px-5 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'raw' ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                      תווי יוניקוד
                  </button>
              </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden shadow-lg relative min-h-[200px] transition-all">
             {viewMode === 'raw' ? (
                 <div className="p-6 font-mono text-sm text-slate-600 dark:text-slate-400 bg-slate-50/50 dark:bg-slate-950/50 min-h-[200px] max-h-[400px] whitespace-pre-wrap overflow-auto select-all" dir="ltr">
                     {outputText}
                 </div>
             ) : (
                 <div 
                    ref={outputFormattedRef}
                    contentEditable
                    className="p-8 text-slate-900 dark:text-slate-100 text-xl leading-relaxed min-h-[200px] max-h-[400px] overflow-y-auto focus:outline-none selection:bg-blue-100 dark:selection:bg-blue-900/40"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: outputRichHtml }}
                 />
             )}
             
             {!outputRichHtml && !outputText && !isProcessing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 pointer-events-none p-10 text-center gap-4">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
                        <Smile size={24} />
                    </div>
                    <span className="italic font-medium text-slate-400 dark:text-slate-600">הטקסט המיוצב יופיע כאן...</span>
                </div>
             )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch">
               
               {/* Main Copy Area with Sub-option */}
               <div className="flex-[2] flex flex-col gap-2">
                   <button
                        onClick={handleCopyRich}
                        disabled={!outputRichHtml && !outputText}
                        className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black transition-all shadow-xl active:translate-y-1 active:shadow-md disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-400 ${copied === 'rich' ? 'bg-blue-600 text-white' : 'bg-slate-900 dark:bg-slate-700 text-white hover:bg-slate-800 dark:hover:bg-slate-600'}`}
                   >
                        {copied === 'rich' ? <Check size={22} className="animate-in zoom-in" /> : <FileText size={22} />}
                        {copied === 'rich' ? 'מוכן להדבקה!' : 'העתקה ל-Word'}
                   </button>
                   
                   {/* Specific Hebrew Office Fix - NOW A CUTE THIN BUTTON */}
                   <button
                        onClick={handleCopyRichHebrew}
                        disabled={!outputRichHtml && !outputText}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-300 shadow-sm active:scale-95 active:shadow-none`}
                   >
                        {copied === 'rich-heb' ? <Check size={14} className="text-green-500" /> : <Monitor size={14} />}
                        {copied === 'rich-heb' ? <span className="text-green-600 dark:text-green-400">הועתק בהצלחה!</span> : 'לגרסת Office בעברית (תיקון Bold)'}
                   </button>
               </div>

               {/* Plain Text Button */}
               <button
                    onClick={handleCopyPlain}
                    disabled={!outputText}
                    className={`flex-1 flex items-center justify-center gap-2 py-5 h-[64px] rounded-2xl font-bold transition-all border-2 active:translate-y-1 ${copied === 'plain' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-700 dark:text-emerald-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'}`}
               >
                    {copied === 'plain' ? <Check size={20} /> : <ClipboardCopy size={20} />}
                    טקסט נקי
               </button>
          </div>
      </div>

      {/* DASHBOARD */}
      <div className={`transition-all duration-700 ease-in-out overflow-hidden ${stats ? 'max-h-[1200px] opacity-100 mt-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <div className="space-y-6">
              
              {/* Analysis Header */}
              <div className="flex items-center gap-3 px-1">
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-600 font-bold text-[10px] uppercase tracking-widest px-3">
                      <BarChart3 size={14} /> דוח עיבוד תווים
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                      <Hash size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats?.totalChars || 0}</span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">תווים עובדו</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                      <ArrowRightLeft size={24} className="text-blue-500 mb-2" />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats?.replaced || 0}</span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">החלפות לוגיות</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                      <Zap size={24} className="text-amber-500 mb-2" />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{stats?.anchored || 0}</span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">עוגני כיוון</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
                      <Sparkles size={24} className="text-emerald-500 mb-2" />
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{(stats?.interventionRate || 0).toFixed(1)}%</span>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase">שיפור קריאות</span>
                  </div>
              </div>

              {/* Fact Card */}
              {activeFact && (
                  <div className="bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900/30 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row gap-5 items-center md:items-start group transition-all hover:shadow-md relative overflow-hidden">
                      <div className="bg-blue-600 dark:bg-blue-500 p-3.5 rounded-2xl text-white shadow-lg shrink-0 group-hover:rotate-6 transition-transform z-10">
                          <HelpCircle size={28} />
                      </div>
                      <div className="space-y-2 text-center md:text-right z-10">
                          <div className="flex flex-col md:flex-row items-center gap-3">
                              <h4 className="font-black text-slate-900 dark:text-slate-100 text-base">הידעת?</h4>
                              <span className="text-blue-600 dark:text-blue-300 px-3 py-1 bg-blue-50 dark:bg-blue-900/40 rounded-full text-[10px] font-bold border border-blue-100 dark:border-blue-900/50 uppercase tracking-wide">
                                  {activeFact.title}
                              </span>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                              {activeFact.content}
                          </p>
                      </div>
                      <div className="absolute -left-4 -bottom-4 opacity-[0.03] dark:opacity-[0.05] rotate-12 pointer-events-none">
                        <Globe2 size={120} className="dark:text-white" />
                      </div>
                  </div>
              )}

              {/* Bottom Decoration */}
              <div className="flex justify-center items-center gap-2 opacity-20 py-8">
                  <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
                  <Cpu size={16} className="text-slate-400 dark:text-slate-600" />
                  <div className="w-1.5 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full" />
              </div>
          </div>
      </div>
    </div>
  );
};
