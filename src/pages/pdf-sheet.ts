import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Character from 'src/character/character';

export default class PDFSheet {
  makeSheet(character: Character, pages: HTMLCollectionOf<HTMLElement>) {
    const pagePromises = [];
    const scale = 10;
    for (const page of Array.from(pages)) {
      pagePromises.push(
        html2canvas(page, {
          scale: scale, // Adjusts your resolution
          windowWidth: (window.innerHeight * 11.0) / 8.5,
          windowHeight: window.innerHeight,
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
        unit: 'in',
        format: 'letter',
      });

      const ctx = canvases[0].getContext('2d');
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
      }
      doc.addImage(
        canvases[0].toDataURL('image/jpeg', 1),
        'JPEG',
        0.4,
        0.4,
        10.2,
        7.7
      );

      const multicanvas = canvases[1];
      const numPages = parseInt(pages[1].dataset.pages ?? '1');
      // Inspiration: https://stackoverflow.com/questions/14017442/capturing-only-a-portion-of-canvas-with-todataurl-javascript-html5
      for (let page = 0; page < numPages; page++) {
        const imageContentRaw = multicanvas
          .getContext('2d')
          ?.getImageData(
            0,
            (page * multicanvas.height) / 1.0 / numPages,
            multicanvas.width,
            multicanvas.height / 1.0 / numPages
          );
        if (!imageContentRaw) continue;
        doc.addPage('letter', 'landscape');
        // create new canvas
        const canvas = document.createElement('canvas');
        // with the correct size
        canvas.width = multicanvas.width;
        canvas.height = multicanvas.height / 1.0 / numPages;
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
          0.4,
          0.4,
          10.2,
          7.7
        );
      }
      doc.save(`${character.name}_${character.level}.pdf`);
    });
  }
}
