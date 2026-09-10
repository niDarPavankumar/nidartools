(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const qrType = $("qrType");
  const qrText = $("qrText");
  const qrTextLabel = $("qrTextLabel");

  const emailFields = $("emailFields");
  const phoneFields = $("phoneFields");
  const smsFields = $("smsFields");
  const wifiFields = $("wifiFields");

  const emailAddress = $("emailAddress");
  const emailSubject = $("emailSubject");
  const emailBody = $("emailBody");

  const phoneNumber = $("phoneNumber");

  const smsNumber = $("smsNumber");
  const smsMessage = $("smsMessage");

  const wifiName = $("wifiName");
  const wifiPassword = $("wifiPassword");
  const wifiSecurity = $("wifiSecurity");
  const wifiHidden = $("wifiHidden");

  const qrSize = $("qrSize");
  const errorCorrection = $("errorCorrection");

  const foregroundColor = $("foregroundColor");
  const backgroundColor = $("backgroundColor");
  const foregroundValue = $("foregroundValue");
  const backgroundValue = $("backgroundValue");

  const generateBtn = $("generateBtn");
  const resetBtn = $("resetBtn");

  const resultSection = $("resultSection");
  const resultSummary = $("resultSummary");
  const qrTypeResult = $("qrTypeResult");
  const qrSizeResult = $("qrSizeResult");

  const qrCanvas = $("qrCanvas");
  const downloadPngBtn = $("downloadPngBtn");
  const downloadSvgBtn = $("downloadSvgBtn");

  let generatedData = "";
  let generatedSize = 512;
  let generatedForeground = "#000000";
  let generatedBackground = "#ffffff";

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function updateColorLabels() {
    foregroundValue.textContent =
      foregroundColor.value.toUpperCase();

    backgroundValue.textContent =
      backgroundColor.value.toUpperCase();
  }

  function hideAllExtraFields() {
    emailFields.hidden = true;
    phoneFields.hidden = true;
    smsFields.hidden = true;
    wifiFields.hidden = true;
  }

  function updateInputMode() {
    const type = qrType.value;

    hideAllExtraFields();

    qrText.hidden = false;
    qrTextLabel.hidden = false;

    if (type === "text") {
      qrTextLabel.textContent = "Text";
      qrText.placeholder =
        "Enter the text you want to encode...";
    }

    if (type === "url") {
      qrTextLabel.textContent = "Website URL";
      qrText.placeholder =
        "https://example.com";
    }

    if (type === "email") {
      qrText.hidden = true;
      qrTextLabel.hidden = true;
      emailFields.hidden = false;
    }

    if (type === "phone") {
      qrText.hidden = true;
      qrTextLabel.hidden = true;
      phoneFields.hidden = false;
    }

    if (type === "sms") {
      qrText.hidden = true;
      qrTextLabel.hidden = true;
      smsFields.hidden = false;
    }

    if (type === "wifi") {
      qrText.hidden = true;
      qrTextLabel.hidden = true;
      wifiFields.hidden = false;
    }
  }

  function getQrData() {
    const type = qrType.value;

    if (type === "text") {
      const value = qrText.value.trim();

      if (!value) {
        throw new Error("Please enter some text.");
      }

      return value;
    }

    if (type === "url") {
      let value = qrText.value.trim();

      if (!value) {
        throw new Error("Please enter a website URL.");
      }

      if (
        !/^https?:\/\//i.test(value)
      ) {
        value = "https://" + value;
      }

      try {
        new URL(value);
      } catch {
        throw new Error(
          "Please enter a valid website URL."
        );
      }

      return value;
    }

    if (type === "email") {
      const address =
        emailAddress.value.trim();

      const subject =
        emailSubject.value.trim();

      const body =
        emailBody.value.trim();

      if (!address) {
        throw new Error(
          "Please enter an email address."
        );
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
        throw new Error(
          "Please enter a valid email address."
        );
      }

      const params = new URLSearchParams();

      if (subject) {
        params.set("subject", subject);
      }

      if (body) {
        params.set("body", body);
      }

      const query = params.toString();

      return (
        "mailto:" +
        address +
        (query ? "?" + query : "")
      );
    }

    if (type === "phone") {
      const number =
        phoneNumber.value.trim();

      if (!number) {
        throw new Error(
          "Please enter a phone number."
        );
      }

      return "tel:" + number;
    }

    if (type === "sms") {
      const number =
        smsNumber.value.trim();

      const message =
        smsMessage.value.trim();

      if (!number) {
        throw new Error(
          "Please enter a phone number."
        );
      }

      let result = "SMSTO:" + number;

      if (message) {
        result += ":" + message;
      }

      return result;
    }

    if (type === "wifi") {
      const name =
        wifiName.value.trim();

      const password =
        wifiPassword.value;

      const security =
        wifiSecurity.value;

      const hidden =
        wifiHidden.checked;

      if (!name) {
        throw new Error(
          "Please enter the Wi-Fi network name."
        );
      }

      /*
       * Escape special characters according to
       * the common Wi-Fi QR format.
       */
      const escapeWifi = (value) =>
        String(value)
          .replace(/\\/g, "\\\\")
          .replace(/;/g, "\\;")
          .replace(/,/g, "\\,")
          .replace(/:/g, "\\:");

      return (
        "WIFI:" +
        "T:" + security + ";" +
        "S:" + escapeWifi(name) + ";" +
        "P:" + escapeWifi(password) + ";" +
        "H:" + (hidden ? "true" : "false") +
        ";;"
      );
    }

    throw new Error(
      "Unsupported QR code type."
    );
  }

  function getTypeLabel() {
    const labels = {
      text: "Text QR Code",
      url: "Website QR Code",
      email: "Email QR Code",
      phone: "Phone QR Code",
      sms: "SMS QR Code",
      wifi: "Wi-Fi QR Code"
    };

    return labels[qrType.value] ||
      "QR Code";
  }

  function clearQrCanvas() {
    const ctx =
      qrCanvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(
      0,
      0,
      qrCanvas.width,
      qrCanvas.height
    );

    ctx.fillStyle =
      backgroundColor.value;

    ctx.fillRect(
      0,
      0,
      qrCanvas.width,
      qrCanvas.height
    );
  }

  function copyRenderedQrToCanvas() {
    const container =
      document.createElement("div");

    container.style.position =
      "fixed";

    container.style.left =
      "-10000px";

    container.style.top =
      "0";

    container.style.background =
      generatedBackground;

    document.body.appendChild(
      container
    );

    return container;
  }

  function renderQrWithLibrary(data) {
    if (
      typeof window.QRCode !== "function"
    ) {
      throw new Error(
        "QR engine is not available. Please check your internet connection and reload the page."
      );
    }

    const size =
      Number(qrSize.value);

    const level =
      errorCorrection.value;

    const temp =
      copyRenderedQrToCanvas();

    /*
     * qrcodejs accepts the error correction
     * constants through QRCode.CorrectLevel.
     */
    const correctionMap = {
      L: QRCode.CorrectLevel.L,
      M: QRCode.CorrectLevel.M,
      Q: QRCode.CorrectLevel.Q,
      H: QRCode.CorrectLevel.H
    };

    new QRCode(temp, {
      text: data,
      width: size,
      height: size,
      colorDark: foregroundColor.value,
      colorLight: backgroundColor.value,
      correctLevel:
        correctionMap[level] ||
        QRCode.CorrectLevel.M
    });

    return new Promise(
      (resolve, reject) => {
        let attempts = 0;

        const check = () => {
          const canvas =
            temp.querySelector("canvas");

          const image =
            temp.querySelector("img");

          if (canvas) {
            const output =
              document.createElement(
                "canvas"
              );

            output.width = size;
            output.height = size;

            const ctx =
              output.getContext("2d");

            ctx.drawImage(
              canvas,
              0,
              0,
              size,
              size
            );

            document.body.removeChild(
              temp
            );

            resolve(output);
            return;
          }

          if (image && image.complete) {
            const output =
              document.createElement(
                "canvas"
              );

            output.width = size;
            output.height = size;

            const ctx =
              output.getContext("2d");

            ctx.fillStyle =
              backgroundColor.value;

            ctx.fillRect(
              0,
              0,
              size,
              size
            );

            ctx.drawImage(
              image,
              0,
              0,
              size,
              size
            );

            document.body.removeChild(
              temp
            );

            resolve(output);
            return;
          }

          attempts++;

          if (attempts > 100) {
            document.body.removeChild(
              temp
            );

            reject(
              new Error(
                "QR code generation timed out."
              )
            );

            return;
          }

          setTimeout(check, 25);
        };

        check();
      }
    );
  }

  async function generateQr() {
    let data;

    try {
      data = getQrData();
    } catch (error) {
      alert(error.message);
      return;
    }

    generateBtn.disabled = true;
    generateBtn.textContent =
      "Generating...";

    try {
      const canvas =
        await renderQrWithLibrary(data);

      qrCanvas.width =
        canvas.width;

      qrCanvas.height =
        canvas.height;

      const ctx =
        qrCanvas.getContext("2d");

      ctx.clearRect(
        0,
        0,
        qrCanvas.width,
        qrCanvas.height
      );

      ctx.drawImage(
        canvas,
        0,
        0
      );

      generatedData = data;
      generatedSize =
        Number(qrSize.value);

      generatedForeground =
        foregroundColor.value;

      generatedBackground =
        backgroundColor.value;

      qrTypeResult.textContent =
        getTypeLabel();

      qrSizeResult.textContent =
        `${generatedSize} × ${generatedSize} px`;

      resultSummary.textContent =
        "Your QR code has been generated successfully.";

      resultSection.hidden = false;

      resultSection.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
        "Unable to generate the QR code."
      );
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent =
        "Generate QR Code";
    }
  }

  function downloadPng() {
    if (!generatedData) {
      alert(
        "Please generate a QR code first."
      );
      return;
    }

    try {
      const link =
        document.createElement("a");

      link.download =
        "nidar-qr-code.png";

      link.href =
        qrCanvas.toDataURL(
          "image/png"
        );

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

    } catch (error) {
      console.error(error);

      alert(
        "Unable to download the PNG file."
      );
    }
  }

  function createSvgFromPng() {
    const png =
      qrCanvas.toDataURL(
        "image/png"
      );

    const size =
      generatedSize;

    /*
     * The SVG contains the generated QR
     * as a lossless embedded PNG.
     * This keeps the SVG portable while
     * preserving the exact generated design.
     */
    return `
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="${size}"
     height="${size}"
     viewBox="0 0 ${size} ${size}">
  <rect
    width="${size}"
    height="${size}"
    fill="${escapeXml(generatedBackground)}"
  />
  <image
    width="${size}"
    height="${size}"
    href="${png}"
    x="0"
    y="0"
  />
</svg>`;
  }

  function downloadSvg() {
    if (!generatedData) {
      alert(
        "Please generate a QR code first."
      );
      return;
    }

    try {
      const svg =
        createSvgFromPng();

      const blob =
        new Blob(
          [svg],
          {
            type: "image/svg+xml;charset=utf-8"
          }
        );

      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        "nidar-qr-code.svg";

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

    } catch (error) {
      console.error(error);

      alert(
        "Unable to download the SVG file."
      );
    }
  }

  function resetTool() {
    qrType.value = "text";

    qrText.value = "";
    emailAddress.value = "";
    emailSubject.value = "";
    emailBody.value = "";
    phoneNumber.value = "";
    smsNumber.value = "";
    smsMessage.value = "";
    wifiName.value = "";
    wifiPassword.value = "";
    wifiSecurity.value = "WPA";
    wifiHidden.checked = false;

    qrSize.value = "512";
    errorCorrection.value = "M";

    foregroundColor.value =
      "#000000";

    backgroundColor.value =
      "#ffffff";

    generatedData = "";

    resultSection.hidden = true;

    updateColorLabels();
    updateInputMode();
    clearQrCanvas();

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  qrType.addEventListener(
    "change",
    updateInputMode
  );

  foregroundColor.addEventListener(
    "input",
    updateColorLabels
  );

  backgroundColor.addEventListener(
    "input",
    updateColorLabels
  );

  generateBtn.addEventListener(
    "click",
    generateQr
  );

  resetBtn.addEventListener(
    "click",
    resetTool
  );

  downloadPngBtn.addEventListener(
    "click",
    downloadPng
  );

  downloadSvgBtn.addEventListener(
    "click",
    downloadSvg
  );

  updateColorLabels();
  updateInputMode();

  console.log(
    "niDar Tools — QR Generator initialized."
  );
})();
