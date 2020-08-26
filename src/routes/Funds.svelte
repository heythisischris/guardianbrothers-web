<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  var isMobile = window.matchMedia("only screen and (max-width: 760px)")
    .matches;

  function goToSection(section) {
    document.getElementById(section).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest"
    });
  }
  async function loadAPI(url) {
    let data = await fetch(url);
    let response = await data.json();
    return response;
  }
  var stats = loadAPI("https://api.guardianbrothers.com/stats");
  stats.then(innerStats => {
    stats = innerStats;
  });

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  });

  var displayedPositions = [];
  var positions = loadAPI("https://api.guardianbrothers.com/positions");
  positions.then(innerPositions => {
    positions = innerPositions;
    displayedPositions = positions.positions.slice(0, 10);
  });

  async function exportCsv() {
    let array = stats.map((obj, index) => [
      obj.id.substring(0, 10),
      "$" + (obj.value / obj.shares).toFixed(2),
      obj.shares,
      "$" + obj.value
    ]);
    array.unshift([
      "Date",
      "NAV",
      "Shares Outstanding",
      "Net Liquidated Value & Trades"
    ]);

    let csvContent =
      "data:text/csv;charset=utf-8," + array.map(e => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "guardian_brothers_fund_export.csv");
    document.body.appendChild(link);
    link.click();
  }

  onMount(() => {
    setTimeout(() => {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        let performanceArray = stats.map((obj, index) => [
          new Date(obj.id),
          +(parseFloat(obj.value) / parseFloat(obj.shares)).toFixed(2)
          //parseFloat(obj.value)
        ]);
        //console.log(array);
        var performanceChart = new window.google.visualization.AreaChart(
          document.getElementById("performanceChart")
        );
        let performanceData = new google.visualization.DataTable();
        performanceData.addColumn("date", "Month");
        performanceData.addColumn("number", "Price");
        performanceData.addRows(performanceArray);
        performanceChart.draw(performanceData, {
          legend: { position: "none" },
          backgroundColor: { fill: "transparent" },
          chartArea: {
            left: isMobile ? 50 : 75,
            top: 5,
            width: "100%",
            height: "90%"
          },
          vAxis: { format: "currency" },
          hAxis: {
            gridlines: { units: { months: { format: ["MMM YYYY"] } } },
            minorGridlines: { units: { days: { format: [] } } }
          }
        });

        let diversificationArray = [];
        for (let obj of positions.positions) {
          let findIndex = diversificationArray.findIndex(
            innerObj => innerObj[0] === obj.sector
          );
          if (findIndex === -1) {
            diversificationArray.push([obj.sector, obj.marketValue]);
          } else {
            diversificationArray[findIndex][1] += obj.marketValue;
          }
        }

        var diversificationChart = new window.google.visualization.PieChart(
          document.getElementById("diversificationChart")
        );
        let diversificationData = new google.visualization.DataTable();
        diversificationData.addColumn("string", "sector");
        diversificationData.addColumn("number", "marketValue");
        diversificationData.addRows(diversificationArray);

        diversificationChart.draw(diversificationData, {
          legend: { position: isMobile ? "none" : "" },
          colors: ["#2a314a", "#415777", "#617da1", "#8aaacd", "#b5d8f5"],
          backgroundColor: { fill: "transparent" },
          chartArea: { left: 0, top: 0, width: "100%", height: "100%" },
          vAxis: { format: "currency" },
          hAxis: {
            gridlines: {
              units: {
                months: { format: ["MMM YYYY"] }
              }
            },
            minorGridlines: {
              units: {
                days: { format: [] }
              }
            }
          }
        });

        let marketCapArray = [
          ["Micro", 0],
          ["Small", 0],
          ["Mid", 0],
          ["Large", 0],
          ["Mega", 0]
        ];
        for (let obj of positions.positions) {
          if (obj.marketCap >= 0 && obj.marketCap < 300000000) {
            marketCapArray[0][1] += obj.marketValue;
          }
          if (obj.marketCap >= 300000000 && obj.marketCap < 2000000000) {
            marketCapArray[1][1] += obj.marketValue;
          }
          if (obj.marketCap >= 2000000000 && obj.marketCap < 10000000000) {
            marketCapArray[2][1] += obj.marketValue;
          }
          if (obj.marketCap >= 10000000000 && obj.marketCap < 200000000000) {
            marketCapArray[3][1] += obj.marketValue;
          }
          if (obj.marketCap >= 200000000000) {
            marketCapArray[4][1] += obj.marketValue;
          }
        }

        var marketCapChart = new window.google.visualization.PieChart(
          document.getElementById("marketCapChart")
        );
        let marketCapData = new google.visualization.DataTable();
        marketCapData.addColumn("string", "sector");
        marketCapData.addColumn("number", "marketValue");
        marketCapData.addRows(marketCapArray);

        marketCapChart.draw(marketCapData, {
          legend: { position: isMobile ? "none" : "" },
          colors: ["#8aaacd", "#b5d8f5", "#2a314a", "#415777", "#617da1"],
          backgroundColor: { fill: "transparent" },
          chartArea: { left: 0, top: 0, width: "100%", height: "100%" },
          vAxis: { format: "currency" },
          hAxis: {
            gridlines: {
              units: {
                months: { format: ["MMM YYYY"] }
              }
            },
            minorGridlines: {
              units: {
                days: { format: [] }
              }
            }
          }
        });
      }
    }, 1500); //find way to detect google charts loaded instead of timeout
  });
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:400px;">
    {#await stats}
      <div />
    {:then stats}
      <div id="statsTitle">Guardian Brother Holdings - Investors Shares</div>
      <div id="stats" in:fade>
        <div class="statsContainer">
          <div class="infoBorder">
            <div>Fund Assets</div>
            <div>{formatter.format(stats[0].value)}</div>
          </div>
          <div class="infoBorder">
            <div>Shares Outstanding</div>
            <div>{formatter.format(stats[0].shares).slice(1)}</div>
          </div>
        </div>
        <div class="statsContainer">
          <div class="infoBorder">
            <div>NAV</div>
            <div>{formatter.format(stats[0].value / stats[0].shares)}</div>
          </div>
          <div class="infoBorder">
            <div>NAV Change</div>
            <div>
              {formatter.format(stats[0].value / stats[0].shares - stats[1].value / stats[1].shares)}
              ({(((stats[0].value / stats[0].shares - stats[1].value / stats[1].shares) / (stats[1].value / stats[1].shares)) * 100).toFixed(2) + '%'})
            </div>
          </div>
        </div>
      </div>
      <div class="investDiv">
        <a
          class="investButton"
          target="_blank"
          href="https://calendly.com/guardianbrothers/15min"
          in:fade={{ delay: 250 }}>
          INVEST NOW
        </a>
      </div>
    {/await}
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
        OVERVIEW
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionHowItWorks')}>
        HOW IT WORKS
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionPerformance')}>
        PERFORMANCE
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionFundFacts')}>
        FUND FACTS
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionTopHoldings')}>
        HOLDINGS
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionDiversification')}>
        DIVERSIFICATION
      </a>
      <a href="javascript:void(0)" on:click={() => goToSection('sectionTeam')}>
        TEAM
      </a>
    </div>
  </div>
</div>
<div class="pageContainer">
  <div class="pageContainerInner">
    <h1 id="sectionOverview">Overview</h1>
    <div class="textBlock">
      <h2>How We Invest</h2>
      <p>
        We believe investing is about transparency, honesty, and accessibility
        for all our investors at any time. We created this fund with the goal of
        downside protection during market declines while seeking long term
        capital appreciation. Our number one goal is to provide exceptional
        returns while minimizing risk.
      </p>
      <h2>Fund Strategy</h2>
      <p>
        • Guardian Brothers invests in mid-large cap U.S companies with
        long-term competitive advantages and relevancy, quality management teams
        and positive performance on fund’s criteria.
        <br />
        • Our team focus in value investing. We only invest in companies that
        have being rigorously monitored and have passed all our filters.
        <br />
        • The fund seeks to be independent of the market’s conditions generating
        income in any circumstances. Our main goal is to always be on top of the
        markets.
      </p>
    </div>
    <h1 id="sectionHowItWorks">How it works</h1>
    <div class="textBlock">
      <div class="howItWorksBlocks">
        <div in:fade="{{delay: 500, duration: 500}}">
          <p class="howItWorksBlocksTitle">We buy</p>
          <p>
            Guardian Brothers Holdings find opportunities in the stock market.
            Creates a solid portfolio for all of our investors
          </p>
        </div>
        <div in:fade="{{delay: 1000, duration: 500}}">
          <p class="howItWorksBlocksTitle">You Invest</p>
          <p>
            You become a partner and receive benefits of the returns generated
            by Guardian Brothers Fund
          </p>
        </div>
        <div in:fade="{{delay: 1500, duration: 500}}">
          <p class="howItWorksBlocksTitle">Capital Appreciation</p>
          <p>
            Our portfolio appreciates and receives dividends. You get the
            benefit of compounded interest and capital appreciation
          </p>
        </div>
        <div in:fade="{{delay: 2000, duration: 500}}">
          <p class="howItWorksBlocksTitle">You get paid</p>
          <p>
            Your investment appreciates and we help capture your
            profits. No limits on withdrawals, no hidden fees. Easy access.
          </p>
        </div>
      </div>
    </div>
    <h1
      id="sectionPerformance"
      style="display:flex;align-items:flex-end;justify-content:space-between">
      Performance
      <a
        style="float:right;font-size:14px;"
        href="javascript:void(0)"
        on:click={() => {
          exportCsv();
        }}>
        Download CSV
      </a>
    </h1>

    <div class="textBlock">
      <p style="display:flex;flex-direction:row;justify-content:flex-end;" />
      <div
        id="performanceChart"
        style="width: 100%; height: {isMobile ? '300px' : '500px'}"
        in:fade={{ delay: 2000 }} />
    </div>
    <h1 id="sectionTopHoldings">Top Holdings</h1>
    <div class="textBlock">
      {#await positions}
        <div />
      {:then positions}
        <table style="width:100%;" in:fade>
          <thead>
            <tr style="text-align: {isMobile ? 'center' : 'left'};">
              <th>{isMobile ? 'Ticker' : 'Name'}</th>
              <th># of Shares</th>
              <th>Market Value</th>
              <th>Weight</th>
              <th>Total Gain</th>
            </tr>
          </thead>
          <tbody>
            {#each displayedPositions as item}
              <tr>
                <td>{isMobile ? item.instrument.symbol : item.name}</td>
                <td>{item.longQuantity}</td>
                <td>{formatter.format(item.marketValue)}</td>
                <td>
                  {((item.marketValue / positions.liquidationValue) * 100).toFixed(2)}%
                </td>
                <td>
                  {(((item.marketValue / item.longQuantity - item.averagePrice) / item.averagePrice) * 100).toFixed(2)}%
                </td>
              </tr>
            {/each}
            <tr />
            {#if displayedPositions.length !== 10}
              <tr style="height:60px;">
                <td>Cash</td>
                <td>{formatter.format(positions.cashBalance)}</td>
                <td>
                  {((positions.cashBalance / positions.liquidationValue) * 100).toFixed(2) + '%'}
                </td>
              </tr>
            {/if}
          </tbody>
        </table>
        <div style="display:flex;width:100%;justify-content:center;">
          <a
            href="javascript:void(0)"
            on:click={() => {
              if (displayedPositions.length === 10) {
                displayedPositions = positions.positions;
              } else {
                displayedPositions = positions.positions.slice(0, 10);
              }
            }}>
            {displayedPositions.length === 10 ? 'Expand' : 'Collapse'}
          </a>
        </div>
      {/await}
    </div>
    <h1 id="sectionDiversification">Diversification</h1>
    <div class="textBlock diversificationCharts">
      <div
        id="diversificationChart"
        style="width: 50%; height: 350px;"
        in:fade={{ delay: 2000 }} />
      <div
        id="marketCapChart"
        style="width: 50%; height: 350px;"
        in:fade={{ delay: 2000 }} />
    </div>
    <h1 id="sectionFundFacts">Fund Facts</h1>
    <div class="textBlock">
      {#await stats}
        <div />
      {:then stats}
        <div class="fundFactsBlocks" in:fade>
          <table style="width:100%;">
            <thead>
              <tr>
                <th style="width:30%;" />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Fund Objective</td>
                <td>Capital Appreciation and income</td>
              </tr>
              <tr>
                <td>Fund Strategy</td>
                <td>U.S Mid-Large Cap Long/Short Equity Fund</td>
              </tr>
              <tr>
                <td>Fund Asset</td>
                <td>{formatter.format(stats[0].value)}</td>
              </tr>
              <tr>
                <td>NAV</td>
                <td>{formatter.format(stats[0].value / stats[0].shares)}</td>
              </tr>
              <tr>
                <td>Ticker</td>
                <td>GBH</td>
              </tr>
              <tr>
                <td>Number of Holdings</td>
                {#await positions}
                  <td />
                {:then positions}
                  <td in:fade>{positions.positions.length}</td>
                {/await}
              </tr>
              <tr>
                <td>Distribution Frequency</td>
                <td>Quarterly</td>
              </tr>
              <tr>
                <td>Gross Expense Ratio</td>
                <td>0.50%</td>
              </tr>
              <tr>
                <td>Fund Inception</td>
                <td>02/13/2020</td>
              </tr>
            </tbody>
          </table>
          <table style="width:100%;">
            <thead>
              <tr>
                <th style="width:35%;" />
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Primary Benchmark</td>
                <td>S&P500</td>
              </tr>
              <tr>
                <td>Minimum Investment</td>
                <td>$500</td>
              </tr>
              <tr>
                <td>Minimum Subsequent Investment</td>
                <td>$50</td>
              </tr>
              <tr>
                <td>Management Fees</td>
                <td>1.5%</td>
              </tr>
              <tr>
                <td>Transaction Fees</td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Performance Fees</td>
                <td>10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      {/await}
    </div>
    <h1 id="sectionTeam">Team</h1>
    <div class="textBlock">
      <div class="teamBlocks">
        <div class="teamBlocksInner">
          <img alt="" src="images/fernando.jpg" />
          <h2>Fernando Guardia Virreira</h2>
          <span>Chief Executive Officer</span>
          <span>Portfolio Manager</span>
        </div>
        <div class="teamBlocksInner">
          <img alt="" src="images/chris.jpg" />
          <h2>Chris Aitken</h2>
          <span>Chief Technology Officer</span>
        </div>
        <div class="teamBlocksInner">
          <img alt="" src="images/matias.jpg" />
          <h2>Matias Martinez</h2>
          <span>Director of Marketing & Sales</span>
        </div>
        <div class="teamBlocksInner">
          <img alt="" src="images/juan.jpg" />
          <h2>Juan Carlos Paniagua</h2>
          <span>Executive Vice President</span>
        </div>
      </div>
    </div>
  </div>
</div>
