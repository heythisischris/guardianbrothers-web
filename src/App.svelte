<script>
  import { Router, Route } from "svelte-routing";
  import { globalHistory } from "svelte-routing/src/history";
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";
  import NavLink from "./components/NavLink.svelte";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
  import ContactUs from "./routes/ContactUs.svelte";
  import Funds from "./routes/Funds.svelte";
  import EquityFund1 from "./routes/equityFund1.svelte";
  import HybridFund from "./routes/hybridFund.svelte";
  import Team from "./routes/Team.svelte";
  import Login from "./routes/Login.svelte";
  import Signup from "./routes/Signup.svelte";
  import Reset from "./routes/Reset.svelte";
  import Account from "./routes/Account.svelte";
  import BurgerMenu from "svelte-burger-menu";
  import { _, addMessages, getLocaleFromNavigator, init } from "svelte-i18n";
  import es from "./es.json";
  addMessages("es", es);
  init({
    fallbackLocale: "es",
    initialLocale: getLocaleFromNavigator(),
  });
  const Auth = aws_amplify_auth.Auth;

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
  let pathname = window.location.pathname;
  let unsub;
  var isMobile = false;
  //background scroll
  onMount(() => {
    unsub = globalHistory.listen(({ location, action }) => {
      pathname = location.pathname;
    });
    (function () {
      isMobile = window.matchMedia(
        "only screen and (max-width: 760px)"
      ).matches;
      var parallax = window.document.querySelectorAll("body"),
        speed = 0.4;
      window.onscroll = function () {
        [].slice.call(parallax).forEach(function (el, i) {
          var windowYOffset = window.pageYOffset,
            elBackgrounPos =
              "50% " +
              (windowYOffset * speed +
                (["/", "/hybridFund"].includes(pathname)
                  ? 0
                  : isMobile
                  ? 50
                  : 100)) +
              "px";
          el.style.backgroundPosition = elBackgrounPos;
        });
      };
    })();
  });
  onDestroy(() => {
    unsub();
  });

  //check for auth session
  let authenticated = false;
  let userData = {};
  const authCheck = async () => {
    try {
      userData = (await Auth.currentSession()).getIdToken().payload;
      authenticated = true;
    } catch (err) {
      authenticated = false;
    }
  };
  authCheck();
</script>

