<script lang="ts">
    import { get_random_bg } from "$lib/pages/components/random_background";
    import type { PostResult } from "$lib/types";

    const { post, total }: { post: PostResult | null, total: number } = $props();
</script>

{#if post == null}
    <div class="card bg-base-100 image-full w-96 shadow-sm">
        <div class="card-body">
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-32 w-full"></div>
        </div>
    </div>
{:else}
    <div class="card h-1/3 bg-base-100 image-full shadow-sm
        transition-transform duration-200 hover:scale-[1.02] hover:shadow-md
    ">
        <figure>
            <img
            class="w-full h-full object-cover"
            src={post.image == '' ? get_random_bg():post.image}
            alt={post.title}
            />
        </figure>
        <div class="card-body">
            <h2 class="card-title">{post.title}</h2>
            <div class="card-actions justify-end mt-auto">
                <button class="btn btn-primary">Read More</button>
            </div>
        </div>
    </div>
{/if}