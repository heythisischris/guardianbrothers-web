<script>
  import { onMount } from "svelte";
  let navArray = [
    8.77,
    9.0,
    8.24,
    9.54,
    10.0,
    7.6,
    9.7,
    9.8,
    9.0,
    8.67,
    8.5,
    8.0,
    8.34,
    9.28,
    10.0,
    10.23,
    10.5,
    10.32,
    10.73,
    10.32,
    11.0,
    10.45,
    10.34,
    11.0,
    10.7,
    11.1,
    11.12,
    11.45
  ];
  let navToday = navArray[navArray.length - 1];
  let navReturn = `${(navToday / 10 - 1).toFixed(2)}% ($${(
    navToday - 10
  ).toFixed(2)})`;
  function goToSection(section) {
    document.getElementById(section).scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:400px;">
    <div style="margin-top:25px;margin-bottom:25px;">
      Guardian Brother Equity Fund (GBH)
    </div>
    <div style="display:flex;flex-direction:row;justify-content:space-between;">
      <div>
        <div>Fund Asset</div>
        <div>$18.2k</div>
      </div>
      <div>
        <div>Fund Strategy</div>
        <div>US Mid-Large Cap Stocks</div>
      </div>
      <div>
        <div>NAV (Today)</div>
        <div>${navToday}</div>
      </div>
      <div>
        <div>YTD Return</div>
        <div>${navReturn}</div>
      </div>
    </div>
  </div>
</div>
<div class="pageContainerMiddle">
  <div
    class="pageContainerInner"
    style="color:#000000;font-size:22px;min-height:auto;">
    <div style="display:flex;flex-direction:row;justify-content:space-between;">
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionOverview')}>
        Overview
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionPerformance')}>
        Performance
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionFundFacts')}>
        Fund Facts
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionHoldings')}>
        Holdings
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionPortfolioManagers')}>
        Portfolio Managers
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionFundAndExpenses')}>
        Fund & Expenses
      </a>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner">
    <h1 id="sectionOverview">Overview</h1>
    <div class="textBlock">
      <p>
        We believe investing is about transparency, honesty, and accessibility
        for all our investors at any time. We created this fund with the goal of
        downside protection during market declines while seeking long term
        capital appreciation. Our number one goal is to provide exceptional
        returns while minimizing risk.
      </p>
      <p>
        Fund Strategy:
        <br />
        • Fund Title Invest is mid-large cap U.S companies with long-term
        competitive advantages and relevancy, quality management teams and
        positive performance on fund’s criteria.
        <br />
        • Our team focus in value investing. We only invest in companies that
        have being rigorously monitored and have passed all our filters.
        <br />
        • The fund seeks to be independent of the market’s conditions generating
        income in any circumstances. Our main goal is to always be on top of the
        markets.
      </p>
      <p>
        Risk
        <br />
        • You may lose money by investing in the Fund. You should expect the
        Fund's share price and total return to fluctuate within a wide range,
        like the fluctuations of the overall stock market. The Fund's
        performance could be hurt by: (read more)
      </p>
      <i>
        <p>
          Stock market risk: The chance that stock prices overall will decline.
          Stock markets tend to move in cycles, with periods of rising prices
          and periods of falling prices. Manager risk: The chance that, as a
          result of poor security selection by the Advisor, the Fund may
          underperform relative to benchmarks or other funds with similar
          investment objectives. Investment style risk: The chance that returns
          from the mix of small-, mid-, and large-cap stocks in the Fund's
          portfolio will trail returns from the overall stock market.
          Historically, small- and mid-cap stocks have been more volatile in
          price than the large-cap stocks that dominate the overall stock
          market, and they often perform quite differently. Additionally, from
          time to time, growth stocks may be more volatile than the overall
          stock market.
        </p>
        <p>
          Sector-focus risk: The chance that investing a significant portion of
          the Fund’s assets in one sector of the market exposes the Fund to
          greater market risk and potential monetary losses than if those assets
          were spread among various sectors.
        </p>
        <p>
          Foreign securities risk: The chance that the value of foreign
          securities will be adversely affected by the political and economic
          environments and other overall economic conditions in the countries
          where the Fund invests. Investing in foreign securities involves:
          country risk, which is the chance that domestic events - such as
          political upheaval, financial troubles, or natural disasters – will
          weaken a country's securities markets; and currency risk, which is the
          chance that the value of a foreign investment, measured in U.S.
          dollars, will decrease because of unfavorable changes in currency
          exchange rates. Small- and mid-cap stocks risk: The chance that small-
          and mid-cap stocks may trade less frequently or in more limited volume
          than those of larger, more established companies; may fluctuate in
          value more; and, as a group, may suffer more severe price declines
          during periods of generally declining stock prices.
        </p>
      </i>
    </div>
    <h1 id="sectionPerformance">Performance</h1>
    <div class="textBlock">
      <p>
        This chart illustrates the performance of a hypothetical $10,000
        investment in the Fund since its inception on 11/01/2004. Assumes
        investment of dividends and capital gains, but does not reflect the
        effect of any applicable sales charges or redemption fees. This chart
        does not imply any future performance.
      </p>
    </div>
    <h1 id="sectionFundFacts">Fund Facts</h1>
    <div class="textBlock">
      <p>
        • Fund Objective – Capital Appreciation and income
        <br />
        • Fund Strategy – U.S Mid-Large Cap Long/Short Equity Fund
        <br />
        • Ticker – FMB
        <br />
        • Fund Asset – total fund’s assets
        <br />
        • CUSIP – Not yet
        <br />
        • Distribution Frequency – Quarterly
        <br />
        • Minimum Initial Investment - $500
        <br />
        • Minimum Subsequent Investment - $50
        <br />
        • Gross Expense Ratio – 0.50%
        <br />
        • NAV – of the current date
        <br />
        • NAV Change from prior day -
        <br />
      </p>
    </div>
    <h1 id="sectionHoldings">Holdings</h1>
    <div class="textBlock">
      <p>Work in progress.</p>
    </div>
    <h1 id="sectionPortfolioManagers">Portfolio Managers</h1>
    <div class="textBlock">
      <p>
        Fernando Guardia Virreira is President and Portfolio Manager of FMB.
        SEC-Registered investment advisor CRD- 305744
      </p>
    </div>
    <h1 id="sectionFundAndExpenses">Fund & Expenses</h1>
    <div class="textBlock">
      <p>
        Management Fee – 1% (Investment entry fee)
        <br />
        Expense Ratio – 0.50% (Annual expense fee)
        <br />
        Performance fees - 10% over return (quarterly)
        <br />
      </p>
    </div>
  </div>
</div>
