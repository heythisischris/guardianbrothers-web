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
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:600px;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div class="mainTitle" in:fade={{ delay: 250, duration: 500 }}>
      {$_("home.main.title")}
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 1500, duration: 500 }}>
      {$_("home.main.subtitle")}
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
        <div class="award">
          <div class="awardIcon">
            <img alt="medal" src="images/medal.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("home.section1.badge1.title")}</div>
            <div class="awardSubtitle">
              {$_("home.section1.badge1.description")}
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon">
            <img alt="certificate" src="images/certificate.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("home.section1.badge2.title")}</div>
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
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
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
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
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
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
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
    <div class="pageContainerInner">
      <div class="row">
        <div class="rowItem">
          <div class="header" style="margin-top:50px;">
            <div class="headerText">{$_("home.section3.title")}</div>
            <div class="headerLine" />
          </div>
          <div class="subHeaderText">{$_("home.section3.subtitle")}</div>
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
                  {$_("home.section3.badge1.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge1.description")}
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
                  {$_("home.section3.badge2.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge2.description")}
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
                  {$_("home.section3.badge3.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge3.description")}
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
                  {$_("home.section3.badge4.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge4.description")}
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
                  {$_("home.section3.badge5.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge5.description")}
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
                  {$_("home.section3.badge6.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge6.description")}
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
                  {$_("home.section3.badge7.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge7.description")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer section4">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:flex-start;"
  >
    <div class="section4Title">
      {$_("home.section4.title")}
    </div>
    <div class="section4Description">
      {$_("home.section4.description")}
    </div>
    <div
      on:click={() => {
        navigate("/funds");
      }}
      class="section4Button"
    >
      {$_("home.section4.button")}
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

  .section4Title {
    font-size: 50px;
    font-weight: 600;
  }
  .section4Description {
    margin-top: 40px;
    font-size: 26px;
    font-weight: 600;
    max-width: 50%;
  }
  .section4Button {
    margin-top: 60px;
    cursor: pointer;
    background-color: #ffffff;
    color: #000000;
    width: 150px;
    height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .section4 {
    min-height: 600px;
    background: linear-gradient(#354558aa, #354558aa), url("images/gbfund1.jpg");
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

    .section4 {
      background-size: 250%;
      background-position: -250px 0px;
      min-height: 300px;
    }
    .section4Title {
      font-size: 30px;
    }
    .section4Description {
      margin-top: 20px;
      font-size: 22px;
      max-width: 100%;
    }
  }
</style>
