import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in environment variables!");
}

const DEFAULT_AUTO_REPLY = `Thank you for reaching out! We've received your feedback and our team is actively reviewing your ticket. We'll get back to you with an update shortly. If you have any urgent concerns, please don't hesitate to add another comment.`;

const ISSUE_RESPONSES = {
  HARDWARE_ISSUE: "Our technical team is examining the hardware-related issue you've reported. We'll ensure everything is working optimally.",
  SOFTWARE_ISSUE: "Our software team is looking into the issue you've described. We're working on a solution right away.",
  NETWORK_CONNECTIVITY: "Our network specialists are investigating the connectivity issue. We'll restore full access as quickly as possible.",
  ACCOUNT_ACCESS: "Our security team is reviewing your account access request. You'll have access restored shortly.",
  OTHER: "Our support team has received your ticket and is preparing the appropriate response."
};

export async function generateAutoReply(ticket, comment, userAvailability = null) {
  try {
    const issueTypeResponse = ISSUE_RESPONSES[ticket.issueType] || ISSUE_RESPONSES.OTHER;
    
    let availabilityContext = "";
    
    if (userAvailability) {
      const timezone = userAvailability.timezone || "UTC";
      const now = new Date();
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = dayNames[userTime.getDay()];
      const currentTime = `${String(userTime.getHours()).padStart(2, '0')}:${String(userTime.getMinutes()).padStart(2, '0')}`;
      const workingDays = userAvailability.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const isWorkingDay = workingDays.includes(currentDay);
      const startTime = userAvailability.workingHoursStart || "09:00";
      const endTime = userAvailability.workingHoursEnd || "17:00";
      const isWithinWorkingHours = currentTime >= startTime && currentTime <= endTime;
      const isAvailable = isWorkingDay && isWithinWorkingHours;
      
      availabilityContext = `
User Availability Context:
- User's Timezone: ${timezone}
- User's Current Time: ${currentTime} (${currentDay})
- User's Working Hours: ${startTime} - ${endTime}
- User's Working Days: ${workingDays.join(", ")}
- User Currently Available: ${isAvailable ? "Yes" : "No"}
- Response Delay Setting: ${userAvailability.responseDelayMinutes || 0} minutes

IMPORTANT: ${!isAvailable 
        ? `The user is currently outside their availability window. Acknowledge this politely and indicate when they can expect a full response (during their working hours).` 
        : `The user is currently available during their working hours.`
      }
`;
    }
    
    const prompt = `You are a helpful IT support assistant. Generate a friendly, professional auto-reply for a support ticket.

Ticket Details:
- Subject: ${ticket.subject}
- Issue Type: ${ticket.issueType}
- Location: ${ticket.location}
- Description: ${ticket.description}

User's Feedback: ${comment.content}
${availabilityContext}

Requirements:
1. Acknowledge receipt of their feedback
2. Reassure them their ticket is being reviewed
3. Be concise (2-3 sentences max)
4. Professional but friendly tone
5. If the user is not currently available, indicate when they can expect a response

Generate the response:`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 256,
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    console.log("Gemini API response unexpected:", data);
    return buildDefaultReply(ticket, issueTypeResponse);
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return buildDefaultReply(ticket, ISSUE_RESPONSES[ticket.issueType] || ISSUE_RESPONSES.OTHER);
  }
}

function buildDefaultReply(ticket, issueTypeResponse) {
  const personalized = issueTypeResponse || ISSUE_RESPONSES.OTHER;
  return `${DEFAULT_AUTO_REPLY} ${personalized}`;
}

