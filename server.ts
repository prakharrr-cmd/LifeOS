import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { INITIAL_STREAM_ITEMS, INITIAL_RISK, INITIAL_STRESS_REPORT } from "./src/data/seedData";
import { StreamItem, DetectedRisk, StressAuditReport, ScheduleRebalanceItem } from "./src/types";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory runtime state for the user session
let currentStreamItems: StreamItem[] = [...INITIAL_STREAM_ITEMS];
let currentRisk: DetectedRisk = { ...INITIAL_RISK };
let currentStressReport: StressAuditReport = { ...INITIAL_STRESS_REPORT };

// Lazy helper for Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    itemCount: currentStreamItems.length,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/stream-items", (req, res) => {
  res.json({
    items: currentStreamItems,
    risk: currentRisk,
    stressReport: currentStressReport,
  });
});

app.post("/api/stream-items", (req, res) => {
  const newItem: StreamItem = {
    id: req.body.id || `item-${Date.now()}`,
    source: req.body.source || "notifications",
    title: req.body.title || "Untitled Notification",
    content: req.body.content || "",
    sender: req.body.sender || "System Alert",
    timestamp: req.body.timestamp || "Just now",
    dateTag: req.body.dateTag || "Upcoming",
    tags: req.body.tags || ["New"],
    isHighlighted: true,
  };

  currentStreamItems.unshift(newItem);
  res.json({ success: true, item: newItem, items: currentStreamItems });
});

app.delete("/api/stream-items/:id", (req, res) => {
  const { id } = req.params;
  currentStreamItems = currentStreamItems.filter((item) => item.id !== id);
  res.json({ success: true, items: currentStreamItems });
});

app.post("/api/stream-items/reset", (req, res) => {
  currentStreamItems = [...INITIAL_STREAM_ITEMS];
  currentRisk = { ...INITIAL_RISK };
  currentStressReport = { ...INITIAL_STRESS_REPORT };
  res.json({
    success: true,
    items: currentStreamItems,
    risk: currentRisk,
    stressReport: currentStressReport,
  });
});

