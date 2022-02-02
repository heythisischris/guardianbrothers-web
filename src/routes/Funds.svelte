<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { _ } from "svelte-i18n";
  var isMobile = window.matchMedia(
    "only screen and (max-width: 760px)"
  ).matches;

  function goToSection(section) {
    document.getElementById(section).scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
  async function loadAPI(url) {
    let data = await fetch(url);
    let response = await data.json();
    return response;
  }
  var stats = loadAPI("https://lambda.guardianbrothers.com/stats");
  stats.then((innerStats) => {
    stats = innerStats;
  });

  let formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  let positionsSelected = true;
  var displayedPositions = [];
  var positions = loadAPI("https://lambda.guardianbrothers.com/positions");
  positions.then((innerPositions) => {
    positions = innerPositions;
    displayedPositions = positions.positions.slice(0, 10);
  });

  var displayedTrades = [];
  var trades = loadAPI("https://lambda.guardianbrothers.com/trades");
  trades.then((innerTrades) => {
    trades = innerTrades;
    displayedTrades = trades.slice(0, 10);
  });

  let teamIndex = 0;

  async function exportCsv(csvType) {
    let array = [];
    if (csvType === "performance") {
      array = stats.map((obj, index) => [
        obj.id.substring(0, 10),
        "$" + (obj.value / obj.shares).toFixed(2),
        obj.shares,
        "$" + obj.value,
        index < stats.length - 1
          ? `${(
              (obj.value /
                obj.shares /
                (stats[index + 1].value / stats[index + 1].shares) -
                1) *
              100
            ).toFixed(2)}%`
          : "0.00%",
      ]);
      array.unshift([
        "Date",
        "NAV",
        "Shares Outstanding",
        "Fund Assets",
        "Daily % Return",
      ]);
    } else if (csvType === "positions") {
      array = positions.positions.map((obj, index) => [
        obj.instrument.symbol,
        obj.name,
        obj.longQuantity,
        obj.marketValue,
        `${((obj.marketValue / positions.liquidationValue) * 100).toFixed(2)}%`,
        `${(
          ((obj.marketValue / obj.longQuantity - obj.averagePrice) /
            obj.averagePrice) *
          100
        ).toFixed(2)}%`,
        obj.sector,
        obj.industry,
        obj.marketCap,
        obj.peRatio,
        obj.dividendYield,
        obj.priceBookRatio,
        obj.beta,
      ]);
      array.unshift([
        "Ticker",
        "Name",
        "Number of Shares",
        "Market Value",
        "Weight",
        "Total Gain",
        "Sector",
        "Industry",
        "Market Cap",
        "P/E Ratio",
        "Dividend Yield",
        "Price/Book Ratio",
        "Beta",
      ]);
    } else if (csvType === "trades") {
      array = trades.map((obj, index) => [
        obj.ticker,
        obj.company,
        obj.date,
        obj.order,
        obj.shares,
      ]);
      array.unshift(["Ticker", "Company", "Date", "Order", "Shares"]);
    }

    let csvContent =
      "data:text/csv;charset=utf-8," + array.map((e) => e.join(",")).join("\n");
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `guardian_brothers_${csvType}_export.csv`);
    document.body.appendChild(link);
    link.click();
  }
  let asOfDate = "";
  onMount(() => {
    window.scrollTo(0, 0);
    document.querySelectorAll("#body")[0].style.backgroundImage =
      "url('images/background_funds.jpg')";
    setTimeout(() => {
      asOfDate = `as of ${new Date(stats[0].id).toLocaleDateString()}`;
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        let performanceArray = stats.map((obj, index) => [
          new Date(new Date(obj.id).getTime() + 3600 * 1000 * 24),
          +(parseFloat(obj.value) / parseFloat(obj.shares)).toFixed(2),
          //parseFloat(obj.value)
        ]);
        //console.log(array);
        var performanceChart = new google.visualization.AreaChart(
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
            height: "90%",
          },
          vAxis: {
            format: "currency",
            viewWindow: {
              min: 4,
              max: 14,
            },
          },
          hAxis: {
            gridlines: { units: { months: { format: ["MMM YYYY"] } } },
            minorGridlines: { units: { days: { format: [] } } },
          },
        });

        let diversificationArray = [];
        for (let obj of positions.positions) {
          let findIndex = diversificationArray.findIndex(
            (innerObj) => innerObj[0] === obj.sector
          );
          if (findIndex === -1) {
            diversificationArray.push([obj.sector, obj.marketValue]);
          } else {
            diversificationArray[findIndex][1] += obj.marketValue;
          }
        }

        diversificationArray.push(["Cash", positions.cashBalance]);

        var diversificationChart = new google.visualization.PieChart(
          document.getElementById("diversificationChart")
        );
        google.visualization.events.addListener(
          diversificationChart,
          "ready",
          function () {
            document.getElementById("diversificationChart").style.display =
              null;
          }
        );
        let diversificationData = new google.visualization.DataTable();
        diversificationData.addColumn("string", "sector");
        diversificationData.addColumn("number", "marketValue");
        diversificationData.addRows(diversificationArray);
        diversificationChart.draw(diversificationData, {
          legend: { position: "right" },
          colors: ["#2a314a", "#415777", "#617da1", "#8aaacd", "#b5d8f5"],
          backgroundColor: { fill: "transparent" },
          chartArea: {
            top: 10,
            width: "100%",
            height: isMobile ? "80%" : "100%",
          },
          // chartArea: {left: '10%', width: '100%', height: '65%'},
          forceIFrame: true,
          pieHole: isMobile ? 0.4 : 0,
        });

        let marketCapArray = [
          ["Micro Cap", 0],
          ["Small Cap", 0],
          ["Mid Cap", 0],
          ["Large Cap", 0],
          ["Mega Cap", 0],
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
          legend: { position: "right", textStyle: { fontSize: 14 } },
          colors: ["#8aaacd", "#b5d8f5", "#2a314a", "#415777", "#617da1"],
          backgroundColor: { fill: "transparent" },
          chartArea: {
            width: "100%",
            height: "100%",
          },
          forceIFrame: true,
          pieHole: isMobile ? 0.4 : 0,
        });
      }
    }, 1500); //find way to detect google charts loaded instead of timeout
  });
