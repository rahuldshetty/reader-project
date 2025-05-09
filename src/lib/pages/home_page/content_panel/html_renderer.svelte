<script lang="ts">
    import type { ContentResult, PostResult } from "$lib/types";
    import { cleanHTML } from "$lib/utils/html";

    const { data, post }: { data: ContentResult; post: PostResult } = $props();
</script>

<div class="flex-1 overflow-y-auto">
    <div class="p-6">
        {#if data.image || post.image}
            <img
                src={data.image || post.image}
                alt={data.title}
                class="rounded-md object-cover max-h-96 w-full mb-4
                    transition-transform duration-300 ease-in-out transform hover:scale-101
                "
            />
        {/if}

        <article class="prose prose-base text-text1 max-w-none">
            {@html cleanHTML(data.content as string, data.url)}
        </article>
    </div>
</div>
