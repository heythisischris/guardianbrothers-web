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
  let firstName = "";
  let lastName = "";
  let telephone = "";
  let email = "";
  let mailingListEmail = "";
  let message = "";
  let messageSent = false;
  let addedToMailingList = false;
  async function sendMessage() {
    await fetch(`https://lambda.guardianbrothers.com/contact`, {
      method: "post",
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        telephone: telephone,
        message: message,
      }),
    });
    messageSent = true;
  }
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
    <div class="topLine" in:fade={{ delay: 250, duration: 500 }} />
    <div in:fade={{ delay: 250, duration: 500 }} class="mainSubtitle">
      <div class="subtitle">{$_("hybridFund.main.subtitle")}</div>
    </div>
    <a
      target="_blank"
      href="https://meetings.hubspot.com/guardianbrothers/llamada-de-oportunidad-gbh"
      in:fade={{ delay: 250, duration: 500 }}
      class="topButton"
    >
      {$_("hybridFund.main.button1")}
    </a>
    <a
      target="_blank"
      href="https://guardianbrothers.com"
      in:fade={{ delay: 250, duration: 500 }}
      class="topButton"
    >
      {$_("hybridFund.main.button2")}
    </a>
    <a
      target="_blank"
      href="https://guardianbrothers.com"
      in:fade={{ delay: 250, duration: 500 }}
      class="topButton"
    >
      {$_("hybridFund.main.button3")}
    </a>
  </div>
</div>
<div class="pageContainer" style="background-color:#F4F9FF;padding:40px 0px;">
  <div class="pageContainerInner" style="margin-top:20px;">
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
      <img class="hybridImage1" alt="" src="images/hybrid_image1.jpg" />
    </div>
  </div>
</div>
<div class="pageContainer" style="min-height:200px;">
  <div class="pageContainerInner">
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:40px;"
    >
      <div class="header">
        <div class="headerLine" />
        <div class="headerText">{$_("hybridFund.section2.title")}</div>
        <div class="headerLine" />
      </div>
    </div>
    <div class="blocks" style="margin-bottom:50px;">
      <div class="block">
        <div class="blockNumber">1</div>
        <div class="blockTitle">{$_("hybridFund.section2.block1.title")}</div>
        <div class="blockDescription">
          {$_("hybridFund.section2.block1.description")}
        </div>
      </div>
      <div class="block">
        <div class="blockNumber">2</div>
        <div class="blockTitle">{$_("hybridFund.section2.block2.title")}</div>
        <div class="blockDescription">
          {$_("hybridFund.section2.block2.description")}
        </div>
      </div>
      <div class="block">
        <div class="blockNumber">3</div>
        <div class="blockTitle">{$_("hybridFund.section2.block3.title")}</div>
        <div class="blockDescription">
          {$_("hybridFund.section2.block3.description")}
        </div>
      </div>
      <div class="block">
        <div class="blockNumber">4</div>
        <div class="blockTitle">{$_("hybridFund.section2.block4.title")}</div>
        <div class="blockDescription">
          {$_("hybridFund.section2.block4.description")}
        </div>
      </div>
    </div>
    <div class="asterisk">{$_("hybridFund.section2.asterisk")}</div>
  </div>
</div>

