<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  onMount(() => {
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_contactus.jpg')";
  });
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:284px;"
  />
</div>
<div class="pageContainer">
  <div class="pageContainerInner" />
</div>
