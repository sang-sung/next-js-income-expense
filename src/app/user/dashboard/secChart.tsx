"use client";
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SecChart({ data }: { data: any }) {
  const [axisColor, setAxisColor] = useState("#000");

  useEffect(() => {
    const updateColor = () => {
      const rootStyles = getComputedStyle(document.documentElement);
      const color = rootStyles.getPropertyValue("--foreground").trim();
      setAxisColor(color || "#000");
    };

    updateColor(); // รันตอนแรก

    // ติดตามการเปลี่ยน class (เช่น dark/light) ที่ <html> หรือ <body>
    const observer = new MutationObserver(updateColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect(); // cleanup
  }, []);

  //   const labels = ["January", "February", "March", "April", "May", "June"];
  //   const data = {
  //     labels: labels,
  //     datasets: [
  //       {
  //         label: "My First dataset",
  //         backgroundColor: "rgb(255, 99, 132)",
  //         borderColor: "rgb(255, 99, 132)",
  //         data: [0, 10, 5, 2, 20, 30, 45],
  //       },
  //       {
  //         label: "My Second dataset",
  //         backgroundColor: "rgb(250, 00, 132)",
  //         borderColor: "rgb(250, 00, 132)",
  //         data: [1, 25, 7, 36, 10, 15, 5],
  //       },
  //     ],
  //   };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          color: axisColor, // สีตัวหนังสือใน legend
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: axisColor, // สีตัวอักษรบนแกน x
        },
        grid: {
          color: `${axisColor}33`,
        },
      },
      y: {
        ticks: {
          color: axisColor, // สีตัวอักษรบนแกน y
        },
        grid: {
          color: `${axisColor}33`,
        },
      },
    },
  };

  return (
    <div className="flex w-full border-2 justify-center py-2 rounded-2xl">
      <div className="w-[80%] ">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
