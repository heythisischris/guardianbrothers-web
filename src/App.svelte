<script>
  import { Router, Route } from "svelte-routing";
  import NavLink from "./components/NavLink.svelte";
  import Funds from "./routes/Funds.svelte";
  import Insights from "./routes/Insights.svelte";
  import Strategies from "./routes/Strategies.svelte";
  import About from "./routes/About.svelte";
  import Contact from "./routes/Contact.svelte";

  // Used for SSR. A falsy value is ignored by the Router.
  export let url = "";
</script>

<head>
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0,
    user-scalable=0" />
  <title>Guardian Brothers Holdings Inc.</title>
  <meta charset="utf-8" />
  <meta name="description" content="Guardian Brothers Holdings Inc." />
  <meta name="author" content="Chris Aitken" />
  <meta property="og:url" content="guardianbrothers.com" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Guardian Brothers Holdings Inc." />
  <meta property="og:description" content="Guardian Brothers Holdings Inc." />
  <meta
    name="apple-mobile-web-app-title"
    content="Guardian Brothers Holdings Inc." />
  <meta name="application-name" content="Guardian Brothers Holdings Inc." />
</head>
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
                style="display:flex;flex-direction:column;justify-content:center;">
                <div style="font-size:36px;">Guardian Brothers Holdings</div>
                <div style="font-size:22px;">Invest in your future</div>
              </div>
            </NavLink>
          </div>
          <div
            style="display:flex;flex-direction:column;justify-content:center;align-items:flex-end;">
            <div class="navSocial">
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
              <a
                target="_blank"
                href="https://www.facebook.com/guardianbrothers/">
                <img
                  class="socialIcon"
                  alt="bandcamp"
                  src="images/facebook.svg" />
              </a>
            </div>
            <div class="navLinks">
              <NavLink to="/">Funds</NavLink>
              <NavLink to="insights">Insights</NavLink>
              <NavLink to="strategies">Strategies</NavLink>
              <NavLink to="about">About</NavLink>
              <NavLink to="contact">Contact</NavLink>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <Route path="/" component={Funds} />
    <Route path="insights" component={Insights} />
    <Route path="strategies" component={Strategies} />
    <Route path="about" component={About} />
    <Route path="contact" component={Contact} />
    <div class="footer">Copyright © 2020 Guardian Brothers Holdings Inc.</div>
  </div>
</Router>
