import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import font from './Roboto-Mono';
import Character from 'src/character/character';

export default class PDFSheet {
  makeSheet(character: Character, pages: HTMLCollectionOf<HTMLElement>) {
    const firstPage = pages[0];
    const left = (firstPage.offsetWidth / (11 - 0.8)) * 0.8;
    const top = (firstPage.offsetHeight / (8.5 - 0.8)) * 0.8;
    const width = firstPage.offsetWidth;
    const height = firstPage.offsetHeight;

    const pagePromises = [];
    for (const page of Array.from(pages)) {
      pagePromises.push(
        html2canvas(page, {
          scale: 10, // Adjusts your resolution
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

      doc.addFileToVFS('Roboto Mono', font);
      doc.addFont('Roboto Mono', 'RobotoMono-Regular', 'normal');
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
          ?.getImageData(0, page * height * 10, width * 10, height * 10);
        if (!imageContentRaw) continue;
        doc.addPage('letter', 'landscape');
        // create new canvas
        const canvas = document.createElement('canvas');
        // with the correct size
        canvas.width = width * 10;
        canvas.height = height * 10;
        // put there raw image data
        // expected to be faster as tere are no scaling, etc
        canvas.getContext('2d')?.putImageData(imageContentRaw, 0, 0);
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
