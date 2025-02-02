<script>
    import empty_logo from "$lib/assets/empty_logo.svg";
    const { message } = $props();
</script>

<div
    class="w-full h-screen cursor-default flex flex-col items-center justify-center gap-10"
>
    <img src={empty_logo} class="object-contain w-32" alt="Not Found" />
    <p class="text-xs">{message}</p>
</div>
