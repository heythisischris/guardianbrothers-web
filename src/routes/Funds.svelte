<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { navigate } from "svelte-routing";
  import { _ } from "svelte-i18n";
  onMount(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_funds.jpg')";
    document.querySelectorAll("#body")[0].style.backgroundPosition =
      "50% 100px";
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
      {$_("funds.main.title")}
    </div>
    <div class="mainSubtitle" in:fade={{ delay: 0, duration: 500 }}>
      {$_("funds.main.subtitle")}
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner" style="padding-bottom:0px;">
    <div class="row">
      <div
        class="rowItem"
        on:click={() => {
          navigate("/equityFund1");
        }}
      >
        <div class="fundsTitle">{$_("funds.equityFund1.title")}</div>
        <div class="fundsSubtitle">{$_("funds.equityFund1.subtitle")}</div>
      </div>
      <div
        class="rowItem"
        on:click={() => {
          navigate("/hybridFund");
        }}
      >
        <div class="fundsTitle">{$_("funds.hybridFund.title")}</div>
        <div class="fundsSubtitle">{$_("funds.hybridFund.subtitle")}</div>
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
    margin-top: -120px;
  }
  .rowItem {
    width: 50%;
    background-color: #394355;
    color: #ffffff;
    padding: 30px;
    margin: 20px;
    height: 200px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .fundsTitle {
    font-size: 40px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  .fundsSubtitle {
    font-size: 20px;
    font-weight: 400;
  }
  .rowItem:hover {
    background-color: #5d6e89;
  }
  .pageContainer {
    min-height: 100px;
  }
  @media only screen and (max-width: 850px) {
    .row {
      flex-direction: column;
    }
    .rowItem {
      width: calc(100% - 40px);
      margin: 0px;
      margin-bottom: 20px;
    }
  }
</style>
