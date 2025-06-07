<script lang="ts">
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  	$effect(() => {
      
    });
</script>

<section class="">
  <div class="flex w-screen h-screen overflow-hidden">
  <!-- Column 1: Medium -->
  <div class="w-1/4 bg-base-200 p-4 overflow-hidden h-full flex flex-col">
    <!-- Top Row -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Top Half</p>
      <p>Content for row 1...</p>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Bottom Row -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Bottom Half</p>
      <p>Content for row 2...</p>
    </div>
  </div>


  <!-- Column 2: Large -->
  <div class="w-2/4 bg-base-100 p-4 overflow-y-auto">
    <!-- Content here -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Large Main Column</p>
      <p>Content for row 1...</p>
    </div>
  </div>

  <!-- Column 3: Small -->
  <div class="w-1/4 bg-base-200 p-4 overflow-hidden h-full flex flex-col">
    <!-- First Row -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Top Half</p>
      <p>Content for row 1...</p>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Second Row -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Bottom Half</p>
      <p>Content for row 2...</p>
    </div>

    <div class="divider"></div>

    <!-- Third Row -->
    <div class="flex-1 bg-base-100 rounded-xl p-2">
      <p class="text-lg font-bold">📄 Bottom Half</p>
      <p>Content for row 2...</p>
    </div>
  </div>
</div>
</section>