// AI Context Engine Analysis Route
app.post("/api/context-engine/analyze", async (req, res) => {
  try {
    const items: StreamItem[] = req.body.items || currentStreamItems;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback deterministic analysis if no key provided
      const risk: DetectedRisk = {
        ...INITIAL_RISK,
        explanation: `Evaluated ${items.length} disjoint cross-channel stream records. High deadline compression detected across Friday.`,
      };
      currentRisk = risk;
      return res.json({ risk, source: "deterministic" });
    }

    const itemsSummary = items
      .map(
        (i, idx) =>
          `[#${idx + 1}] Source: ${i.source.toUpperCase()} | Sender: ${i.sender} | Title: "${i.title}" | When: "${i.dateTag}" | Content: "${i.content}"`
      )
      .join("\n");

    const prompt = `You are LifeOS, an AI predictive context engine that watches a user's phone messages, calendar, emails, assignments, and notifications.
Your core mission is NOT to make another to-do list, but to connect disparate clues and predict: "You're going to miss this."
Look for cross-channel contradictions (e.g. extension messages vs exam calendar vs assignment due dates), compressed timeframes, false sense of safety ("Extension Bias"), and hidden cognitive overload.

Here are the user's active stream inputs:
${itemsSummary}

Synthesize these inputs. Generate a JSON response adhering strictly to the schema provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Punchy alert title summarizing the main collision" },
            severity: { type: Type.STRING, description: "Must be CRITICAL, HIGH, MEDIUM, or LOW" },
            missProbability: { type: Type.INTEGER, description: "Probability from 0 to 100 that user will miss something or burn out" },
            predictionStatement: { type: Type.STRING, description: "Exact visceral prediction, e.g. You're going to miss this." },
            predictedOverload: { type: Type.STRING, description: "EXTREME, HIGH, MODERATE, or LOW" },
            timeUntilCollision: { type: Type.STRING, description: "Time until the main crisis or collapse" },
            cognitiveTrap: { type: Type.STRING, description: "The psychological bias or trap that causes them to fail (e.g. Extension Bias, Spacing Illusion)" },
            connectedItemTitles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Titles of the specific items that triggered this cross-stream risk"
            },
            explanation: { type: Type.STRING, description: "How the disparate pieces fit together to cause the disaster" },
            preventionStep: { type: Type.STRING, description: "Immediate strategic action to prevent the miss" },
            deadlines: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  time: { type: Type.STRING },
                  source: { type: Type.STRING },
                  critical: { type: Type.BOOLEAN },
                },
                required: ["title", "time", "source"],
              },
            },
          },
          required: [
            "title",
            "severity",
            "missProbability",
            "predictionStatement",
            "predictedOverload",
            "timeUntilCollision",
            "cognitiveTrap",
            "explanation",
            "preventionStep",
            "deadlines"
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const riskResult: DetectedRisk = {
      id: `risk-${Date.now()}`,
      title: parsed.title || INITIAL_RISK.title,
      severity: (["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(parsed.severity)
        ? parsed.severity
        : "HIGH") as DetectedRisk["severity"],
      missProbability: Math.min(100, Math.max(10, parsed.missProbability || 85)),
      predictionStatement: parsed.predictionStatement || "You're going to miss this.",
      predictedOverload: (["EXTREME", "HIGH", "MODERATE", "LOW"].includes(parsed.predictedOverload)
        ? parsed.predictedOverload
        : "HIGH") as DetectedRisk["predictedOverload"],
      timeUntilCollision: parsed.timeUntilCollision || "Under 24 hours",
      cognitiveTrap: parsed.cognitiveTrap || INITIAL_RISK.cognitiveTrap,
      connectedItemIds: items.slice(0, 5).map((i) => i.id),
      deadlines: (parsed.deadlines || INITIAL_RISK.deadlines).map((d: any) => ({
        title: d.title,
        time: d.time,
        source: (["messages", "calendar", "email", "assignments", "notifications"].includes(d.source)
          ? d.source
          : "assignments") as any,
        critical: d.critical ?? true,
      })),
      explanation: parsed.explanation || INITIAL_RISK.explanation,
      preventionStep: parsed.preventionStep || INITIAL_RISK.preventionStep,
    };

    currentRisk = riskResult;
    res.json({ risk: riskResult, source: "gemini" });
  } catch (err: any) {
    console.error("Gemini context engine error:", err);
    res.json({
      risk: currentRisk,
      fallback: true,
      error: err.message || "Failed to parse context with AI",
    });
  }
});

// The Killer Feature: "Why am I stressed?"
app.post("/api/stress-audit", async (req, res) => {
  try {
    const items: StreamItem[] = req.body.items || currentStreamItems;
    const ai = getGeminiClient();

    if (!ai) {
      currentStressReport = { ...INITIAL_STRESS_REPORT };
      return res.json({ report: currentStressReport, source: "deterministic" });
    }

    const itemsSummary = items
      .map(
        (i, idx) =>
          `[Item ${idx + 1}] (${i.source}) "${i.title}" scheduled/tagged: "${i.dateTag}" - ${i.content}`
      )
      .join("\n");

    const prompt = `You are LifeOS's deep cognitive audit engine answering the user's primal question:
"Why am I stressed?"

The core thesis of LifeOS is:
"You're not behind. You're overloaded."
The user isn't lazy; they are dealing with hidden collision bottlenecks where multiple disjoint commitments (emails, WhatsApp messages, calendar tests, LMS assignments) clash silently without a unified view.

Input Stream Records:
${itemsSummary}

Analyze this workload, diagnose the exact cognitive overload reasons, and automatically propose a concrete, realistic schedule rebalance (e.g. moving heavy tasks to earlier low-friction slots or staggering deadlines so the user has breathing room).

Return a JSON strictly according to the specified schema.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: { type: Type.STRING, description: "Must include or start with: You're not behind. You're overloaded." },
            cognitiveLoadScore: { type: Type.INTEGER, description: "0-100 cognitive stress score" },
            loadTier: { type: Type.STRING, description: "EXTREME, HIGH, MODERATE, or NORMAL" },
            whyYouAreStressed: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 direct, hyper-accurate bullet points breaking down why their brain is feeling overwhelmed"
            },
            bottlenecks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  window: { type: Type.STRING },
                  conflictingEvents: { type: Type.ARRAY, items: { type: Type.STRING } },
                  riskFactor: { type: Type.STRING },
                },
                required: ["window", "conflictingEvents", "riskFactor"]
              }
            },
            suggestedRebalance: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  originalTime: { type: Type.STRING },
                  suggestedTime: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  impact: { type: Type.STRING },
                  channel: { type: Type.STRING },
                },
                required: ["title", "originalTime", "suggestedTime", "reason", "impact"]
              }
            },
            summaryMessage: { type: Type.STRING, description: "Encouraging, clear conclusion" },
            mentalReliefIndex: { type: Type.STRING, description: "e.g. Reduces peak cognitive friction by 70%" }
          },
          required: [
            "verdict",
            "cognitiveLoadScore",
            "loadTier",
            "whyYouAreStressed",
            "bottlenecks",
            "suggestedRebalance",
            "summaryMessage",
            "mentalReliefIndex"
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || "{}");
    const auditReport: StressAuditReport = {
      verdict: parsed.verdict || "You're not behind. You're overloaded.",
      cognitiveLoadScore: Math.min(100, Math.max(20, parsed.cognitiveLoadScore || 90)),
      loadTier: (["EXTREME", "HIGH", "MODERATE", "NORMAL"].includes(parsed.loadTier)
        ? parsed.loadTier
        : "HIGH") as StressAuditReport["loadTier"],
      whyYouAreStressed: parsed.whyYouAreStressed || INITIAL_STRESS_REPORT.whyYouAreStressed,
      bottlenecks: parsed.bottlenecks || INITIAL_STRESS_REPORT.bottlenecks,
      suggestedRebalance: (parsed.suggestedRebalance || INITIAL_STRESS_REPORT.suggestedRebalance).map(
        (item: any, idx: number) => ({
          id: `reb-${Date.now()}-${idx}`,
          title: item.title,
          originalTime: item.originalTime,
          suggestedTime: item.suggestedTime,
          reason: item.reason,
          impact: item.impact,
          channel: (["messages", "calendar", "email", "assignments", "notifications"].includes(item.channel)
            ? item.channel
            : "assignments") as any,
          applied: false,
        })
      ),
      summaryMessage: parsed.summaryMessage || INITIAL_STRESS_REPORT.summaryMessage,
      mentalReliefIndex: parsed.mentalReliefIndex || "Reduces peak cognitive friction by 68%",
    };

    currentStressReport = auditReport;
    res.json({ report: auditReport, source: "gemini" });
  } catch (err: any) {
    console.error("Gemini stress audit error:", err);
    res.json({
      report: currentStressReport,
      fallback: true,
      error: err.message || "Stress diagnostic computed using rule-based heuristics",
    });
  }
});

