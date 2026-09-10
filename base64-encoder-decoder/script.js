(function () {
  'use strict';

  /* =========================================================
     niDar Tools — Base64 Encoder & Decoder
     Tool #11 — Client-side JavaScript
     ========================================================= */


  // ---------------------------------------------------------
  // ELEMENT HELPER
  // ---------------------------------------------------------

  function $(id) {
    return document.getElementById(id);
  }


  // ---------------------------------------------------------
  // ELEMENTS
  // ---------------------------------------------------------

  const encodeInput = $('encodeInput');
  const encodeBtn = $('encodeBtn');
  const clearEncodeBtn = $('clearEncodeBtn');

  const encodeResultBox = $('encodeResultBox');
  const encodeOutput = $('encodeOutput');
  const encodeStatus = $('encodeStatus');

  const copyEncodeBtn = $('copyEncodeBtn');
  const downloadEncodeBtn = $('downloadEncodeBtn');


  const decodeInput = $('decodeInput');
  const decodeBtn = $('decodeBtn');
  const clearDecodeBtn = $('clearDecodeBtn');

  const decodeResultBox = $('decodeResultBox');
  const decodeOutput = $('decodeOutput');
  const decodeStatus = $('decodeStatus');

  const copyDecodeBtn = $('copyDecodeBtn');
  const downloadDecodeBtn = $('downloadDecodeBtn');


  const useEncodedAsInputBtn =
    $('useEncodedAsInputBtn');

  const useDecodedAsInputBtn =
    $('useDecodedAsInputBtn');

  const swapBtn =
    $('swapBtn');

  const clearAllBtn =
    $('clearAllBtn');

  const startToolBtn =
    $('startToolBtn');


  // ---------------------------------------------------------
  // BASE64 HELPERS
  // ---------------------------------------------------------

  function encodeUTF8(text) {

    const bytes =
      new TextEncoder().encode(text);

    let binary = '';

    const chunkSize = 0x8000;

    for (
      let i = 0;
      i < bytes.length;
      i += chunkSize
    ) {

      const chunk =
        bytes.subarray(
          i,
          Math.min(
            i + chunkSize,
            bytes.length
          )
        );

      binary += String.fromCharCode.apply(
        null,
        chunk
      );
    }

    return btoa(binary);
  }


  function decodeUTF8(base64) {

    const cleaned =
      base64
        .replace(/\s/g, '')
        .replace(/-/g, '+')
        .replace(/_/g, '/');


    if (!cleaned) {
      return '';
    }


    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(cleaned)) {
      throw new Error(
        'Invalid Base64 characters.'
      );
    }


    if (cleaned.length % 4 === 1) {
      throw new Error(
        'Invalid Base64 length.'
      );
    }


    const padded =
      cleaned +
      '='.repeat(
        (4 - (cleaned.length % 4)) % 4
      );


    const binary =
      atob(padded);

    const bytes =
      new Uint8Array(
        binary.length
      );


    for (
      let i = 0;
      i < binary.length;
      i++
    ) {
      bytes[i] =
        binary.charCodeAt(i);
    }


    return new TextDecoder(
      'utf-8',
      {
        fatal: true
      }
    ).decode(bytes);
  }


  // ---------------------------------------------------------
  // ENCODE
  // ---------------------------------------------------------

  function encodeText() {

    const text =
      encodeInput.value;


    if (!text) {

      alert(
        'कृपया Encode करण्यासाठी text भरा.'
      );

      encodeInput.focus();

      return;
    }


    try {

      const result =
        encodeUTF8(text);


      encodeOutput.value =
        result;


      encodeResultBox.hidden =
        false;


      encodeStatus.textContent =
        'Encoded successfully';


      encodeStatus.style.color =
        '#087f35';


      encodeResultBox.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });

    } catch (error) {

      console.error(error);

      alert(
        'Text encode करताना error आली.'
      );
    }
  }


  // ---------------------------------------------------------
  // DECODE
  // ---------------------------------------------------------

  function decodeText() {

    const base64 =
      decodeInput.value.trim();


    if (!base64) {

      alert(
        'कृपया Decode करण्यासाठी Base64 text भरा.'
      );

      decodeInput.focus();

      return;
    }


    try {

      const result =
        decodeUTF8(base64);


      decodeOutput.value =
        result;


      decodeResultBox.hidden =
        false;


      decodeStatus.textContent =
        'Decoded successfully';


      decodeStatus.style.color =
        '#087f35';


      decodeResultBox.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });

    } catch (error) {

      console.error(error);

      decodeResultBox.hidden =
        false;


      decodeStatus.textContent =
        'Invalid Base64';


      decodeStatus.style.color =
        '#c62828';


      decodeOutput.value =
        'Unable to decode this value.\n\n' +
        'Please check that the input is valid Base64.';

    }
  }


  // ---------------------------------------------------------
  // COPY HELPER
  // ---------------------------------------------------------

  async function copyText(
    text,
    button,
    originalLabel
  ) {

    if (!text) {

      alert(
        'Copy करण्यासाठी result उपलब्ध नाही.'
      );

      return;
    }


    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          text
        );

      } else {

        const temp =
          document.createElement('textarea');

        temp.value =
          text;

        temp.style.position =
          'fixed';

        temp.style.left =
          '-9999px';

        document.body.appendChild(temp);

        temp.select();

        document.execCommand('copy');

        temp.remove();
      }


      button.textContent =
        '✓ Copied';


      setTimeout(function () {

        button.textContent =
          originalLabel;

      }, 1600);

    } catch (error) {

      console.error(error);

      alert(
        'Clipboard मध्ये copy करता आले नाही.'
      );
    }
  }


  // ---------------------------------------------------------
  // DOWNLOAD TEXT FILE
  // ---------------------------------------------------------

  function downloadTextFile(
    text,
    filename
  ) {

    if (!text) {

      alert(
        'Download करण्यासाठी result उपलब्ध नाही.'
      );

      return;
    }


    const blob =
      new Blob(
        [text],
        {
          type: 'text/plain;charset=utf-8'
        }
      );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement('a');

    link.href =
      url;

    link.download =
      filename;

    document.body.appendChild(link);

    link.click();

    link.remove();


    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }


  // ---------------------------------------------------------
  // CLEAR ENCODE
  // ---------------------------------------------------------

  function clearEncode() {

    encodeInput.value =
      '';

    encodeOutput.value =
      '';

    encodeResultBox.hidden =
      true;

    encodeStatus.textContent =
      'Ready';

    encodeStatus.style.color =
      '';

    encodeInput.focus();
  }


  // ---------------------------------------------------------
  // CLEAR DECODE
  // ---------------------------------------------------------

  function clearDecode() {

    decodeInput.value =
      '';

    decodeOutput.value =
      '';

    decodeResultBox.hidden =
      true;

    decodeStatus.textContent =
      'Ready';

    decodeStatus.style.color =
      '';

    decodeInput.focus();
  }


  // ---------------------------------------------------------
  // USE ENCODED RESULT AS DECODE INPUT
  // ---------------------------------------------------------

  function useEncodedResult() {

    const value =
      encodeOutput.value.trim();


    if (!value) {

      alert(
        'आधी Encoded Result तयार करा.'
      );

      return;
    }


    decodeInput.value =
      value;


    decodeInput.focus();


    decodeInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }


  // ---------------------------------------------------------
  // USE DECODED RESULT AS ENCODE INPUT
  // ---------------------------------------------------------

  function useDecodedResult() {

    const value =
      decodeOutput.value;


    if (!value) {

      alert(
        'आधी Decoded Result तयार करा.'
      );

      return;
    }


    encodeInput.value =
      value;


    encodeInput.focus();


    encodeInput.dispatchEvent(
      new Event('input')
    );


    encodeInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }


  // ---------------------------------------------------------
  // SWAP INPUTS
  // ---------------------------------------------------------

  function swapInputs() {

    const encoded =
      encodeInput.value;

    const decoded =
      decodeInput.value;


    encodeInput.value =
      decoded;

    decodeInput.value =
      encoded;


    encodeResultBox.hidden =
      true;

    decodeResultBox.hidden =
      true;


    encodeInput.focus();
  }


  // ---------------------------------------------------------
  // CLEAR ALL
  // ---------------------------------------------------------

  function clearAll() {

    encodeInput.value =
      '';

    decodeInput.value =
      '';

    encodeOutput.value =
      '';

    decodeOutput.value =
      '';


    encodeResultBox.hidden =
      true;

    decodeResultBox.hidden =
      true;


    encodeStatus.textContent =
      'Ready';

    decodeStatus.textContent =
      'Ready';


    encodeStatus.style.color =
      '';

    decodeStatus.style.color =
      '';


    encodeInput.focus();
  }


  // ---------------------------------------------------------
  // START TOOL
  // ---------------------------------------------------------

  function startTool() {

    encodeInput.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });


    setTimeout(function () {
      encodeInput.focus();
    }, 450);
  }


  // =========================================================
  // BUTTON EVENTS
  // =========================================================

  encodeBtn.addEventListener(
    'click',
    encodeText
  );


  decodeBtn.addEventListener(
    'click',
    decodeText
  );


  clearEncodeBtn.addEventListener(
    'click',
    clearEncode
  );


  clearDecodeBtn.addEventListener(
    'click',
    clearDecode
  );


  copyEncodeBtn.addEventListener(
    'click',
    function () {

      copyText(
        encodeOutput.value,
        copyEncodeBtn,
        '📋 Copy'
      );

    }
  );


  copyDecodeBtn.addEventListener(
    'click',
    function () {

      copyText(
        decodeOutput.value,
        copyDecodeBtn,
        '📋 Copy'
      );

    }
  );


  downloadEncodeBtn.addEventListener(
    'click',
    function () {

      downloadTextFile(
        encodeOutput.value,
        'nidar-base64-encoded.txt'
      );

    }
  );


  downloadDecodeBtn.addEventListener(
    'click',
    function () {

      downloadTextFile(
        decodeOutput.value,
        'nidar-base64-decoded.txt'
      );

    }
  );


  useEncodedAsInputBtn.addEventListener(
    'click',
    useEncodedResult
  );


  useDecodedAsInputBtn.addEventListener(
    'click',
    useDecodedResult
  );


  swapBtn.addEventListener(
    'click',
    swapInputs
  );


  clearAllBtn.addEventListener(
    'click',
    clearAll
  );


  startToolBtn.addEventListener(
    'click',
    startTool
  );


  // =========================================================
  // ENTER / CTRL + ENTER SUPPORT
  // =========================================================

  encodeInput.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Enter' &&
        (event.ctrlKey || event.metaKey)
      ) {

        event.preventDefault();

        encodeText();
      }

    }
  );


  decodeInput.addEventListener(
    'keydown',
    function (event) {

      if (
        event.key === 'Enter' &&
        (event.ctrlKey || event.metaKey)
      ) {

        event.preventDefault();

        decodeText();
      }

    }
  );


  // =========================================================
  // INPUT STATUS
  // =========================================================

  encodeInput.addEventListener(
    'input',
    function () {

      if (encodeInput.value) {

        encodeStatus.textContent =
          'Text ready';

      } else {

        encodeStatus.textContent =
          'Ready';
      }

    }
  );


  decodeInput.addEventListener(
    'input',
    function () {

      if (decodeInput.value) {

        decodeStatus.textContent =
          'Base64 ready';

      } else {

        decodeStatus.textContent =
          'Ready';
      }

    }
  );


  // =========================================================
  // INITIAL STATE
  // =========================================================

  encodeResultBox.hidden =
    true;

  decodeResultBox.hidden =
    true;

})();
