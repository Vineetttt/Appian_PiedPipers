import { useState } from "react";

export default function ImageCode() {
  const [imageFile, setImageFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleImageFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      console.log("Selected file:", file);
      setImageFile(file);
      setGeneratedCode(""); 
      setLoading(true); 

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/v1/code_generation/from_image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate code from image");
      }

      const data = await response.json();

      setGeneratedCode(data.generated_code);
    } catch (error) {
      console.error("Error generating code from image:", error);
    } finally {
      setLoading(false); 
    }
  };

  const handleCopyCode = () => {
    const textarea = document.createElement("textarea");
    textarea.value = generatedCode;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <label
        htmlFor="fileInput"
        className="h-72 sm:h-80 border-dashed border-2 border-gray-500 flex flex-col items-center justify-center bg-slate-200 cursor-pointer"
      >
        <div className="mb-4">
          <div className="w-full flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              fill="none"
              className="w-12 h-12"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </div>
          <p className="text-bold text-2xl md:text-3xl px-4">
            {imageFile ? `Selected File: ${imageFile.name}` : "Drag and drop or click here"}
          </p>
          <p className="px-4">to upload your Image file of component</p>
        </div>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept="image/jpeg, image/png, image/gif"
          onChange={handleImageFileUpload}
        />
      </label>
      {/* Display spinner while loading */}
      {loading && (
        <div className="text-center mt-4">
          <div className="spinner-border text-slate-800" role="status">
            <span className="visually-hidden">Generating Code...</span>
          </div>
        </div>
      )}
      {/* when response is generated */}
      <div className={`mt-4 text-xl font-bold ${loading ? 'hidden' : ''}`}>
        Generated Code:
      </div>
      <div className={`bg-slate-900 p-2 rounded-xl sm:p-2 text-red-400 mt-4 h-60 w-full overflow-y-scroll ${loading ? 'hidden' : ''}`}>
        <div className="">
          <pre>{generatedCode}</pre>
        </div>
      </div>
      {!loading && generatedCode && (
        <div
          className={`mx-4 mt-4 text-white py-2 font-bold text-xl rounded-xl w-[50%] sm:w-[92%] md:w-[95%] text-center ${
            copied ? "bg-slate-500" : "bg-slate-900"
          } cursor-pointer hover:bg-slate-800`}
          onClick={handleCopyCode}
        >
          {copied ? "Copied!" : "Copy Code"}
        </div>
      )}
    </>
  );
}
