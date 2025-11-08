import React from "react";
import Form1 from "@/components/PreviewForm/form1";
import Form2 from "@/components/PreviewForm/form2";
import Form3 from "@/components/PreviewForm/form3";
import Form4 from "@/components/PreviewForm/form4";

const page = ({ params }: { params: { formId: string } }) => {
  return (
    <div className="text-white z-30 ">
      {params.formId === "form1" && (
        <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <Form1 />
        </div>
      )}
      {params.formId === "form2" && (
         <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <Form2 />
        </div>
      )}
      {params.formId === "form3" && (
         <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <Form3 />
        </div>
      )}
      {params.formId === "form4" && (
         <div className="min-h-screen flex justify-center items-start bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <Form4 />
        </div>
      )}
    </div>
  );
};

export default page;
