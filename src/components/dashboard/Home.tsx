"use client";
import React, { useEffect, useState } from "react";
import TemplateSelectButton from "@/styles/TemplateSelectButton";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Home = () => {
  interface Field {
    id: number;
    heading: string;
    type: string;
    mandatory: boolean;
    value: string;
    options?: string[];
    checkedOptions?: boolean[];
  }
  
  const [form1Fields, setForm1Fields] = useState<Field[]>([]);
  const [form2Fields, setForm2Fields] = useState<Field[]>([]);
  const [form3Fields, setForm3Fields] = useState<Field[]>([]);
  const [form4Fields, setForm4Fields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          fetch(`/api/forms?formId=form1`),
          fetch(`/api/forms?formId=form2`),
          fetch(`/api/forms?formId=form3`),
          fetch(`/api/forms?formId=form4`),
        ]);

        const data1 = res1.ok ? await res1.json() : { fields: [] };
        const data2 = res2.ok ? await res2.json() : { fields: [] };
        const data3 = res3.ok ? await res3.json() : { fields: [] };
        const data4 = res4.ok ? await res4.json() : { fields: [] };

        setForm1Fields(data1.fields || []);
        setForm2Fields(data2.fields || []);
        setForm3Fields(data3.fields || []);
        setForm4Fields(data4.fields || []);

        // After fetching, decide where to go
        const recentForm = localStorage.getItem("recentForms");
        const hasForm1 = data1.fields && data1.fields.length > 0;
        const hasForm2 = data2.fields && data2.fields.length > 0;
        const hasForm3 = data3.fields && data3.fields.length > 0;
        const hasForm4 = data4.fields && data4.fields.length > 0;

        // Redirect logic
        if (hasForm1 || hasForm2 || hasForm3 || hasForm4) {
          if (recentForm === "form1" && hasForm1) {
            router.push("/home/form1");
            return;
          } else if (recentForm === "form2" && hasForm2) {
            router.push("/home/form2");
            return;
          } else if (recentForm === "form3" && hasForm3) {
            router.push("/home/form3");
            return;
          } else if (recentForm === "form4" && hasForm4) {
            router.push("/home/form4");
            return;
          } else if (hasForm1) {
            router.push("/home/form1");
            return;
          } else if (hasForm2) {
            router.push("/home/form2");
            return;
          } else if (hasForm3) {
            router.push("/home/form3");
            return;
          } else if (hasForm4) {
            router.push("/home/form4");
            return;
          }
        }
      } catch (err) {
        console.log("Error fetching forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [router]);

  const showTemplateButton =
    !loading &&
    form1Fields.length === 0 &&
    form2Fields.length === 0 &&
    form3Fields.length === 0 &&
    form4Fields.length === 0;

  return (
    <div className=" w-screen h-screen flex justify-center items-center ">
      {showTemplateButton && (
        <Link
          href="/template"
          className="container flex flex-col justify-center items-center"
        >
          <TemplateSelectButton />
        </Link>
      )}
    </div>
  );
};

export default Home;
