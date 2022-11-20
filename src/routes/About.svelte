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
      "url('images/background_about.jpg')";
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
      {$_("about.main.title")}
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      {$_("about.main.subtitle")}
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner" style="padding-bottom:0px;">
    <div class="row">
      <img alt="" class="rowItem" src="images/fernando_cover.jpg" />
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("about.section1.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("about.section1.subtitle")}</div>
        <div class="containerOne">
          <div class="containerOneText">
            <p>
              {$_("about.section1.paragraph1")}
            </p>
            <p>
              {$_("about.section1.paragraph2")}
            </p>
            <p>
              {$_("about.section1.paragraph3")}
            </p>
            <p class="section1Quote">
              {$_("about.section1.quote")}
            </p>
            <div class="section1QuoteImage">❞</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="pageContainer" style="background-color:#F2EFE5">
  <div class="pageContainerInner">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("about.section2.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("about.section2.subtitle")}</div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="medal" src="images/classroom.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("about.section2.badge1.title")}</div>
            <div class="awardSubtitle">
              {$_("about.section2.badge1.description")}
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="certificate" src="images/support.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">
              {$_("about.section2.badge2.title")}
            </div>
            <div class="awardSubtitle">
              {$_("about.section2.badge2.description")}
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="certificate" src="images/confidentiality.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">
              {$_("about.section2.badge3.title")}
            </div>
            <div class="awardSubtitle">
              {$_("about.section2.badge3.description")}
            </div>
          </div>
        </div>
      </div>
      <img alt="" class="rowItem mobile" src="images/about1.jpg" />
    </div>
  </div>
  <img alt="" class="rowItem desktop" src="images/about1.jpg" />
</div>
<div class="pageContainer" style="min-height:550px;">
  <div class="pageContainerInner">
    <div>
      <div class="header" style="margin-top:50px;">
        <div class="headerLine" />
        <div class="headerText">
          {$_("about.section3.title")}
        </div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">{$_("about.section3.subtitle")}</div>
      <div class="containerOneText">
        <p>
          {$_("about.section3.paragraph1")}
        </p>
        <p>
          {$_("about.section3.paragraph2")}
        </p>
        <p>
          {$_("about.section3.paragraph3")}
        </p>
        <p>
          {$_("about.section3.paragraph4")}
        </p>
      </div>
    </div>
  </div>
</div>
<div class="blueContainer">
  <div class="subHeaderText" style="color:#ffffff">
    {$_("about.section4.title")}
  </div>
  <div class="row">
    <ul class="rowItem">
      <li>{$_("about.section4.bullet1")}</li>
      <li>{$_("about.section4.bullet2")}</li>
      <li>{$_("about.section4.bullet3")}</li>
      <li>{$_("about.section4.bullet4")}</li>
      <li>{$_("about.section4.bullet5")}</li>
      <li>{$_("about.section4.bullet6")}</li>
    </ul>
    <ul class="rowItem">
      <li>{$_("about.section4.bullet7")}</li>
      <li>{$_("about.section4.bullet8")}</li>
      <li>{$_("about.section4.bullet9")}</li>
      <li>{$_("about.section4.bullet10")}</li>
      <li>{$_("about.section4.bullet11")}</li>
      <li>{$_("about.section4.bullet12")}</li>
    </ul>
  </div>
</div>
<img alt="" style="width:100%;" src="images/about2.jpg" />

<div class="pageContainer" style="min-height:300px;">
  <div class="pageContainerInner">
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;"
    >
      <div class="header" style="margin-top:50px;">
        <div class="headerLine" />
        <div class="headerText">{$_("about.section5.title")}</div>
        <div class="headerLine" />
      </div>
    </div>
    <div class="teamBlocks" in:fade>
      <div class="teamBlocksInner">
        <img alt="" src="images/tradestation.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/gemini.jpg" />
      </div>
      <div class="teamBlocksInner">
        <img alt="" src="images/investmentlawgroup.jpg" />
      </div>
    </div>
    <div class="teamBlocks" in:fade>
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
  .row {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
  }
  .rowItem {
    width: 50%;
  }
  .mobile {
    display: none;
  }
  .desktop {
    display: unset;
  }
  .blueContainer {
    position: absolute;
    right: 0px;
    width: 60%;
    background-color: #021c32;
    color: #ffffff;
    padding: 50px;
    margin-top: -100px;
  }
  .section1Quote {
    font-style: italic;
    font-size: 24px;
    color: #888888;
    z-index: 1;
    position: relative;
  }
  .section1QuoteImage {
    font-size: 170px;
    color: #ddd;
    width: 100%;
    text-align: right;
    margin-top: -130px;
  }
  @media only screen and (max-width: 850px) {
    .row {
      flex-direction: column;
    }
    .rowItem {
      width: 100%;
    }
    .desktop {
      display: none;
    }
    .mobile {
      display: unset;
    }
    .blueContainer {
      position: relative;
      width: calc(100% - 60px);
      padding: 20px;
      margin: 0px;
    }
    .awardTextContainer {
      width: 200px;
    }

    .awardIcon {
      margin-right: 20px;
      margin-left: -10px;
    }
  }
</style>
