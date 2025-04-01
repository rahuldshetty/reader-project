<script lang="ts">
    import { onMount } from "svelte";
    import { loadPdf } from "./pdf_helper";
    import AppButton from "$lib/components/AppButton.svelte";

    const { content, image, title, url } = $props();

    let canvas;

    let pdfDocument = null;
    let currentPage = $state(1);
    let scale = 2.0;
    let context;

    onMount(async ()=>{
        if(url){
            pdfDocument = await loadPdf(content);
            renderPage(currentPage);
        }
    })
    
    const renderPage = async (pageNumber: number) => {
        const page = await pdfDocument.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        context = canvas.getContext('2d');
        const renderContext = {
        canvasContext: context,
        viewport: viewport
        };
        await page.render(renderContext).promise;
    }

    function nextPage() {
        if (currentPage < pdfDocument.numPages) {
            currentPage++;
            renderPage(currentPage);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
        }
    }

</script>

<div class="mb-2">
    <AppButton onclick={prevPage} disabled={currentPage === 1} text={'Previous'}/>
    <AppButton onclick={nextPage} disabled={currentPage === pdfDocument?.numPages} text={'Next'}/>
</div>

<canvas bind:this={canvas}/>
