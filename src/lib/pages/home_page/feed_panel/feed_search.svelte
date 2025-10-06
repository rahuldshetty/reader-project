<script lang="ts">
    import { ROOT_PARENT_FEED_ID } from "$lib/constants";
    import { search_keywords, active_feed_id } from "$lib/stores/app_store";
    import { refresh_posts } from "../common";


    const onSearchValueChange = async (e: Event) => {
        const text = (e.target as HTMLInputElement).value;
        if(text.trim().length == 0){
            $search_keywords = [];
        } else{
            $active_feed_id = ROOT_PARENT_FEED_ID;
            $search_keywords = text.toLowerCase().trim().split(/\s+/);
        }
        await refresh_posts($active_feed_id);
    }

</script>

<label class="input input-sm input-ghost">
  <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      stroke-linejoin="round"
      stroke-linecap="round"
      stroke-width="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input type="search" placeholder="Search" onchange={onSearchValueChange}/>
</label>
