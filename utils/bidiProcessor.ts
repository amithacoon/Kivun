// Unicode Control Characters
export const RLM = '\u200F';
export const LRM = '\u200E'; // Left-to-Right Mark
export const RLE = '\u202B';
export const PDF = '\u202C';

// Hebrew Native Punctuation
export const HEB_MAQAF = '\u05BE';      // ־
export const HEB_GERESH = '\u05F3';     // ׳
export const HEB_GERSHAYIM = '\u05F4';  // ״

// Expanded set of weak punctuation marks that need RLM anchoring in mixed text
export const WEAK_PUNCTUATION = new Set([
  ':', ';', '.', ',', '?', '!', 
  '-', '–', '—', // Hyphens, En-dash, Em-dash
  '_',           // Underscores
  '/', '\\', '|', // Slashes and pipes
  '@', '#', '*', // Symbols
  '+', '=', '~'  // Math
]);

// Set of opening and closing brackets
export const OPEN_BRACKETS = new Set(['(', '[', '{', '<']);
export const CLOSE_BRACKETS = new Set([')', ']', '}', '>']);

export const LANGUAGE_FACTS = [
  { title: "Emoji Logic", content: "אימוג'ים הם לרוב תווים 'ניטרליים' ביוניקוד. ללא תיקון, הם עלולים לקפוץ לצד הלא נכון של השורה כשהם ממוקמים בסוף משפט בעברית." },
  { title: "Surrogate Pairs", content: "רוב האימוג'ים תופסים 4 בייטים ב-UTF-16. אם עוברים על המחרוזת לפי אינדקס פשוט, עלולים 'לחתוך' אימוג'י לשניים ולגרום לשגיאות תצוגה." },
  { title: "RLM & Emojis", content: "הצמדת RLM לאימוג'י מבטיחה שהוא ייחשב כחלק מההקשר העברי ולא 'ייגרר' אחרי מילה באנגלית שבאה לפניו." },
  { title: "Visual vs Logical", content: "בשנות ה-90 (עידן HTML 3.2), אתרים בעברית נכתבו הפוך (Visual Hebrew) כדי שהדפדפן יציג אותם ישר. הקוד היה נראה כמו 'olleh' במקום 'hello'." },
  { title: "האלגוריתם של יוניקוד (UBA)", content: "תקן ה-BiDi Algorithm של יוניקוד משתרע על פני עשרות עמודי חוקים רק כדי לקבוע איך סימני פיסוק ניטרליים יתנהגו בין שפות שונות." },
  { title: "Zero Width Joiner", content: "התו ZWJ משמש ביוניקוד כדי 'להדביק' אימוג'ים מורכבים. למשל, אימוג'י של משפחה הוא בעצם רצף של: איש + ZWJ + אישה + ZWJ + ילד." },
  { title: "Abjad", content: "עברית מוגדרת כ-'Abjad' – מערכת כתב שבה האותיות מייצגות בעיקר עיצורים. הניקוד (Vowels) הומצא מאוחר יותר בטבריה כדי לשמר את ההגייה הנכונה." },
  { title: "אותיות מנצפ״ך", content: "האותיות הסופיות נוצרו מסיבה גרפית היסטורית: כשכתבו על מגילות קלף, היה קל ומהיר יותר למשוך את הקו כלפי מטה בסוף מילה במקום לעצור ולסגור את האות." },
  { title: "באג ה-Word המפורסם", content: "בגרסאות ישנות של Word, שילוב של סוגריים ומספרים בתוך טקסט עברי גרם לעיתים קרובות להיפוך הסוגר השני. זו הסיבה שרבים התרגלו לכתוב סוגריים הפוכים בכוונה." },
  { title: "הפונט דוד (David)", content: "הגופן הנפוץ 'דוד' עוצב ב-1954 ע״י איתמר דוד. אין לו באמת גרסת Bold (מודגש) מקורית; המחשב פשוט מעבה את הקווים מתמטית, מה שלעיתים מעוות את האותיות." }
];

