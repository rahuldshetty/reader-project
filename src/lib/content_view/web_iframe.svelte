<script>
    const {link, title} = $props();
</script>

<iframe
    src={link}
    class="w-full h-full border-none"
    title={title}
    sandbox="allow-scripts allow-forms"
></iframe>