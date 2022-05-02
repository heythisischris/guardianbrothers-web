<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    const isMobile = window.matchMedia(
      "only screen and (max-width: 760px)"
    ).matches;
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_contactus.jpg')";
    document.querySelectorAll("#body")[0].style.backgroundPosition = `50% ${
      isMobile ? "50" : "100"
    }px`;
  });
  let firstName = "";
  let lastName = "";
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
      {$_("contact.main.title")}
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      {$_("contact.main.subtitle")}
    </div>
  </div>
</div>
<div class="pageContainer" style="background-color:#F2EFE5">
  <div class="pageContainerInner expandContact">
    <div class="row">
      <div class="rowItem">
        <div class="header" style="margin-top:50px;">
          <div class="headerLine" />
          <div class="headerText">{$_("contact.section1.title")}</div>
          <div class="headerLine" />
        </div>
        <div class="subHeaderText">{$_("contact.section1.subtitle")}</div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="marker" src="images/pin.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("contact.section1.badge1.title")}</div>
            <div class="awardSubtitle">
              {$_("contact.section1.badge1.description")}
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="call" src="images/phone.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("contact.section1.badge2.title")}</div>
            <div class="awardSubtitle">
              {$_("contact.section1.badge2.description")}
            </div>
          </div>
        </div>
        <div class="award">
          <div class="awardIcon" style="background-color:#d1a765;">
            <img alt="certificate" src="images/email.svg" />
          </div>
          <div class="awardTextContainer">
            <div class="awardTitle">{$_("contact.section1.badge3.title")}</div>
            <div class="awardSubtitle">
              {$_("contact.section1.badge3.description")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="contactContainer">
    <div class="header" style="margin-top:50px;">
      <div class="headerLine" />
      <div class="headerText">{$_("contact.section2.title")}</div>
      <div class="headerLine" />
    </div>
    <div class="subHeaderText">{$_("contact.section2.subtitle")}</div>
    {#if messageSent}
      <p>{$_("contact.section2.form.success")}</p>
    {:else}
      <div>
        <div class="row">
          <input
            bind:value={firstName}
            class="rowItem"
            placeholder={$_("contact.section2.form.firstName")}
          />
          <input
            bind:value={lastName}
            class="rowItem"
            placeholder={$_("contact.section2.form.lastName")}
          />
        </div>
        <div class="row">
          <input
            bind:value={email}
            placeholder={$_("contact.section2.form.email")}
          />
        </div>
        <div class="row">
          <textarea
            bind:value={message}
            style="min-height:200px"
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
<iframe
  title="map"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3585.415343297413!2d-80.3429729845866!3d26.019962904212036!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9a69434b5cbab%3A0xf7321824a4c395e3!2s1620%20NW%20143rd%20Terrace%2C%20Pembroke%20Pines%2C%20FL%2033028!5e0!3m2!1sen!2sus!4v1651534497206!5m2!1sen!2sus"
  style="width:100%;height:500px;border:0;"
  allowfullscreen=""
  loading="lazy"
/>
<div class="pageContainer" style="min-height:400px;">
  <div class="pageContainerInner" style="padding-bottom:0px;">
    <div class="row">
      <div class="rowItem">
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

        {#if addedToMailingList}
          <p style="margin:40px;">
            {$_("contact.section3.form.success")}
          </p>
        {:else}
          <div class="row" style="align-items:center;margin-top:40px;">
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
    padding: 10px 20px;
    min-width: 150px;
    text-align: center;
    cursor: pointer;
    transition: 0.2s;
  }
  button:hover {
    background-color: #9bc8ff;
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
    .awardTextContainer {
      max-width: 150px;
    }

    .awardIcon {
      margin-right: 20px;
      margin-left: -10px;
    }
  }
</style>
