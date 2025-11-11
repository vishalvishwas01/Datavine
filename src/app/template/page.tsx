"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BiPlus } from "react-icons/bi";

const Page = () => {
  interface Field {
    id: number;
    heading: string;
    headLine: string;
    description: string;
    type: string;
    mandatory: boolean;
    value: string;
    options?: string[];
    checkedOptions?: boolean[];
  }
  
  const [loading, setLoading]=useState(false);
  // toggles
  const [form1Toggle, setForm1Toggle] = useState(false);
  const [form2Toggle, setForm2Toggle] = useState(false);
  const [form3Toggle, setForm3Toggle] = useState(false);
  const [form4Toggle, setForm4Toggle] = useState(false);

  // separate states for each form
  const [form1Fields, setForm1Fields] = useState<Field[]>([]);
  const [form2Fields, setForm2Fields] = useState<Field[]>([]);
  const [form3Fields, setForm3Fields] = useState<Field[]>([]);
  const [form4Fields, setForm4Fields] = useState<Field[]>([]);

  const [form1Headline, setForm1Headline] = useState("");
  const [form2Headline, setForm2Headline] = useState("");
  const [form3Headline, setForm3Headline] = useState("");
  const [form4Headline, setForm4Headline] = useState("");

  const [form1Description, setForm1Description] = useState("");
  const [form2Description, setForm2Description] = useState("");
  const [form3Description, setForm3Description] = useState("");
  const [form4Description, setForm4Description] = useState("");

  const fetchFormData = async () => {
    setLoading(true)
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        fetch(`/api/forms?formId=form1`),
        fetch(`/api/forms?formId=form2`),
        fetch(`/api/forms?formId=form3`),
        fetch(`/api/forms?formId=form4`),
      ]);

      const [data1, data2, data3, data4] = await Promise.all([
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
      ]);

      if (data1?.formData?.length > 0) {
        const form = data1.formData[0];
        setForm1Headline(form.headLine || "");
        setForm1Description(form.description || "");
      }
      if (data2?.formData?.length > 0) {
        const form = data2.formData[0];
        setForm2Headline(form.headLine || "");
        setForm2Description(form.description || "");
      }
      if (data3?.formData?.length > 0) {
        const form = data3.formData[0];
        setForm3Headline(form.headLine || "");
        setForm3Description(form.description || "");
      }
      if (data4?.formData?.length > 0) {
        const form = data4.formData[0];
        setForm4Headline(form.headLine || "");
        setForm4Description(form.description || "");
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching formData:", error);
    }
  };

  const fetchForm = async () => {
    setLoading(true)
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        fetch("/api/forms?formId=form1"),
        fetch("/api/forms?formId=form2"),
        fetch("/api/forms?formId=form3"),
        fetch("/api/forms?formId=form4"),
      ]);

      const [data1, data2, data3, data4] = await Promise.all([
        res1.json(),
        res2.json(),
        res3.json(),
        res4.json(),
      ]);

      setForm1Fields(data1.fields || []);
      setForm2Fields(data2.fields || []);
      setForm3Fields(data3.fields || []);
      setForm4Fields(data4.fields || []);
      setLoading(false)
    } catch (err) {
      console.log("No existing form found — starting fresh." + err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchFormData();
      await fetchForm();
    };
    loadData();
  }, []);

  useEffect(() => {
    setForm1Toggle(form1Fields.length === 0 && !form1Headline && !form1Description);
    setForm2Toggle(form2Fields.length === 0 && !form2Headline && !form2Description);
    setForm3Toggle(form3Fields.length === 0 && !form3Headline && !form3Description);
    setForm4Toggle(form4Fields.length === 0 && !form4Headline && !form4Description);
  }, [
    form1Fields,
    form2Fields,
    form3Fields,
    form4Fields,
    form1Headline,
    form2Headline,
    form3Headline,
    form4Headline,
    form1Description,
    form2Description,
    form3Description,
    form4Description,
  ]);


  const FormCard = ({
    toggle,
    setToggle,
    formPath,
  }: {
    toggle: boolean;
    setToggle: (value: boolean) => void;
    formPath: string;
  }) => (
    <>
      {toggle ? (
        <div className="border-4 border-gray-400 relative h-100 w-100 rounded-2xl flex justify-center items-center overflow-hidden">
          {loading ? <div className="text-white text-2xl">Loading...</div>:<button
            className="text-white bg-gray-400 hover:bg-gray-700 transition-all cursor-pointer w-10 h-10 rounded-xl text-4xl flex justify-center items-center"
            onClick={() => setToggle(false)}
          >
            <BiPlus />
          </button>}
        </div>
      ) : (
        <div className="border-4 border-gray-400 relative h-100 w-100 rounded-3xl flex justify-center items-center overflow-hidden ">
          <div className="absolute bg-gradient-to-r from-slate-50  to-red-200 h-full   w-full flex justify-center items-end pb-5">
            <button className="bg-gray-800 hover:bg-gray-600 transition-all h-10 w-auto rounded-2xl cursor-pointer">
              <Link href={`/home/${formPath}`} className="text-white px-4 py-2">
                Create/Update
              </Link>
            </button>
          </div>
          {/* <iframe
            src={`/home/preview/${formPath}`}
            className="w-full h-full rounded-2xl object-cover"
          /> */}
          <div className={`text-black z-20 uppercase text-3xl font-semibold mask-b-from-neutral-300`}>{formPath}</div>
        </div>
      )}
    </>
  );

  return (
    <div className=" h-screen w-screen flex justify-center items-center gap-5 pt-20 px-2 lg:px-10 pb-10">
      <div className="w-full h-full gap-10 flex justify-center items-center flex-wrap overflow-auto py-2">
        <FormCard toggle={form1Toggle} setToggle={setForm1Toggle} formPath="form1" />
        <FormCard toggle={form2Toggle} setToggle={setForm2Toggle} formPath="form2" />
        <FormCard toggle={form3Toggle} setToggle={setForm3Toggle} formPath="form3" />
        <FormCard toggle={form4Toggle} setToggle={setForm4Toggle} formPath="form4" />
      </div>
    </div>
  );
};

export default Page;