<div class="pageContainer section3">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:center;"
  >
    <div class="header" style="margin-top:40px;">
      <div class="headerLine" />
      <div class="headerText" style="color:#ffffff">
        {$_("hybridFund.section3.title")}
      </div>
      <div class="headerLine" />
    </div>
    <div class="blocks" style="margin-bottom:50px;">
      <div class="block2">
        <img class="block2Image" alt="" src="images/hybrid_thumb1.png" />
        <div class="block2Title">
          {$_("hybridFund.section3.block1.title")}
        </div>
        <div class="block2Description">
          {$_("hybridFund.section3.block1.description")}
        </div>
      </div>
      <div class="block2">
        <img class="block2Image" alt="" src="images/hybrid_thumb2.png" />
        <div class="block2Title">
          {$_("hybridFund.section3.block2.title")}
        </div>
        <div class="block2Description">
          {$_("hybridFund.section3.block2.description")}
        </div>
      </div>
      <div class="block2">
        <img class="block2Image" alt="" src="images/hybrid_thumb3.png" />
        <div class="block2Title">
          {$_("hybridFund.section3.block3.title")}
        </div>
        <div class="block2Description">
          {$_("hybridFund.section3.block3.description")}
        </div>
      </div>
      <div class="block2">
        <img class="block2Image" alt="" src="images/hybrid_thumb4.png" />
        <div class="block2Title">
          {$_("hybridFund.section3.block4.title")}
        </div>
        <div class="block2Description">
          {$_("hybridFund.section3.block4.description")}
        </div>
      </div>
      <div class="block2">
        <img class="block2Image" alt="" src="images/hybrid_thumb5.png" />
        <div class="block2Title">
          {$_("hybridFund.section3.block5.title")}
        </div>
        <div class="block2Description">
          {$_("hybridFund.section3.block5.description")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer">
  <div class="pageContainerInner">
    <div
      style="display:flex;flex-direction:column;justify-content:center;align-items:center;margin-top:40px;"
    >
      <div class="header">
        <div class="headerLine" />
        <div class="headerText">{$_("hybridFund.section4.title")}</div>
        <div class="headerLine" />
      </div>
    </div>
    <img class="section4image" alt="" src="images/hybrid_robot.png" />
    <div class="blocks3 section4">
      <div class="block3 block3_1">
        <div class="block3Title">{$_("hybridFund.section4.block1.title")}</div>
        <div class="block3Description">
          {$_("hybridFund.section4.block1.description")}
        </div>
      </div>
      <div class="block3 block3_2">
        <div class="block3Title">{$_("hybridFund.section4.block2.title")}</div>
        <div class="block3Description">
          {$_("hybridFund.section4.block2.description")}
        </div>
      </div>
      <div class="block3 block3_3">
        <div class="block3Title">{$_("hybridFund.section4.block3.title")}</div>
        <div class="block3Description">
          {$_("hybridFund.section4.block3.description")}
        </div>
      </div>
    </div>
  </div>
</div>

<div class="pageContainer" style="background-color:#F4F9FF;padding:40px 0px;">
  <div class="pageContainerInner">
    <div class="header">
      <div class="headerLine" />
      <div class="headerText">{$_("hybridFund.section5.title")}</div>
      <div class="headerLine" />
    </div>

    <table>
      <thead>
        <tr>
          <th style="width:50%;border-right-width:0px;"
            >{$_("hybridFund.section5.table1.title")}</th
          >
          <th style="width:50%;border-left-width:0px;" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{$_("hybridFund.section5.table1.row1.title")}</td>
          <td>{$_("hybridFund.section5.table1.row1.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row2.title")}</td>
          <td>{$_("hybridFund.section5.table1.row2.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row3.title")}</td>
          <td>{$_("hybridFund.section5.table1.row3.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row4.title")}</td>
          <td>{$_("hybridFund.section5.table1.row4.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row5.title")}</td>
          <td>{$_("hybridFund.section5.table1.row5.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row6.title")}</td>
          <td>{$_("hybridFund.section5.table1.row6.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table1.row7.title")}</td>
          <td>{$_("hybridFund.section5.table1.row7.description")}</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th style="width:50%;border-right-width:0px;"
            >{$_("hybridFund.section5.table2.title")}</th
          >
          <th style="width:50%;border-left-width:0px;" />
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{$_("hybridFund.section5.table2.row1.title")}</td>
          <td>{$_("hybridFund.section5.table2.row1.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table2.row2.title")}</td>
          <td>{$_("hybridFund.section5.table2.row2.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table2.row3.title")}</td>
          <td>{$_("hybridFund.section5.table2.row3.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table2.row4.title")}</td>
          <td>{$_("hybridFund.section5.table2.row4.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table2.row5.title")}</td>
          <td>{$_("hybridFund.section5.table2.row5.description")}</td>
        </tr>
        <tr>
          <td>{$_("hybridFund.section5.table2.row6.title")}</td>
          <td>{$_("hybridFund.section5.table2.row6.description")}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div class="pageContainer section6">
  <div
    class="pageContainerInner"
    style="display:flex;flex-direction:column;justify-content:center;align-items:center;"
  >
    <div class="header" style="margin-bottom:20px;">
      <div class="headerLine" />
      <div class="headerText" style="color:#ffffff;">
        {$_("hybridFund.section6.title")}
      </div>
      <div class="headerLine" />
    </div>
    {#if messageSent}
      <p>{$_("contact.section2.form.success")}</p>
    {:else}
      <div class="sendMessageContainer">
        <div class="messageRow">
          <input
            bind:value={firstName}
            placeholder={$_("contact.section2.form.firstName")}
          />
          <input
            bind:value={email}
            placeholder={$_("contact.section2.form.email")}
          />
          <input
            bind:value={telephone}
            placeholder={$_("contact.section2.form.telephone")}
          />
        </div>
        <div class="row">
          <textarea
            bind:value={message}
            style="min-height:200px;max-width:967px;"
            placeholder={$_("contact.section2.form.message")}
          />
        </div>
        <button
          on:click={() => {
            sendMessage();
          }}
          style="float:right;">{$_("contact.section2.form.submit")}</button
        >
      </div>
    {/if}
  </div>
</div>

<style>
  .topButton {
    color: #ffffff;
    text-transform: uppercase;
    text-align: center;
    cursor: pointer;
    background-color: #d1a765;
    padding: 10px 50px;
    margin-top: 30px;
    text-decoration-line: none;
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
    padding: 0px 20px;
  }

  .section3 {
    min-height: 200px;
    background: url("images/hybrid_image2.jpg");
    background-size: cover;
    color: #ffffff;
  }

  .section4 {
    min-height: 800px;
    background: url("images/hybrid_image3.jpg");
    background-size: cover;
  }

  .section6 {
    min-height: 600px;
    background: url("images/hybrid_footer.jpg");
    background-size: cover;
    color: #ffffff;
  }

  .blocks {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 20px 0px;
  }

  .hybridImage1 {
    width: 40%;
  }

  .block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 325px;
    width: 25%;
    padding: 0px 20px;
    border-left: 2px solid #aaaaaa;
  }
  .block:first-child {
    border-left: none;
  }
  .blockNumber {
    background-color: #d1a765;
    color: #00355f;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 36px;
    font-weight: bold;
    margin: 10px;
  }
  .blockTitle {
    color: #00355f;
    margin: 10px;
    font-size: 24px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: center;
  }
  .blockDescription {
    color: #000000;
    margin: 10px;
    text-align: center;
  }
  .asterisk {
    text-align: center;
    margin-bottom: 50px;
  }

  .block2 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 425px;
    width: 20%;
    border: 1px solid #5288e2;
    margin: 0px 10px;
  }
  .block2Image {
    width: 125px;
    height: 125px;
    margin: 10px;
    color: #ffffff;
  }
  .block2Title {
    color: #00355f;
    margin: 10px;
    font-size: 20px;
    color: #ffffff;
    text-transform: uppercase;
    text-align: center;
  }
  .block2Description {
    margin: 10px;
    text-align: center;
    color: #ffffff;
    font-size: 16px;
  }

  .blocks3 {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 100px 0px;
    margin: 50px 0px;
  }

  .block3 {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    width: 600px;
    background-color: #ffffff;
    border: 10px solid #cccccc;
    margin: 10px;
    padding: 10px;
    z-index: 1;
  }
  .block3Title {
    color: #00355f;
    margin: 10px;
    font-size: 20px;
    text-transform: uppercase;
    font-weight: bold;
    text-align: left;
  }
  .block3Description {
    margin: 10px;
    text-align: left;
    color: #000000;
    font-size: 16px;
  }

  .block3_1 {
    margin-left: 0px;
  }
  .block3_2 {
    margin-left: 400px;
  }
  .block3_3 {
    margin-left: -200px;
  }

  table {
    width: 100%;
    max-width: 1000px;
    margin: 20px auto;
    border-collapse: collapse;
  }
  tbody tr {
    background-color: #ffffff;
  }
  th {
    background-color: #bacad9;
    color: #00355f;
    text-align: left;
    padding: 20px;
    text-transform: uppercase;
    border: 1px solid #707070;
    font-size: 20px;
  }
  td {
    border: 1px solid #707070;
    padding: 20px;
  }
  td:first-child {
    font-weight: bold;
  }
  .topLine {
    width: 50%;
    height: 2px;
    background-color: #d1a765;
    margin: 0px;
  }

  .section4image {
    position: absolute;
    height: 100%;
  }

  input,
  textarea {
    width: calc(100% - 30px);
    margin: 5px;
    padding: 10px;
    font-family: arial;
  }
  button {
    all: unset;
    background-color: #d1a765;
    color: #ffffff;
    padding: 10px 20px;
    min-width: 150px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
    margin-top: 10px;
    margin-right: 7px;
  }
  button:hover {
    background-color: #9bc8ff;
  }
  .sendMessageContainer {
    width: 100%;
    max-width: 1000px;
  }
  .awardTitle {
    font-family: lato;
    text-transform: uppercase;
    margin-top: 80px;
    margin-bottom: 20px;
  }
  .awardTitle:first-child {
    margin-top: 0px;
  }
  .headerText {
    font-size: 30px !important;
    text-transform: uppercase;
  }
  .header {
    margin-bottom: 40px;
  }
  .messageRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }

  @media only screen and (max-width: 850px) {
    .topButton {
      margin-left: auto;
      margin-right: auto;
    }
    .hybridImage1 {
      width: 100vw;
      margin-top: 30px;
    }
    .blocks {
      flex-direction: column;
    }
    .containerOne {
      flex-direction: column;
    }
    .section3 {
      background-size: 250%;
      background-position: -250px 0px;
      min-height: 300px;
    }
    .block,
    .block2 {
      width: 100%;
    }

    .block3_1,
    .block3_2,
    .block3_3 {
      margin-left: 0px;
    }

    .topLine {
      width: 100%;
      margin: 0px;
    }

    .sendMessageContainer {
      width: 100%;
    }
    .mainTitle {
      text-align: center;
      font-size: 26px;
    }
    .blocks3 {
      margin-top: 0px;
      padding-top: 0px;
    }
    .block3 {
      width: 80%;
    }
    .section4image {
      z-index: -1;
    }
    .messageRow {
      flex-direction: column;
    }
    .awardTitle:first-child {
      margin-top: 40px;
    }
    .awardTitle {
      text-align: center;
    }
    .block2 {
      margin-bottom: 40px;
    }
    .block2Image {
      width: 80px;
      height: 80px;
    }
    .headerText {
      font-size: 26px !important;
    }
    .block {
      border-left: none;
    }
    button {
      margin-right: 0px;
      width: calc(100% - 40px);
    }
    .header {
      max-width: 100%;
    }
    table {
      word-break: break-word;
    }
  }
</style>
