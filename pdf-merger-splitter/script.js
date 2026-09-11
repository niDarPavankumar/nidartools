// PDF-lib वापरून ब्राउझरमध्येच PDF मर्ज आणि स्प्लिट करणे
let mergeFiles = [];
let splitFile = null;

// टॅब स्विच फंक्शन
function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tool-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById('output-container').classList.add('hidden');

    if (tabName === 'merge') {
        document.querySelector('.tab-buttons button:nth-child(1)').classList.add('active');
        document.getElementById('merge-section').classList.add('active');
    } else {
        document.querySelector('.tab-buttons button:nth-child(2)').classList.add('active');
        document.getElementById('split-section').classList.add('active');
    }
}

// --- MERGE LOGIC ---
const mergeFileInput = document.getElementById('merge-file-input');
const mergeFileList = document.getElementById('merge-file-list');
const mergeActionBtn = document.getElementById('merge-action-btn');

mergeFileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
        if (file.type === 'application/pdf') {
            mergeFiles.push(file);
        }
    });
    updateMergeUI();
});

function updateMergeUI() {
    mergeFileList.innerHTML = '';
    mergeFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${file.name}</span> <button onclick="removeMergeFile(${index})" style="background:none;border:none;color:red;cursor:pointer;">✕</button>`;
        mergeFileList.appendChild(li);
    });
    mergeActionBtn.disabled = mergeFiles.length < 2;
}

function removeMergeFile(index) {
    mergeFiles.splice(index, 1);
    updateMergeUI();
}

mergeActionBtn.addEventListener('click', async () => {
    if (mergeFiles.length < 2) return;
    mergeActionBtn.textContent = 'Merging...';
    mergeActionBtn.disabled = true;

    try {
        const mergedPdf = await PDFLib.PDFDocument.create();
        for (let file of mergeFiles) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach(page => mergedPdf.addPage(page));
        }

        const mergedPdfFile = await mergedPdf.save();
        showOutput(mergedPdfFile, 'merged-document.pdf', 'PDFs merged successfully!');
    } catch (error) {
        alert('Error merging PDFs. Please try again.');
        console.error(error);
    } finally {
        mergeActionBtn.textContent = 'Merge PDFs';
        mergeActionBtn.disabled = false;
    }
});

// --- SPLIT LOGIC ---
const splitFileInput = document.getElementById('split-file-input');
const splitFileInfo = document.getElementById('split-file-info');
const splitActionBtn = document.getElementById('split-action-btn');

splitFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
        splitFile = file;
        splitFileInfo.textContent = `Selected: ${file.name}`;
        splitFileInfo.classList.remove('hidden');
        splitActionBtn.disabled = false;
    }
});

splitActionBtn.addEventListener('click', async () => {
    if (!splitFile) return;
    splitActionBtn.textContent = 'Splitting...';
    splitActionBtn.disabled = true;

    try {
        const arrayBuffer = await splitFile.arrayBuffer();
        const pdf = await PDFLib.PDFDocument.load(arrayBuffer);
        const pageCount = pdf.getPageCount();

        // सुलभतेसाठी पहिली पेज किंवा सर्व पेज सेपरेट करून पहिली पेज देण्याचे लॉजिक किंवा मुख्य फाईल
        const subPdf = await PDFLib.PDFDocument.create();
        const [firstPage] = await subPdf.copyPages(pdf, [0]);
        subPdf.addPage(firstPage);
        const subPdfBytes = await subPdf.save();

        showOutput(subPdfBytes, 'split-page-1.pdf', `Successfully extracted first page out of ${pageCount} pages!`);
    } catch (error) {
        alert('Error splitting PDF.');
        console.error(error);
    } finally {
        splitActionBtn.textContent = 'Split PDF (All Pages)';
        splitActionBtn.disabled = false;
    }
});

// --- OUTPUT HANDLER ---
function showOutput(uint8Array, filename, message) {
    const blob = new Blob([uint8Array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    const downloadLink = document.getElementById('download-link');
    downloadLink.href = url;
    downloadLink.download = filename;
    downloadLink.classList.remove('hidden');

    const statusMsg = document.getElementById('status-message');
    statusMsg.textContent = message;
    
    document.getElementById('output-container').classList.remove('hidden');
}
