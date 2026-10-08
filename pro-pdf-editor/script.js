pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const pdfInput = document.getElementById("pdfInput");
    const uploadCard = document.getElementById("uploadCard");
    const pdfDocument = document.getElementById("pdfDocument");
    const pdfCanvasArea = document.getElementById("pdfCanvas"); 
    const pdfStatus = document.getElementById("pdfStatus");
    const pageList = document.getElementById("pageList");
    const pageCount = document.getElementById("pageCount");
    
    const openPdfBtn = document.getElementById("openPdf");
    const choosePdfBtn = document.getElementById("choosePdf");
    const downloadPdfBtn = document.getElementById("downloadPdf");

    const zoomInBtn = document.getElementById("zoomIn");
    const zoomOutBtn = document.getElementById("zoomOut");
    const zoomValue = document.getElementById("zoomValue");

    const toolButtons = document.querySelectorAll("[data-tool]");
    const actionButtons = document.querySelectorAll("[data-action]");

    let currentTool = "select";
    let currentZoom = 1;
    let currentFile = null;
    
    let pdfDocView = null; 
    let editPdfDoc = null; 
    let currentPdfBytes = null;
    let currentPageNum = 1;
    let isRendering = false;

    pdfDocument.innerHTML = ""; 
    const renderCanvas = document.createElement("canvas");
    renderCanvas.id = "renderCanvas";
    renderCanvas.style.display = "block";
    renderCanvas.style.margin = "0 auto";
    renderCanvas.style.boxShadow = "0 18px 45px rgba(15, 23, 42, .15)";
    pdfDocument.appendChild(renderCanvas);
    const ctx = renderCanvas.getContext("2d");

    function setStatus(message) { if (pdfStatus) pdfStatus.textContent = message; }

    function updateZoom() {
        if (pdfDocument) {
            pdfDocument.style.transform = `scale(${currentZoom})`;
            pdfDocument.style.transformOrigin = "top center";
        }
        if (zoomValue) zoomValue.textContent = `${Math.round(currentZoom * 100)}%`;
    }

    async function loadPdfEngine(file) {
        try {
            setStatus("Loading Pro PDF Engine...");
            uploadCard.style.display = "none";
            pdfDocument.style.display = "block";
            
            const arrayBuffer = await file.arrayBuffer();
            currentPdfBytes = new Uint8Array(arrayBuffer);

            editPdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
            const loadingTask = pdfjsLib.getDocument({ data: currentPdfBytes });
            pdfDocView = await loadingTask.promise;
            
            if (pageCount) pageCount.textContent = `${pdfDocView.numPages} Pages`;

            createRealThumbnails();
            currentPageNum = 1;
            await renderPage(currentPageNum);

            setStatus(`Loaded: ${file.name}`);
        } catch (error) {
            console.error("PDF Load Error:", error);
            setStatus("Error loading PDF.");
        }
    }

    async function renderPage(num) {
        if (isRendering || !pdfDocView) return;
        isRendering = true;
        setStatus(`Rendering Page ${num}...`);

        try {
            const page = await pdfDocView.getPage(num);
            const viewport = page.getViewport({ scale: 1.5 }); 
            
            renderCanvas.height = viewport.height;
            renderCanvas.width = viewport.width;

            pdfDocument.style.width = `${viewport.width}px`;
            pdfDocument.style.minHeight = `${viewport.height}px`;

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;
            setStatus(`Page ${num} of ${pdfDocView.numPages} is ready.`);
        } catch (error) {
            console.error("Render Error:", error);
        } finally {
            isRendering = false;
        }
    }

    function createRealThumbnails() {
        if (!pageList || !pdfDocView) return;
        pageList.innerHTML = "";

        for (let i = 1; i <= pdfDocView.numPages; i++) {
            const thumbnail = document.createElement("div");
            thumbnail.className = `pdf-page-thumb ${i === currentPageNum ? "active" : ""}`;
            thumbnail.innerHTML = `<div style="padding:20px; text-align:center; border:1px solid #ddd; background:#fff; border-radius:6px;">P${i}</div>`;

            thumbnail.addEventListener("click", async () => {
                document.querySelectorAll(".pdf-page-thumb").forEach(item => item.classList.remove("active"));
                thumbnail.classList.add("active");
                currentPageNum = i;
                await renderPage(currentPageNum);
            });
            pageList.appendChild(thumbnail);
        }
    }

    function triggerFileInput() { if (pdfInput) pdfInput.click(); }
    if (openPdfBtn) openPdfBtn.addEventListener("click", triggerFileInput);
    if (choosePdfBtn) choosePdfBtn.addEventListener("click", triggerFileInput);
    if (uploadCard) uploadCard.addEventListener("click", triggerFileInput);

    if (pdfInput) {
        pdfInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file && file.type === "application/pdf") {
                currentFile = file;
                loadPdfEngine(file);
            }
        });
    }

    if (pdfCanvasArea) {
        ["dragenter", "dragover"].forEach(evt => pdfCanvasArea.addEventListener(evt, e => { e.preventDefault(); uploadCard.style.borderColor = "#00b894"; }));
        ["dragleave", "drop"].forEach(evt => pdfCanvasArea.addEventListener(evt, e => { e.preventDefault(); uploadCard.style.borderColor = ""; }));
        pdfCanvasArea.addEventListener("drop", e => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type === "application/pdf") { currentFile = file; loadPdfEngine(file); }
        });
    }

    actionButtons.forEach(button => {
        button.addEventListener("click", async () => {
            const action = button.dataset.action;
            if (!editPdfDoc) return setStatus("Please open a PDF first.");

            if (action === "delete") {
                if (pdfDocView.numPages <= 1) return alert("Cannot delete last page.");
                if (confirm(`Delete Page ${currentPageNum}?`)) {
                    editPdfDoc.removePage(currentPageNum - 1);
                    await reloadEngineAfterEdit();
                }
            } 
            else if (action === "rotate") {
                const pages = editPdfDoc.getPages();
                const page = pages[currentPageNum - 1];
                page.setRotation(PDFLib.degrees(page.getRotation().angle + 90));
                await reloadEngineAfterEdit();
            }
        });
    });

    async function reloadEngineAfterEdit() {
        const savedBytes = await editPdfDoc.save();
        const updatedBlob = new Blob([savedBytes], { type: 'application/pdf' });
        const updatedFile = new File([updatedBlob], currentFile.name, { type: 'application/pdf' });
        currentPageNum = 1; 
        await loadPdfEngine(updatedFile);
    }

    if (downloadPdfBtn) {
        downloadPdfBtn.addEventListener("click", async () => {
            if (!editPdfDoc) return setStatus("Open a PDF to download.");
            setStatus("Preparing Download...");
            const pdfBytes = await editPdfDoc.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `niDar_Pro_${currentFile.name}`;
            link.click();
            setStatus("Download Complete!");
        });
    }

    toolButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            toolButtons.forEach(i => i.classList.remove("active"));
            btn.classList.add("active");
            currentTool = btn.dataset.tool;
        });
    });

    if (zoomInBtn) zoomInBtn.addEventListener("click", () => { currentZoom = Math.min(2.5, currentZoom + 0.1); updateZoom(); });
    if (zoomOutBtn) zoomOutBtn.addEventListener("click", () => { currentZoom = Math.max(0.5, currentZoom - 0.1); updateZoom(); });

    updateZoom();
});