// Original generator (Best for English Office)
export const getWordFriendlyHtml = (content: string) => {
    return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset="utf-8">
        <title>Document</title>
        <style>
            body { font-family: 'David', 'Arial', sans-serif; font-size: 12pt; direction: rtl; text-align: right; }
            ul, ol { margin-top: 0; margin-bottom: 0; direction: rtl; unicode-bidi: embed; }
            li { direction: rtl; text-align: right; margin-right: 24pt; mso-list-l-id: 1; }
            p { margin: 0; padding: 0; direction: rtl; unicode-bidi: embed; }
        </style>
    </head>
    <body lang="he-IL">
        <div dir="rtl" style="direction: rtl; text-align: right; font-family: 'David', 'Arial', sans-serif; line-height: 1.5;">
            ${content}
        </div>
    </body>
    </html>`.trim();
};

// New generator (Strictly handles Font Weight for Hebrew Office)
export const getHebrewOfficeHtml = (content: string) => {
    return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
        <meta charset="utf-8">
        <title>Document</title>
        <style>
            /* Force font-weight: normal (400) to prevent auto-bolding in Hebrew Office */
            body { font-family: 'David', 'Arial', sans-serif; font-size: 12pt; direction: rtl; text-align: right; font-weight: normal; }
            ul, ol { margin-top: 0; margin-bottom: 0; direction: rtl; unicode-bidi: embed; }
            li { direction: rtl; text-align: right; margin-right: 24pt; mso-list-l-id: 1; font-weight: normal; }
            p { margin: 0; padding: 0; direction: rtl; unicode-bidi: embed; font-weight: normal; }
            b, strong { font-weight: bold; }
        </style>
    </head>
    <body lang="he-IL">
        <div dir="rtl" style="direction: rtl; text-align: right; font-family: 'David', 'Arial', sans-serif; line-height: 1.5; font-weight: normal;">
            ${content}
        </div>
    </body>
    </html>`.trim();
};

export interface FixStats {
    totalChars: number;
    replaced: number;
    anchored: number;
    interventionRate: number;
}

export const isEmoji = (char: string) => /\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}/u.test(char);
export const isHebrew = (char: string | undefined) => char ? char.charCodeAt(0) >= 0x0590 && char.charCodeAt(0) <= 0x05FF : false;
export const isEnglishOrDigit = (char: string | undefined) => char ? /[a-zA-Z0-9]/.test(char) : false;

