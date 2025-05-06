<script>
    import { active_modal } from "$lib/store";
    import { MODAL_TYPE } from '$lib/constants';
</script>

<div class="modal" class:modal-open={$active_modal == MODAL_TYPE.ADD}>
    <div class="modal-box">
      <h3 class="font-bold text-lg">Congratulations Interner user!</h3>
      <p class="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for free!</p>
      <div class="modal-action">
        <button class="btn" on:click={()=>$active_modal = MODAL_TYPE.NONE}>Yay!</button>
      </div>
    </div>
</div>
