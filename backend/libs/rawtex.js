/**
 * Try to parse JSON from a (possibly noisy) text output from a model.
 * Returns parsed object/array, or null if not found.
 */
export const tryParseJSONFromText = (raw) => {
    const text = raw
        .replace(/\r/g, "")
        .replace(/\u0000/g, "")
        .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "")
        .replace(/\u2028|\u2029/g, "")
        .trim();

    // 1) If there's a fenced ```json block, extract its inner content (prefer it).
    const fencedJsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fencedJsonMatch) {
        const candidate = fencedJsonMatch[1].trim();
        try {
            return JSON.parse(candidate);
        } catch (e) {
            // fallthrough to more robust attempts
            console.warn("Failed parsing fenced JSON, will try heuristics:", e.message);
        }
    }

    // 2) If the model returned something like: "```...```Some trailing text"
    //    try to extract first {...} or [...] block via brute-force bracket matching

    const firstBrace = text.search(/[\{\[]/);
    if (firstBrace === -1) return null;

    // Collect candidate end indexes (positions of '}' or ']') after firstBrace
    const candidates = [];
    for (let i = firstBrace; i < text.length; i++) {
        const ch = text[i];
        if (ch === "}" || ch === "]") candidates.push(i);
    }

    // Try progressive substrings from firstBrace to each candidate end (from nearest to farthest)
    for (let j = 0; j < candidates.length; j++) {
        const endIdx = candidates[j];
        const candidate = text.slice(firstBrace, endIdx + 1);
        try {
            const parsed = JSON.parse(candidate);
            return parsed;
        } catch (e) {
            // continue trying
        }
    }

    // 3) Try a reversed order (longer candidate first) — sometimes inner braces produce success only later
    for (let k = candidates.length - 1; k >= 0; k--) {
        const endIdx = candidates[k];
        const candidate = text.slice(firstBrace, endIdx + 1);
        try {
            const parsed = JSON.parse(candidate);
            return parsed;
        } catch (e) {
            // continue trying
        }
    }

    // 4) Heuristic replacement: if JSON uses single quotes for keys/strings, attempt to convert to double quotes.
    //    WARNING: this is heuristic and might break complex cases. Use only as last-resort.
    const singleQuoteCandidate = text.slice(firstBrace).trim();
    if (/^[\{\[]/.test(singleQuoteCandidate)) {
        // naive convert single quotes to double quotes for keys and simple string values
        const swapped = singleQuoteCandidate
            .replace(/(['"])?([a-zA-Z0-9_]+)\1\s*:/g, (_, q, key) => `"${key}":`) // keys without quotes -> quoted
            .replace(/'([^']*)'/g, (_, s) => JSON.stringify(s)); // 'value' -> "value"

        try {
            const parsed = JSON.parse(swapped);
            return parsed;
        } catch (e) {
            console.warn("Heuristic single-quote -> double-quote failed:", e.message);
        }
    }

    // nothing worked
    return null;
}



