<script lang="ts">
  import { getVersion } from "@tauri-apps/api/app";
  import icon from "$lib/assets/ico-1024.png";
</script>

<div
  class="flex items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-600 text-white"
>
  <div class="text-center animate-fade-in">
    <img src={icon} alt="AI-Toolkit Logo" class="mx-auto mb-4 w-24 h-24" />
    <div class="mb-6">
      <h1 class="text-4xl font-bold">Reader-Project</h1>

      {#await getVersion() then version}
        <span class="text-sm self-end block text-right">v{version}</span>
      {/await}
    </div>
    <div class="flex w-full justify-center items-center mb-4">
      
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .animate-fade-in {
    animation: fade-in 1.5s ease-in-out;
  }
</style>
