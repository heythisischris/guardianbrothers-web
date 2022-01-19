<script>
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import NavLink from "./components/NavLink.svelte";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import ContactUs from "./routes/ContactUs.svelte";
  import Funds from "./routes/Funds.svelte";
  import Team from "./routes/Team.svelte";
  import { addMessages, getLocaleFromNavigator, init } from "svelte-i18n";
  import es from "./es.json";
  addMessages("es", es);
  init({
    fallbackLocale: "es",
    initialLocale: getLocaleFromNavigator(),
  });

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
  var isMobile = false;
  //background scroll
  onMount(() => {
    (function () {
      isMobile = window.matchMedia(
        "only screen and (max-width: 760px)"
      ).matches;
      var parallax = window.document.querySelectorAll("body"),
        speed = 0.4;
      window.onscroll = function () {
        [].slice.call(parallax).forEach(function (el, i) {
          var windowYOffset = window.pageYOffset,
            elBackgrounPos = "50% " + (windowYOffset * speed + 100) + "px";
          el.style.backgroundPosition = elBackgrounPos;
        });
      };
    })();
  });
</script>

<Router {url}>
  <div class="container">
    <div
      class="navContainer"
      style="height:40px;background-color:#A09162;padding:0px;margin:0px;"
    >
      <div
        class="navContainerInner"
        style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;color:#ffffff;"
      >
        <a
          target="_blank"
          href="https://goo.gl/maps/wq7EaAxM3nkQ9EC1A"
          style="display:flex;flex-direction:row;justify-content:space-between;align-items:center;color:#ffffff;text-decoration-line:none;"
        >
          <img class="socialIcon" alt="location" src="images/location.svg" />
          {!isMobile ? `601 Brickell Key Drive, Miami, FL` : `Miami, FL`}
        </a>
        <div class="navSocial">
          <a target="_blank" href="https://www.facebook.com/guardianbrothers/">
            <img class="socialIcon" alt="facebook" src="images/facebook.svg" />
          </a>
          <a
            target="_blank"
            href="https://www.instagram.com/guardianbrothersofficial/"
          >
            <img
              class="socialIcon"
              alt="instagram"
              src="images/instagram.svg"
            />
          </a>
          <a
            target="_blank"
            href="https://www.linkedin.com/company/guardianbrothers/"
          >
            <img class="socialIcon" alt="linkedin" src="images/linkedin.svg" />
          </a>
          <a target="_blank" href="https://twitter.com/GBH_Fund">
            <img class="socialIcon" alt="twitter" src="images/twitter.svg" />
          </a>
        </div>
      </div>
    </div>
    <nav>
      <div class="navContainer">
        <div class="navContainerInner">
          <div class="navTitle">
            <NavLink to="/">
              <img
                style="margin-right:10px;"
                class="logo"
                alt=""
                src="/images/logo.svg"
              />
              <div
                style="display:flex;flex-direction:column;justify-content:center;color:#000000;"
              >
                <div id="title">Guardian Brothers Holdings</div>
                <div id="subtitle">Invest in your future</div>
              </div>
            </NavLink>
          </div>
          <div
            style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;"
          >
            <div class="navLinks">
              <NavLink to="/">HOME</NavLink>
              <NavLink to="/about">ABOUT</NavLink>
              <NavLink to="/contactus">CONTACT {isMobile ? "" : "US"}</NavLink>
              <NavLink to="/funds">FUNDS</NavLink>
              <NavLink to="/team">TEAM</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/contactus" component={ContactUs} />
    <Route path="/funds" component={Funds} />
    <Route path="/team" component={Team} />
    <div class="navContainer blocksContainer">
      <div class="navContainerInner blocks" style="width:100%">
        <div class="blocksInner">
          <a href="/" style="font-family: 'alegreya-regular';">
            <img
              style="margin-right:10px;height:70px;"
              class="logo"
              alt=""
              src="/images/logo.svg"
            />
            <div
              style="display:flex;flex-direction:column;justify-content:center;color:#000000;"
            >
              <div style="font-size:20px;">Guardian Brothers Holdings</div>
              <div style="font-size:14px;">Invest in your future</div>
            </div>
          </a>
          <p style="margin-bottom:20px;font-size:12px;">
            {`Investing involves risk, including loss of principal. Past performance does not guarantee or indicate future results. Any historical returns expected returns or probability projections may not reflect actual future performance. While the data we use from third parties is believed to be reliable, we cannot ensure the accuracy or completeness of data provided by investors or other third parties. Neither Guardian Brothers Holdings nor any of its affiliates provide tax advice and do not represent in any manner that the outcomes described herein will result in any particular tax consequence. Offers to sell, or solicitations of offers to buy, any security can only be made through official offering documents that contain important information about investment objectives, risks, fees, and expenses. Prospective investors should consult with a tax or legal adviser before making any investment decision.`}
          </p>
          <div class="yellowLine" />
          <a href="tel:4788414516" class="award">
            <div class="awardIcon" style="background-color:#A09162;">
              <img alt="call" src="images/call.svg" />
            </div>
            <div class="awardTextContainer" style="width:200px;">
              <div class="awardTitle">Call Any Time</div>
              <div class="awardSubtitle">(478) 841-4516</div>
            </div>
          </a>
        </div>
        <div class="blocksInner">
          <div class="footerTitle">Explore</div>
          <div class="yellowLine" />
          <div class="blocksMenuContainer">
            <div class="blocksMenu">
              <a href="/">HOME</a>
              <a href="/about">ABOUT</a>
              <a href="/contactus">CONTACT US</a>
              <a href="/privacypolicy">PRIVACY POLICY</a>
              <a href="/termsofservice">TERMS OF SERVICE</a>
            </div>
            <div class="blocksMenu">
              <a href="/funds#sectionOverview">OVERVIEW</a>
              <a href="/funds#sectionHowItWorks">HOW IT WORKS</a>
              <a href="/funds#sectionPerformance">PERFORMANCE</a>
              <a href="/funds#sectionFundFacts">FUND FACTS</a>
              <a href="/funds#sectionTopHoldings">HOLDINGS</a>
              <a href="/funds#sectionDiversification">DIVERSIFICATION</a>
              <a href="/funds#sectionTeam">TEAM</a>
            </div>
          </div>
        </div>
        <div class="blocksInner">
          <div class="footerTitle">Contact</div>
          <div class="yellowLine" />
          <div class="blocksMenu">
            <div class="contactContainer">
              <img alt="email" src="images/footer_email.svg" />
              <a href="mailto:fernando@guardianbrothers.com"
                >Fernando@guardianbrothers.com</a
              >
            </div>
            <div class="contactContainer">
              <img alt="time" src="images/footer_time.svg" />
              <div>Mon - Sat 8:00 AM - 6:00 PM</div>
            </div>
            <div class="contactContainer">
              <img alt="location" src="images/footer_location.svg" />
              <a target="_blank" href="https://goo.gl/maps/wq7EaAxM3nkQ9EC1A"
                >601 Brickell Key Drive, Miami, FL{isMobile ? `` : `33131`}</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="navContainer"
      style="height:60px;background-color:#A09162;padding:0px;margin:0px;color:#ffffff;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:12px;"
    >
      Copyright © {new Date().getFullYear()} Guardian Brothers Holdings LLC
    </div>
  </div>
