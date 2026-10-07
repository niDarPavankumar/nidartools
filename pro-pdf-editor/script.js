pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

let pdfDocView = null;
let editPdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0;
let originalFileName = "document.pdf";
let currentPdfBytes = null;

const canvas = document.getElementById('pdfCanvas');
const ctx = canvas.getContext('2d');
const ui = {
    fileInput: document.getElementById('fileInput'),
    uploadPrompt: document.getElementById('uploadPrompt'),
    navControls: document.getElementById('navControls'),
    editControls: document.getElementById('editControls'),
    pageNum: document.getElementById('pageNum'),
    pageCount: document.getElementById('pageCount'),
    prevBtn: document.getElementById('prevBtn'),
    nextBtn: document.getElementById('nextBtn'),
    zoomIn: document.getElementById('zoomIn'),
    zoomOut: document.getElementById('zoomOut'),
    addTextBtn: document.getElementById('addTextBtn'),
    deletePageBtn: document.getElementById('deletePageBtn'),
    saveBtn: document.getElementById('saveBtn'),
    textModal: document.getElementById('textModal'),
    textInputArea: document.getElementById('textInputArea'),
    confirmTextBtn: document.getElementById('confirmTextBtn'),
    cancelTextBtn: document.getElementById('cancelTextBtn')
};

function renderPage(num) {
    pageRendering = true;
    pdfDocView.getPage(num).then(function(page) {
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        let renderContext = { canvasContext: ctx, viewport: viewport };
        let renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
    ui.pageNum.textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) { pageNumPending = num; } else { renderPage(num); }
}

async function loadPdfToView(uint8Array) {
    currentPdfBytes = uint8Array;
    const loadingTask = pdfjsLib.getDocument({data: uint8Array});
    pdfDocView = await loadingTask.promise;
    ui.pageCount.textContent = pdfDocView.numPages;
    
    ui.uploadPrompt.classList.add('hidden');
    canvas.classList.remove('hidden');
    ui.navControls.classList.remove('hidden');
    ui.editControls.classList.remove('hidden');
    
    if(pageNum > pdfDocView.numPages) pageNum = pdfDocView.numPages;
    if(pageNum < 1) pageNum = 1;
    renderPage(pageNum);
}

ui.fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') { alert('Please upload a valid PDF file.'); return; }
    originalFileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    currentPdfBytes = new Uint8Array(arrayBuffer);
    
    editPdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
    pageNum = 1;
    await loadPdfToView(currentPdfBytes);
});

ui.prevBtn.addEventListener('click', () => { if (pageNum <= 1) return; pageNum--; queueRenderPage(pageNum); });
ui.nextBtn.addEventListener('click', () => { if (pageNum >= pdfDocView.numPages) return; pageNum++; queueRenderPage(pageNum); });

ui.zoomIn.addEventListener('click', () => { scale += 0.2; queueRenderPage(pageNum); });
ui.zoomOut.addEventListener('click', () => { if (scale <= 0.4) return; scale -= 0.2; queueRenderPage(pageNum); });

ui.deletePageBtn.addEventListener('click', async () => {
    if(pdfDocView.numPages <= 1) { alert("Cannot delete the last remaining page."); return; }
    if(!confirm(`Are you sure you want to delete Page ${pageNum}?`)) return;
    
    editPdfDoc.removePage(pageNum - 1);
    // CRITICAL FIX: Save changes and reload the viewer
    const pdfBytes = await editPdfDoc.save();
    currentPdfBytes = pdfBytes; 
    editPdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
    await loadPdfToView(currentPdfBytes);
});

ui.addTextBtn.addEventListener('click', () => {
    ui.textInputArea.value = '';
    ui.textModal.classList.remove('hidden');
    ui.textInputArea.focus();
});

ui.cancelTextBtn.addEventListener('click', () => {
    ui.textModal.classList.add('hidden');
});

ui.confirmTextBtn.addEventListener('click', async () => {
    const text = ui.textInputArea.value;
    ui.textModal.classList.add('hidden');
    if (!text) return;
    
    const pages = editPdfDoc.getPages();
    const currentPage = pages[pageNum - 1];
    const { width, height } = currentPage.getSize();
    
    // Add text slightly lower so it's more visible, and black color
    currentPage.drawText(text, {
        x: 50,
        y: height - 100,
        size: 24,
        color: PDFLib.rgb(0, 0, 0), 
    });
    
    // CRITICAL FIX: Save changes and reload the viewer immediately
    const pdfBytes = await editPdfDoc.save();
    currentPdfBytes = pdfBytes;
    editPdfDoc = await PDFLib.PDFDocument.load(currentPdfBytes);
    await loadPdfToView(currentPdfBytes);
});

ui.saveBtn.addEventListener('click', async () => {
    // We already save changes immediately in the addText/deletePage functions.
    // So currentPdfBytes has the latest edits.
    const blob = new Blob([currentPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'edited_' + originalFileName;
    link.click();
});
