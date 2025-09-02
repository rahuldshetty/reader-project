<script lang="ts">
    const { messaage } : { messaage:string } = $props();
</script>

<div class="w-full h-full flex flex-col gap-4 justify-center items-center">
    <span class="loading loading-spinner loading-xl"></span>
    <span class="">{messaage}</span>
</div>
