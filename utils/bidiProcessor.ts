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
  { title: "הפונט דוד (David)", content: "הגופן הנפוץ 'דוד' עוצב ב-1954 ע״י איתמר דוד. אין לו באמת גרסת Bold (מודגש) מקורית; המחשב פשוט מעבה את הקווים מתמטית, מה שלעיתים מעוות את האותיות." },
  { title: "Word ו-RTL", content: "Microsoft Word תומך ב-RTL מאז גרסה 97, אך עד היום הפורמט הפנימי (.docx) שומר את הכיוון כ-attribute בשם 'bidi' בתוך ה-XML — שם שנחשב 'ארכאי' אפילו בתוך מיקרוסופט עצמה." },
  { title: "QWERTY בעברית", content: "פריסת מקלדת עברית תקנית (SI-1452) לא תואמת את QWERTY לפי הגיון פונטי. היא הותאמה בעיקר לנוחות ידיים של מדפיסות בשנות ה-60 שכבר ידעו להקליד באנגלית." },
  { title: "GPT ועברית", content: "מודלי שפה גדולים כמו GPT אומנו על כמות עצומה של טקסט אנגלי. כתוצאה מכך, כשהם מייצרים עברית, הסימני פיסוק שלהם מוצבים לפי לוגיקה של LTR — ולכן רוב הפלט שלהם זקוק לתיקון BiDi." },
  { title: "Unicode נקודה אחת", content: "כל תו ביוניקוד מזוהה ב-'Code Point'. לעברית יש Code Points בטווח U+0590 עד U+05FF. אך בפועל, ישנם תווים עבריים נוספים פזורים בטווח U+FB1D עד U+FB4E (צורות מיוחדות)." },
  { title: "מקלדת AZERTY בעברית", content: "בצרפת, מקלדות ברירת המחדל הן AZERTY ולא QWERTY. יהודים צרפתים שעלו לישראל לעיתים הקליקו לפי פריסה שונה, מה שגרם לבלגן בהגדרות מקלדת עברית-צרפתית עד שנות ה-2000." },
  { title: "Gemini ועברית RTL", content: "Gemini של גוגל, שאומן על נתונים רבים יותר בשפות שמיות, עדיין מייצר שגיאות BiDi בפלט בעברית — בעיקר כשמדובר בשילוב של מספרים, אנגלית ועברית באותו משפט." },
  { title: "DOCX הוא ZIP", content: "קובץ .docx הוא בעצם ארכיון ZIP. אפשר לשנות את הסיומת ל-.zip, לפתוח אותו, ולמצוא בפנים קבצי XML שמכילים את כל הטקסט, הסגנונות, והכיווניות של המסמך." },
  { title: "ניקוד בפיסוק", content: "בעברית, נקודות כגון שווא נע או קמץ משנות את הצליל — אך לא את הכיווניות. יוניקוד מגדיר אותן כתווים 'Non-Spacing Mark' שיורשים את הכיוון מהתו שלפניהם." },
  { title: "PDF ועברית", content: "פורמט PDF לא שומר כיווניות טקסט ישירות. כשמעתיקים טקסט עברי מ-PDF, הוא לעיתים מגיע הפוך לחלוטין — כי ה-PDF שומר תווים בסדר ויזואלי ולא לוגי." },
  { title: "מקלדת Dvorak", content: "פריסת Dvorak, שתוכננה ב-1936 להפחתת עייפות הידיים, כמעט ולא אומצה. לא קיימת גרסת Dvorak עברית רשמית, אם כי חלק מהאקרים ישראלים יצרו אחת בעצמם." },
  { title: "Claude ועברית", content: "Claude של Anthropic מייצר עברית ברמה טובה יחסית, אך עדיין נוטה לשים סימן שאלה (?), ג'רשיים (\") ואפוסטרוף (') בצד הלא נכון של ביטוי — בדיוק הבעיה שKivun מתקן." },
  { title: "Ctrl+Shift ב-Windows", content: "ב-Windows, קיצור המקלדת Ctrl+Shift מחליף כיוון הקלדה בין RTL ל-LTR בתוכנות כמו Word ו-Outlook. משתמשים רבים לוחצים עליו בטעות ותוהים למה כל הטקסט שלהם הפך פתאום לאנגלית." },
  { title: "בינה מלאכותית וסוגריים", content: "כשמודל AI כותב '(ראה סעיף 3)', הסוגר הסוגר ( ) ממוקם ב-Unicode כ'Mirrored Character'. בתצוגת RTL הוא אמור להתהפך אוטומטית — אך לא כל רנדרר מממש זאת נכון." },
  { title: "מקש Caps Lock בעברית", content: "במקלדות עבריות ישנות (לפני Windows XP), Caps Lock הגדיל אותיות אנגליות אך החליף גם לעברית בגרסאות מסוימות. כיום, Alt+Shift הוא הקיצור הרשמי להחלפת שפה ב-Windows." },
  { title: "OpenAI ו-Nikud", content: "ChatGPT לעיתים מוסיף ניקוד לעברית שלא ביקשת. זה קורה כי ניקוד מגדיל את דיוק ייצוג הסמנטיקה בטוקנים, וה-tokenizer לפעמים 'מוצא' ניקוד במידע האימון בלי כוונה." },
  { title: "מקש 'גל' (תו הגג)", content: "תו ^ (Caret) בעברית משמש לפעמים כסימון בלתי רשמי לדגש חזק. אך ב-Unicode, הדגש האמיתי הוא תו U+05BC (דגש), שנכתב מעל האות ואינו גורם לשום בעיית כיוון." },
  { title: "מחרוזת ריקה ב-Word", content: "Word מייצג פסקה ריקה כ-XML: <w:p><w:pPr><w:jc w:val='right'/></w:pPr></w:p>. אם משאירים את ה-jc ריק, Word בגרסה עברית יישר לימין, אבל Word בגרסה אנגלית — לשמאל." },
  { title: "הEmbedding של שפות שמיות", content: "מחקר מ-2023 הראה שמודלי שפה מייצגים עברית וערבית ב'מרחב וקטורי' קרוב זה לזה — ולכן לפעמים Claude מערב ביניהן כשמייצר טקסט RTL ארוך ומורכב." },
  { title: "Bidi Override", content: "יוניקוד מכיל תווי RLE ,LRE ,RLO ,LRO שמאפשרים לאכוף כיוון. תוקפים השתמשו בהם כדי להסתיר קוד זדוני בשמות קבצים — כך ש-'exe.txt' בפועל הוצג כ-'txt.exe' ב-Windows Explorer." },
  { title: "Word 2007 ו-Unicode", content: "Word 2007 היה הגרסה הראשונה שתמכה מלאה ב-Unicode BMP (Basic Multilingual Plane). לפניה, לא ניתן היה להכניס אימוג'ים או תווים נדירים ישירות לטקסט — הם פשוט הוחלפו בריבועים ריקים." }
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

    // Grapheme-aware segmenter: prevents splitting surrogate pairs (emojis)
    // and compound emoji sequences (ZWJ families, skin tones, flags)
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' });

    // 4. Process Each Node with Global Context
    for (const { node, start } of nodeMap) {
        const text = (node.nodeValue || "").replace(/\u00A0/g, ' ');
        let resultText = "";

        for (const { segment: char, index: segIdx } of segmenter.segment(text)) {
            const globalIndex = start + segIdx;
            const prevChar = globalText[globalIndex - 1];
            const nextChar = globalText[globalIndex + char.length];

            // --- Logic: Dashes (Em-dash / En-dash) ---
            if (char === '—' || char === '–') {
                const prevStrong = getGlobalStrongDir(globalIndex, 'prev');
                const nextStrong = getGlobalStrongDir(globalIndex, 'next');
                if (prevStrong === 'hebrew' || nextStrong === 'hebrew') {
                    resultText += HEB_MAQAF;
                    totalReplaced++;
                } else {
                    resultText += char; // Keep original in non-Hebrew context
                }
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
                resultText += HEB_MAQAF; // Always use proper Hebrew Maqaf
                if (char === '-') totalReplaced++;
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
