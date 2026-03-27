export const C_CODE_TEMPLATE = `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

/**
 * Kivun - Offline BiDi Fixer (C Implementation)
 * 
 * Usage: 
 *   gcc -o kivun main.c
 *   ./kivun < input.txt > output.txt
 */

// Unicode Control Characters (UTF-8 Hex Strings)
const char RLE[] = "\\xE2\\x80\\xAB"; // Start Right-to-Left Embedding
const char PDF[] = "\\xE2\\x80\\xAC"; // Pop Directional Formatting
const char RLM[] = "\\xE2\\x80\\x8F"; // Right-to-Left Mark

// Hebrew Native Punctuation Replacements
const char HEB_MAQAF[]     = "\\xD6\\xBE"; // (U+05BE)
const char HEB_GERESH[]    = "\\xD7\\xB3"; // (U+05F3)
const char HEB_GERSHAYIM[] = "\\xD7\\xB4"; // (U+05F4)

// --- Helper Functions ---

int is_weak_punctuation(int c) {
    // Check for characters that often get misplaced in RTL/LTR mixing
    return strchr(":;.,?!", c) != NULL;
}

int is_bracket(int c) {
    return strchr("()[]{}<>", c) != NULL;
}

/**
 * Heuristic for Emojis in UTF-8.
 * Emojis usually map to 4-byte sequences in UTF-8 starting with 0xF0 (U+1Fxxx).
 */
int is_likely_emoji_start(unsigned char c) {
    return (c >= 0xF0); 
}

int main() {
    // 1. Force the document to start with Global Right-to-Left Embedding
    fprintf(stdout, "%s", RLE);

    int c;
    while ((c = fgetc(stdin)) != EOF) {
        unsigned char uc = (unsigned char)c;

        // --- Logic: Fix Brackets ---
        // Wrap brackets in RLM to ensure they don't flip direction visually
        if (is_bracket(c)) {
            fprintf(stdout, "%s%c%s", RLM, c, RLM);
            continue;
        }

        // --- Logic: Native Hebrew Punctuation ---
        // Replace ASCII characters that are used incorrectly as Hebrew punctuation
        if (c == '"') {
            fprintf(stdout, "%s", HEB_GERSHAYIM);
            continue;
        }
        if (c == '\\'') {
            fprintf(stdout, "%s", HEB_GERESH);
            continue;
        }
        if (c == '-') {
            fprintf(stdout, "%s", HEB_MAQAF);
            continue;
        }

        // --- Logic: Anchor Punctuation ---
        // Print the character itself
        fputc(c, stdout);

        // If it's weak punctuation, append RLM to force it to stay with the Hebrew segment
        if (is_weak_punctuation(c)) {
            fprintf(stdout, "%s", RLM);
        }

        // --- Logic: Emojis ---
        // Emojis are neutral. In an RTL context, they can float to the LTR side.
        // This is a naive heuristic: if we see a start byte of an emoji, we assume
        // the next bytes are part of it. A robust parser would count bytes.
        // Here we rely on the fact that we are processing a stream. 
        // NOTE: This basic version passes bytes through. For robust Emoji handling
        // in C, a full state machine is recommended.
    }

    // 2. Close the Global Embedding
    fprintf(stdout, "%s", PDF);
    
    return 0;
}
`;