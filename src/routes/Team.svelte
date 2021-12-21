<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  onMount(() => {
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_team.jpg')";
  });
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:284px;"
  >
    <div
      class="mainTitle"
      style="margin-top:60px;"
      in:fade={{ delay: 0, duration: 500 }}
    >
      Team
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      Consequuntur saepe reprehenderit provident esse ut itaque aut. Sapiente
      reiciendis tenetur atque perferendis ut quis in. Illum animi sed. Et
      libero aliquam ullam illum beatae facilis.
    </div>
  </div>
</div>
<div class="pageContainer" style="min-height:300px;">
  <div class="pageContainerInner">
    <div class="teamContainer">
      <div class="header">
        <div class="headerText">Our members</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">Get Consultancy From Our Expert Agents</div>
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/fernando.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Fernando Guardia</h2>
          <span>Founder & Chief Executive Officer</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/sebastian.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Sebastian Ewel</h2>
          <span>Chairman & Chief Financial Office</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/chris.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Chris Aitken</h2>
          <span>Chief Technology Officer</span>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="pageContainer" style="min-height:300px;background-color:#F2EFE5">
  <div class="pageContainerInner">
    <div class="teamContainer">
      <div class="header">
        <div class="headerText">Board of Directors</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText" />
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/luis.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Luis Fernando Guardia</h2>
          <span>President & CEO of Prodimsa S.A</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/monica.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Monica Virreira</h2>
          <span>Chairman & CLO of Prodimsa S.A</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/matias.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Matias Martinez</h2>
          <span>Founder & CEO of TocToc S.R.L</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/juan.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Juan Carlos Paniagua</h2>
          <span>Board member</span>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer" style="min-height:300px;">
  <div class="pageContainerInner">
    <div class="teamContainer">
      <div class="header">
        <div class="headerText">Sint illo esse et enim est</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">Our partners</div>
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/tdameritrade.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/interactivebrokers.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/prodisma.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/investmentlawgroup.jpg" />
      </div>
    </div>
  </div>
</div>

<style>
  .teamContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    margin-bottom: -50px;
  }
</style>
