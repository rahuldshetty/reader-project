<script lang="ts">
    import FeedEditButton from "./feed_edit_button.svelte";

    let { favicon, title, id, type } = $props();
</script>

<li>
    <div class="p-2">
        {#if favicon}
            <img
                class="w-6 h-6 object-cover"
                src={favicon}
                alt={title}
            />
        {/if}
        <span class="truncate">{title}</span>
        <FeedEditButton title={title} id={id} type={type}/>
    </div>
</li>
