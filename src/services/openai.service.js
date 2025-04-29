import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Obtém a chave do .env
});

export async function processImage(imagePath) {
  const imageBuffer = fs.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");

  const prompt = `
    Extraia os dados do cardápio na imagem.
    Estruture os dados como JSON no seguinte formato:
    [{"category_name":"Pizzas","products":[{"product_name":"Pizza Calabresa","description":"Calabresa com queijo","value":30,"promotion_value":25}]}]
  `;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "user", content: prompt },
      { role: "user", content: `data:image/png;base64,${imageBase64}` },
    ],
    temperature: 0,
    response_format: { type: "json_object" },
  });

  return response.choices[0].message.content;
}