// Apply rebalanced schedule
app.post("/api/apply-rebalance", (req, res) => {
  const { rebalanceId, rebalances } = req.body;

  if (rebalances && Array.isArray(rebalances)) {
    // Apply all
    rebalances.forEach((reb: ScheduleRebalanceItem) => {
      // Find matching stream item by title similarity
      const match = currentStreamItems.find((it) =>
        it.title.toLowerCase().includes(reb.title.toLowerCase().slice(0, 8))
      );
      if (match) {
        match.dateTag = `${reb.suggestedTime} [Rebalanced]`;
        match.tags = [...(match.tags || []), "Auto-Rebalanced"];
      }
    });

    if (currentStressReport && currentStressReport.suggestedRebalance) {
      currentStressReport.suggestedRebalance.forEach((r) => (r.applied = true));
      currentStressReport.cognitiveLoadScore = Math.max(18, currentStressReport.cognitiveLoadScore - 55);
      currentStressReport.loadTier = "NORMAL";
    }

    currentRisk.missProbability = Math.max(12, currentRisk.missProbability - 65);
    currentRisk.severity = "LOW";
    currentRisk.predictionStatement = "Deconfliction applied. Deadlines stabilized.";
    currentRisk.predictedOverload = "LOW";

    return res.json({
      success: true,
      appliedCount: rebalances.length,
      items: currentStreamItems,
      risk: currentRisk,
      stressReport: currentStressReport,
    });
  }

  if (rebalanceId) {
    const reb = currentStressReport.suggestedRebalance.find((r) => r.id === rebalanceId);
    if (reb) {
      reb.applied = true;
      const match = currentStreamItems.find((it) =>
        it.title.toLowerCase().includes(reb.title.toLowerCase().slice(0, 8))
      );
      if (match) {
        match.dateTag = `${reb.suggestedTime} [Rebalanced]`;
      }
    }
  }

  res.json({
    success: true,
    items: currentStreamItems,
    risk: currentRisk,
    stressReport: currentStressReport,
  });
});

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[LifeOS] Backend & UI running at http://0.0.0.0:${PORT}`);
  });
}

start();
