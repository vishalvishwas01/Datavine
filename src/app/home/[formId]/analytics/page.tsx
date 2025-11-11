"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { PieChart } from "@mui/x-charts/PieChart";
import { BarChart } from "@mui/x-charts/BarChart";
import LoadingBar from "@/styles/LoadingBar";

type NormalizedItem = { question: string; answer: any };
interface ResponseDataRaw {
  responses?: any;
}

export default function AnalyticsPage() {
  const BAR_COLORS = [
    "#4e79a7",
    "#f28e2b",
    "#e15759",
    "#76b7b2",
    "#59a14f",
    "#edc948",
    "#b07aa1",
    "#ff9da7",
  ];

  const { formId } = useParams();
  const [responses, setResponses] = useState<ResponseDataRaw[]>([]);
  const [dataNumericLenght, setDataNumericLenght] = useState(false);
  const [dataMixedLenght, setDataMixedLenght] = useState(false);
  const [numericCharts, setNumericCharts] = useState<
    { question: string; data: { label: string; value: number }[] }[]
  >([]);
  const [mixedCharts, setMixedCharts] = useState<
    { question: string; data: { label: string; value: number }[] }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const normalize = (raw: any): NormalizedItem[] => {
    if (Array.isArray(raw)) {
      const looksLikePairs = raw.every(
        (it) => it && typeof it.question === "string" && "answer" in it
      );
      if (looksLikePairs) return raw;
      return raw.map((val: any, idx: number) => ({
        question: `Answer ${idx + 1}`,
        answer: val,
      }));
    }
    if (raw && typeof raw === "object") {
      return Object.entries(raw).map(([k, v]) => ({
        question: String(k),
        answer: v,
      }));
    }
    return [{ question: "Answer", answer: raw }];
  };

  useEffect(() => {
    const fetchResponses = async () => {
      setLoading(true);
      const r = await fetch(`/api/forms/${formId}/responses`);
      const j = await r.json();
      const docs = Array.isArray(j.responses) ? j.responses : [];
      setResponses(docs);
      setLoading(false);
    };
    fetchResponses();
  }, [formId]);

  useEffect(() => {
    const grouped: Record<string, any[]> = {};

    responses.forEach((doc) => {
      const items = normalize(doc.responses);
      items.forEach((item) => {
        if (!grouped[item.question]) grouped[item.question] = [];
        grouped[item.question].push(item.answer);
      });
    });

    const numeric: typeof numericCharts = [];
    const mixed: typeof mixedCharts = [];

    Object.entries(grouped).forEach(([question, answers]) => {
      const numericValues = answers.map((a) => Number(a));
      const allNumeric = numericValues.every((v) => !Number.isNaN(v));

      const counts: Record<string, number> = {};
      answers.forEach((ans) => {
        const key = String(ans);
        counts[key] = (counts[key] || 0) + 1;
      });

      const chartData = Object.entries(counts).map(([label, value]) => ({
        label,
        value,
      }));

      if (allNumeric) {
        numeric.push({ question, data: chartData });
      } else {
        mixed.push({ question, data: chartData });
      }
    });

    setNumericCharts(numeric);
    setMixedCharts(mixed);

    setDataNumericLenght(numeric.some((chart) => chart.data.length > 10));
    setDataMixedLenght(mixed.some((chart) => chart.data.length > 20));
  }, [responses]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        <div className=" w-[90%]">
          <LoadingBar />
        </div>
      </div>
    );
  }

  if (responses.length === 0) {
    return (
     <div className="min-h-screen bg-gray-50 p-6 pt-45 flex justify-center items-center text-2xl font-bold">
        No responses yet for this form.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-45 gap-4 space-y-12 flex flex-wrap justify-start items-start">
      {dataNumericLenght ? (
        <>
          {numericCharts.map((chart, index) => {
            const barWidth = 80;
            const chartWidth = Math.max(
              chart.data.length * barWidth,
              window.innerWidth * 0.9
            );

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center border-2 border-gray-400 rounded-2xl shadow-2xl w-[90vw] overflow-x-auto"
              >
                <h2 className="text-lg font-semibold mb-4">{chart.question}</h2>
                <div className="w-full overflow-x-auto">
                  <div style={{ width: chartWidth }}>
                    <BarChart
                      xAxis={[
                        {
                          data: chart.data.map((d) => d.label),
                          scaleType: "band",
                        },
                      ]}
                      series={[{ data: chart.data.map((d) => d.value) }]}
                      width={chartWidth}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {numericCharts.map((chart, index) => (
            <div
              key={index}
              className="flex flex-col justify-start items-center border-2 border-gray-400 rounded-2xl shadow-2xl pb-2"
            >
              <h2 className="text-lg font-semibold mb-2">{chart.question}</h2>
              <PieChart
                series={[
                  {
                    innerRadius: 50,
                    outerRadius: 100,
                    data: chart.data,
                    arcLabel: "value",
                  },
                ]}
                width={250}
                height={300}
              />
            </div>
          ))}
        </>
      )}

      {dataMixedLenght ? (
        <>
          {mixedCharts.map((chart, index) => {
            const barWidth = 80;
            const chartWidth = Math.max(
              chart.data.length * barWidth,
              window.innerWidth * 0.9
            );

            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center border-2 border-gray-400 rounded-2xl shadow-2xl w-[90vw] overflow-x-auto"
              >
                <h2 className="text-lg font-semibold mb-4">{chart.question}</h2>
                <div className="w-full overflow-x-auto">
                  <div style={{ width: chartWidth }}>
                    <BarChart
                      xAxis={[
                        {
                          data: chart.data.map((d) => d.label),
                          scaleType: "band",
                        },
                      ]}
                      series={[{ data: chart.data.map((d) => d.value) }]}
                      width={chartWidth}
                      height={300}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <>
          {mixedCharts.map((chart, index) => (
            <div
              key={index}
              className="flex flex-col items-center border-2 border-gray-400 rounded-2xl shadow-2xl"
            >
              <h2 className="text-lg font-semibold mb-4">{chart.question}</h2>
              <BarChart
                xAxis={[
                  { data: chart.data.map((d) => d.label), scaleType: "band" },
                ]}
                series={[{ data: chart.data.map((d) => d.value) }]}
                width={330}
                height={300}
                colors={BAR_COLORS}
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
}
