<script>
    const {onclick, disabled, text} = $props();
</script>

<button
    class="px-4 py-2 rounded-lg 
        {disabled? "bg-gray-100 text-gray-300":"text-gray-600 bg-gray-300 hover:bg-gray-400"}
    "
    onclick={onclick} 
    disabled={disabled}>
    {text}
</button>
