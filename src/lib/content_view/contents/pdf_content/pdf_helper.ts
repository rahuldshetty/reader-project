import * as pdfjs from 'pdfjs-dist';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

// Function to convert PDF to HTML string
export async function pdfToHtmlString(arrayBuffer) {
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;

    let htmlString = '<div class="pdf-content">';

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        htmlString += `<div class="pdf-page" data-page="${pageNum}">`;

        textContent.items.forEach(item => {
            htmlString += `<p>${item.str}</p>`;
        });

        htmlString += '</div>';
    }

    htmlString += '</div>';
    return htmlString;
}
