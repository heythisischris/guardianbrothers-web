<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  onMount(() => {
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_contactus.jpg')";
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
      Contact us
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      Nihil odio reprehenderit. Voluptatum animi nulla doloremque aut odio sed
      veniam sit. Veritatis doloribus ad perspiciatis.
    </div>
  </div>
</div>
<div class="pageContainer" style="background-color:#F2EFE5">
  <div class="pageContainerInner expandContact">
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
    </div>
  </div>
  <div class="contactContainer">
    <div class="header" style="margin-top:50px;">
      <div class="headerText">Voluptas non aut voluptatibus</div>
      <div class="headerLine" />
    </div>
    <div class="subHeaderText">Get in touch</div>
    <div class="row">
      <input class="rowItem" placeholder="First Name" />
      <input class="rowItem" placeholder="Last Name" />
    </div>
    <div class="row">
      <input placeholder="Email" />
    </div>
    <div class="row">
      <textarea style="min-height:200px" placeholder="Message" />
    </div>
    <button style="float:right;">SUBMIT</button>
  </div>
</div>
<iframe
  title="map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3593.112122118072!2d-80.18817598497898!3d25.766859883634453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b42812c76b33%3A0xcfb2220e8b21a30d!2s601%20Brickell%20Key%20Dr%2C%20Miami%2C%20FL%2033131!5e0!3m2!1sen!2sus!4v1640067497942!5m2!1sen!2sus"
  style="width:100%;height:500px;border:0;"
  allowfullscreen=""
  loading="lazy"
/>
<div class="pageContainer" style="min-height:100px;">
  <div class="pageContainerInner" style="padding-bottom:0px;">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:100px;">
          <div class="headerText">est quia autem iste qui ut</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">Subscribe to our newsletter</div>
        <div class="containerOne">
          <div class="containerOneText">
            Ut deserunt laborum. Ut rerum repellendus voluptates voluptatem iste
            eum et nihil non. Ad repellendus voluptatem molestias rem non omnis
            et.
          </div>
        </div>

        <div class="row" style="align-items:center;margin-top:40px;">
          <input placeholder="Enter your Email" />
          <button>SUBSCRIBE</button>
        </div>
      </div>
      <img
        alt=""
        style="max-height: 500px;object-fit: contain;"
        class="rowItem"
        src="images/about3.jpg"
      />
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
  .contactContainer {
    background-color: #ffffff;
    width: 100%;
    padding: 0px 50px;
  }
  input,
  textarea {
    width: 100%;
    margin: 5px;
    padding: 10px;
    font-family: arial;
  }
  button {
    all: unset;
    background-color: #6f8db1;
    color: #ffffff;
    padding:10px 20px;
    min-width:150px;
    text-align:center;
  }
  @media only screen and (max-width: 850px) {
    .row {
      flex-direction: column;
      width: 90%;
    }
    .rowItem {
      width: 100%;
    }
    .contactContainer {
      position: absolute;
      height: 650px;
      margin-top: 680px;
      padding: 20px;
      width: calc(100% - 40px);
    }
    .expandContact {
      margin-bottom: 650px;
    }
  }
</style>
