export async function extractTextFromImage(base64Image) {
  try {
    //Makes sure an empty file upload doesn't break the function
    if (!base64Image) {
      console.error("[OCR ERROR]: No image payload data was sent to the extractor.");
      return "[OCR Error: Image payload is empty]";
    }

    console.log("[OCR] Cleaning up base64 metadata headers...");

    // If the image string has a frontend file metadata header (e.g., "data:image/png;base64,..."),
    // split it and keep only the raw base64 character blocks.
    let cleanBase64 = base64Image;
    if (base64Image.includes("base64,")) {
      cleanBase64 = base64Image.split("base64,")[1];
    }

    console.log("[OCR] Sending sanitized image data to OCR.space...");

    const formData = new FormData();
    
    formData.append("base64Image", `data:image/png;base64,${cleanBase64}`);
    formData.append("language", "eng");
    formData.append("isOverlayRequired", "false");

    //Fallback URL safety checker in case the process.env file is reloading
    const apiUrl = process.env.OCR_API_URL || "https://api.ocr.space/parse/image";
    const apiKey = process.env.OCR_API_KEY || "dont25kfreekey"; // Fallback to their public tier testing key

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "apikey": process.env.OCR_API_KEY
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`OCR provider network response error status code: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.OCRExitCode === 1 && data.ParsedResults && data.ParsedResults.length > 0) {
      const extractedText = data.ParsedResults[0].ParsedText;
      console.log("[OCR] Successfully parsed text:", extractedText);
      return extractedText;
    } else {
      // Catch specific errors sent back by the OCR.space server (like invalid key, image too large, etc.)
      const serverMessage = Array.isArray(data.ErrorMessage) ? data.ErrorMessage.join(", ") : data.ErrorMessage;
      throw new Error(serverMessage || "OCR.space failed to parse image layout.");
    }

  } catch (error) {
    console.error("[OCR ERROR]:", error.message);
    return `[OCR Extraction Failed: ${error.message}]`;
  }
}