</script>

<div class="pageContainerTop">
  <div
    class="pageContainerInner"
    style="color:#ffffff;font-size:22px;height:284px;"
  >
    {#await stats}
      <div />
    {:then stats}
      <div id="statsTitle">{$_("funds.main.title")}</div>
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
              {formatter.format(
                stats[0].value / stats[0].shares -
                  stats[1].value / stats[1].shares
              )}
              ({(
                ((stats[0].value / stats[0].shares -
                  stats[1].value / stats[1].shares) /
                  (stats[1].value / stats[1].shares)) *
                100
              ).toFixed(2) + "%"})
            </div>
          </div>
        </div>
      </div>
      <div class="investDiv">
        <a
          class="investButton"
          target="_blank"
          href="https://calendly.com/guardianbrothers/15min"
          in:fade={{ delay: 250 }}
        >
          INVEST NOW
        </a>
      </div>
    {/await}
  </div>
</div>
<div class="pageContainerMiddle">
  <div
    class="pageContainerInner"
    style="color:#000000;font-size:22px;min-height:auto;"
  >
    <div style="display:flex;flex-direction:row;justify-content:space-between;">
      <a href={"#"} on:click={() => goToSection("sectionOverview")}>
        OVERVIEW
      </a>
      <a href={"#"} on:click={() => goToSection("sectionHowItWorks")}>
        HOW IT WORKS
      </a>
      <a href={"#"} on:click={() => goToSection("sectionPerformance")}>
        PERFORMANCE
      </a>
      <a href={"#"} on:click={() => goToSection("sectionFundFacts")}>
        FUND FACTS
      </a>
      <a href={"#"} on:click={() => goToSection("sectionTopHoldings")}>
        HOLDINGS
      </a>
      <a href={"#"} on:click={() => goToSection("sectionDiversification")}>
        DIVERSIFICATION
      </a>
      <a href={"#"} on:click={() => goToSection("sectionTeam")}> TEAM </a>
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
        • Our team focus in value investing. We only invest in companies that have
        being rigorously monitored and have passed all our filters.
        <br />
        • The fund seeks to be independent of the market’s conditions generating
        income in any circumstances. Our main goal is to always be on top of the
        markets.
        <br />
        <br />
      </p>
    </div>
    <h1 id="sectionHowItWorks" style={isMobile ? "margin-bottom:30px;" : ""}>
      How it works
    </h1>
    <div class="textBlock">
      <div class="howItWorksBlocks">
        <div in:fade={{ delay: 500, duration: 500 }}>
          <p class="howItWorksBlocksNumber">1</p>
          <p class="howItWorksBlocksTitle">We buy</p>
          <p>
            Guardian Brothers Holdings find opportunities in the stock market.
            Creates a solid portfolio for all of our investors
          </p>
        </div>
        <div in:fade={{ delay: 1000, duration: 500 }}>
          <p class="howItWorksBlocksNumber">2</p>
          <p class="howItWorksBlocksTitle">You Invest</p>
          <p>
            You become a partner and receive benefits of the returns generated
            by Guardian Brothers Fund
          </p>
        </div>
        <div in:fade={{ delay: 1500, duration: 500 }}>
          <p class="howItWorksBlocksNumber">3</p>
          <p class="howItWorksBlocksTitle">Capital Appreciation</p>
          <p>
            Our portfolio appreciates and receives dividends. You get the
            benefit of compounded interest and capital appreciation
          </p>
        </div>
        <div in:fade={{ delay: 2000, duration: 500 }}>
          <p class="howItWorksBlocksNumber">4</p>
          <p class="howItWorksBlocksTitle">You get paid</p>
          <p>
            Your investment appreciates and we help capture your profits. No
            limits on withdrawals, no hidden fees. Easy access.
          </p>
        </div>
      </div>
    </div>
    <h1
      id="sectionPerformance"
      style="display:flex;align-items:flex-end;justify-content:space-between"
    >
      <div>Performance <span class="asOfDate">{asOfDate}</span></div>
      <a
        style="float:right;font-size:14px;"
        href={"#"}
        on:click={() => {
          exportCsv("performance");
        }}
      >
        Download CSV
      </a>
    </h1>

    <div class="textBlock">
      <p style="display:flex;flex-direction:row;justify-content:flex-end;" />
      <div
        id="performanceChart"
        style="width: 100%; height: {isMobile ? '300px' : '500px'}"
        in:fade={{ delay: 2000 }}
      />
    </div>

    <h1
      id="sectionTopHoldings"
      style="display:flex;align-items:flex-end;justify-content:space-between"
    >
      <div style="display:flex;">
        <div
          on:click={() => {
            positionsSelected = true;
          }}
          style="cursor:pointer;background-color:{positionsSelected
            ? '#aaaaaa'
            : '#00000011'};padding:0px 10px;border-top-right-radius:10px;border-top-left-radius:10px;margin-bottom:-5px;margin-right:5px;"
        >
          {isMobile ? "" : "Top "}Holdings
        </div>
        <div
          on:click={() => {
            positionsSelected = false;
          }}
          style="cursor:pointer;background-color:{positionsSelected
            ? '#00000011'
            : '#aaaaaa'};padding:0px 10px;border-top-right-radius:10px;border-top-left-radius:10px;margin-bottom:-5px;margin-right:5px;"
        >
          Trades
        </div>
        <span
          style="display:{isMobile ? 'none' : 'relative'};align-self:flex-end"
          class="asOfDate">{asOfDate}</span
        >
      </div>
      <a
        style="float:right;font-size:14px;"
        href={"#"}
        on:click={() => {
          exportCsv(positionsSelected ? "positions" : "trades");
        }}
      >
        Download CSV
      </a>
    </h1>
    <div class="textBlock">
      {#if positionsSelected}
        {#await positions}
          <div />
        {:then positions}
          <table style="width:100%;{isMobile ? 'font-size:11px;' : ''}" in:fade>
            <thead>
              <tr style="text-align: {isMobile ? 'center' : 'left'};">
                <th>Ticker</th>
                <th style="display: {isMobile ? 'none' : 'unset'}">Name</th>
                <th># of Shares</th>
                <th>Market Value</th>
                <th>Weight</th>
                <th>Total Gain</th>
              </tr>
            </thead>
            <tbody>
              {#each displayedPositions as item}
                <tr>
                  <td>{item.instrument.symbol}</td>
                  <td style="display: {isMobile ? 'none' : 'unset'}"
                    >{item.name}</td
                  >
                  <td>{item.longQuantity}</td>
                  <td>{formatter.format(item.marketValue)}</td>
                  <td>
                    {(
                      (item.marketValue / positions.liquidationValue) *
                      100
                    ).toFixed(2)}%
                  </td>
                  <td>
                    {(
                      ((item.marketValue / item.longQuantity -
                        item.averagePrice) /
                        item.averagePrice) *
                      100
                    ).toFixed(2)}%
                  </td>
                </tr>
              {/each}
              <tr />
              {#if displayedPositions.length !== 10}
                <tr style="height:60px;">
                  <td>Cash</td>
                  <td>{formatter.format(positions.cashBalance)}</td>
                  <td>
                    {(
                      (positions.cashBalance / positions.liquidationValue) *
                      100
                    ).toFixed(2) + "%"}
                  </td>
                </tr>
              {/if}
            </tbody>
          </table>
          <div style="display:flex;width:100%;justify-content:center;">
            <a
              href={"#"}
              on:click={() => {
                if (displayedPositions.length === 10) {
                  displayedPositions = positions.positions;
                } else {
                  displayedPositions = positions.positions.slice(0, 10);
                }
              }}
            >
              {displayedPositions.length === 10 ? "Expand" : "Collapse"}
            </a>
          </div>
        {/await}
      {:else}
        <table style="width:100%;" in:fade>
          <thead>
            <tr style="text-align: {isMobile ? 'center' : 'left'};">
              <th>Ticker</th>
              <th style="display: {isMobile ? 'none' : 'unset'}">Company</th>
              <th>Date</th>
              <th>Order</th>
              <th>Shares</th>
            </tr>
          </thead>
          <tbody>
            {#each displayedTrades as item}
              <tr>
                <td>{item.ticker}</td>
                <td style="display: {isMobile ? 'none' : 'unset'}"
                  >{item.company}</td
                >
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.order}</td>
                <td>{item.shares}</td>
              </tr>
            {/each}
            <tr />
          </tbody>
        </table>
        <div style="display:flex;width:100%;justify-content:center;">
          <a
            href={"#"}
            on:click={() => {
              if (displayedTrades.length === 10) {
                displayedTrades = trades;
              } else {
                displayedTrades = trades.slice(0, 10);
              }
            }}
          >
            {displayedTrades.length === 10 ? "Expand" : "Collapse"}
          </a>
        </div>
      {/if}
    </div>
    <h1 id="sectionDiversification">
      <div>Diversification <span class="asOfDate">{asOfDate}</span></div>
    </h1>
    <div class="textBlock diversificationCharts">
      <div style="width: 50%; height: 350px;">
        <h2>Sectors</h2>
        <div id="diversificationChart" style="height:300px" />
      </div>
      <div style="width: 50%; height: 350px;">
        <h2>Market Cap</h2>
        <div id="marketCapChart" style="height:300px" />
      </div>
    </div>
    <h1 id="sectionFundFacts">Fund Facts</h1>
    <div class="textBlock">
      {#await stats}
        <div />
      {:then stats}
        <div class="fundFactsBlocks" in:fade>
          <table style="width:48%;">
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
                <td>1%</td>
              </tr>
              <tr>
                <td>Fund Inception</td>
                <td>02/13/2020</td>
              </tr>
            </tbody>
          </table>
          <table style="width:48%;">
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
                <td>$1,000</td>
              </tr>
              <tr>
                <td>Minimum Subsequent Investment</td>
                <td>$100</td>
              </tr>
              <tr>
                <td>Management Fees</td>
                <td>2%</td>
              </tr>
              <tr>
                <td>Transaction Fees</td>
                <td>3%</td>
              </tr>
              <tr>
                <td>Performance Fees</td>
                <td>15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      {/await}
    </div>
  </div>
</div>

<style>
</style>
