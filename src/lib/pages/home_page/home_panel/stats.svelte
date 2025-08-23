<script lang="ts">
    const {total_posts, date}: {total_posts: number, date: string} = $props();

    const day = $derived.by(()=>{
      const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
      return day;
    })
</script>

<div class="stats bg-base-100 border-base-300 border">
  <div class="stat">
    <div class="stat-title">Day</div>
    <div class="stat-value">{day}</div>
  </div>

  <div class="stat">
    <div class="stat-title">Total Posts</div>
    <div class="stat-value">{total_posts}</div>
  </div>
</div>