<script lang="ts">
    import { onMount } from "svelte";
    import Chart, { type ChartItem } from "chart.js/auto";
    import { get_color_var } from "$lib/utils/html";
    import { local_user_setting } from "$lib/stores/app_store";

    const date = new Date().toISOString().split("T")[0];

    const day = $derived.by(()=>{
      const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
      return day;
    });

    const latitude = $derived($local_user_setting.LATITUDE);
    const longitude = $derived($local_user_setting.LONGITUDE);

    let chartCanvas: ChartItem;
    let chart: Chart<"bar", any, unknown>;

    // API endpoint for hourly temperatures on 2025-09-09 in Berlin
    const apiUrl = $derived(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&start_date=${date}&end_date=${date}`,
    );

    onMount(async () => {
        const res = await fetch(apiUrl);
        const data = await res.json();

        const times = data.hourly.time.map((t: string | number | Date) =>
            new Date(t).toLocaleTimeString([], {
                hour: "2-digit",
            }),
        );
        const temps = data.hourly.temperature_2m;

        if (chart) chart.destroy();

        chart = new Chart(chartCanvas, {
            type: "bar",
            data: {
                labels: times.map((t:string)=>{
                    const [hour, ampm] = t.split(" "); // ["10", "AM"]
                    return `${hour} ${ampm.toLowerCase()}`; // "10 am"
                }),
                datasets: [
                    {
                         label: "Temperature (°C)",
                        data: temps,
                        backgroundColor: times.map((t: string) => {
                            const [hourStr, ampm] = t.split(" "); // Split "10 AM" -> [10, AM]
                            let hour = Number.parseInt(hourStr);
                            if (ampm === "PM" && hour !== 12) hour += 12;
                            if (ampm === "AM" && hour === 12) hour = 0; // midnight edge case

                            const currentHour = new Date().getHours();
                            return hour === currentHour
                                ? get_color_var("--color-primary") // highlight current hour (red)
                                : get_color_var("--color-neutral"); // default blue
                            }
                        ),
                        borderColor: "rgba(59, 130, 246, 1)",
                        borderWidth: 0,
                        
                        barPercentage: 0.8, // add spacing between bars
                        categoryPercentage: 0.6,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                },
                scales: {
                    x: {
                        grid: { drawTicks: false, display: false },
                        ticks: {
                            align: 'start',
                            autoSkip: true,
                            maxTicksLimit: 4,
                        },
                    },
                    y: {
                        ticks: { 
                            display: true, maxTicksLimit: 3,
                        }, 
                        grid: { drawTicks: true, display: true },
                    },
                },
            },
        });
    });
</script>

<!-- DaisyUI Card -->
<div class="card bg-base-100 border-base-300 border shadow-sm">
    <div class="card-body">
        <h3 class="card-title">Temperature (°C)</h3>
        <!-- <p class="text-sm text-base-content/70">
            {day}
        </p> -->
        <div class="w-full">
            <canvas bind:this={chartCanvas}></canvas>
        </div>
    </div>
</div>
