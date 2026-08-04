"use strict";

document.addEventListener("DOMContentLoaded", () => {

const imageInput = document.getElementById("imageInput");
const preview = document.getElementById("preview");
const quality = document.getElementById("quality");
const qualityValue = document.getElementById("qualityValue");
const compressBtn = document.getElementById("compressBtn");
const result = document.getElementById("result");

if (
!imageInput ||
!preview ||
!quality ||
!qualityValue ||
!compressBtn ||
!result
) {
return;
}

let selectedFile = null;

qualityValue.textContent = quality.value + "%";

quality.addEventListener("input", () => {

qualityValue.textContent =
quality.value + "%";

});

imageInput.addEventListener("change", (event) => {

result.innerHTML = "";

preview.innerHTML = "";

selectedFile =
event.target.files[0];

if (!selectedFile) {

return;

}

if (
!selectedFile.type.startsWith("image/")
) {

result.innerHTML =
'<div class="alert alert-danger">Please select a valid image.</div>';

selectedFile = null;

return;

}

const image =
document.createElement("img");

image.style.maxWidth = "100%";

image.style.borderRadius = "12px";

image.style.marginTop = "20px";

const reader =
new FileReader();

reader.onload = (ev) => {

image.src = ev.target.result;

preview.appendChild(image);

};

reader.readAsDataURL(selectedFile);

});
compressBtn.addEventListener("click", () => {

if (!selectedFile) {

result.innerHTML =
'<div class="alert alert-danger">Please select an image first.</div>';

return;

}

const image = new Image();

const reader = new FileReader();

reader.onload = (ev) => {

image.onload = () => {

const canvas =
document.createElement("canvas");

const ctx =
canvas.getContext("2d");

canvas.width = image.width;

canvas.height = image.height;

ctx.drawImage(
image,
0,
0,
canvas.width,
canvas.height
);

const q =
Number(quality.value) / 100;

canvas.toBlob((blob) => {

if (!blob) {

return;

}

const url =
URL.createObjectURL(blob);

const originalKB =
(selectedFile.size / 1024).toFixed(1);

const compressedKB =
(blob.size / 1024).toFixed(1);

const savedPercent =
(
100 -
(blob.size / selectedFile.size) * 100
).toFixed(1);
result.innerHTML = `
<div class="alert alert-success">

<h3>Compression Complete</h3>

<p>

Original Size :
<strong>

${originalKB} KB

</strong>

</p>

<p>

Compressed Size :
<strong>

${compressedKB} KB

</strong>

</p>

<p>

Saved :
<strong>

${savedPercent}%

</strong>

</p>

<p>

<a
class="btn"
href="${url}"
download="compressed-image.jpg">

Download Image

</a>

</p>

</div>
`;

},"image/jpeg",q);

};

image.src = ev.target.result;

};

reader.readAsDataURL(selectedFile);

});

});