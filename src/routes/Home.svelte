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
  async function loadAPI(url) {
    let data = await fetch(url);
    let response = await data.json();
    return response;
  }
  var equityFund1Stats = loadAPI(
    "https://lambda.guardianbrothers.com/stats/equityFund1"
  );
  equityFund1Stats.then((innerStats) => {
    equityFund1Stats = innerStats;
  });
  var hybridFundStats = loadAPI(
    "https://lambda.guardianbrothers.com/stats/hybridFund"
  );
  hybridFundStats.then((innerStats) => {
    hybridFundStats = innerStats;
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
      style="margin-top:-20px;"
      in:fade={{ delay: 250, duration: 500 }}
    >
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

<div class="pageContainer sectionFunds">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div
      class="pageContainerInner sectionFundsInner"
      style="color:#ffffff;font-size:22px;"
    >
      {#await equityFund1Stats}
        <div />
      {:then equityFund1Stats}
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
                navigate("/funds");
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
        <div id="stats" in:fade>
          <div class="statsContainer">
            <div class="infoBorder">
              <div>{$_("funds.main.fundAssets")}</div>
              <div>{formatter.format(equityFund1Stats[0].value)}</div>
            </div>
            <div class="infoBorder">
              <div>{$_("funds.main.sharesOutstanding")}</div>
              <div>{formatter.format(equityFund1Stats[0].shares).slice(1)}</div>
            </div>
          </div>
          <div class="statsContainer">
            <div class="infoBorder">
              <div>{$_("funds.main.nav")}</div>
              <div>
                {formatter.format(
                  equityFund1Stats[0].value / equityFund1Stats[0].shares
                )}
              </div>
            </div>
            <div class="infoBorder">
              <div>{$_("funds.main.navChange")}</div>
              <div>
                {formatter.format(
                  equityFund1Stats[0].value / equityFund1Stats[0].shares -
                    equityFund1Stats[1].value / equityFund1Stats[1].shares
                )}
                ({(
                  ((equityFund1Stats[0].value / equityFund1Stats[0].shares -
                    equityFund1Stats[1].value / equityFund1Stats[1].shares) /
                    (equityFund1Stats[1].value / equityFund1Stats[1].shares)) *
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
    <div class="row">
      <div class="rowItem section5">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("home.section5.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("home.section5.subtitle")}</div>
        <div class="row">
          <div class="testimonialBlocks">
            {#each [0, 1, 2] as item}
              <div class="testimonialBlock {item == 2 ? 'selected' : ''}">
                <div class="testimonialDescription">
                  Praesentium cumque doloribus explicabo dicta suscipit et
                  maiores. Vel qui ea velit tenetur fugiat. Dignissimos culpa
                  facilis maiores voluptatum autem sint recusandae et aut.
                  Expedita id natus vel blanditiis omnis ad ad. Quidem cumque
                  molestiae consequatur.
                </div>
                <div class="testimonialAuthor">
                  <div class="testimonialImage" />
                  <div>
                    <div class="testimonialName">Annabell Brown</div>
                    <div class="testimonialLocation">
                      Kessler, Hauck And Gusikowski
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <div class="testimonialBackgroundBlock">
            <div class="testimonialArrow">{`<`}</div>
            <div class="testimonialArrow">{`>`}</div>
            <div class="testimonialButton">LEER MAS</div>
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

  .testimonialBlocks {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 80%;
    margin: 0px auto;
    z-index: 1;
    position: relative;
  }
  .testimonialBlock {
    width: 320px;
    height: 320px;
    padding: 10px;
    background-color: #f3f3f3;
    border: 2px solid #d1a765;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .testimonialBlock.selected {
    background-color: #f2efe5;
  }
  .testimonialDescription {
    font-style: italic;
    line-height: 2;
    color: #888888;
  }
  .testimonialImage {
    height: 50px;
    width: 50px;
    border-radius: 25px;
    background-color: #cccccc;
    margin-right: 10px;
  }
  .testimonialName {
    font-weight: 600;
  }
  .testimonialLocation {
    color: #888888;
  }
  .testimonialAuthor {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .testimonialBackgroundBlock {
    position: absolute;
    right: 0px;
    margin-top: -250px;
    width: 100vw;
    height: 380px;
    background-color: #d1a765;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
  }

  .testimonialArrow {
    height: 50px;
    width: 50px;
    background-color: #00355f;
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 30px;
    cursor: pointer;
    font-weight: 100;
    transition: 0.5s;
    margin: 0px 10px;
    margin-bottom: 40px;
    color: #ffffff;
  }
  .testimonialArrow:hover {
    background-color: #1a68a6;
  }

  .testimonialButton {
    cursor: pointer;
    background-color: #00355f;
    color: #ffffff;
    width: 150px;
    height: 50px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    margin: 0px 10px;
    margin-bottom: 40px;
  }
  .testimonialButton:hover {
    background-color: #1a68a6;
  }
  .section5 {
    min-height: 582px;
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
      margin-top:0px;
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
    .testimonialBlocks {
      flex-direction: column;
      width: 100%;
    }
    .testimonialBlock {
      margin: 10px 0px;
    }
    .testimonialBackgroundBlock {
      position: relative;
      margin-top: 0px;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      margin-bottom: 50px;
    }
    .testimonialArrow {
      margin: 0px 10px;
      margin-top: 20px;
    }
    .testimonialButton {
      margin: 0px 10px;
      margin-top: 20px;
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
