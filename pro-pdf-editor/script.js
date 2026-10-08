/* =========================================================
   Pro PDF Editor — UI Controller (Phase 1)
   Architecture: Prepares for modular engine injection
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Global Top Tools
    const topTools = document.querySelectorAll(".t-btn");
    
    // Upload & Render Elements
    const openPdfBtn = document.getElementById("openPdfBtn");
    const pdfInput = document.getElementById("pdfInput");
    const uploadPrompt = document.getElementById("uploadPrompt");
    const pdfDocumentWrapper = document.getElementById("pdfDocumentWrapper");
    const thumbnailsTrack = document.getElementById("thumbnailsTrack");
    
    // Contextual Panel
    const contextualPanel = document.getElementById("contextualPanel");
    const closeContextBtn = document.getElementById("closeContext");
    const contextTitle = document.getElementById("contextTitle");

    let isFileLoaded = false;

    /* --- 1. Global Toolbar Logic --- */
    topTools.forEach(btn => {
        btn.addEventListener("click", () => {
            topTools.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            
            // In Phase 2: This will notify engine/text-editor.js or annotations.js
            console.log(`Tool Selected: ${btn.dataset.category}`);
        });
    });

    /* --- 2. File Upload Simulation (Prep for engine/pdf-renderer.js) --- */
    openPdfBtn.addEventListener("click", () => pdfInput.click());
    
    pdfInput.addEventListener("change", (e) => {
        if(e.target.files.length > 0) {
            simulatePdfLoad(e.target.files[0].name);
        }
    });

    function simulatePdfLoad(filename) {
        isFileLoaded = true;
        uploadPrompt.style.display = "none";
        pdfDocumentWrapper.style.display = "block";
        
        // Setup dummy dimensions for canvas wrapper to visualize
        pdfDocumentWrapper.style.width = "600px";
        pdfDocumentWrapper.style.height = "800px";
        
        generateThumbnails(5); // Simulate 5 pages
    }

    /* --- 3. Bottom Thumbnails Logic (Prep for engine/page-manager.js) --- */
    function generateThumbnails(pageCount) {
        thumbnailsTrack.innerHTML = ""; // Clear empty state
        
        for(let i = 1; i <= pageCount; i++) {
            const thumb = document.createElement("div");
            thumb.className = "thumb-item";
            thumb.innerHTML = `
                <span style="color:#cbd5e1; font-size:24px;">📄</span>
                <span class="thumb-number">Page ${i}</span>
            `;
            
            thumb.addEventListener("click", () => {
                // Clear active states
                document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("selected"));
                thumb.classList.add("selected");
                
                // Open Contextual Menu for this page
                openContextualMenu(`Page ${i}`);
            });
            
            thumbnailsTrack.appendChild(thumb);
        }
    }

    /* --- 4. Contextual Menu Logic --- */
    function openContextualMenu(targetName) {
        contextTitle.textContent = `${targetName} Selected`;
        contextualPanel.style.display = "flex";
    }

    closeContextBtn.addEventListener("click", () => {
        contextualPanel.style.display = "none";
        document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("selected"));
    });

});