<Router {url}>
  <div class="container">
    <nav>
      <div
        class="navContainer"
        style={["/", "/hybridFund"].includes(pathname)
          ? "background-color:transparent"
          : ""}
      >
        <div class="navContainerInner">
          <div class="navTitle">
            <NavLink to="/">
              <img
                style="margin-right:10px;{['/', '/hybridFund'].includes(
                  pathname
                )
                  ? 'filter: brightness(10)'
                  : ''}"
                class="logo"
                alt=""
                src="/images/logo.svg"
              />
              <div
                class="titleContainer"
                style="display:flex;flex-direction:column;justify-content:center;color:#333333;"
              >
                <div id="title">Guardian Brothers Holdings</div>
                <div id="titleLine" />
                <div
                  id="subtitle"
                  style={["/", "/hybridFund"].includes(pathname)
                    ? "color:#ffffff"
                    : ""}
                >
                  GESTIÓN FINANCIERA
                </div>
              </div>
            </NavLink>
          </div>
          <div
            style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;"
          >
            {#if isMobile}
              <BurgerMenu
                duration={0.2}
                width="100%"
                paddingTop="100px"
                padding="30px"
                menuColor="#ffffff"
                burgerColor={["/", "/hybridFund"].includes(pathname)
                  ? "#ffffff"
                  : "#000000"}
                backgroundColor="#284660"
              >
                <a
                  class="mobileLinks {pathname === '/'
                    ? 'activeMobileLink'
                    : ''}"
                  href="/">{$_("app.home")}</a
                >
                <p />
                <a
                  class="mobileLinks {pathname === '/about'
                    ? 'activeMobileLink'
                    : ''}"
                  href="/about">{$_("app.about")}</a
                >
                <p />
                <a
                  class="mobileLinks {pathname === '/contactus'
                    ? 'activeMobileLink'
                    : ''}"
                  href="/contactus">{$_("app.contact")}</a
                >
                <p />
                <a
                  class="mobileLinks {pathname === '/funds'
                    ? 'activeMobileLink'
                    : ''}"
                  href="/funds">{$_("app.funds")}</a
                >
                <p />
                <a
                  class="mobileLinks {pathname === '/team'
                    ? 'activeMobileLink'
                    : ''}"
                  href="/team">{$_("app.team")}</a
                >
              </BurgerMenu>
            {:else}
              <!-- <div
                class="navLinks"
                style="display:flex;flex-direction:row;align-items:center;justify-content:center;margin-bottom:-5px;margin-top:-5px;"
              >
                {#if authenticated}
                  <div
                    style="margin-right:5px;color:{pathname === '/'
                      ? '#ffffff'
                      : '#000000'}"
                  >
                    Welcome, {userData.given_name}!
                  </div>
                  <div style="background-color:#000000;margin-right:10px;">
                    <NavLink to="/account">Account</NavLink>
                  </div>
                  <div style="background-color:#555555">
                    <a
                      class="authLink"
                      href="javascript:void(0)"
                      on:click={() => {
                        authenticated = false;
                      }}>Logout</a
                    >
                  </div>
                {:else}
                  <div style="background-color:#000000;margin-right:10px;">
                    <NavLink to="/login">{$_("app.login")}</NavLink>
                  </div>
                  <div style="background-color:#555555">
                    <NavLink to="/signup">{$_("app.signup")}</NavLink>
                  </div>
                {/if}
              </div> -->
              <div class="navLinks">
                <NavLink to="/">{$_("app.home")}</NavLink>
                <NavLink to="/about">{$_("app.about")}</NavLink>
                <NavLink to="/contactus">{$_("app.contact")}</NavLink>
                <NavLink to="/funds">{$_("app.funds")}</NavLink>
                <NavLink to="/team">{$_("app.team")}</NavLink>
              </div>
            {/if}
          </div>
        </div>
      </div>
    </nav>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/contactus" component={ContactUs} />
    <Route path="/funds" component={Funds} />
    <Route path="/equityFund1" component={EquityFund1} />
    <Route path="/hybridFund" component={HybridFund} />
    <Route path="/team" component={Team} />
    <Route path="/login" component={Login} />
    <Route path="/signup" component={Signup} />
    <div class="navContainer blocksContainer">
      <div class="navContainerInner blocks" style="width:100%">
        <div class="blocksInner">
          <a href="/" style="font-family: 'alegreya-regular';">
            <img
              style="margin-right:10px;height:40px;"
              class="logo"
              alt=""
              src="/images/logo.svg"
            />
            <div
              style="display:flex;flex-direction:column;justify-content:center;color:#333333;"
            >
              <div style="font-size:18px;">
                Guardian Brothers{isMobile ? "" : " Holdings"}
              </div>
              <div style="font-size:12px;font-family:arial;text-align:right;">
                GESTIÓN FINANCIERA
              </div>
            </div>
          </a>
          <p style="margin-bottom:10px;font-size:12px;width:99%;">
            © 2010-2022 Guardian Brothers Fund
          </p>
          <p style="margin-bottom:20px;font-size:12px;">
            {`No hay garantías de que los Fondos cumplirán sus objetivos de inversión o que sus estrategias GBH serán exitosas.
              Los datos de rendimiento indicados representan el rendimiento pasado y no son garantía de rendimientos futuros. El rendimiento actual puede ser inferior o superior a los datos de rendimiento citados.`}
          </p>
        </div>
        <div class="blocksInner">
          <div class="footerTitle">{$_("app.exploreBottom")}</div>
          <div class="yellowLine" />
          <div class="blocksMenuContainer">
            <div class="blocksMenu">
              <a href="/">{$_("app.home")}</a>
              <a href="/about">{$_("app.about")}</a>
              <a href="/contactus">{$_("app.contact")}</a>
              <a href="/privacypolicy">{$_("app.privacy")}</a>
              <a href="/termsofservice">{$_("app.terms")}</a>
            </div>
            <div class="blocksMenu">
              <a href="/equityFund1#sectionOverview">{$_("app.overview")}</a>
              <a href="/equityFund1#sectionHowItWorks">{$_("app.howItWorks")}</a
              >
              <a href="/equityFund1#sectionPerformance"
                >{$_("app.performance")}</a
              >
              <a href="/equityFund1#sectionFundFacts">{$_("app.fundFacts")}</a>
              <a href="/equityFund1#sectionTopHoldings">{$_("app.holdings")}</a>
              <a href="/equityFund1#sectionDiversification"
                >{$_("app.diversification")}</a
              >
            </div>
          </div>
        </div>
        <div class="blocksInner">
          <div class="footerTitle">{$_("app.contactBottom")}</div>
          <div class="yellowLine" />
          <div class="blocksMenu">
            <div class="contactContainer">
              <img alt="email" src="images/footer_email.svg" />
              <a href="mailto:invest@guardianbrothers.com"
                >invest@guardianbrothers.com</a
              >
            </div>
            <div class="contactContainer">
              <img alt="time" src="images/footer_time.svg" />
              <div>Mon - Sat 8:00 AM - 6:00 PM</div>
            </div>
            <div class="contactContainer">
              <img alt="location" src="images/footer_location.svg" />
              <a target="_blank" href="https://goo.gl/maps/bTjBTtdwFqquXE4AA"
                >1620 NW 143rd Terrace, Pembroke Pines, FL 33028</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="navContainer"
      style="height:60px;background-color:#d1a765;padding:0px;margin:0px;color:#ffffff;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:12px;"
    >
      {$_("app.copyright")} © {new Date().getFullYear()} Guardian Brothers Holdings
      LLC
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
    background-color: #d1a765;
  }

  .blocks a {
    color: #888888;
    text-decoration-line: none;
    transition: 0.2s;
  }
  .blocks a:hover {
    color: #333333;
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
  #titleLine {
    height: 1px;
    width: 78%;
    background-color: #c49c4b;
    margin-left: auto;
    margin-top: -5px;
    margin-bottom: 3px;
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
    .logo {
      display: none;
    }
    .navContainerInner {
      align-items: flex-end;
      margin-bottom: 24px;
      margin-top: 8px;
    }
    .mobileLinks {
      color: #ffffff !important;
      text-decoration-line: none;
      font-size: 24px;
    }
    .activeMobileLink {
      text-decoration-line: underline;
      color: #c49c4b !important;
    }
  }
</style>
