import OpenAI from "openai";
import { NextRequest } from "next/server";

const client = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY || "",
  baseURL: "https://api.siliconflow.cn/v1",
});

const SYSTEM_PROMPT = `你是一个文学气质的日记助手。用户会给你一段今天的记录或感悟，请你帮助排版成以下格式：

【今日索引】
日期：（使用用户提供的日期）
心情分：（根据内容判断 1-10 分，1最低10最高）
关键词：（提取3个关键词，用逗号分隔）

【日记】
（用第一人称改写，克制文笔，保留原意。文风参考张爱玲的克制、木心的留白。不用华丽词藻，用精准的细节代替情绪的直白表达。控制在150-300字。）

【洞察】
（1-2条精炼的自我观察或生活见解，每条一行）

【未来视角】
（一段从容的寄语，写给未来回看这篇日记的自己，温和但不煽情，2-3句话）

【原始感悟】
（原封不动保留用户的输入文字）

注意：
- 保持温暖但克制的语气
- 不要过度解读或添加用户没有表达的情感
- 日记部分要有文学质感但不矫揉造作`;

export async function POST(request: NextRequest) {
  const { content, date } = await request.json();

  if (!content || !content.trim()) {
    return new Response(JSON.stringify({ error: "内容不能为空" }), {
      status: 400,
    });
  }

  const userMessage = `今天是${date}。以下是我今天的记录：\n\n${content}`;

  const stream = await client.chat.completions.create({
    model: "Qwen/Qwen2.5-7B-Instruct",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    stream: true,
    max_tokens: 1024,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content || "";
        if (text) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
