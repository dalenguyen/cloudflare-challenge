import { ACCOUNT_ID, AI_TOKEN, BASE_URL } from "./environment";

/**
 * Generate capture for an image
 *
 * @param base64Image string
 * @returns string
 */
export const imageToText = async (base64Image: string) => {
  const MODEL = "@cf/unum/uform-gen2-qwen-500m";

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AI_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  const body = JSON.stringify({
    image: base64ToArrayBuffer(base64Image),
    prompt: "Generate a caption for this image",
    max_tokens: 512,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body,
    redirect: "follow",
  };

  try {
    const { result } = await fetch(`${BASE_URL}/${MODEL}`, requestOptions).then(
      (response) => response.json(),
    );

    return result;
  } catch (error) {
    return error;
  }
};

function base64ToArrayBuffer(base64: string) {
  var binaryString = atob(base64);
  var bytes = [];
  for (var i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
