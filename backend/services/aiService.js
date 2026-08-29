/**
 * AI Service: Connects Node.js Express with Python FastAPI ML Server and optional LLM Gemini API.
 */

const axios = require('axios');

const FASTAPI_BASE_URL = process.env.FASTAPI_URL || 'http://127.0.0.1:8000';

class AIService {
  /**
   * Predict complaint category, priority, department, confidence & sentiment.
   * Tries FastAPI first, then falls back to Groq classification, then hardcoded defaults.
   */
  async predictComplaint(complaintText) {
    // Source 1: FastAPI ML server
    try {
      const response = await axios.post(`${FASTAPI_BASE_URL}/predict`, {
        complaint: complaintText
      }, { timeout: 4000 });
      return response.data;
    } catch (err) {
      console.error('FastAPI Prediction call error:', err.message);
    }

    // Source 2: Groq LLM classification fallback
    try {
      const groqResult = await this.predictComplaintViaGroq(complaintText);
      if (groqResult) {
        console.log('Groq classification fallback used for:', complaintText.substring(0, 50));
        return groqResult;
      }
    } catch (err) {
      console.error('Groq classification fallback error:', err.message);
    }

    // Source 3: Hardcoded defaults
    return {
      category: 'Internet Down',
      priority: 'High',
      department: 'Internet Support',
      confidence: 0.85,
      sentiment: 'Frustrated',
      aiSummary: `Possible network issue: ${complaintText.substring(0, 50)}...`
    };
  }

  /**
   * Fallback classification using Groq when FastAPI is unavailable.
   */
  async predictComplaintViaGroq(complaintText) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;

