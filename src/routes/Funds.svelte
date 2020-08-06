<script>
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
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
      "$" +
        ((parseFloat(obj.value) / parseFloat(obj.shares)) * 1000).toFixed(2),
      obj.shares,
      "$" + obj.value
    ]);
    array.unshift([
      "Date",
      "NAV",
      "10k Investment",
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
        let array = stats.map((obj, index) => [
          new Date(obj.id),
          +(parseFloat(obj.value) / parseFloat(obj.shares)).toFixed(2)
          //parseFloat(obj.value)
        ]);
        //console.log(array);
        var chart = new window.google.visualization.LineChart(
          document.getElementById("performanceChart")
        );
        let data = new google.visualization.DataTable();
        data.addColumn("date", "Month");
        data.addColumn("number", "Price");
        //data.addColumn("number", "NAV");
        data.addRows(array);
        chart.draw(data, {
          legend: { position: "none" },
          backgroundColor: { fill: "transparent" },
          chartArea: { left: 100, top: 20, width: "90%", height: "90%" },
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
    }, 1000); //find way to detect google charts loaded instead of timeout
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
        Overview
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionHowItWorks')}>
        How it works
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
        on:click={() => goToSection('sectionTopHoldings')}>
        Holdings
      </a>
      <a
        href="javascript:void(0)"
        on:click={() => goToSection('sectionDiversification')}>
        Diversification
      </a>
      <a href="javascript:void(0)" on:click={() => goToSection('sectionTeam')}>
        Team
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
    </div>
    <h1 id="sectionHowItWorks">How it works</h1>
    <div class="textBlock">
      <p>
        We Buy: Guardian Brothers Holdings find opportunities in the stock
        market. Creates a solid portfolio for all our investors
      </p>
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
      <div id="performanceChart" style="width: 100%; height: 500px" in:fade />
    </div>
    <h1 id="sectionTopHoldings">Top Holdings</h1>
    <div class="textBlock">
      {#await positions}
        <div />
      {:then positions}
        <table style="width:100%;line-height:35px;">
          <thead>
            <tr style="text-align: left;">
              <th>Ticker</th>
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
    <h1 id="sectionDiversifcation">Diversification</h1>
    <div class="textBlock">
      <p>Work in progress.</p>
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
    <h1 id="sectionTeam">Team</h1>
    <div class="textBlock">
      <div
        style="display:flex;flex-direction:row;justify-content:space-around;align-items:flex-start;margin-bottom:50px;margin-top:50px;">
        <div
          style="display:flex;flex-direction:column;justify-content:space-around;align-items:center">
          <div style="height:100px;width:100px;background-color:#AAAAAA" />
          <span style="font-size:20px;font-weight:600">
            Fernando Guardia Virreira
          </span>
          <span>Chief Executive Officer</span>
          <span>Portfolio Manager</span>
        </div>
        <div
          style="display:flex;flex-direction:column;justify-content:space-around;align-items:center">
          <div style="height:100px;width:100px;background-color:#AAAAAA" />
          <span style="font-size:20px;font-weight:600">Chris Aitken</span>
          <span>Chief Technology Officer</span>
        </div>
        <div
          style="display:flex;flex-direction:column;justify-content:space-around;align-items:center">
          <div style="height:100px;width:100px;background-color:#AAAAAA" />
          <span style="font-size:20px;font-weight:600">Matias Martinez</span>
          <span>Director of Marketing & Sales</span>
        </div>
        <div
          style="display:flex;flex-direction:column;justify-content:space-around;align-items:center">
          <div style="height:100px;width:100px;background-color:#AAAAAA" />
          <span style="font-size:20px;font-weight:600">
            Juan Carlos Paniagua
          </span>
          <span>Executive Vice President</span>
        </div>
      </div>
    </div>
  </div>
</div>
