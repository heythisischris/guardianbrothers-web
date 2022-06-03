<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_home.jpg')";
    document.querySelectorAll("#body")[0].style.backgroundPosition = "50% 0px";
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
    <div class="mainTitle" in:fade={{ delay: 250, duration: 500 }}>
      {$_("home.main.title")}
    </div>
    <div class="subtitleContainer" in:fade={{ delay: 350, duration: 500 }}>
      <div class="mainSubtitle">
        {$_("home.main.subtitle")}
      </div>
      <div class="dynamicSubtitle">
        <div class="subtitle1">{$_("home.main.subtitle1")}</div>
        <div class="subtitle2">{$_("home.main.subtitle2")}</div>
        <div class="subtitle3">{$_("home.main.subtitle3")}</div>
      </div>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner" style="margin-top:60px;">
    <div class="header">
      <div class="headerLine" />
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
        <div class="headerLine" />
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
            navigate("/hybridFund");
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
            navigate("/hybridFund");
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
            navigate("/hybridFund");
          }}
          class="blocksButton"
        >
          {$_("home.section2.box3.button")}
        </div>
      </div>
    </div>
  </div>
</div>
<div class="fundsContainer">
  <div class="pageContainer sectionFunds">
    <div
      class="pageContainerInner"
      style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
    >
      <div
        class="pageContainerInner sectionFundsInner"
        style="color:#ffffff;font-size:22px;"
      >
        <div class="sectionFundsTopContainer">
          <div class="sectionFundsTitle">
            {$_("home.sectionFunds.equityFund1.title")}
          </div>
          <div class="sectionFundsDescription">
            {$_("home.sectionFunds.equityFund1.description")}
          </div>
          <div class="sectionFundsButtonContainer">
            <div
              on:click={() => {
                navigate("/equityFund1");
              }}
              class="sectionFundsButton"
            >
              {$_("home.sectionFunds.button")}
            </div>
            <a
              target="_blank"
              href="https://meetings.hubspot.com/guardianbrothers/llamada-de-oportunidad-gbh"
              class="sectionFundsInvestButton"
            >
              {$_("home.sectionFunds.investButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="pageContainer sectionFunds2">
    <div
      class="pageContainerInner"
      style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
    >
      <div
        class="pageContainerInner sectionFundsInner"
        style="color:#ffffff;font-size:22px;"
      >
        <div class="sectionFundsTopContainer">
          <div class="sectionFundsTitle">
            {$_("home.sectionFunds.hybridFund.title")}
          </div>
          <div class="sectionFundsDescription">
            {$_("home.sectionFunds.hybridFund.description")}
          </div>
          <div class="sectionFundsButtonContainer">
            <div
              on:click={() => {
                navigate("/hybridFund");
              }}
              class="sectionFundsButton"
            >
              {$_("home.sectionFunds.button")}
            </div>
            <a
              target="_blank"
              href="https://meetings.hubspot.com/guardianbrothers/llamada-de-oportunidad-gbh"
              class="sectionFundsInvestButton"
            >
              {$_("home.sectionFunds.investButton")}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("home.section4.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("home.section4.subtitle")}</div>
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
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/check.svg" />
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
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/lightbulb.svg" />
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
              style="background-color:#d1a765;"
            >
              <img alt="medal" src="images/heart.svg" />
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
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/star.svg" />
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
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/handshake.svg" />
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
              style="background-color:#d1a765;"
            >
              <img alt="certificate" src="images/technical_chart.svg" />
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
  .mainTitle {
    font-size: 30px;
    margin-top: -80px;
    margin-bottom: 20px;
  }
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
    background: linear-gradient(#35455899, #35455899),
      url("images/equityBackground.jpg");
    background-size: cover;
    color: #ffffff;
    width: calc(50% + 160px);
    padding: 20px;
    margin-right: -160px;
    clip-path: polygon(0% 0%, 100% 0, 85% 100%, 0% 100%);
  }

  .sectionFunds2 {
    min-height: 200px;
    background: url("images/hybrid_cover.jpg");
    background-size: cover;
    color: #ffffff;
    width: calc(50% + 160px);
    padding: 20px;
    padding-left: 150px;
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
  .subtitle3 {
    opacity: 0;
    animation: subtitleAnimation 15s infinite;
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
  .subtitleContainer {
    border-left: 2px solid #c49c4b;
    height: 140px;
    padding-left: 20px;
    margin-left: 20px;
  }
  .mainSubtitle {
    font-size: 30px;
  }
  .dynamicSubtitle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    font-size: 80px;
    margin-top: -10px;
  }

  .sectionFundsTopContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    margin-top: 100px;
  }
  .sectionFundsButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
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
  .fundsContainer {
    display: flex;
    flex-direction: row;
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

    .sectionFunds {
      background-size: 250%;
      background-position: -250px 0px;
      min-height: 300px;
      clip-path: none;
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
    .mainTitle {
      font-size: 24px;
      text-align: left !important;
    }
    .mainSubtitle {
      font-size: 24px;
      text-align: left !important;
    }
    .dynamicSubtitle {
      font-size: 50px;
    }
    .fundsContainer {
      flex-direction: column;
    }
    .sectionFunds,
    .sectionFunds2 {
      width: 100%;
      padding: 0px;
      margin: 0px;
    }
    .subtitleContainer {
      height: 100px;
    }
  }
</style>
