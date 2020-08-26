<script>
  import { Router, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import NavLink from "./components/NavLink.svelte";
  import Funds from "./routes/Funds.svelte";
  import Insights from "./routes/Insights.svelte";
  import Strategies from "./routes/Strategies.svelte";
  import Contact from "./routes/Contact.svelte";

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";

  //background scroll

  onMount(() => {
    (function() {
      var parallax = window.document.querySelectorAll("body"),
        speed = 0.5;
      window.onscroll = function() {
        [].slice.call(parallax).forEach(function(el, i) {
          var windowYOffset = window.pageYOffset,
            elBackgrounPos = "50% " + windowYOffset * speed + "px";
          el.style.backgroundPosition = elBackgrounPos;
        });
      };
    })();
  });
</script>

<Router {url}>
  <div class="container">
    <nav>
      <div class="navContainer">
        <div class="navContainerInner">
          <div class="navTitle">
            <NavLink to="/">
              <img
                style="margin-right:10px;"
                class="logo"
                alt=""
                src="/images/logo.svg" />
              <div
                style="display:flex;flex-direction:column;justify-content:center;color:#000000;">
                <div id="title">Guardian Brothers Holdings</div>
                <div id="subtitle">Invest in your future</div>
              </div>
            </NavLink>
          </div>
          <div
            style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;">
            <div class="navSocial">
              <a
                target="_blank"
                href="https://www.facebook.com/guardianbrothers/">
                <img
                  class="socialIcon"
                  alt="facebook"
                  src="images/facebook.svg" />
              </a>
              <a
                target="_blank"
                href="https://www.instagram.com/guardianbrothersofficial/">
                <img
                  class="socialIcon"
                  alt="instagram"
                  src="images/instagram.svg" />
              </a>
              <a
                target="_blank"
                href="https://www.linkedin.com/guardianbrothers/">
                <img
                  class="socialIcon"
                  alt="linkedin"
                  src="images/linkedin.svg" />
              </a>
              <a
                target="_blank"
                href="https://www.twitter.com/guardianbrothers/">
                <img
                  class="socialIcon"
                  alt="twitter"
                  src="images/twitter.svg" />
              </a>
            </div>
            <div class="navLinks">
              <NavLink to="/">Funds</NavLink>
              <NavLink to="insights">Insights</NavLink>
              <NavLink to="strategies">Strategies</NavLink>
              <NavLink to="contact">Contact</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <Route path="/" component={Funds} />
    <Route path="insights" component={Insights} />
    <Route path="strategies" component={Strategies} />
    <Route path="contact" component={Contact} />
    <div class="footer">Copyright © 2020 Guardian Brothers Holdings LLC</div>
  </div>
</Router>
