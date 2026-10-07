document.addEventListener("DOMContentLoaded", () => {
    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const statusArea = document.getElementById("statusArea");
    const fileNameDisplay = document.getElementById("fileName");
    const convertBtn = document.getElementById("convertBtn");
    const statusText = document.getElementById("statusText");
    const progressBar = document.getElementById("progressBar");
    let currentFile = null;

    dropZone.addEventListener("dragover", (e) => { e.preventDefault(); dropZone.classList.add("dragover"); });
    dropZone.addEventListener("dragleave", () => { dropZone.classList.remove("dragover"); });
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault(); dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener("change", (e) => {
        if (e.target.files.length > 0) handleFile(e.target.files[0]);
    });

    function handleFile(file) {
        if (!file.name.endsWith('.docx')) { alert("Please upload a valid Word (.docx) file."); return; }
        currentFile = file;
        fileNameDisplay.textContent = file.name;
        statusArea.classList.remove("hidden");
        statusText.textContent = "Ready to convert...";
        progressBar.style.width = "0%";
        convertBtn.disabled = false;
        convertBtn.textContent = "Convert to PDF";
        convertBtn.classList.remove("success");
    }

    convertBtn.addEventListener("click", () => {
        if (!currentFile) return;
        convertBtn.disabled = true;
        statusText.textContent = "Reading Word File...";
        progressBar.style.width = "30%";
        const reader = new FileReader();
        reader.onload = function(event) {
            const arrayBuffer = event.target.result;
            mammoth.convertToHtml({arrayBuffer: arrayBuffer}).then(function(result) {
                statusText.textContent = "Generating PDF...";
                progressBar.style.width = "60%";
                
                // Bypass hidden div completely - Pass HTML string directly!
                const htmlContent = '<div style="padding: 20px; font-family: Arial, sans-serif; color: #000; line-height: 1.6;">' + result.value + '</div>';
                
                const opt = {
                    margin: 10,
                    filename: currentFile.name.replace('.docx', '.pdf'),
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                
                html2pdf().set(opt).from(htmlContent).save().then(() => {
                    statusText.textContent = "Success! PDF Downloaded.";
                    progressBar.style.width = "100%";
                    convertBtn.textContent = "Conversion Complete";
                    convertBtn.classList.add("success");
                }).catch(err => {
                    statusText.textContent = "Error generating PDF.";
                    convertBtn.disabled = false;
                });
            }).catch(function(err) {
                statusText.textContent = "Error reading Word file.";
                convertBtn.disabled = false;
            });
        };
        reader.readAsArrayBuffer(currentFile);
    });
});
