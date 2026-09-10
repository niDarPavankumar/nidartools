document.addEventListener('DOMContentLoaded', () => {
    console.log("niDar Tools: Edge-Inward Background Remover Loaded.");

    // DOM Elements
    const uploadZone = document.getElementById('uploadZone');
    const selectImageBtn = document.getElementById('selectImageBtn');
    const imageInput = document.getElementById('imageInput');
    const workspace = document.getElementById('workspace');
    const settingsSection = document.getElementById('settingsSection');
    const processSection = document.getElementById('processSection');
    const progressSection = document.getElementById('progressSection');
    const progressBar = document.getElementById('progressBar');
    const progressPercent = document.getElementById('progressPercent');
    const progressMessage = document.getElementById('progressMessage');
    const resultSection = document.getElementById('resultSection');

    const originalPreview = document.getElementById('originalPreview');
    const originalPlaceholder = document.getElementById('originalPlaceholder');
    const originalName = document.getElementById('originalName');
    const originalDimensions = document.getElementById('originalDimensions');

    const resultPreview = document.getElementById('resultPreview');
    const resultPlaceholder = document.getElementById('resultPlaceholder');
    const resultDimensions = document.getElementById('resultDimensions');
    const resultSize = document.getElementById('resultSize');

    const removeBackgroundBtn = document.getElementById('removeBackgroundBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const processAgainBtn = document.getElementById('processAgainBtn');
    const startOverBtn = document.getElementById('startOverBtn');

    const backgroundMode = document.getElementById('backgroundMode');
    const outputFormat = document.getElementById('outputFormat');
    const outputQuality = document.getElementById('outputQuality');

    let currentFile = null;

    if (selectImageBtn) {
        selectImageBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            imageInput.click();
        });
    }

    if (uploadZone) {
        uploadZone.addEventListener('click', (e) => {
            if (e.target !== selectImageBtn) {
                imageInput.click();
            }
        });
    }

    if (uploadZone) {
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleImageUpload(e.dataTransfer.files[0]);
            }
        });
    }

    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                handleImageUpload(e.target.files[0]);
            }
        });
    }

    function handleImageUpload(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPG, PNG, WEBP).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                if (originalPreview) {
                    originalPreview.src = e.target.result;
                    originalPreview.style.display = 'block';
                }
                if (originalPlaceholder) originalPlaceholder.style.display = 'none';
                if (originalName) originalName.textContent = file.name;
                if (originalDimensions) originalDimensions.textContent = `${img.naturalWidth} × ${img.naturalHeight} px`;

                if (workspace) workspace.hidden = false;
                if (settingsSection) settingsSection.hidden = false;
                if (processSection) processSection.hidden = false;
                if (resultSection) resultSection.hidden = true;
                if (progressSection) progressSection.hidden = true;

                workspace.scrollIntoView({ behavior: 'smooth' });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Precise Edge-Inward Background Removal (Strictly targets back layer from borders)
    if (removeBackgroundBtn) {
        removeBackgroundBtn.addEventListener('click', async () => {
            if (!currentFile) return;

            processSection.querySelector('.process-card').style.display = 'none';
            progressSection.hidden = false;
            updateProgress(20, 'Scanning outer boundaries...');

            setTimeout(async () => {
                try {
                    const img = new Image();
                    img.src = originalPreview.src;
                    await img.decode();

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d', { willReadFrequently: true });
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.drawImage(img, 0, 0);

                    updateProgress(50, 'Removing back layer precisely...');

                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imgData.data;
                    const width = canvas.width;
                    const height = canvas.height;

                    // Reference color strictly from top-left corner (Back side reference)
                    const refR = data[0];
                    const refG = data[1];
                    const refB = data[2];

                    // Tolerance set for deep background removal without leaking inside subject
                    const tolerance = 65;

                    let visited = new Uint8Array(width * height);
                    let queue = [];

                    // Push all 4 outer border pixels into queue to start processing strictly from outside in
                    for (let x = 0; x < width; x++) {
                        queue.push({x, y: 0});
                        queue.push({x, y: height - 1});
                        visited[0 * width + x] = 1;
                        visited[(height - 1) * width + x] = 1;
                    }
                    for (let y = 0; y < height; y++) {
                        queue.push({x: 0, y});
                        queue.push({x: width - 1, y});
                        visited[y * width + 0] = 1;
                        visited[y * width + (width - 1)] = 1;
                    }

                    while(queue.length > 0) {
                        let {x, y} = queue.pop();
                        let idx = (y * width + x) * 4;
                        let r = data[idx], g = data[idx+1], b = data[idx+2];

                        // Color distance check from outer reference
                        let diff = Math.abs(r - refR) + Math.abs(g - refG) + Math.abs(b - refB);

                        if (diff <= (tolerance * 3)) {
                            data[idx + 3] = 0; // Make background transparent

                            // Explore inward neighbors
                            const neighbors = [
                                {nx: x+1, ny: y}, {nx: x-1, ny: y},
                                {nx: x, ny: y+1}, {nx: x, ny: y-1}
                            ];

                            for(let n of neighbors) {
                                if(n.nx >= 0 && n.nx < width && n.ny >= 0 && n.ny < height) {
                                    let nPos = n.ny * width + n.nx;
                                    if(!visited[nPos]) {
                                        visited[nPos] = 1;
                                        queue.push({x: n.nx, y: n.ny});
                                    }
                                }
                            }
                        }
                    }

                    ctx.putImageData(imgData, 0, 0);

                    const mode = backgroundMode.value;
                    if (mode !== 'transparent') {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = canvas.width;
                        tempCanvas.height = canvas.height;
                        const tempCtx = tempCanvas.getContext('2d');
                        tempCtx.fillStyle = mode;
                        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
                        tempCtx.drawImage(canvas, 0, 0);
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(tempCanvas, 0, 0);
                    }

                    updateProgress(90, 'Generating final clear output...');

                    let format = (outputFormat.value === 'webp') ? 'image/webp' : 'image/png';
                    let quality = parseFloat(outputQuality.value);

                    canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        resultPreview.src = url;
                        resultPreview.style.display = 'block';
                        resultPlaceholder.style.display = 'none';
                        resultDimensions.textContent = `${canvas.width} × ${canvas.height} px`;

                        let s = blob.size;
                        resultSize.textContent = (s < 1024) ? s + ' B' : (s < 1024*1024) ? (s/1024).toFixed(1) + ' KB' : (s/(1024*1024)).toFixed(2) + ' MB';

                        downloadBtn.href = url;
                        downloadBtn.download = `niDar-background-removed.${outputFormat.value}`;

                        updateProgress(100, 'Done!');
                        setTimeout(() => {
                            progressSection.hidden = true;
                            resultSection.hidden = false;
                            processSection.querySelector('.process-card').style.display = 'flex';
                            processSection.hidden = true;
                            resultSection.scrollIntoView({ behavior: 'smooth' });
                        }, 400);
                    }, format, quality);

                } catch (err) {
                    console.error(err);
                    alert('Error processing image.');
                    progressSection.hidden = true;
                    processSection.querySelector('.process-card').style.display = 'flex';
                }
            }, 200);
        });
    }

    function updateProgress(percent, msg) {
        if (progressBar) progressBar.style.width = percent + '%';
        if (progressPercent) progressPercent.textContent = percent + '%';
        if (progressMessage) progressMessage.textContent = msg;
    }

    if (processAgainBtn) {
        processAgainBtn.addEventListener('click', () => {
            resultSection.hidden = true;
            processSection.hidden = false;
            workspace.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (startOverBtn) {
        startOverBtn.addEventListener('click', () => {
            currentFile = null;
            imageInput.value = '';
            if (originalPreview) originalPreview.style.display = 'none';
            if (originalPlaceholder) originalPlaceholder.style.display = 'block';
            workspace.hidden = true;
            settingsSection.hidden = true;
            processSection.hidden = true;
            resultSection.hidden = true;
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
