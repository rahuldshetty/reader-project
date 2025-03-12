<script>
    import { cleanHTML } from "$lib/content_view/contents/html_content/html_cleaner";

    const { content, image, title, url } = $props();
</script>

<!-- To set margin: max-w-6xl -->
<div class="max-w-6xl">
    {#if content && image && !content.includes("img")}
        <img
            src={image}
            alt={title}
            class="rounded-md object-cover"
        />
    {/if}

    <div
        class="mt-4 mr-4 indent-0 text-text1 text-base font-normal leading-relaxed text-justify mb-20"
    >
        <article class="content">
            {@html cleanHTML(content, url)}
        </article>
    </div>
</div>


<style>
    article :global {
        * {
            @apply max-w-screen-2xl;
        }
        p {
            @apply text-text1 mt-3 mb-3 text-base antialiased font-normal;
        }

        li p {
            margin: 0; /* Remove unwanted margins */
            display: inline; /* Force inline content */
        }

        a {
            pointer-events: none;
            cursor: default;
        }

        h1 {
            @apply text-5xl font-medium text-text1 mt-4 mb-4;
        }
        h2 {
            @apply text-4xl font-medium text-text1 mt-4 mb-4;
        }
        h3 {
            @apply text-3xl font-medium text-text1 mt-4 mb-4;
        }
        h4 {
            @apply text-2xl font-medium text-text1 mt-4 mb-4;
        }
        h5 {
            @apply text-xl font-medium text-text1 mt-4 mb-4;
        }
        h6 {
            @apply text-base font-medium text-text1 mt-4 mb-4;
        }

        ul {
            @apply list-inside list-disc;
        }

        code {
            @apply text-sm font-mono;
        }

        img {
            @apply max-w-5xl;
        }

        pre {
            @apply text-text1 bg-pre rounded-md p-4 max-w-6xl whitespace-pre-wrap mt-1 mb-1;
        }

        /* Table Styling */
        table {
            @apply table w-1/2 text-sm text-left text-text1;
        }

        thead {
            @apply table-header-group font-medium uppercase;
        }

        th {
            @apply px-6 py-3;
        }

        tr {
            @apply table-row border-b;
        }

        tbody {
            @apply table-row-group;
        }

        td {
            @apply table-cell px-2 py-1;
        }
    }
</style>
