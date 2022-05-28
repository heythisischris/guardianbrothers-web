<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    const isMobile = window.matchMedia(
      "only screen and (max-width: 760px)"
    ).matches;
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_team.jpg')";
    document.querySelectorAll("#body")[0].style.backgroundPosition = `50% ${
      isMobile ? "50" : "100"
    }px`;
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
      {$_("team.main.title")}
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      {$_("team.main.subtitle")}
    </div>
  </div>
</div>
<div class="pageContainer" style="min-height:300px;">
  <div class="pageContainerInner">
    <div class="teamContainer">
      <div class="header">
        <div class="headerLine" />
        <div class="headerText">{$_("team.section1.title")}</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">{$_("team.section1.subtitle")}</div>
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/fernando.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Fernando Guardia</h2>
          <span>Founder & CEO</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/sebastian.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Sebastian Ewel</h2>
          <span>Chairman & Chief Financial Officer</span>
        </div>
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/matias.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Matias Martinez</h2>
          <span>Chief Sales Officer</span>
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
        <div class="headerLine" />
        <div class="headerText">{$_("team.section2.title")}</div>
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
        <img alt="" src="images/manuel.jpg" />
        <div class="teamBlocksInnerText">
          <h2>Manuel Sauma</h2>
          <span>Growth Lead at Mano Pagos</span>
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
        <div class="headerLine" />
        <div class="headerText">{$_("team.section3.title")}</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText" />
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/interactivebrokers.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/paxos.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/investmentlawgroup.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/nav.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/summit.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/prodisma.jpg" />
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
  .mainTitle {
    margin-top: 15px !important;
  }
</style>
