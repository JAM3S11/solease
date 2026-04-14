import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + GEMINI_API_KEY;

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