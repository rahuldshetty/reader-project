<script lang="ts">
    import icon from "$lib/assets/ico-1024.png"
    import Titlebar from "$lib/components/titlebar.svelte";

</script>

<Titlebar />

<div class="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white">
  <div class="text-center animate-fade-in">
    <img src={icon} alt="AI-Toolkit Logo" class="mx-auto mb-4 w-32 h-32" />
    <h1 class="text-5xl font-bold mb-6">Reader-Project</h1>
    <div class="flex w-full justify-center items-center mb-4">
      <div class="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
    </div>
    <p class="text-lg">Loading News...</p>
  </div>
</div>

<style>
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fade-in {
    animation: fade-in 1.5s ease-in-out;
  }
</style>
