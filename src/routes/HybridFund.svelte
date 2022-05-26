<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/hybrid_cover.jpg')";
    document.querySelectorAll("#body")[0].style.backgroundPosition = "50% 0px";
  });

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let mailingListEmail = "";
  let addedToMailingList = false;
  async function addToMailingList() {
    await fetch(`https://lambda.guardianbrothers.com/mailinglist`, {
      method: "post",
      body: JSON.stringify({
        email: mailingListEmail,
      }),
    });
    addedToMailingList = true;
  }
</script>

<div class="pageContainerTop" style="margin-top: -110px;">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:100vh;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div
      class="mainTitle"
      style="margin-top:-20px;color:#D1A765;font-family:'alegreya-regular';"
      in:fade={{ delay: 250, duration: 500 }}
    >
      {$_("hybridFund.main.title")}
    </div>
    <div
      in:fade={{ delay: 250, duration: 500 }}
      style="width:50%;height:2px;background-color:#D1A765"
    />
    <div in:fade={{ delay: 250, duration: 500 }} class="mainSubtitle">
      <div class="subtitle">{$_("hybridFund.main.subtitle")}</div>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner" style="margin-top:60px;">
    <div class="header">
      <div class="headerLine" />
      <div class="headerText">{$_("hybridFund.section1.title")}</div>
      <div class="headerLine" />
    </div>
    <div class="containerOne">
      <div class="containerOneText">
        <div class="awardTitle">
          {$_("hybridFund.section1.title1")}
        </div>
        <p>
          {$_("hybridFund.section1.paragraph1")}
        </p>
        <div class="awardTitle">
          {$_("hybridFund.section1.title2")}
        </div>
        <p>
          {$_("hybridFund.section1.paragraph2")}
        </p>
        <p>
          {$_("hybridFund.section1.paragraph3")}
        </p>
        <div class="awardTitle">
          {$_("hybridFund.section1.title3")}
        </div>
        <p>
          {$_("hybridFund.section1.paragraph4")}
        </p>
        <p>
          {$_("hybridFund.section1.paragraph5")}
        </p>
      </div>
      <div class="rowItem">
        <img src="images/hybrid_image1.jpg" />
      </div>
    </div>
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:40px;"
    >
      <div class="header">
        <div class="headerLine" />
        <div class="headerText">{$_("hybridFund.section2.title")}</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">{$_("hybridFund.section2.subtitle")}</div>
    </div>
    <div class="blocks" style="margin-bottom:50px;">
      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block1.jpg" />
        <p class="blocksTitle">{$_("hybridFund.section2.box1.title")}</p>
        <p class="blocksDescription">
          {$_("hybridFund.section2.box1.description")}
        </p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("hybridFund.section2.box1.button")}
        </div>
      </div>

      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block2.jpg" />
        <p class="blocksTitle">{$_("hybridFund.section2.box2.title")}</p>
        <p class="blocksDescription">
          {$_("hybridFund.section2.box2.description")}
        </p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("hybridFund.section2.box2.button")}
        </div>
      </div>
      <div class="blocksDiv">
        <img class="blocksImage" alt="blocks" src="images/block3.jpg" />
        <p class="blocksTitle">{$_("hybridFund.section2.box3.title")}</p>
        <p class="blocksDescription">
          {$_("hybridFund.section2.box3.description")}
        </p>
        <div
          on:click={() => {
            navigate("/funds");
          }}
          class="blocksButton"
        >
          {$_("hybridFund.section2.box3.button")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer sectionFunds">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div
      class="pageContainerInner sectionFundsInner"
      style="color:#ffffff;font-size:22px;"
    >
      <div />
    </div>
  </div>
</div>

<div class="pageContainer sectionFunds">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div
      class="pageContainerInner sectionFundsInner"
      style="color:#ffffff;font-size:22px;"
    >
      <div />
    </div>
  </div>
</div>

<div class="pageContainer">
  <div class="pageContainerInner">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("hybridFund.section4.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("hybridFund.section4.subtitle")}</div>
        <div class="row" style="text-align:center;">
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="medal" src="images/group.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge1.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge1.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/check.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge2.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge2.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/lightbulb.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge3.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge3.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="medal" src="images/heart.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge4.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge4.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/star.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge5.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge5.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/handshake.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge6.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge6.description")}
              </div>
            </div>
          </div>
          <div class="award awardModify">
            <div
              class="awardIcon awardIconModify"
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/technical_chart.svg" />
            </div>
            <div class="awardTextContainer awardTextContainerModify">
              <div class="awardTitle">
                {$_("hybridFund.section4.badge7.title")}
              </div>
              <div class="awardSubtitle">
                {$_("hybridFund.section4.badge7.description")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer" style="min-height:400px;">
  <div class="pageContainerInner" style="padding-bottom:0px;">
    <div class="row">
      <div class="rowItem" style="justify-content:center;">
        <div class="header" style="margin-top:100px;">
          <div class="headerLine" />
          <div class="headerText">{$_("contact.section3.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("contact.section3.subtitle")}</div>
        <div class="containerOne">
          <div class="containerOneText">
            {$_("contact.section3.description")}
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;">
          {#if addedToMailingList}
            <p style="margin:40px;">
              {$_("contact.section3.form.success")}
            </p>
          {:else}
            <div class="row subscribeContainer">
              <input
                bind:value={mailingListEmail}
                placeholder={$_("contact.section3.form.email")}
              />
              <button
                on:click={() => {
                  addToMailingList();
                }}>{$_("contact.section3.form.submit")}</button
              >
            </div>
          {/if}
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

  .sectionFundsTitle {
    font-size: 50px;
    font-weight: 600;
  }
  .sectionFundsDescription {
    font-size: 26px;
    font-weight: 600;
    margin-bottom: 25px;
  }
  .sectionFundsButton {
    cursor: pointer;
    background-color: #cccccc;
    color: #333333;
    width: 150px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    transition: 0.5s;
  }
  .sectionFundsButton:hover {
    background-color: #ffffff;
  }
  .sectionFundsInvestButton {
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
    text-decoration-line: none;
  }
  .sectionFundsInvestButton:hover {
    background-color: #2c6db6;
  }

  .sectionFunds {
    min-height: 200px;
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
    font-family: "Merriweather";
    font-weight: bold;
  }
  .blocksDescription {
    font-weight: 400;
    font-size: 18px;
    padding: 10px 20px;
    margin-top: -30px;
  }
  .blocksButton {
    font-size: 18px;
    background-color: #d1a765;
    cursor: pointer;
    color: #00355f;
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
    background-color: #d1a765;
  }

  .blocksDiv {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 30%;
    background-color: #00355f;
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

  .sectionFundsTopContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 20px;
  }
  .sectionFundsButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
  #stats {
    margin-top: 100px;
  }
  .sectionFundsInner {
    height: 410px;
  }

  input {
    width: 100%;
    margin: 5px;
    padding: 10px;
    font-family: arial;
  }
  button {
    all: unset;
    background-color: #6f8db1;
    color: #ffffff;
    padding: 10px 20px;
    min-width: 150px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
  }
  button:hover {
    background-color: #9bc8ff;
  }
  .subscribeContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 40px;
    width: 600px;
  }
  .rowItem {
    width: 50%;
  }

  @media only screen and (max-width: 850px) {
    .rowItem {
      width: 100%;
    }
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

    .sectionFunds {
      background-size: 250%;
      background-position: -250px 0px;
      min-height: 300px;
    }
    .sectionFundsTitle {
      font-size: 30px;
    }
    .sectionFundsDescription {
      margin-top: 20px;
      font-size: 18px;
      max-width: 100%;
    }
    .sectionFundsTopContainer {
      flex-direction: column;
      margin-top: 0px;
    }
    #stats {
      margin-top: 20px;
    }
    .sectionFundsInner {
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
      font-size: 20px;
    }
    .sectionFundsButton {
      font-size: 14px;
      width: 140px;
    }
    .sectionFundsInvestButton {
      font-size: 14px;
      width: 140px;
    }
    .subscribeContainer {
      flex-direction: column;
      width: 100%;
      margin-bottom: 200px;
    }
  }
</style>
