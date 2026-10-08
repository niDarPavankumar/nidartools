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

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/png, image/jpeg, image/jpg";
    imageInput.style.display = "none";
    document.body.appendChild(imageInput);

    // --- Advanced Signature Modal ---
    const sigModal = document.createElement("div");
    sigModal.className = "signature-modal";
    sigModal.innerHTML = `
        <div class="signature-content" style="width: 90%; max-width: 450px;">
            <h3 style="margin-top:0; margin-bottom:15px;">Create Signature</h3>
            
            <div class="sig-tabs">
                <button class="sig-tab active" data-tab="draw">Draw</button>
                <button class="sig-tab" data-tab="type">Type</button>
                <button class="sig-tab" data-tab="upload">Upload</button>
            </div>
            
            <div id="panel-draw" class="sig-panel active">
                <canvas id="sigPadCanvas" width="400" height="180" style="border: 2px dashed #cbd5e1; background: #f8fafc; cursor: crosshair; width: 100%;"></canvas>
                <button id="clearSigBtn" class="action-btn" style="margin-top:10px; width:100%;">Clear Drawing</button>
            </div>
            
            <div id="panel-type" class="sig-panel">
                <input type="text" id="sigTypeInput" class="sig-type-input" placeholder="Type your name here...">
                <p style="font-size:12px; color:#64748b;">This will be converted into a digital signature.</p>
            </div>
            
            <div id="panel-upload" class="sig-panel">
                <div id="sigUploadArea" class="sig-upload-box">
                    <span style="font-size:24px;">📁</span><br>
                    Tap to upload signature image
                </div>
                <input type="file" id="sigActualUpload" accept="image/*" style="display:none;">
            </div>

            <div style="display:flex; justify-content:flex-end; margin-top:20px; gap:10px;">
                <button id="cancelSigBtn" class="action-btn">Cancel</button>
                <button id="saveSigBtn" class="action-btn primary">Add Signature</button>
            </div>
        </div>
    `;
    document.body.appendChild(sigModal);

    // Signature Tab Switching
    const sigTabs = document.querySelectorAll('.sig-tab');
    const sigPanels = document.querySelectorAll('.sig-panel');
    let activeSigMethod = 'draw';
    let uploadedSigDataUrl = null;

    sigTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sigTabs.forEach(t => t.classList.remove('active'));
            sigPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.dataset.tab;
            document.getElementById(`panel-${target}`).classList.add('active');
            activeSigMethod = target;
        });
    });

    // Drawing Logic
    const sigPadCanvas = document.getElementById("sigPadCanvas");
    const sigCtx = sigPadCanvas.getContext("2d");
    let isDrawing = false;
    
    function getTouchPos(canvasDom, touchEvent) {
        var rect = canvasDom.getBoundingClientRect();
        return { x: touchEvent.touches[0].clientX - rect.left, y: touchEvent.touches[0].clientY - rect.top };
    }
    sigPadCanvas.addEventListener("mousedown", (e) => { isDrawing = true; sigCtx.beginPath(); sigCtx.moveTo(e.offsetX, e.offsetY); });
    sigPadCanvas.addEventListener("mousemove", (e) => { if(isDrawing) { sigCtx.lineTo(e.offsetX, e.offsetY); sigCtx.stroke(); }});
    sigPadCanvas.addEventListener("mouseup", () => { isDrawing = false; });
    sigPadCanvas.addEventListener("touchstart", (e) => { e.preventDefault(); isDrawing = true; const pos = getTouchPos(sigPadCanvas, e); sigCtx.beginPath(); sigCtx.moveTo(pos.x, pos.y); }, {passive: false});
    sigPadCanvas.addEventListener("touchmove", (e) => { e.preventDefault(); if(isDrawing) { const pos = getTouchPos(sigPadCanvas, e); sigCtx.lineTo(pos.x, pos.y); sigCtx.stroke(); }}, {passive: false});
    sigPadCanvas.addEventListener("touchend", () => { isDrawing = false; });
    document.getElementById("clearSigBtn").addEventListener("click", () => sigCtx.clearRect(0, 0, sigPadCanvas.width, sigPadCanvas.height));

    // Upload Logic for Signature
    const sigUploadArea = document.getElementById("sigUploadArea");
    const sigActualUpload = document.getElementById("sigActualUpload");
    sigUploadArea.addEventListener("click", () => sigActualUpload.click());
    sigActualUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedSigDataUrl = event.target.result;
                sigUploadArea.innerHTML = `<img src="${uploadedSigDataUrl}" style="max-width:100%; max-height:120px;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Save Signature Button
    document.getElementById("cancelSigBtn").addEventListener("click", () => sigModal.style.display = "none");
    document.getElementById("saveSigBtn").addEventListener("click", () => {
        let finalDataUrl = null;
        
        if(activeSigMethod === 'draw') {
            finalDataUrl = sigPadCanvas.toDataURL("image/png");
        } 
        else if (activeSigMethod === 'type') {
            const typedText = document.getElementById("sigTypeInput").value;
            if(!typedText) return alert("Please type your signature.");
            // Create a temporary canvas to draw the typed text as an image
            const tempCanvas = document.createElement("canvas");
            tempCanvas.width = 400; tempCanvas.height = 100;
            const tempCtx = tempCanvas.getContext("2d");
            tempCtx.font = "40px 'Brush Script MT', cursive";
            tempCtx.fillStyle = "black";
            tempCtx.textAlign = "center";
            tempCtx.textBaseline = "middle";
            tempCtx.fillText(typedText, 200, 50);
            finalDataUrl = tempCanvas.toDataURL("image/png");
        }
        else if (activeSigMethod === 'upload') {
            if(!uploadedSigDataUrl) return alert("Please upload an image.");
            finalDataUrl = uploadedSigDataUrl;
        }

        if(finalDataUrl) {
            addDraggableImage(finalDataUrl, 'signature');
            sigModal.style.display = "none";
            resetToSelectTool();
        }
    });

    // --- Formatting Toolbar (Text) ---
    const fmtToolbar = document.createElement("div");
    fmtToolbar.className = "formatting-toolbar";
    fmtToolbar.innerHTML = `
        <input type="color" id="fmtColor" class="fmt-input-color" value="#000000">
        <input type="number" id="fmtSize" class="fmt-input-size" value="16" min="8" max="72">
        <button id="fmtBold" class="fmt-btn">B</button>
        <button id="fmtDelete" class="fmt-btn" style="color:#ef4444;">🗑</button>
    `;
    canvasContainer.appendChild(fmtToolbar);
    let activeTextElement = null;

    document.getElementById("fmtColor").addEventListener("input", (e) => { if(activeTextElement) activeTextElement.style.color = e.target.value; });
    document.getElementById("fmtSize").addEventListener("input", (e) => { if(activeTextElement) activeTextElement.style.fontSize = e.target.value + "px"; });
    document.getElementById("fmtBold").addEventListener("click", () => { if(activeTextElement) { activeTextElement.style.fontWeight = activeTextElement.style.fontWeight === "bold" ? "normal" : "bold"; } });
    document.getElementById("fmtDelete").addEventListener("click", () => {
        if(activeTextElement) {
            activeTextElement.remove();
            addedElements = addedElements.filter(el => el.element !== activeTextElement);
            hideFormattingToolbar();
        }
    });

    function showFormattingToolbar(el) {
        activeTextElement = el;
        fmtToolbar.style.top = (parseInt(el.style.top) - 40) + "px";
        fmtToolbar.style.left = el.style.left;
        fmtToolbar.classList.add("show");
    }
    function hideFormattingToolbar() { fmtToolbar.classList.remove("show"); activeTextElement = null; }

    // --- Tools Selection ---
    function resetToSelectTool() {
        currentTool = "select";
        topTools.forEach(t => t.classList.remove("active"));
        document.querySelector('[data-category="select"]').classList.add("active");
    }

    topTools.forEach(btn => {
        btn.addEventListener("click", () => {
            topTools.forEach(t => t.classList.remove("active"));
            btn.classList.add("active");
            currentTool = btn.dataset.category;
            
            if(currentTool !== "text") hideFormattingToolbar();
            
            if (currentTool === "image") {
                imageInput.click();
            } else if (currentTool === "sign") {
                sigModal.style.display = "flex";
            }
        });
    });

    imageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => { addDraggableImage(event.target.result, 'image'); };
            reader.readAsDataURL(file);
        }
        resetToSelectTool();
    });

    // --- Interactive Canvas Clicks ---
    canvasContainer.addEventListener("mousedown", (e) => {
        if(!pdfDocView) return;
        if(e.target.classList.contains('draggable-text') || e.target.closest('.formatting-toolbar')) return;

        const rect = canvasContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (currentTool === "text") {
            const textBox = document.createElement("div");
            textBox.contentEditable = "true";
            textBox.className = "draggable-text";
            textBox.style.left = `${x}px`;
            textBox.style.top = `${y}px`;
            textBox.style.color = "#000000";
            textBox.style.fontSize = "16px";
            textBox.innerHTML = "New Text";
            
            textBox.addEventListener("focus", function() { showFormattingToolbar(this); });
            canvasContainer.appendChild(textBox);
            setTimeout(() => { textBox.focus(); }, 100);
            
            makeDraggable(textBox);
            addedElements.push({ type: 'text', element: textBox, page: currentPageNum });
            resetToSelectTool();
        } 
        else if (currentTool === "annotate") { 
            // Whiteout (Eraser) Tool
            const whiteout = document.createElement("div");
            whiteout.className = "draggable-whiteout";
            whiteout.style.left = `${x}px`;
            whiteout.style.top = `${y}px`;
            whiteout.style.width = "100px";
            whiteout.style.height = "25px";
            
            whiteout.addEventListener("dblclick", () => {
                whiteout.remove();
                addedElements = addedElements.filter(el => el.element !== whiteout);
            });

            canvasContainer.appendChild(whiteout);
            makeDraggable(whiteout);
            addedElements.push({ type: 'whiteout', element: whiteout, page: currentPageNum });
            resetToSelectTool();
        }
    });

    function addDraggableImage(dataUrl, type) {
        const img = document.createElement("img");
        img.src = dataUrl;
        img.className = "draggable-image";
        img.style.left = `${renderCanvas.width / 2 - 50}px`;
        img.style.top = `${renderCanvas.height / 2 - 50}px`;
        
        img.addEventListener("dblclick", () => {
            img.remove();
            addedElements = addedElements.filter(el => el.element !== img);
        });

        canvasContainer.appendChild(img);
        makeDraggable(img);
        addedElements.push({ type: type, element: img, page: currentPageNum, dataUrl: dataUrl });
    }

    function makeDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = dragMouseDown;
        el.addEventListener("touchstart", dragTouchStart, {passive: false});

        function dragMouseDown(e) {
            if(currentTool !== "select" || document.activeElement === el) return;
            e.preventDefault();
            pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            if(el.classList.contains('draggable-text')) showFormattingToolbar(el);
        }
        function elementDrag(e) { e.preventDefault(); updatePosition(e.clientX, e.clientY); }

        function dragTouchStart(e) {
            if(currentTool !== "select" || document.activeElement === el) return;
            pos3 = e.touches[0].clientX; pos4 = e.touches[0].clientY;
            document.addEventListener("touchend", closeDragElement);
            document.addEventListener("touchmove", touchDrag, {passive: false});
            if(el.classList.contains('draggable-text')) showFormattingToolbar(el);
        }
        function touchDrag(e) { e.preventDefault(); updatePosition(e.touches[0].clientX, e.touches[0].clientY); }

        function updatePosition(clientX, clientY) {
            pos1 = pos3 - clientX; pos2 = pos4 - clientY;
            pos3 = clientX; pos4 = clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
            if(el.classList.contains('draggable-text')) {
                fmtToolbar.style.top = (el.offsetTop - 40) + "px";
                fmtToolbar.style.left = el.style.left;
            }
        }
        function closeDragElement() {
            document.onmouseup = null; document.onmousemove = null;
            document.removeEventListener("touchend", closeDragElement);
            document.removeEventListener("touchmove", touchDrag);
        }
    }

    // --- Load & Render ---
    openPdfBtn.addEventListener("click", () => pdfInput.click());
    pdfInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if(file && file.type === "application/pdf") { currentFile = file; await loadPdfEngine(file); }
    });

    async function loadPdfEngine(file) {
        try {
            uploadPrompt.style.display = "none";
            pdfDocumentWrapper.style.display = "block";
            
            const arrayBuffer = await file.arrayBuffer();
            const pdfBytes = new Uint8Array(arrayBuffer);

            editPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
            const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
            pdfDocView = await loadingTask.promise;

            addedElements = [];
            canvasContainer.querySelectorAll('.draggable-text, .draggable-image, .draggable-whiteout').forEach(e => e.remove());
            hideFormattingToolbar();

            generateRealThumbnails();
            currentPageNum = 1;
            await renderPage(currentPageNum);
        } catch (error) { console.error(error); }
    }

    async function renderPage(num) {
        if (isRendering || !pdfDocView) return;
        isRendering = true; hideFormattingToolbar();

        try {
            const page = await pdfDocView.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 });
            
            renderCanvas.height = viewport.height;
            renderCanvas.width = viewport.width;
            canvasContainer.style.width = `${viewport.width}px`;
            canvasContainer.style.height = `${viewport.height}px`;

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            
            canvasContainer.querySelectorAll('.draggable-text, .draggable-image, .draggable-whiteout').forEach(e => e.remove());
            addedElements.forEach(el => { if(el.page === num) canvasContainer.appendChild(el.element); });
        } catch (error) { console.error(error); } finally { isRendering = false; }
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

    // --- Export (Bake Elements into PDF) ---
    exportPdfBtn.addEventListener("click", async () => {
        if (!editPdfDoc) return alert("Please open a PDF first.");
        hideFormattingToolbar();
        
        try {
            exportPdfBtn.textContent = "Saving...";
            const pages = editPdfDoc.getPages();
            const helveticaFont = await editPdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
            const helveticaBold = await editPdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

            for (const elData of addedElements) {
                const pageIndex = elData.page - 1;
                const page = pages[pageIndex];
                const { width, height } = page.getSize();
                const htmlEl = elData.element;
                
                const elLeft = parseFloat(htmlEl.style.left);
                const elTop = parseFloat(htmlEl.style.top);
                const scaleX = width / renderCanvas.width;
                const scaleY = height / renderCanvas.height;
                const pdfX = elLeft * scaleX;

                if (elData.type === 'text') {
                    const textVal = htmlEl.innerText || htmlEl.textContent;
                    if(textVal && textVal !== "New Text") {
                        const pdfY = height - (elTop * scaleY) - (parseInt(htmlEl.style.fontSize) * scaleY);
                        const isBold = htmlEl.style.fontWeight === "bold";
                        page.drawText(textVal, { x: pdfX, y: pdfY, size: parseInt(htmlEl.style.fontSize) * scaleY, font: isBold ? helveticaBold : helveticaFont });
                    }
                } 
                else if (elData.type === 'whiteout') {
                    const pdfY = height - (elTop * scaleY) - (htmlEl.offsetHeight * scaleY);
                    page.drawRectangle({ x: pdfX, y: pdfY, width: htmlEl.offsetWidth * scaleX, height: htmlEl.offsetHeight * scaleY, color: PDFLib.rgb(1, 1, 1) });
                }
                else if (elData.type === 'image' || elData.type === 'signature') {
                    const imgBytes = await fetch(elData.dataUrl).then(res => res.arrayBuffer());
                    const pdfImage = elData.dataUrl.includes("png") ? await editPdfDoc.embedPng(imgBytes) : await editPdfDoc.embedJpg(imgBytes);
                    const pdfY = height - (elTop * scaleY) - (htmlEl.offsetHeight * scaleY);
                    page.drawImage(pdfImage, { x: pdfX, y: pdfY, width: htmlEl.offsetWidth * scaleX, height: htmlEl.offsetHeight * scaleY });
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
            console.error(e);
            alert("Error exporting PDF.");
            exportPdfBtn.innerHTML = "⬇ Export";
        }
    });
});

    // --- Phase 6: Load SEO Content ---
    async function loadSeoContent() {
        const seoArea = document.getElementById("seoContentArea");
        if(!seoArea) return;
        
        try {
            const response = await fetch('content/seo-content.json');
            if(!response.ok) throw new Error("Could not load content");
            
            const data = await response.json();
            
            let html = `<div class="seo-inner">`;
            html += `<h1>${data.title}</h1>`;
            html += `<p>${data.description}</p>`;
            
            // Features Grid
            html += `<div class="seo-grid">`;
            data.features.forEach(f => {
                html += `
                <div class="seo-feature">
                    <h3>✨ ${f.title}</h3>
                    <p>${f.desc}</p>
                </div>`;
            });
            html += `</div>`;
            
            // FAQ Section
            html += `<div class="seo-faq"><h2>Frequently Asked Questions</h2>`;
            data.faq.forEach(q => {
                html += `
                <div class="faq-item">
                    <h4>Q: ${q.q}</h4>
                    <p>A: ${q.a}</p>
                </div>`;
            });
            html += `</div></div>`;
            
            seoArea.innerHTML = html;
            
        } catch(e) {
            console.error("SEO Content Load Error:", e);
        }
    }
    
    // Call the function
    loadSeoContent();
