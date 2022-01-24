<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  onMount(() => {
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
  <div class="pageContainerInner">
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
      <div>
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
        <p class="blocksTitle">{$_("home.section2.box1.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box1.description")}</p>
        <p class="blocksButton">{$_("home.section2.box1.button")}</p>
      </div>
      <div>
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
        <p class="blocksTitle">{$_("home.section2.box2.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box2.description")}</p>
        <p class="blocksButton">{$_("home.section2.box2.button")}</p>
      </div>
      <div>
        <img class="blocksImage" alt="blocks" src="images/blocks.jpg" />
        <p class="blocksTitle">{$_("home.section2.box3.title")}</p>
        <p class="blocksDescription">{$_("home.section2.box3.description")}</p>
        <p class="blocksButton">{$_("home.section2.box3.button")}</p>
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
          <div class="row">
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="medal" src="images/group.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge1.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge1.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="certificate" src="images/like.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge2.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge2.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="certificate" src="images/chart.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge3.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge3.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="medal" src="images/geography.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge4.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge4.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="certificate" src="images/collaboration.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge5.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge5.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="certificate" src="images/business.svg" />
              </div>
              <div class="awardTextContainer">
                <div class="awardTitle">
                  {$_("home.section3.badge6.title")}
                </div>
                <div class="awardSubtitle">
                  {$_("home.section3.badge6.description")}
                </div>
              </div>
            </div>
            <div class="award">
              <div class="awardIcon" style="background-color:#A09162;">
                <img alt="certificate" src="images/medal.svg" />
              </div>
              <div class="awardTextContainer">
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
<img alt="" style="width:100%;" src="images/gbfund1.jpg" />

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

  .blocks {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .blocksImage {
    width: 100%;
    height: 100%;
  }
  .blocksTitle {
    font-weight: 700;
    font-size: 24px;
    padding: 20px;
  }
  .blocksDescription {
    font-weight: 600;
    font-size: 18px;
    padding: 20px;
  }
  .blocksButton {
    font-weight: 600;
    font-size: 18px;
  }

  .blocks div {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    width: 30%;
    background-color: #021c32;
    height: 600px;
    color: #ffffff;
    margin: 10px;
    border-radius: 0px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition: 0.2s;
  }

  .blocks div:hover {
    background-color: #6f8db1;
  }

  @media only screen and (max-width: 850px) {
    .blocks {
      flex-direction: column;
    }

    .blocks div {
      width: 100%;
      margin: 0px;
      padding: 0px;
      margin-bottom: 20px;
    }

    .blocksTitle {
      margin-top: -30px !important;
      margin-bottom: -30px !important;
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
  }
</style>
