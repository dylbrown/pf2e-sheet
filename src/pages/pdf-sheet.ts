import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Character from 'src/character/character';

export default class PDFSheet {
  makeSheet(character: Character, pages: HTMLCollectionOf<HTMLElement>) {
    const firstPage = pages[0];
    const left = (firstPage.offsetWidth / 10.2) * 0.4;
    const top = (firstPage.offsetWidth / 10.2) * 0.4;
    const width = firstPage.offsetWidth;
    const height = firstPage.offsetHeight;

    const pagePromises = [];
    const scale = 8;
    for (const page of Array.from(pages)) {
      pagePromises.push(
        html2canvas(page, {
          scale: scale, // Adjusts your resolution
          windowWidth: 1100,
          windowHeight: 850,
          allowTaint: true,
          onclone: (document) => {
            Array.from(document.querySelectorAll('*')).forEach((e) => {
              const existingStyle = e.getAttribute('style') || '';
              e.setAttribute(
                'style',
                existingStyle +
                  '; font-family: Roboto Mono, monospace !important'
              );
            });
          },
        })
      );
    }
    Promise.all(pagePromises).then((canvases) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: 'letter',
        hotfixes: ['px_scaling'],
      });

      const img1 = canvases[0].toDataURL('image/jpeg', 1);
      const ctx = canvases[0].getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
      }
      doc.addImage(img1, 'JPEG', left, top, width, height);

      const multicanvas = canvases[1];
      const numPages = parseInt(pages[1].dataset.pages ?? '1');
      // Inspiration: https://stackoverflow.com/questions/14017442/capturing-only-a-portion-of-canvas-with-todataurl-javascript-html5
      for (let page = 0; page < numPages; page++) {
        const imageContentRaw = multicanvas
          .getContext('2d')
          ?.getImageData(
            0,
            page * height * scale,
            width * scale,
            height * scale
          );
        if (!imageContentRaw) continue;
        doc.addPage('letter', 'landscape');
        // create new canvas
        const canvas = document.createElement('canvas');
        // with the correct size
        canvas.width = width * scale;
        canvas.height = height * scale;
        // put there raw image data
        // expected to be faster as there are no scaling, etc
        canvas.getContext('2d')?.putImageData(imageContentRaw, 0, 0);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
        }
        // get image data (encoded as bas64)
        doc.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          left,
          top,
          width,
          height
        );
      }
      doc.save(`${character.name}_${character.level}.pdf`);
    });
  }
}