    const prompt = `Classify this Nepal Telecom customer complaint. Respond with ONLY valid JSON, no markdown, no explanation:

{
  "category": "Fiber Cut | LOS Red | Internet Slow | SIM Activation | Billing | IPTV | Mobile Issue | Landline | Broadband | Other",
  "priority": "Low | Medium | High | Critical",
  "department": "Fiber Team | Mobile Support | Billing | Network Operations | Customer Support",
  "sentiment": "Happy | Neutral | Frustrated | Angry",
  "confidence": 0.95,
  "aiSummary": "one line summary"
}

Complaint: "${complaintText}"`;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-20b',
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 200,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 5000
        }
      );

      const content = response.data?.choices?.[0]?.message?.content?.trim();
      if (!content) return null;

      let parsed;
      try {
        parsed = JSON.parse(content);
      } catch {
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsed = JSON.parse(jsonMatch[0]);
        } else {
          return null;
        }
      }

      if (!parsed.category || !parsed.priority || !parsed.department) return null;

      return {
        category: parsed.category,
        priority: parsed.priority,
        department: parsed.department,
        confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.85,
        sentiment: parsed.sentiment || 'Neutral',
        aiSummary: parsed.aiSummary || complaintText.substring(0, 50)
      };
    } catch (err) {
      console.error('Groq classification error:', err.message);
      return null;
    }
  }

  /**
   * Check duplicate similarity against existing DB complaints using TF-IDF Cosine Similarity in FastAPI.
   * Falls back to simple keyword overlap if FastAPI is unavailable.
   */
  async checkDuplicate(newComplaintText, existingComplaints) {
    // Source 1: FastAPI duplicate check
    try {
      const response = await axios.post(`${FASTAPI_BASE_URL}/duplicate-check`, {
        newComplaint: newComplaintText,
        existingComplaints: existingComplaints.map(c => ({
          ticketId: c.ticketId || c._id.toString(),
          description: `${c.title || ''} ${c.description || ''}`
        }))
      }, { timeout: 4000 });
      return response.data;
    } catch (err) {
      console.error('FastAPI Duplicate Check error:', err.message);
    }

    // Source 2: Simple keyword overlap fallback
    const newWords = new Set(newComplaintText.toLowerCase().split(/\s+/));
    let bestMatch = null;
    let bestScore = 0;

    for (const complaint of existingComplaints) {
      const existingText = `${complaint.title || ''} ${complaint.description || ''}`.toLowerCase();
      const existingWords = new Set(existingText.split(/\s+/));
      let overlap = 0;
      for (const word of newWords) {
        if (existingWords.has(word)) overlap++;
      }
      const score = newWords.size > 0 ? overlap / newWords.size : 0;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = complaint;
      }
    }

    const isDuplicate = bestScore > 0.6;
    return {
      isDuplicate,
      similarityScore: bestScore,
      matchedTicketId: isDuplicate ? (bestMatch?.ticketId || bestMatch?._id?.toString()) : null
    };
  }

  /**
   * Smart Troubleshooting Guide Generator (Fallback to static rules if LLM is unavailable)
   */
  getTroubleshootingAdvice(category) {
    const adviceMap = {
      'Fiber Cut': 'Check for broken outdoor drop wire or pole damage. A field engineer has been notified.',
      'LOS Red': 'Check ONT Optical Router: Ensure patch cord yellow wire is plugged firmly. Verify if red LOS light stops blinking.',
      'ONT Offline': 'Unplug ONT power adapter for 30 seconds, reconnect transformer, and verify PON power LED light.',
      'Internet Down': 'Restart Wi-Fi router. VerifyWAN IP status and check if subscription billing account is active.',
      'Internet Slow': 'Run a speed test near the router. Disconnect heavy background torrents/streaming devices.',
      'High Ping': 'Connect via direct LAN cable instead of 2.4GHz Wi-Fi and restart local router device.',
      'Router Issue': 'Perform soft reset of Wi-Fi router. Check ethernet cables.',
      'Weak WiFi': 'Move closer to ONT router or switch device to 5GHz Wi-Fi band.',
      'SIM Activation': 'Turn on Airplane mode for 10 seconds and restart phone. Ensure KYC verification submitted.',
      'SIM Blocked': 'Contact customer support for PUK code unlock.',
      'Voice Call': 'Enable VoLTE in mobile SIM network settings and restart phone.',
      'SMS Failure': 'Verify SMS Service Center Number (+9779851000000) in SMS app settings.',
      'Recharge Issue': 'Wait 5 minutes for payment gateway webhooks. Check wallet transaction ID in bank statement.',
      'Billing': 'Check account statement in NTC Mobile App or dial *400#.',
      'IPTV': 'Restart NetTV Set-Top Box and check HDMI cable connection to TV.'
    };
    return adviceMap[category] || 'Restart device and verify cable connections.';
  }

  /**
   * Generate intelligent, humanized conversational response via Groq LLaMA3 API
   */
  async generateLLMTroubleshooting(userText, mlCategory, sentiment) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return null;

    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'openai/gpt-oss-20b',
          messages: [
            {
              role: 'system',
              content: `You are Aastha, a warm, empathetic, and highly professional customer support representative for Nepal Telecom (NTC).
Talk like a helpful human support specialist rather than a rigid robot. 

Guidelines:
1. Greet warmly (e.g. "I understand how frustrating this must be for you...") matching the customer sentiment.
2. Provide concise, clear, and actionable troubleshooting steps for their issue (e.g. ONT router checks, PON/LOS lights, FTTH fiber cord, Namaste Pay, SIM VoLTE, NetTV).
3. Keep the response natural, friendly, and end by asking if they would like you to officially file a support ticket with our engineering team.`
            },
            {
              role: 'user',
              content: `User Issue: "${userText}". ML System Category: "${mlCategory}". Customer Sentiment: "${sentiment}". Please respond warmly to the user.`
            }
          ],
          max_tokens: 220,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 4500
        }
      );

      return response.data?.choices?.[0]?.message?.content?.trim() || null;
    } catch (err) {
      console.warn('Groq LLM API notice:', err.response?.data || err.message);
      return null;
    }
  }
}

module.exports = new AIService();

