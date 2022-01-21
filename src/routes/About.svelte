<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  onMount(() => {
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_about.jpg')";
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
        <div class="header" style="margin-top:100px;">
          <div class="headerText">About the Company</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">Why choose us</div>
        <div class="containerOne">
          <div class="containerOneText">
            Excepturi ipsam quibusdam accusamus. Vel omnis consequatur ea et
            quia maxime nemo voluptatem accusamus. Et sapiente quod rerum
            ratione ea assumenda quod quo ex. Nam aut deserunt veniam eaque sit
            non cum consequatur earum. Qui laborum ea id deserunt.
            <p />
            Provident et ea rerum rerum nemo nihil repellat. Laborum a sequi tenetur.
            Ex nam nihil fuga architecto perspiciatis est eos aut incidunt. Nemo
            labore sequi sit est blanditiis.
            <p />
            Eum incidunt sit velit nemo. Consectetur veritatis et nemo. Ut sed voluptate
            consectetur nam ea. Ab facilis aliquam quo consequatur ipsum dicta. Molestiae
            sequi ipsa dolorem fugiat qui vel nihil iusto eos. Ducimus delectus molestiae
            nobis iure quaerat pariatur similique rem temporibus.
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
          <div class="headerText">Learn more</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">Our Advantages</div>
        <div class="award">
          <div class="awardIcon" style="background-color:#A09162;">
            <img alt="medal" src="images/medal.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">Confidentiality</div>
            <div class="awardSubtitle">
              Qui asperiores et pariatur rerum incidunt.
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#A09162;">
            <img alt="certificate" src="images/certificate.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">Comprehensive support</div>
            <div class="awardSubtitle">
              Qui asperiores et pariatur rerum incidunt.
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#A09162;">
            <img alt="certificate" src="images/certificate.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">Quality</div>
            <div class="awardSubtitle">
              Qui asperiores et pariatur rerum incidunt.
            </div>
          </div>
        </div>
      </div>
      <img alt="" class="rowItem mobile" src="images/about1.jpg" />
    </div>
  </div>
  <img alt="" class="rowItem desktop" src="images/about1.jpg" />
</div>
<div class="pageContainer" style="min-height:650px;">
  <div class="pageContainerInner">
    <div>
      <div class="header" style="margin-top:50px;">
        <div class="headerText">Our story</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">Who we are</div>
      <div class="containerOneText">
        Excepturi ipsam quibusdam accusamus. Vel omnis consequatur ea et quia
        maxime nemo voluptatem accusamus. Et sapiente quod rerum ratione ea
        assumenda quod quo ex. Nam aut deserunt veniam eaque sit non cum
        consequatur earum. Qui laborum ea id deserunt.
        <p />
        Provident et ea rerum rerum nemo nihil repellat. Laborum a sequi tenetur.
        Ex nam nihil fuga architecto perspiciatis est eos aut incidunt. Nemo labore
        sequi sit est blanditiis.
        <p />
        Eum incidunt sit velit nemo. Consectetur veritatis et nemo. Ut sed voluptate
        consectetur nam ea. Ab facilis aliquam quo consequatur ipsum dicta. Molestiae
        sequi ipsa dolorem fugiat qui vel nihil iusto eos. Ducimus delectus molestiae
        nobis iure quaerat pariatur similique rem temporibus.
      </div>
    </div>
  </div>
</div>
<div class="blueContainer">
  <div class="subHeaderText">Aut sit itaque vitae ipsam fugit quos ipsa.</div>
  <div class="row">
    <ul class="rowItem">
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
    </ul>
    <ul class="rowItem">
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
    </ul>
    <ul class="rowItem">
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
      <li>Beatae aperiam aperiam</li>
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
        <div class="headerText">Those who connect us</div>
        <div class="headerLine" />
      </div>
      <div class="subHeaderText">Our partners</div>
    </div>
    <div class="row" style="text-align: center;">
      <div class="rowItem">Logo</div>
      <div class="rowItem">Logo</div>
      <div class="rowItem">Logo</div>
      <div class="rowItem">Logo</div>
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
    margin-top: -250px;
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
  }
</style>