export async function generateOnDemandReply(ticket, comment, customPrompt, userAvailability = null) {
  try {
    let availabilityContext = "";
    
    if (userAvailability) {
      const timezone = userAvailability.timezone || "UTC";
      const now = new Date();
      const userTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const currentDay = dayNames[userTime.getDay()];
      const currentTime = `${String(userTime.getHours()).padStart(2, '0')}:${String(userTime.getMinutes()).padStart(2, '0')}`;
      const workingDays = userAvailability.workingDays || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const isWorkingDay = workingDays.includes(currentDay);
      const startTime = userAvailability.workingHoursStart || "09:00";
      const endTime = userAvailability.workingHoursEnd || "17:00";
      const isWithinWorkingHours = currentTime >= startTime && currentTime <= endTime;
      const isAvailable = isWorkingDay && isWithinWorkingHours;
      
      availabilityContext = `
User Availability Context:
- User's Timezone: ${timezone}
- User's Current Time: ${currentTime} (${currentDay})
- User's Working Hours: ${startTime} - ${endTime}
- User's Working Days: ${workingDays.join(", ")}
- User Currently Available: ${isAvailable ? "Yes" : "No"}
- Response Delay Setting: ${userAvailability.responseDelayMinutes || 0} minutes
- Preferred Contact Time: ${userAvailability.preferredContactTime || "business-hours"}

IMPORTANT: ${!isAvailable 
        ? `The user is currently outside their availability window. Acknowledge their availability preferences and provide a response that respects their working hours. Do NOT promise immediate responses. Suggest when they can expect a response.` 
        : `The user is currently available. Acknowledge their current availability status.`
      }
`;
    }

    const prompt = customPrompt || `You are a helpful IT support assistant. Generate a helpful response to the user's comment on this ticket.

Ticket:
- Subject: ${ticket.subject}
- Issue Type: ${ticket.issueType}
- Description: ${ticket.description}

User's Comment: ${comment.content}
${availabilityContext}

Generate a helpful, professional response that respects the user's availability preferences.`;

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 512,
        }
      })
    });

    const data = await response.json();
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    if (userAvailability && !userAvailability.autoResponseEnabled) {
      return "Thank you for your comment. Our team is reviewing your ticket and will respond during your availability window.";
    }
    return "Thank you for your comment. Our team is reviewing your ticket and will respond shortly.";
    
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Thank you for your comment. Our team is reviewing your ticket and will respond shortly.";
  }
}

