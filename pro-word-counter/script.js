document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const wordCountEl = document.getElementById("wordCount");
    const charCountEl = document.getElementById("charCount");
    const sentenceCountEl = document.getElementById("sentenceCount");
    const paragraphCountEl = document.getElementById("paragraphCount");
    const readingTimeEl = document.getElementById("readingTime");
    const keywordListEl = document.getElementById("keywordList");

    // Added English, Marathi, and Hindi common words to filter out
    const commonWords = new Set([
        "the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me",
        "आहे", "व", "आणि", "ते", "हे", "की", "या", "तर", "हा", "ही", "ची", "चा", "चे", "ला",
        "है", "और", "कि", "यह", "से", "को", "का", "की", "में", "के", "एक", "हैं", "तो"
    ]);

    function analyzeText() {
        const text = textInput.value;
        charCountEl.textContent = text.length;
        
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountEl.textContent = wordCount;
        
        // Added Hindi Danda (।) and double Danda (॥) for sentence calculation
        const sentences = text.split(/[.!?।॥]+/).filter(s => s.trim().length > 0);
        sentenceCountEl.textContent = text.length === 0 ? 0 : sentences.length;
        
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        paragraphCountEl.textContent = text.length === 0 ? 0 : paragraphs.length;

        const readingTimeMins = Math.ceil(wordCount / 200);
        readingTimeEl.textContent = wordCount === 0 ? "0 min" : `${readingTimeMins} min${readingTimeMins > 1 ? 's' : ''}`;

        if (words.length === 0) {
            keywordListEl.innerHTML = '<li class="empty-msg">No words to analyze yet.</li>';
            return;
        }

        const wordFreq = {};
        words.forEach(w => {
            // \p{L} matches any kind of letter from any language globally.
            let cw = w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
            if (cw.length > 1 && !commonWords.has(cw)) {
                wordFreq[cw] = (wordFreq[cw] || 0) + 1;
            }
        });

        const sorted = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]).slice(0, 5);
        if (sorted.length === 0) {
            keywordListEl.innerHTML = '<li class="empty-msg">No valid keywords found.</li>';
            return;
        }

        keywordListEl.innerHTML = '';
        sorted.forEach(kw => {
            keywordListEl.innerHTML += `<li><span>${kw}</span> <span class="keyword-count">${wordFreq[kw]}</span></li>`;
        });
    }

    textInput.addEventListener("input", analyzeText);
    
    document.getElementById("uppercaseBtn").addEventListener("click", () => { 
        textInput.value = textInput.value.toUpperCase(); 
        analyzeText(); 
    });
    
    document.getElementById("lowercaseBtn").addEventListener("click", () => { 
        textInput.value = textInput.value.toLowerCase(); 
        analyzeText(); 
    });
    
    document.getElementById("titlecaseBtn").addEventListener("click", () => { 
        textInput.value = textInput.value.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '); 
        analyzeText(); 
    });
    
    document.getElementById("clearBtn").addEventListener("click", () => { 
        textInput.value = ""; 
        analyzeText(); 
        textInput.focus(); 
    });
    
    analyzeText();
});
