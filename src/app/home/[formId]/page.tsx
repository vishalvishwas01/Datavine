import React from "react";
import Form1 from "@/components/form/form1";
import Form2 from "@/components/form/form2";
import Form3 from "@/components/form/form3";
import Form4 from "@/components/form/form4";

const Page = async ({ params }: { params: Promise<{ formId: string }> }) => {
  const { formId } = await params;

  return (
    <div className="text-white z-30">
      {formId === "form1" && (
        <div className="relative  h-auto py-4 pt-20 w-vw flex flex-col gap-5 justify-center items-center">
          <Form1 />
        </div>
      )}
      {formId === "form2" && (
         <div className="relative  h-auto py-4 pt-20 w-vw flex flex-col gap-5 justify-center items-center">
          <Form2 />
        </div>
      )}
      {formId === "form3" && (
         <div className="relative  h-auto py-4 pt-20 w-vw flex flex-col gap-5 justify-center items-center">
          <Form3 />
        </div>
      )}
      {formId === "form4" && (
         <div className="relative  h-auto py-4 pt-20 w-vw flex flex-col gap-5 justify-center items-center">
          <Form4 />
        </div>
      )}
    </div>
  );
};

export default Page;