export async function generateChatResponse({ message, ticketContext, userRole, userName, isFirstMessage = false, images = [] }) {
  try {
    console.log("generateChatResponse called");
    console.log("Message:", message?.substring(0, 100));
    console.log("Images count:", images?.length || 0);
    console.log("First image mimeType:", images?.[0]?.mimeType);
    
    let ticketInfo = "";
    if (ticketContext) {
      ticketInfo = `
User's Current Ticket Context (for reference if relevant):
- Ticket ID: ${ticketContext.ticketId || "N/A"}
- Subject: ${ticketContext.subject || "N/A"}
- Status: ${ticketContext.status || "N/A"}
- Priority: ${ticketContext.priority || "N/A"}
- Description: ${ticketContext.description || "N/A"}
- Issue Type: ${ticketContext.issueType || "N/A"}
`;
    }

    const titlePrompt = isFirstMessage ? `
IMPORTANT: This is the FIRST message in a new conversation. You must also generate a short, descriptive title (max 5 words) for this conversation based on the user's question. 

Format your response exactly like this:
[TITLE: Your generated title here]
---
Your actual response here...
` : "";

    const imageInstructions = images && images.length > 0 ? `
IMAGES UPLOADED: The user has uploaded ${images.length} image(s) and wants you to analyze them.

CRITICAL - OCR AND ANALYSIS REQUIREMENTS:
==========================================
You MUST do the following for EACH uploaded image:

1. **OPTICAL CHARACTER RECOGNITION (OCR):**
   - Extract ALL text visible in the image
   - Read any labels, buttons, menus, error messages
   - Identify any written or printed text
   - Note: Even partial text may be important

2. **VISUAL CONTENT ANALYSIS:**
   - Describe what you see in the image (UI, diagram, photo, document)
   - Identify any logos, icons, or visual elements
   - Note colors, layout, and visual patterns

3. **CONTEXT UNDERSTANDING:**
   - If it's a screenshot: What application/website is shown?
   - If it's a diagram: What does it represent?
   - If it's a document: What type (invoice, form, receipt)?
   - If it's a photo: What's the subject matter?

4. **PROBLEM IDENTIFICATION (if applicable):**
   - What issue might the user be experiencing?
   - What error messages or warnings do you see?
   - What action might the user need to take?

5. **ACTIONABLE RESPONSE:**
   - Summarize what you found in the image(s)
   - Provide specific solutions or next steps based on the image content
   - If you can't determine something, state what you need to know

Image handling:
- Examine each image carefully and thoroughly
- Cross-reference information across multiple images if applicable
- Provide detailed, helpful analysis
` : "";

    const prompt = `You are SolEase AI Assistant - an intelligent AI support assistant with deep knowledge in IT, software, hardware, networking, cybersecurity, and general problem-solving.

About SOLEASE (if relevant):
- SOLEASE is an AI-native helpdesk platform with native MCP (Model Context Protocol) integration
- It empowers autonomous AI agents to resolve tickets, execute workflows, and collaborate with teams
- Features include: Intelligent Helpdesk, AI-Powered Triage, Workflow Automation, Analytics Dashboard
- The platform serves three user roles: Manager, Reviewer, and Client
- Users can create tickets, track progress, get AI assistance, and access the knowledge base

User Information:
- Name: ${userName}
- Role: ${userRole}
${ticketInfo}

${imageInstructions}

IMPORTANT - Your Core Capabilities:
You are a GENERAL PURPOSE AI assistant that can help with ANY problem or question. You are not limited to just SOLEASE platform questions. You can help with:

1. **Technical Troubleshooting** - Hardware, software, networks, operating systems, connectivity, etc.
2. **Programming & Development** - Code help, debugging, best practices, architecture decisions
3. **IT & Infrastructure** - Server issues, cloud services, database problems, security concerns
4. **General Problem Solving** - Any question, task, or issue the user presents
5. **Step-by-Step Guidance** - Break down complex problems into manageable steps
6. **Knowledge & Learning** - Explain concepts, teach new topics, provide tutorials
7. **Decision Making** - Help analyze options and recommend solutions
8. **Creative Problem Solving** - Think outside the box for novel solutions

Your Approach:
- Analyze the user's question/problem thoroughly
- Ask clarifying questions if needed to better understand the issue
- Provide detailed, accurate, and practical solutions
- When troubleshooting, use systematic diagnosis methods
- Break complex solutions into clear, numbered steps
- Provide code examples when relevant
- Suggest multiple approaches when applicable
- Be honest about limitations - if you don't know something, say so

Response Guidelines:
- Keep responses comprehensive but focused
- Use clear, simple language
- When troubleshooting, ask one question at a time to narrow down the issue
- If providing steps, number them clearly and explain the reasoning
- If the issue relates to their ticket, reference the ticket ID
- Adapt your response level to the user's apparent expertise
- Be patient and thorough - don't assume knowledge

${titlePrompt}
User's Question/Problem: ${message}

Provide the most helpful response you can:`;

    // Build parts array for Gemini - text + images
    const parts = [{ text: prompt }];
    
    // Add images if provided
    if (images && images.length > 0) {
      console.log("=== BUILDING GEMINI REQUEST ===");
      console.log("Images to send to Gemini:", images.length);
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        console.log(`Image ${i + 1}:`);
        console.log(`  - mimeType: ${img.mimeType}`);
        console.log(`  - base64 length: ${img.base64?.length || 0}`);
        console.log(`  - first 50 chars: ${img.base64?.substring(0, 50)}`);
        
        parts.push({
          inlineData: {
            mimeType: img.mimeType || "image/jpeg",
            data: img.base64
          }
        });
      }
    }

    console.log("Sending request to Gemini API...");
    console.log("Total parts in request:", parts.length);

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: parts
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096,
        }
      })
    });

    console.log("Gemini response status:", response.status);
    
    const data = await response.json();
    console.log("Gemini response keys:", Object.keys(data));
    
    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      let responseText = data.candidates[0].content.parts[0].text;
      
      if (isFirstMessage) {
        const titleMatch = responseText.match(/\[TITLE:\s*(.*?)\]/i);
        if (titleMatch) {
          const generatedTitle = titleMatch[1].trim();
          responseText = responseText.replace(/\[TITLE:.*?\]\s*---/i, "").trim();
          return { response: responseText, title: generatedTitle };
        }
      }
      
      return responseText;
    }
    
    console.log("Gemini API response unexpected for chat:", data);
    return "I'm having trouble processing your request right now. Please try again or contact our support team.";
    
  } catch (error) {
    console.error("Error calling Gemini API for chat:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please try again in a moment.";
  }
}