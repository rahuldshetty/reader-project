<script lang="ts">
    import Spinner from "$lib/components/spinner.svelte";
    import { summarize_content } from "$lib/services/ai_llm_service";
    import Fa from "svelte-fa";
    import { 
        faRobot,
    } from "@fortawesome/free-solid-svg-icons";
    const { text }: { text: string } = $props();
</script>

{#await summarize_content(text)}
    <div class="mt-4 ml-4 mr-4">
            <ul class="list bg-base-300 rounded-box shadow-md">
                <li class="pl-4 pr-4 pt-4 text-xs opacity-80 tracking-wide">
                    <div class="flex flex-row items-center gap-2">
                        <Fa icon={faRobot} size="sm" />
                        <div>AI Generated Summary</div>
                    </div>
                </li>
                <div class="flex w-full justify-center p-4">
                    <Spinner/>
                </div>
            </ul>
    </div>
{:then keyPoints}
    {#if keyPoints.length > 0}
        <div class="mt-4 ml-4 mr-4">
            <ul class="list bg-base-300 rounded-box shadow-md">
                <li class="p-4 text-xs opacity-100 tracking-wide">
                    <div class="flex flex-row items-center gap-2">
                        <Fa icon={faRobot} size="sm" />
                        <div>AI Generated Summary</div>
                    </div>
                </li>
                {#each keyPoints as keyPoint}
                    <li class="list-row">
                        <div class="text-xs opacity-80 ">
                            {keyPoint}
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
{/await}
