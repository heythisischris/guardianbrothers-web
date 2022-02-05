<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_home.jpg')";
  });
  async function loadAPI(url) {
    let data = await fetch(url);
    let response = await data.json();
    return response;
  }
  var stats = loadAPI("https://lambda.guardianbrothers.com/stats");
  stats.then((innerStats) => {
    stats = innerStats;
  });

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:600px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div class="mainTitle" style="margin-top:-20px;" in:fade={{ delay: 250, duration: 500 }}>
      {$_("home.main.title")}
    </div>
    <div class="mainSubtitle">
      <div class="subtitle1">{$_("home.main.subtitle1")}</div>
      <div class="subtitle2">{$_("home.main.subtitle2")}</div>
      <div class="subtitle3">{$_("home.main.subtitle3")}</div>
      <div class="subtitle4">{$_("home.main.subtitle4")}</div>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner" style="margin-top:60px;">
    <div class="header">
      <div class="headerText">{$_("home.section1.title")}</div>
      <div class="headerLine" />
    </div>
    <div class="subHeaderText">{$_("home.section1.subtitle")}</div>
    <div class="containerOne">
      <div>
        <div class="award awardModify2">
          <div class="awardIcon awardIconModify2">
            <img alt="medal" src="images/medal.svg" />
          </div>
          <div class="awardTextContainer awardTextContainerModify2">
            <div class="awardTitle">
              {$_("home.section1.badge1.title")}
            </div>
            <div class="awardSubtitle">
              {$_("home.section1.badge1.description")}
            </div>
          </div>
        </div>
        <div class="award awardModify2">
          <div class="awardIcon awardIconModify2">
            <img alt="certificate" src="images/certificate.svg" />
          </div>
          <div class="awardTextContainer awardTextContainerModify2">
            <div class="awardTitle">
              {$_("home.section1.badge2.title")}
            </div>
            <div class="awardSubtitle">
              {$_("home.section1.badge2.description")}
            </div>
          </div>
        </div>
      </div>
      <div class="containerOneText">
        <p>
          {$_("home.section1.paragraph1")}
        </p>
        <p>
          {$_("home.section1.paragraph2")}
        </p>
        <p>
          {$_("home.section1.paragraph3")}
        </p>
        <p>
          {$_("home.section1.paragraph4")}
        </p>
      </div>
    </div>
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:40px;"
    >
      <div class="header">
        <div class="headerText">{$_("home.section2.title")}</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">{$_("home.section2.subtitle")}</div>
    </div>
    <div class="blocks" style="margin-bottom:50px;">
      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block1.jpg" />
        <p class="blocksTitle">{$_("home.section2.box1.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box1.description")}</p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("home.section2.box1.button")}
        </div>
      </div>

      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block2.jpg" />
        <p class="blocksTitle">{$_("home.section2.box2.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box2.description")}</p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("home.section2.box2.button")}
        </div>
      </div>
      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block3.jpg" />
        <p class="blocksTitle">{$_("home.section2.box3.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box3.description")}</p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("home.section2.box3.button")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer section3">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div
      class="pageContainerInner section3Inner"
      style="color:#ffffff;font-size:22px;"
    >
      {#await stats}
        <div />
      {:then stats}
        <div class="section3TopContainer">
          <div class="section3Title">
            {$_("home.section3.title")}
          </div>
          <div class="section3Description">
            {$_("home.section3.description")}
          </div>
          <div class="section3ButtonContainer">
            <div
              on:click={() => {
                navigate("/funds");
              }}
              class="section3Button"
            >
              {$_("home.section3.button")}
            </div>

            <div
              on:click={() => {
                window.location = "https://calendly.com/guardianbrothers/15min";
              }}
              class="section3InvestButton"
            >
              {$_("home.section3.investButton")}
            </div>
          </div>
        </div>
        <div id="stats" in:fade>
          <div class="statsContainer">
            <div class="infoBorder">
              <div>Fund Assets</div>
              <div>{formatter.format(stats[0].value)}</div>
            </div>
            <div class="infoBorder">
              <div>Shares Outstanding</div>
              <div>{formatter.format(stats[0].shares).slice(1)}</div>
            </div>
          </div>
          <div class="statsContainer">
            <div class="infoBorder">
              <div>NAV</div>
              <div>
                {formatter.format(stats[0].value / stats[0].shares)}
              </div>
            </div>
            <div class="infoBorder">
              <div>NAV Change</div>
              <div>
                {formatter.format(
                  stats[0].value / stats[0].shares -
                    stats[1].value / stats[1].shares
                )}
                ({(
                  ((stats[0].value / stats[0].shares -
                    stats[1].value / stats[1].shares) /
                    (stats[1].value / stats[1].shares)) *
                  100
                ).toFixed(2) + "%"})
              </div>
            </div>
          </div>
        </div>
      {/await}
    </div>
  </div>
</div>

<div class="pageContainer">
  <div class="pageContainerInner">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerText">{$_("home.section4.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("home.section4.subtitle")}</div>
        <div class="row" style="text-align:center;">
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="medal" src="images/group.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge1.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge1.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="certificate" src="images/like.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge2.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge2.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="certificate" src="images/chart.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge3.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge3.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="medal" src="images/geography.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge4.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge4.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="certificate" src="images/collaboration.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge5.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge5.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="certificate" src="images/business.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge6.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge6.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#A09162;"
            >
              <img alt="certificate" src="images/medal.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("home.section4.badge7.title")}
              </div>
              <div class="awardSubtitle">
                {$_("home.section4.badge7.description")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .containerOne {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: #888888;
  }
  .containerOneText {
    max-width: 800px;
    font-size: 20px;
  }

  .section3Title {
    font-size: 50px;
    font-weight: 600;
  }
  .section3Description {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 25px;
  }
  .section3Button {
    cursor: pointer;
    background-color: #cccccc;
    color: #000000;
    width: 150px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    transition: 0.5s;
  }
  .section3Button:hover {
    background-color: #ffffff;
  }
  .section3InvestButton {
    cursor: pointer;
    background-color: #102e50;
    color: #ffffff;
    width: 200px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
  }
  .section3InvestButton:hover {
    background-color: #2c6db6;
  }

  .section3 {
    min-height: 600px;
    background: linear-gradient(#354558ee, #354558ee), url("images/gbfund1.svg");
    background-size: cover;
    color: #ffffff;
  }

  .blocks {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .blocksImage {
    width: 100%;
  }
  .blocksTitle {
    font-weight: 700;
    font-size: 24px;
    padding: 10px 20px;
  }
  .blocksDescription {
    font-weight: 600;
    font-size: 18px;
    padding: 10px 20px;
    margin-top: -30px;
  }
  .blocksButton {
    font-size: 18px;
    background-color: #6f8db1;
    cursor: pointer;
    color: #ffffff;
    width: 150px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    margin-top: 480px;
    margin-left: 20px;
    transition: 0.2s;
  }

  .blocksButton:hover {
    background-color: #afcff5;
  }

  .blocksDiv {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 30%;
    background-color: #021c32;
    height: 500px;
    color: #ffffff;
    margin: 10px;
    border-radius: 0px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .awardModify {
    display: inline-flex;
    flex-direction: column;
    padding: 15px;
  }
  .awardIconModify {
    margin-right: 0px;
  }
  .awardTextContainerModify {
    align-items: center;
    text-align: center;
  }

  @keyframes subtitleAnimation {
    0% {
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    20% {
      opacity: 1;
    }
    30% {
      opacity: 0;
    }
    40% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    60% {
      opacity: 0;
    }
    70% {
      opacity: 0;
    }
    80% {
      opacity: 0;
    }
    90% {
      opacity: 0;
    }
    100% {
      opacity: 0;
    }
  }

  .subtitle1,
  .subtitle2,
  .subtitle3,
  .subtitle4 {
    opacity: 0;
    animation: subtitleAnimation 20s infinite;
    transition: all;
    position: absolute;
  }
  .subtitle1 {
    animation-delay: 0s;
  }
  .subtitle2 {
    animation-delay: 5s;
  }
  .subtitle3 {
    animation-delay: 10s;
  }
  .subtitle4 {
    animation-delay: 15s;
  }

  .section3TopContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }
  .section3ButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  #stats {
    margin-top: 100px;
  }
  .section3Inner {
    height: 450px;
  }

  @media only screen and (max-width: 850px) {
    .blocks {
      flex-direction: column;
    }

    .blocksDiv {
      width: 100%;
      margin: 0px;
      padding: 0px;
      margin-bottom: 50px;
    }

    .awardTextContainerModify {
      max-width: 100% !important;
    }

    .containerOne {
      flex-direction: column;
    }
    .awardTextContainer {
      max-width: 150px;
    }
    .blocksDescription {
      font-size: 20px;
    }

    .section3 {
      background-size: 250%;
      background-position: -250px 0px;
      min-height: 300px;
    }
    .section3Title {
      font-size: 30px;
    }
    .section3Description {
      margin-top: 20px;
      font-size: 18px;
      max-width: 100%;
    }
    .section3TopContainer {
      flex-direction: column;
    }
    #stats {
      margin-top: 20px;
    }
    .section3Inner {
      height: 100%;
    }

    .awardModify2 {
      display: inline-flex;
      flex-direction: column;
      padding: 15px;
    }
    .awardIconModify2 {
      margin-right: 0px;
    }
    .awardTextContainerModify2 {
      align-items: center;
      text-align: center;
      max-width: 100%;
    }
    .awardSubtitle {
      font-size:20px;
    }
  }
</style>
