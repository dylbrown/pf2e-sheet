import jsPDF from 'jspdf';

addEventListener('message', async (message) => {
  const blobs: Blob[] = message.data.blobs;
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'in',
    format: 'letter',
  });
  if (!blobs[0] || !blobs[1]) return;
  doc.addImage(URL.createObjectURL(blobs[0]), 'JPEG', 0.4, 0.4, 10.2, 7.7);

  const bmp = await createImageBitmap(blobs[1]);
  const { width, height } = bmp;
  const multicanvas = new OffscreenCanvas(width, height);
  multicanvas
    .getContext('2d', { willReadFrequently: true })
    ?.drawImage(bmp, 0, 0);
  bmp.close(); // free memory
  const numPages = message.data.numPages;
  // Inspiration: https://stackoverflow.com/questions/14017442/capturing-only-a-portion-of-canvas-with-todataurl-javascript-html5
  for (let page = 0; page < numPages; page++) {
    const imageContentRaw = multicanvas
      .getContext('2d')
      ?.getImageData(
        0,
        (page * multicanvas.height) / 1.0 / numPages,
        multicanvas.width,
        multicanvas.height / 1.0 / numPages,
      );
    if (!imageContentRaw) continue;
    doc.addPage('letter', 'landscape');
    // create new canvas
    // with the correct size
    const canvas = new OffscreenCanvas(
      multicanvas.width,
      multicanvas.height / 1.0 / numPages,
    );
    // put there raw image data
    // expected to be faster as there are no scaling, etc
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.putImageData(imageContentRaw, 0, 0);
      ctx.font = '30px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText((page + 1).toString(), canvas.width / 2, canvas.height - 5);
      ctx.imageSmoothingEnabled = true;
    }
    // get image data (encoded as bas64)
    doc.addImage(
      URL.createObjectURL(await canvas.convertToBlob()),
      'JPEG',
      0.4,
      0.4,
      10.2,
      7.7,
    );
  }
  postMessage(doc.output('datauristring'));
});
