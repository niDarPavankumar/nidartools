/* =========================================================
   Pro PDF Editor — UI & Core Engine (Phase 2)
   NamoCrux UI + pdf.js (Render) + pdf-lib (Edit/Export)
   ========================================================= */
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // Global Top Tools
    const topTools = document.querySelectorAll(".t-btn");
    
    // UI Elements
    const openPdfBtn = document.getElementById("openPdfBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const pdfInput = document.getElementById("pdfInput");
    const uploadPrompt = document.getElementById("uploadPrompt");
    const pdfDocumentWrapper = document.getElementById("pdfDocumentWrapper");
    const renderCanvas = document.getElementById("mainRenderCanvas");
    const ctx = renderCanvas.getContext("2d");
    const thumbnailsTrack = document.getElementById("thumbnailsTrack");
    
    // Contextual Panel
    const contextualPanel = document.getElementById("contextualPanel");
    const closeContextBtn = document.getElementById("closeContext");
    const contextTitle = document.getElementById("contextTitle");

    // Engine State
    let currentFile = null;
    let pdfDocView = null; 
    let editPdfDoc = null; 
    let currentPageNum = 1;
    let isRendering = false;

    /* --- 1. Global Toolbar --- */
    topTools.forEach(btn => {
        btn.addEventListener("click", () => {
            topTools.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    /* --- 2. Load PDF Engine --- */
    openPdfBtn.addEventListener("click", () => pdfInput.click());
    
    pdfInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if(file && file.type === "application/pdf") {
            currentFile = file;
            await loadPdfEngine(file);
        } else {
            alert("Please select a valid PDF file.");
        }
    });

    async function loadPdfEngine(file) {
        try {
            // UI States
            uploadPrompt.style.display = "none";
            pdfDocumentWrapper.style.display = "block";
            contextualPanel.style.display = "none";
            
            const arrayBuffer = await file.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);

            // Load for Editing (pdf-lib)
            editPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

            // Load for Viewing (pdf.js)
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            pdfDocView = await loadingTask.promise;

            generateRealThumbnails();
            currentPageNum = 1;
            await renderPage(currentPageNum);

        } catch (error) {
            console.error("Error loading PDF:", error);
            alert("Error loading PDF. It might be encrypted or corrupted.");
        }
    }

    /* --- 3. Render Page (Canvas) --- */
    async function renderPage(num) {
        if (isRendering || !pdfDocView) return;
        isRendering = true;

        try {
            const page = await pdfDocView.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 }); // Pro-level resolution
            
            renderCanvas.height = viewport.height;
            renderCanvas.width = viewport.width;

            // Fit wrapper to canvas exactly
            pdfDocumentWrapper.style.width = `${viewport.width}px`;
            pdfDocumentWrapper.style.height = `${viewport.height}px`;

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
        } catch (error) {
            console.error("Render Error:", error);
        } finally {
            isRendering = false;
        }
    }

    /* --- 4. Generate Real Thumbnails --- */
    function generateRealThumbnails() {
        thumbnailsTrack.innerHTML = ""; 
        
        for(let i = 1; i <= pdfDocView.numPages; i++) {
            const thumb = document.createElement("div");
            thumb.className = `thumb-item ${i === currentPageNum ? 'selected' : ''}`;
            thumb.innerHTML = `
                <span style="color:#cbd5e1; font-size:24px;">📄</span>
                <span class="thumb-number">Page ${i}</span>
            `;
            
            thumb.addEventListener("click", async () => {
                // UI Selection
                document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("selected"));
                thumb.classList.add("selected");
                
                // Engine Action
                currentPageNum = i;
                await renderPage(currentPageNum);
                
                // Trigger Contextual Menu
                openContextualMenu(`Page ${i}`);
            });
            
            thumbnailsTrack.appendChild(thumb);
        }
    }

    /* --- 5. Contextual Menu Actions (The Pro Feature) --- */
    function openContextualMenu(targetName) {
        contextTitle.textContent = `${targetName} Selected`;
        contextualPanel.style.display = "flex";
    }

    closeContextBtn.addEventListener("click", () => {
        contextualPanel.style.display = "none";
        document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("selected"));
    });

    // Wire up Engine Tools (Rotate & Delete)
    const actionBtns = document.querySelectorAll('.c-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            if(!editPdfDoc) return;
            const actionText = btn.textContent.trim().toLowerCase();

            try {
                if(actionText.includes('rotate')) {
                    const pages = editPdfDoc.getPages();
                    const page = pages[currentPageNum - 1];
                    page.setRotation(PDFLib.degrees(page.getRotation().angle + 90));
                    await reloadEngineAfterEdit();
                } 
                else if(actionText.includes('delete')) {
                    if (pdfDocView.numPages <= 1) return alert("Cannot delete the last page.");
                    if (confirm(`Delete Page ${currentPageNum}?`)) {
                        editPdfDoc.removePage(currentPageNum - 1);
                        await reloadEngineAfterEdit();
                    }
                }
                else {
                    // For remaining tools in the menu
                    alert(`${actionText} tool logic will be mapped in Phase 3.`);
                }
            } catch(e) {
                console.error("Action error:", e);
            }
        });
    });

    async function reloadEngineAfterEdit() {
        contextualPanel.style.display = "none";
        const savedBytes = await editPdfDoc.save();
        const updatedBlob = new Blob([savedBytes], { type: 'application/pdf' });
        const updatedFile = new File([updatedBlob], currentFile.name, { type: 'application/pdf' });
        
        // Reload engine with modified file
        await loadPdfEngine(updatedFile);
    }

    /* --- 6. Export / Download --- */
    exportPdfBtn.addEventListener("click", async () => {
        if (!editPdfDoc) return alert("Please open a PDF first.");
        
        try {
            exportPdfBtn.textContent = "Saving...";
            const pdfBytes = await editPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `niDar_Pro_${currentFile.name}`;
            link.click();
            exportPdfBtn.innerHTML = "⬇ Export";
        } catch(e) {
            console.error("Export Error:", e);
            alert("Error exporting PDF.");
        }
    });

});