export const processContent = (html: string): { html: string, text: string, stats: FixStats } => {
    const container = document.createElement('div');
    container.innerHTML = html;

    // 1. Flatten DOM to Text Nodes to allow Global Context Analysis
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
    const textNodes: Node[] = [];
    let n = walker.nextNode();
    while (n) {
        textNodes.push(n);
        n = walker.nextNode();
    }

    // 2. Build Global String Map
    let globalText = "";
    const nodeMap: { node: Node, start: number, end: number }[] = [];
    
    for (const node of textNodes) {
        const val = (node.nodeValue || "").replace(/\u00A0/g, ' '); // Normalize
        nodeMap.push({
            node,
            start: globalText.length,
            end: globalText.length + val.length
        });
        globalText += val;
    }

    // 3. Helper for Global Lookahead/Lookbehind (ignoring newlines/boundaries)
    // OPTIMIZATION: Pre-compute character types to avoid regex/charCodeAt on every lookup
    const charTypes = new Uint8Array(globalText.length);
    const TYPE_NONE = 0;
    const TYPE_HEBREW = 1;
    const TYPE_ENGLISH = 2;
    const TYPE_NEWLINE = 3;

    for (let i = 0; i < globalText.length; i++) {
        const c = globalText[i];
        if (c === '\n' || c === '\r') {
            charTypes[i] = TYPE_NEWLINE;
        } else if (isHebrew(c)) {
            charTypes[i] = TYPE_HEBREW;
        } else if (isEnglishOrDigit(c)) {
            charTypes[i] = TYPE_ENGLISH;
        } else {
            charTypes[i] = TYPE_NONE;
        }
    }

    // OPTIMIZATION: Memoize lookahead/lookbehind results
    const nextStrongCache = new Int32Array(globalText.length).fill(-1);
    const prevStrongCache = new Int32Array(globalText.length).fill(-1);

    const getGlobalStrongDir = (index: number, dir: 'next' | 'prev'): 'hebrew' | 'english' | 'none' => {
        const cache = dir === 'next' ? nextStrongCache : prevStrongCache;
        if (cache[index] !== -1) {
            return cache[index] === TYPE_HEBREW ? 'hebrew' : (cache[index] === TYPE_ENGLISH ? 'english' : 'none');
        }

        let i = index;
        const len = globalText.length;
        const step = dir === 'next' ? 1 : -1;
        
        while (true) {
            i += step;
            if (i < 0 || i >= len) {
                cache[index] = TYPE_NONE;
                return 'none';
            }
            
            const type = charTypes[i];
            if (type === TYPE_NEWLINE) {
                cache[index] = TYPE_NONE;
                return 'none'; // Break context on newline
            }
            if (type === TYPE_HEBREW) {
                cache[index] = TYPE_HEBREW;
                return 'hebrew';
            }
            if (type === TYPE_ENGLISH) {
                cache[index] = TYPE_ENGLISH;
                return 'english';
            }
        }
    };

    let totalReplaced = 0;
    let totalAnchored = 0;
    let fullPlainText = "";

    // 4. Process Each Node with Global Context
    for (const { node, start } of nodeMap) {
        const text = (node.nodeValue || "").replace(/\u00A0/g, ' ');
        let resultText = "";
        
        // Add RLE only at the very start of the first node if needed, 
        // but typically CSS direction:rtl handles this. 
        // We focus on inline fixers here.

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const globalIndex = start + i;
            const prevChar = globalText[globalIndex - 1];
            const nextChar = globalText[globalIndex + 1];

            // --- Logic: Em-dash ---
            if (char === '—') {
                resultText += '-';
                totalReplaced++;
                continue;
            }

            // --- Logic: Brackets ---
            if (OPEN_BRACKETS.has(char)) {
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');
                
                if (nextStrong === 'english') {
                    // Start of English Segment -> Enforce LTR
                    // RLM closes any potential previous Hebrew context.
                    // LRM starts the English context immediately before the bracket.
                    resultText += RLM + LRM + char; 
                    totalAnchored += 2;
                } else {
                    // Standard Hebrew Bracket -> Enforce RTL
                    resultText += RLM + char;
                    totalAnchored++;
                }
                continue;
            }

            if (CLOSE_BRACKETS.has(char)) {
                const prevStrong = getGlobalStrongDir(globalIndex, 'prev');
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');

                if (prevStrong === 'english') {
                    // Closing an English segment
                    if (nextStrong === 'english') {
                        // English continues... (e.g. "(A) and (B)")
                        resultText += char + LRM;
                        totalAnchored++;
                    } else {
                        // English ends, Hebrew/Punctuation follows.
                        // Force Close LTR (LRM) then Force RTL (RLM).
                        // This ensures that commas/periods after the bracket are treated as RTL punctuation.
                        resultText += char + LRM + RLM;
                        totalAnchored += 2;
                    }
                } else {
                    // Hebrew segment closing
                    resultText += char + RLM;
                    totalAnchored++;
                }
                continue;
            }

            // --- Logic: Smart Quotes ---
            if (char === '"') {
                const prevStrong = getGlobalStrongDir(globalIndex, 'prev');
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');

                if (prevStrong === 'english' && nextStrong === 'english') {
                    // It's likely an English quote (e.g. "English Text")
                    resultText += '"';
                } else {
                    resultText += HEB_GERSHAYIM;
                    totalReplaced++;
                }
                continue;
            } else if (char === "'") {
                const prevStrong = getGlobalStrongDir(globalIndex, 'prev');
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');

                if (prevStrong === 'english' && nextStrong === 'english') {
                    // It's likely an English apostrophe (e.g. "Occam's") or single quote
                    resultText += "'";
                } else {
                    resultText += HEB_GERESH;
                    totalReplaced++;
                }
                continue;
            } 

            // --- Logic: Hyphens ---
            if ((char === '-' || char === HEB_MAQAF) && isHebrew(prevChar) && isHebrew(nextChar)) {
                resultText += char;
                continue;
            }

            // Default: Keep char
            resultText += char;

            // --- Logic: Punctuation Anchoring ---
            if (isEmoji(char)) {
                resultText += RLM;
                totalAnchored++;
                continue;
            }

            if (WEAK_PUNCTUATION.has(char)) {
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');

                if (nextStrong === 'english') continue; // Let LTR flow
                if (nextStrong === 'hebrew') continue;  // Let RTL flow (Hebrew pulls it)

                // If End of Line or Unknown -> Anchor to RTL
                resultText += RLM;
                totalAnchored++;
            }
        }

        node.nodeValue = resultText;
        fullPlainText += resultText;
    }

    const totalChars = globalText.length;
    const interventionRate = totalChars > 0 ? ((totalReplaced + totalAnchored) / totalChars) * 100 : 0;

    return { 
        html: container.innerHTML, 
        text: fullPlainText, 
        stats: { totalChars, replaced: totalReplaced, anchored: totalAnchored, interventionRate } 
    };
};
