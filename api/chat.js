export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, systemPrompt } = req.body;

    // ── LOG every question asked on the website ──────────────────────────
    const latestQuestion = messages?.findLast?.(m => m.role === "user")?.content
      || messages?.filter(m => m.role === "user").slice(-1)[0]?.content
      || "(unknown)";

    console.log("─────────────────────────────────────");
    console.log(`[RANG TARANG CHAT] ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`);
    console.log(`❓ Question: ${latestQuestion}`);
    console.log("─────────────────────────────────────");
    // ────────────────────────────────────────────────────────────────────

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-120b",
          messages: [
            { role: "system", content: systemPrompt },
            ...messages,
          ],
          max_tokens: 1000,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("[RANG TARANG CHAT] Groq error:", data?.error?.message);
      return res.status(response.status).json({
        error: data?.error?.message || "Groq request failed",
      });
    }

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Sorry, I couldn't get a response.";

    // ── LOG the AI's reply too ───────────────────────────────────────────
    console.log(`💬 Reply: ${reply}`);
    console.log("─────────────────────────────────────");
    // ────────────────────────────────────────────────────────────────────

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("[RANG TARANG CHAT] Server error:", error);
    return res.status(500).json({
      error: "Something went wrong.",
    });
  }
}
