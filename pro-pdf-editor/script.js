pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const topTools = document.querySelectorAll(".t-btn");
    const openPdfBtn = document.getElementById("openPdfBtn");
    const exportPdfBtn = document.getElementById("exportPdfBtn");
    const pdfInput = document.getElementById("pdfInput");
    const uploadPrompt = document.getElementById("uploadPrompt");
    const pdfDocumentWrapper = document.getElementById("pdfDocumentWrapper");
    const thumbnailsTrack = document.getElementById("thumbnailsTrack");
    const contextualPanel = document.getElementById("contextualPanel");
    const closeContextBtn = document.getElementById("closeContext");

    let currentFile = null;
    let pdfDocView = null; 
    let editPdfDoc = null; 
    let currentPageNum = 1;
    let isRendering = false;
    let currentTool = "select";
    let addedElements = []; 

    pdfDocumentWrapper.innerHTML = ""; 
    const renderCanvas = document.createElement("canvas");
    renderCanvas.id = "mainRenderCanvas";
    renderCanvas.style.display = "block";
    
    const canvasContainer = document.createElement("div");
    canvasContainer.id = "canvasContainer";
    canvasContainer.style.position = "relative";
    canvasContainer.style.display = "inline-block";
    canvasContainer.style.boxShadow = "0 18px 45px rgba(15, 23, 42, .15)";
    
    canvasContainer.appendChild(renderCanvas);
    pdfDocumentWrapper.appendChild(canvasContainer);
    const ctx = renderCanvas.getContext("2d");

    // --- Formatting Toolbar ---
    const fmtToolbar = document.createElement("div");
    fmtToolbar.className = "formatting-toolbar";
    fmtToolbar.innerHTML = `
        <input type="color" id="fmtColor" class="fmt-input-color" value="#000000" title="Text Color">
        <input type="number" id="fmtSize" class="fmt-input-size" value="16" min="8" max="72" title="Font Size">
        <button id="fmtBold" class="fmt-btn" style="font-weight:bold;">B</button>
        <button id="fmtItalic" class="fmt-btn" style="font-style:italic;">I</button>
        <button id="fmtDelete" class="fmt-btn" style="color:#ef4444;">🗑</button>
    `;
    canvasContainer.appendChild(fmtToolbar);
    
    let activeTextElement = null;

    // Formatting Actions
    document.getElementById("fmtColor").addEventListener("input", (e) => {
        if(activeTextElement) activeTextElement.style.color = e.target.value;
    });
    document.getElementById("fmtSize").addEventListener("input", (e) => {
        if(activeTextElement) activeTextElement.style.fontSize = e.target.value + "px";
    });
    document.getElementById("fmtBold").addEventListener("click", () => {
        if(activeTextElement) {
            const isBold = activeTextElement.style.fontWeight === "bold";
            activeTextElement.style.fontWeight = isBold ? "normal" : "bold";
        }
    });
    document.getElementById("fmtItalic").addEventListener("click", () => {
        if(activeTextElement) {
            const isItalic = activeTextElement.style.fontStyle === "italic";
            activeTextElement.style.fontStyle = isItalic ? "normal" : "italic";
        }
    });
    document.getElementById("fmtDelete").addEventListener("click", () => {
        if(activeTextElement) {
            // Remove from DOM
            activeTextElement.remove();
            // Remove from tracking array
            addedElements = addedElements.filter(el => el.element !== activeTextElement);
            hideFormattingToolbar();
        }
    });

    function showFormattingToolbar(el) {
        activeTextElement = el;
        fmtToolbar.style.top = (parseInt(el.style.top) - 45) + "px";
        fmtToolbar.style.left = el.style.left;
        fmtToolbar.classList.add("show");
        
        // Sync toolbar values with element
        document.getElementById("fmtColor").value = rgbToHex(el.style.color) || "#000000";
        document.getElementById("fmtSize").value = parseInt(el.style.fontSize) || 16;
    }
    
    function hideFormattingToolbar() {
        fmtToolbar.classList.remove("show");
        activeTextElement = null;
    }

    // Helper for color sync
    function rgbToHex(rgb) {
        if(!rgb || rgb.indexOf('rgb') === -1) return rgb;
        const rgbVals = rgb.match(/\d+/g);
        if(!rgbVals) return "#000000";
        return "#" + rgbVals.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    // --- Toolbar Logic ---
    topTools.forEach(btn => {
        btn.addEventListener("click", () => {
            topTools.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            currentTool = btn.dataset.category;
            
            // If switching away from select, hide formatting
            if(currentTool !== "select") hideFormattingToolbar();
        });
    });

    // --- File Loading ---
    openPdfBtn.addEventListener("click", () => pdfInput.click());
    
    pdfInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if(file && file.type === "application/pdf") {
            currentFile = file;
            await loadPdfEngine(file);
        }
    });

    async function loadPdfEngine(file) {
        try {
            uploadPrompt.style.display = "none";
            pdfDocumentWrapper.style.display = "block";
            contextualPanel.style.display = "none";
            
            const arrayBuffer = await file.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);

            editPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            pdfDocView = await loadingTask.promise;

            addedElements = [];
            canvasContainer.querySelectorAll('.draggable-text').forEach(e => e.remove());
            hideFormattingToolbar();

            generateRealThumbnails();
            currentPageNum = 1;
            await renderPage(currentPageNum);
        } catch (error) {
            console.error(error);
            alert("Error loading PDF.");
        }
    }

    async function renderPage(num) {
        if (isRendering || !pdfDocView) return;
        isRendering = true;
        hideFormattingToolbar();

        try {
            const page = await pdfDocView.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 });
            
            renderCanvas.height = viewport.height;
            renderCanvas.width = viewport.width;
            
            canvasContainer.style.width = `${viewport.width}px`;
            canvasContainer.style.height = `${viewport.height}px`;

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            // Restore elements for this page
            canvasContainer.querySelectorAll('.draggable-text').forEach(e => e.remove());
            addedElements.forEach(el => {
                if(el.page === num) {
                    canvasContainer.appendChild(el.element);
                }
            });
        } catch (error) {
            console.error(error);
        } finally {
            isRendering = false;
        }
    }

    function generateRealThumbnails() {
        thumbnailsTrack.innerHTML = ""; 
        for(let i = 1; i <= pdfDocView.numPages; i++) {
            const thumb = document.createElement("div");
            thumb.className = `thumb-item ${i === currentPageNum ? 'selected' : ''}`;
            thumb.innerHTML = `<span style="color:#cbd5e1; font-size:24px;">📄</span><span class="thumb-number">Page ${i}</span>`;
            
            thumb.addEventListener("click", async () => {
                document.querySelectorAll(".thumb-item").forEach(t => t.classList.remove("selected"));
                thumb.classList.add("selected");
                currentPageNum = i;
                await renderPage(currentPageNum);
            });
            thumbnailsTrack.appendChild(thumb);
        }
    }

    // --- Interactive Editing (Text) ---
    canvasContainer.addEventListener("click", (e) => {
        if(!pdfDocView) return;
        
        // Don't trigger if clicking on an existing text box or toolbar
        if(e.target.classList.contains('draggable-text') || e.target.closest('.formatting-toolbar')) {
            return;
        }

        if (currentTool === "text") {
            const rect = canvasContainer.getBoundingClientRect();
            // Calculate accurate position regardless of CSS scaling/zooming
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Use contenteditable div instead of input for multiline support
            const textBox = document.createElement("div");
            textBox.contentEditable = "true";
            textBox.className = "draggable-text";
            textBox.style.left = `${x}px`;
            textBox.style.top = `${y}px`;
            textBox.style.color = "#000000";
            textBox.style.fontSize = "16px";
            
            // Placeholder behavior
            textBox.innerHTML = "Type here...";
            textBox.addEventListener("focus", function() {
                if(this.innerHTML === "Type here...") this.innerHTML = "";
                showFormattingToolbar(this);
            });

            canvasContainer.appendChild(textBox);
            
            // CRITICAL FOR MOBILE: Force focus to open keyboard
            setTimeout(() => { textBox.focus(); }, 100);
            
            makeDraggable(textBox);
            addedElements.push({ type: 'text', element: textBox, page: currentPageNum });
            
            // Switch back to select tool so they can drag it immediately after typing
            currentTool = "select";
            topTools.forEach(t => t.classList.remove("active"));
            document.querySelector('[data-category="select"]').classList.add("active");
        } else {
            hideFormattingToolbar();
        }
    });

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        // Mouse Events
        el.onmousedown = dragMouseDown;
        // Touch Events for Mobile
        el.addEventListener("touchstart", dragTouchStart, {passive: false});

        function dragMouseDown(e) {
            if(currentTool !== "select") return;
            // If they are trying to select text inside to edit, let them
            if(document.activeElement === el) return;
            
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            
            showFormattingToolbar(el);
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            updatePosition();
        }

        function dragTouchStart(e) {
            if(currentTool !== "select" || document.activeElement === el) return;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            document.addEventListener("touchend", closeDragElement);
            document.addEventListener("touchmove", touchDrag, {passive: false});
            showFormattingToolbar(el);
        }

        function touchDrag(e) {
            e.preventDefault(); // Stop scrolling while dragging
            pos1 = pos3 - e.touches[0].clientX;
            pos2 = pos4 - e.touches[0].clientY;
            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;
            updatePosition();
        }

        function updatePosition() {
            let newTop = (el.offsetTop - pos2);
            let newLeft = (el.offsetLeft - pos1);
            
            // Constrain within canvas bounds
            newTop = Math.max(0, Math.min(newTop, renderCanvas.height - el.offsetHeight));
            newLeft = Math.max(0, Math.min(newLeft, renderCanvas.width - el.offsetWidth));

            el.style.top = newTop + "px";
            el.style.left = newLeft + "px";
            
            // Move toolbar with element
            fmtToolbar.style.top = (newTop - 45) + "px";
            fmtToolbar.style.left = newLeft + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            document.removeEventListener("touchend", closeDragElement);
            document.removeEventListener("touchmove", touchDrag);
        }
    }

    // --- Export (Baking Text into PDF) ---
    exportPdfBtn.addEventListener("click", async () => {
        if (!editPdfDoc) return alert("Please open a PDF first.");
        hideFormattingToolbar();
        
        try {
            exportPdfBtn.textContent = "Saving...";
            const pages = editPdfDoc.getPages();
            
            // Embed standard font
            const helveticaFont = await editPdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const helveticaBold = await editPdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
            const helveticaOblique = await editPdfDoc.embedFont(PDFLib.StandardFonts.HelveticaOblique);

            for (const elData of addedElements) {
                if (elData.type === 'text') {
                    const pageIndex = elData.page - 1;
                    const page = pages[pageIndex];
                    const { width, height } = page.getSize();
                    
                    const htmlEl = elData.element;
                    const textVal = htmlEl.innerText || htmlEl.textContent;
                    
                    if(textVal && textVal !== "Type here...") {
                        const elLeft = parseFloat(htmlEl.style.left);
                        const elTop = parseFloat(htmlEl.style.top);
                        const scaleX = width / renderCanvas.width;
                        const scaleY = height / renderCanvas.height;
                        
                        // Accurate PDF positioning
                        const pdfX = elLeft * scaleX;
                        // PDF Y is bottom-up. Add a slight offset for font baseline
                        const pdfY = height - (elTop * scaleY) - (parseInt(htmlEl.style.fontSize) * scaleY);
                        
                        // Parse Color
                        const colorHex = rgbToHex(htmlEl.style.color);
                        const r = parseInt(colorHex.slice(1,3), 16) / 255;
                        const g = parseInt(colorHex.slice(3,5), 16) / 255;
                        const b = parseInt(colorHex.slice(5,7), 16) / 255;

                        // Select Font Weight/Style
                        let selectedFont = helveticaFont;
                        if(htmlEl.style.fontWeight === "bold") selectedFont = helveticaBold;
                        if(htmlEl.style.fontStyle === "italic") selectedFont = helveticaOblique;

                        page.drawText(textVal, {
                            x: pdfX,
                            y: pdfY,
                            size: parseInt(htmlEl.style.fontSize) * scaleY,
                            font: selectedFont,
                            color: PDFLib.rgb(r, g, b),
                        });
                    }
                }
            }

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
            exportPdfBtn.innerHTML = "⬇ Export";
        }
    });

    closeContextBtn.addEventListener("click", () => {
        contextualPanel.style.display = "none";
    });
});