</Router>

<style>
  .contactContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }
  .contactContainer img {
    margin-right: 20px;
    margin-bottom: 2px;
    width: 20px;
    object-fit: none;
  }
  .blocksContainer {
    height: 500px;
    background-color: #f2efe5;
    padding: 0px;
    margin: 0px;
    color: #ffffff;
  }
  .footerTitle {
    width: 100%;
    color: #141414;
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .yellowLine {
    width: 100%;
    height: 1px;
    background-color: #a09162;
  }

  .blocks a {
    color: #888888;
    text-decoration-line: none;
    transition: 0.2s;
  }
  .blocks a:hover {
    color: #000000;
  }

  .blocks {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-top: 50px;
  }
  .blocksInner {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 30%;
    color: #888888;
  }
  .blocksMenu {
    width: 100%;
    line-height: 40px;
    display: flex;
    flex-direction: column;
  }
  .blocksMenuContainer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
  }

  @media only screen and (max-width: 850px) {
    .blocks {
      flex-direction: column;
    }

    .blocksInner {
      width: 100%;
      margin: 0px;
      padding: 0px;
      margin-bottom: 20px;
    }
    .blocksContainer {
      height: 100%;
      width: calc(100% - 60px);
      padding: 30px;
    }
    .blocksMenuContainer {
      flex-direction: column;
    }
  }
</style>
