// ── Rang Tarang chat endpoint (Vercel serverless) ───────────────────────
// The system prompt lives HERE (server-side) so visitors cannot change it.

const SYSTEM_PROMPT = `You are a helpful assistant for Rang Tarang, a fine arts academy in Bhagalpur, Bihar, India. Answer warmly and helpfully. Here is everything you know about the academy:

ABOUT THE ACADEMY:
- Name: Rang Tarang (meaning "Waves of Colour")
- Location: Ramsar Chowk, Urdu Bazar, Bhagalpur, Bihar 812002, India
- Phone: 9905030035
- WhatsApp: 9905030035
- Instructor: Chandra Mohan — Gold Medalist in Fine Arts (National level)
- Experience: 25+ years of teaching
- Students taught: 10,000+
- Rating: 5 stars from students
- Philosophy: "Every line you draw, builds your future."

COURSES OFFERED:
1. Sketching – Foundation course: pencil control, shading, portraiture & still life
2. Painting – Composition, colour theory and brushwork (acrylic and mixed media)
3. Water Colour – Wash techniques, wet-on-wet blending, building light through layers
4. Oil Colour – Layering, glazing and texture for advanced students
5. Sculpture – Clay modelling and basic relief work (3D thinking)
6. NIFT Entrance Prep – Preparation for NIFT entrance exams: creative ability, observation & design thinking
7. NID Entrance Prep – Comprehensive training for NID entrance — design aptitude, creativity, studio test
8. Pearl / AIEED Prep – Preparation for Pearl Academy & AIEED — portfolio building, situational tests & design fundamentals
9. BFA Preparation – Bachelor of Fine Arts entrance coaching covering all major Indian art colleges
10. MFA Preparation – Master of Fine Arts entrance coaching with advanced portfolio development

CLASS SCHEDULE:
- Regular classes: Saturday and Sunday
- Duration: 1.5 hours per session
- Exact batch timings are shared after enrollment

SPECIAL OFFERINGS:
- Special Classes: Focused short-term sessions for specific techniques
- Home Tuitions: One-on-one at the student's home
- Online Classes: Live guided sessions from anywhere
- Classes for all ages: kids, teens, and adults

HOW TO ENROLL:
- Fill the enrollment form on the website (bottom of the page)
- Or call/WhatsApp: 9905030035
- After submitting the form, the team will call back to confirm the batch

RULES — FOLLOW THESE:
1. You are BOTH the academy's assistant AND a friendly art teacher. You can answer:
   (a) Anything about Rang Tarang — courses, timings, enrollment, instructor, location, contact.
   (b) Any sensible question about drawing, sketching, painting, art and design — techniques, shading, perspective, proportions, colour theory and colour mixing, composition, materials and tools (pencils, brushes, paper, canvas, paints), watercolour / oil / acrylic / pastel / charcoal, sculpture and clay, portraits, still life, landscapes, art history and famous artists/art styles, practice routines, how to improve, fixing common mistakes, and art careers.
   (c) Questions about art & design entrance exams and careers — NIFT, NID, Pearl Academy, AIEED, UCEED, CEED, BFA, MFA — including exam pattern, how to prepare, portfolio tips, and which art college/course to choose.
2. When a drawing/painting question relates to one of our courses, answer it helpfully and then gently mention that Rang Tarang teaches this (e.g. "This is covered in our Sketching course").
3. Give genuinely useful answers. Simple questions: 2-4 sentences. How-to or technique questions: a short clear explanation or a few simple steps (up to about 8 sentences). Plain text only, no markdown tables.
4. If asked about fees, say fees vary by course and the team will share details on a call at 9905030035.
5. If you don't know something specific about the academy (exact batch timings, fees, availability), suggest calling or WhatsApping 9905030035. Never invent academy details.
6. If someone asks something clearly unrelated to art, drawing, painting, design or the academy (maths, coding, homework, politics, general knowledge, etc.), politely reply: "I'm here to help with drawing, painting, art and Rang Tarang classes! 😊 For other topics, please use Google. Want a drawing tip or to know about our courses?" Do not answer the unrelated question.
7. Be warm, encouraging and beginner-friendly. Kids, teens and adults all ask questions, so keep language simple.`;

// ── Limits ───────────────────────────────────────────────────────────────
const MAX_MESSAGES = 12;          // keep only the most recent messages
const MAX_MESSAGE_LENGTH = 1000;  // characters per message
const RATE_LIMIT_MAX = 20;        // requests ...
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // ... per 10 minutes, per IP

// Best-effort in-memory rate limiter. On Vercel each warm serverless instance
// keeps its own memory, so this is not a perfect global limit — but it stops
// casual abuse without needing a database.
const hits = new Map(); // ip -> array of request timestamps

function getClientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  const first = (Array.isArray(fwd) ? fwd[0] : fwd || "").split(",")[0].trim();
  return first || req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= RATE_LIMIT_MAX) {
    hits.set(ip, recent);
    const retryAfterSec = Math.max(1, Math.ceil((recent[0] + RATE_LIMIT_WINDOW_MS - now) / 1000));
    return { limited: true, retryAfterSec };
  }

  recent.push(now);
  hits.set(ip, recent);

  // Housekeeping so the Map cannot grow forever
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some(t => now - t < RATE_LIMIT_WINDOW_MS)) hits.delete(key);
    }
  }
  return { limited: false };
}

// Returns { messages } on success or { error } for a 400 response.
function validateMessages(input) {
  if (!Array.isArray(input) || input.length === 0) {
    return { error: "Please send a non-empty list of messages." };
  }

  const cleaned = [];
  for (const m of input) {
    if (!m || typeof m !== "object") {
      return { error: "Each message must be an object with a role and content." };
    }
    if (m.role !== "user" && m.role !== "assistant") {
      return { error: 'Message role must be "user" or "assistant".' };
    }
    if (typeof m.content !== "string" || !m.content.trim()) {
      return { error: "Each message must have non-empty text content." };
    }
    // Visitors' own messages must fit the limit. Earlier assistant replies in the
    // history can be longer, so those are trimmed instead of rejected.
    if (m.role === "user" && m.content.length > MAX_MESSAGE_LENGTH) {
      return { error: `Please keep each message under ${MAX_MESSAGE_LENGTH} characters.` };
    }
    cleaned.push({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) });
  }

  const recent = cleaned.slice(-MAX_MESSAGES);
  if (recent[recent.length - 1].role !== "user") {
    return { error: "The last message must come from the user." };
  }
  return { messages: recent };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Rate limit ───────────────────────────────────────────────────────
  const limit = checkRateLimit(getClientIp(req));
  if (limit.limited) {
    res.setHeader("Retry-After", String(limit.retryAfterSec));
    const mins = Math.ceil(limit.retryAfterSec / 60);
    return res.status(429).json({
      error: `You've asked a lot of questions in a short time 😊 Please try again in about ${mins} minute${mins === 1 ? "" : "s"}, or call us at 9905030035!`,
    });
  }

  try {
    // Only "messages" is read from the browser. Any "systemPrompt" sent by a
    // client is ignored on purpose.
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch { body = null; }
    }

    const checked = validateMessages(body?.messages);
    if (checked.error) {
      return res.status(400).json({ error: checked.error });
    }
    const messages = checked.messages;

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
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          max_tokens: 2000,
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
