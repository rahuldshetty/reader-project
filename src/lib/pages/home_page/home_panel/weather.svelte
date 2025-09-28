<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import * as d3 from 'd3';
  import { get_color_var } from "$lib/utils/html";
  import { local_user_setting } from "$lib/stores/app_store";

  // --- inputs / stores (adapted from your code)
  const date = new Date().toISOString().split("T")[0];

  // If you already have derived helpers, keep them — here we assume
  // local_user_setting has LATITUDE and LONGITUDE (adjust if different).
  let latitude: number;
  let longitude: number;

  // bind container for responsive sizing
  let containerEl: HTMLDivElement;
  let svgEl: SVGSVGElement;

  // chart internal
  let times: string[] = [];
  let temps: number[] = [];

  // ResizeObserver
  let ro: ResizeObserver;

  // Get lat/lon from store (subscribe)
  const unsub = local_user_setting.subscribe((v: any) => {
    // adjust keys according to your store shape
    latitude = v?.LATITUDE ?? 52.52; // fallback Berlin
    longitude = v?.LONGITUDE ?? 13.405;
  });

  // Build API URL
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&start_date=${date}&end_date=${date}`;

  // Chart parameters
  const margin = { top: 12, right: 12, bottom: 28, left: 36 };

  // Utility: format hour like "10 am"
  function formatHourLabel(isoOrString: string) {
    const dt = new Date(isoOrString);
    const parts = dt.toLocaleTimeString([], { hour: "2-digit" }).split(" "); // ["10", "AM"]
    const [hour, ampm] = parts;
    return `${hour} ${ampm.toLowerCase()}`; // "10 am"
  }

  async function fetchAndRender() {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&start_date=${date}&end_date=${date}`
      );
      const data = await res.json();

      // Process data just like your Chart.js code
      const rawTimes: string[] = data.hourly.time;
      times = rawTimes.map((t) => formatHourLabel(t));
      temps = data.hourly.temperature_2m.map((n: number) => Number(n));

      renderChart();
    } catch (err) {
      console.error("Could not fetch temperature data:", err);
    }
  }

  function renderChart() {
    if (!svgEl || !containerEl || times.length === 0) return;

    // clear previous
    d3.select(svgEl).selectAll("*").remove();

    const width = containerEl.clientWidth;
    const height = Math.max(160, Math.min(300, Math.floor(width * 0.35))); // keep reasonable aspect ratio

    svgEl.setAttribute("width", String(width));
    svgEl.setAttribute("height", String(height));

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const x = d3
      .scaleBand()
      .domain(times)
      .range([0, innerWidth])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([Math.min(0, d3.min(temps) ?? 0), (d3.max(temps) ?? 0) + 2])
      .nice()
      .range([innerHeight, 0]);

    const g = d3
      .select(svgEl)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // gridlines (horizontal)
    g.append("g")
      .attr("class", "grid")
      .call(
        d3
          .axisLeft(y)
          .ticks(3)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      );

    // Y axis (left)
    g.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(y).ticks(3).tickFormat((d) => `${d}°`));

    // X axis (bottom) - show limited ticks to avoid clutter
    const xAxis = d3.axisBottom(x).tickValues(
      times.filter((_, i) => {
        // roughly evenly pick up to 4 ticks
        const n = times.length;
        if (n <= 4) return true;
        const step = Math.ceil(n / 4);
        return i % step === 0;
      })
    );

    g.append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(xAxis)
      .selectAll("text")
      .attr("dy", "1em")
      .style("font-size", "11px");

    // Bars
    const currentHour = new Date().getHours();

    g.selectAll(".bar")
      .data(temps)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (_d, i) => x(times[i]) ?? 0)
      .attr("y", (d) => y(d))
      .attr("width", () => x.bandwidth())
      .attr("height", (d) => innerHeight - y(d))
      .attr("rx", 4)
      .attr("fill", (_d, i) => {
        // compute hour from times[i] label "10 am" => 10 or 22
        const label = times[i];
        const [hourStr, ampm] = label.split(" ");
        let hour = parseInt(hourStr);
        if (ampm === "pm" && hour !== 12) hour += 12;
        if (ampm === "am" && hour === 12) hour = 0;
        return hour === currentHour ? get_color_var("--color-primary") : get_color_var("--color-neutral");
      });

    // optional: small labels on top of bars for large widths
    if (innerWidth > 350) {
      g.selectAll(".bar-label")
        .data(temps)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (_d, i) => (x(times[i]) ?? 0) + x.bandwidth() / 2)
        .attr("y", (d) => y(d) - 6)
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .text((d) => `${d}°`);
    }
  }

  function startResizeObserver() {
    if (!containerEl) return;
    ro = new ResizeObserver(() => {
      renderChart();
    });
    ro.observe(containerEl);
  }

  onMount(() => {
    // initial fetch (ensure lat/lon are available)
    // if your store loads asynchronously, call fetchAndRender after values settle.
    // small delay ensures latitude/longitude taken from subscribed store
    setTimeout(() => {
      fetchAndRender();
      startResizeObserver();
    }, 0);
  });

  onDestroy(() => {
    if (ro) ro.disconnect();
    unsub();
  });
</script>


<!-- DaisyUI Card -->
<div class="card rounded-sm w-full bg-base-100 border-base-300 border shadow-sm">
  <div class="card-body">
    <h3 class="card-title">Temperature (°C)</h3>
    <div bind:this={containerEl} class="chart-container">
      <!-- svg is the actual chart -->
      <svg bind:this={svgEl} role="img" aria-label="Hourly temperature bar chart"></svg>
    </div>
  </div>
</div>
