import * as pdfjs from 'pdfjs-dist';
import * as pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs';

pdfjs.GlobalWorkerOptions.workerSrc = import.meta.url + 'pdfjs-dist/build/pdf.worker.mjs';

export const loadPdf = async (data) => {
    const loadingTask = pdfjs.getDocument({data: data});
    let pdfDocument = await loadingTask.promise;
    return pdfDocument;
}
