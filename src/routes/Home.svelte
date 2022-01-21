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
  }

  .blocks {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .blocksNumber {
    font-size: 125px;
    font-weight: 800;
    color: #bbb18f;
  }

  .blocks div {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    width: 30%;
    background-color: #a09162;
    height: 200px;
    color: #ffffff;
    margin: 10px;
    padding: 20px;
    border-radius: 0px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    transition: 0.2s;
  }

  .blocks div:hover {
    background-color: #f2efe5;
    color: #141414;
  }

  .blocksTitle {
    font-weight: 600;
    font-size: 30px;
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

    .blocksNumber {
      margin-top: -30px !important;
      margin-bottom: -30px !important;
    }
    .containerOne {
      flex-direction: column;
    }
    .awardTextContainer {
      max-width: 150px;
    }
    .blocksTitle {
      font-size: 20px;
    }
  }
</style>
