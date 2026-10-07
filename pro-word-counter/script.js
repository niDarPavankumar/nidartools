document.addEventListener("DOMContentLoaded", () => {
    const textInput = document.getElementById("textInput");
    const wordCountEl = document.getElementById("wordCount");
    const charCountEl = document.getElementById("charCount");
    const sentenceCountEl = document.getElementById("sentenceCount");
    const paragraphCountEl = document.getElementById("paragraphCount");
    const readingTimeEl = document.getElementById("readingTime");
    const keywordListEl = document.getElementById("keywordList");

    const commonWords = new Set(["the","be","to","of","and","a","in","that","have","i","it","for","not","on","with","he","as","you","do","at","this","but","his","by","from","they","we","say","her","she","or","an","will","my","one","all","would","there","their","what","so","up","out","if","about","who","get","which","go","me"]);

    function analyzeText() {
        const text = textInput.value;
        charCountEl.textContent = text.length;
        
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountEl.textContent = wordCount;
        
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
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
            let cw = w.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (cw.length > 2 && !commonWords.has(cw)) {
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
