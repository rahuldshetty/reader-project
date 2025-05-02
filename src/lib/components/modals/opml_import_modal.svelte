<script>
    import { SETTINGS, MODAL_TYPE, FEED_TYPE, NO_OF_POST_PULLS_PER_TIME } from "$lib/constants";
    import { add_feed, add_posts, fetch_folder_feeds, fetch_posts, fetch_unread_post_counts } from "$lib/db";

    import { selected_modal, opml_modal_data, feeds_store, feed_unread_post_count, posts_by_feed_store, posts_sort_by, unread_posts_only } from "$lib/store";
    import { fetchRSSMetadata, parseOPML } from "$lib/utils";

    let opml_list = $state([]);
    let selected = $state(new Set());
    let loading = $state(false);

    opml_modal_data.subscribe(async (opml_data)=>{
        if(opml_data != ""){
            opml_list = parseOPML(opml_data);
            selected = new Set(opml_list.map((item, index) => index));
        }
    });

    const toggleSelect = (/** @type {number} */ index) => {
        if(selected.has(index)){
            selected.delete(index)
        } else {
            selected.add(index);
        }
        selected = new Set(selected);
    }

    const toggleAll = () => {
        const size = selected.size
        if(size == opml_list.length){
            selected = new Set();
        } else{
            selected = new Set(opml_list.map((item, index) => index));
        }
    }

    const import_opml = async () => {
        loading = true;
        for(const index of selected){
            const feed = opml_list[index];
            const response = await fetchRSSMetadata(-1, feed.xmlUrl);
            if(response){
                const feedName = response.name;
                const feedIcon = response.favicon;
                const feedPosts = response.posts;
                
                // Add Feed to DB
                const feedId = await add_feed(feedName, feed.xmlUrl, feedIcon, FEED_TYPE.FEED, -1);

                // Add Posts to DB
                if(feedId && feedPosts){
                    const posts = [];
                    for (var post of feedPosts) {
                        posts.push({
                            ...post,
                            feed_id: feedId,
                        });
                    }
                    await add_posts(posts);

                    $posts_by_feed_store[feedId] = await fetch_posts(
                        $posts_sort_by,
                        null,
                        feedId,
                        0,
                        NO_OF_POST_PULLS_PER_TIME,
                        $unread_posts_only,
                    );
                }
            } else {
                console.error(`UNABLE TO ADD: ${feed.xmlUrl}`)
            }
        };
        
        $feeds_store = await fetch_folder_feeds();
        $feed_unread_post_count = await fetch_unread_post_counts();

        $opml_modal_data = "";
        opml_list = [];
        loading = false;
        $selected_modal = MODAL_TYPE.NONE;
    };
</script>

<div
    id="settingModal"
    class="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex items-center justify-center z-10
    {$selected_modal != MODAL_TYPE.OPML_IMPORT ? 'hidden' : ''}
    "
>
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 class="text-lg font-bold mb-4">Import OPML</h2>

        {#if loading}
            <div class="flex justify-center items-center">
                <div class="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        {:else}

            <div class="text-normal mb-4">
                Select the feeds which you want to import.
            </div>
            
            <div class="flex ml-2 mb-2 cursor-pointer" onclick={toggleAll}>
                <input type="checkbox" checked={selected.size === opml_list.length}/>
                <span class="ml-2">
                    {selected.size === opml_list.length ? 'Deselect' : 'Select'}
                </span>
            </div>

            <div class="flex flex-col max-h-96 overflow-auto">
                {#each opml_list as opml, index}
                    <div class="flex items-center cursor-pointer p-2 bg-gray-50 rounded hover:bg-gray-100"
                        onclick={()=>toggleSelect(index)}
                    >
                        <input type="checkbox" checked={selected.has(index)}/>
                        <label class="ml-2">{opml.name}</label>
                    </div>
                {/each}

            </div>

            <div class="flex justify-end gap-2 mt-10">
                <button
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    onclick={import_opml}
                >
                    Import
                </button>
                <button
                    class="px-4 py-2 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
                    onclick={() => {
                        console.log("CLOSING MODAL");
                        $selected_modal = MODAL_TYPE.NONE;
                    }}
                >
                    Cancel
                </button>
            </div>
        {/if}
    </div>
</div>
