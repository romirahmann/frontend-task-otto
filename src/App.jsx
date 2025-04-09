/* eslint-disable no-unused-vars */
import React, { useCallback, useEffect, useRef, useState } from "react";

import { FaCloudUploadAlt } from "react-icons/fa";
import { useDropzone } from "react-dropzone";

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [dear, setDear] = useState("");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef(null);

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = words[i] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.font = "24px Poppins";
      ctx.fillStyle = "black";
      try {
        ctx.fillText(`${dear}`, 290, 220);
        wrapText(ctx, message, 200, 270, canvas.width - 380, 50);
        ctx.fillText(`${from}`, 265, 380);
      } catch (err) {
        console.error("Error drawing text:", err);
      }
    };
    img.src = URL.createObjectURL(imageFile);
  };

  useEffect(() => {
    if (!imageFile) {
      setError("Semua field harus diisi.");
      return;
    }
    setError("");
    drawCanvas();
  }, [imageFile, dear, message, from]);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const handleDownload = () => {
    if (!imageFile || !dear || !message || !from) {
      setError("Semua field harus diisi sebelum mengunduh.");
      return;
    }
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "giftcard.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="bg-white max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Gift Card</h1>
      <hr />
      {imageFile && (
        <canvas ref={canvasRef} className="w-full border rounded shadow" />
      )}

      <form className="space-y-4">
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-6 text-center cursor-pointer bg-gray-100 rounded-xl"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop image here...</p>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl text-gray-600">
                <FaCloudUploadAlt />
              </span>
              <p className="mt-1 text-[1em]">Browse File</p>
              <p className="text-[0.7em] text-gray-500">
                Drag & Drop File Here
              </p>
            </div>
          )}
          {imageFile && (
            <p className="text-sm text-green-600 mt-2">
              Image selected: {imageFile.name}
            </p>
          )}
        </div>

        <input
          type="text"
          placeholder="Dear..."
          value={dear}
          onChange={(e) => setDear(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="From..."
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>

      <button
        onClick={handleDownload}
        className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Download Gift Card
      </button>
    </div>
  );
}

export default App;
