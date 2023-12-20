import { useState } from "react";

export default function JsonCode() {
  const [jsonFile, setJsonFile] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleJsonFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      console.log("Selected file:", file);
      setJsonFile(file);
      setGeneratedCode(""); 
      setLoading(true); 

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/v1/code_generation/using_json", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate code");
      }

      const generatedCode = await response.text();
      setGeneratedCode(generatedCode);
    } catch (error) {
      console.error("Error generating code:", error);
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
              fill="blue"
              className="w-12 h-12"
            >
              <path
                fillRule="evenodd"
                d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 15.75a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-bold text-2xl md:text-3xl px-4">
            {jsonFile ? `Selected File: ${jsonFile.name}` : "Drag and drop or click here"}
          </p>
          <p className="px-4">to upload your JSON file of component</p>
        </div>
        <input
          type="file"
          id="fileInput"
          className="hidden"
          accept=".json"
          onChange={handleJsonFileUpload}
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
