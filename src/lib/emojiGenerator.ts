import { MoodType, StyleType } from "@/types/emoji"

export function generateEmojiSvg(prompt: string, style: StyleType, mood: MoodType): { svg: string, bgColor: string } {
  const p = prompt.toLowerCase()
  let theme = "general"
  if (p.includes("coffee") || p.includes("tea") || p.includes("latte") || p.includes("caffeine") || p.includes("mug")) theme = "coffee"
  else if (p.includes("laptop") || p.includes("code") || p.includes("bug") || p.includes("dev") || p.includes("computer")) theme = "tech"
  else if (p.includes("meeting") || p.includes("call") || p.includes("zoom") || p.includes("chat") || p.includes("talk")) theme = "communication"
  else if (p.includes("rocket") || p.includes("launch") || p.includes("ship") || p.includes("goal") || p.includes("target")) theme = "success"
  else if (p.includes("brain") || p.includes("idea") || p.includes("think") || p.includes("lightbulb") || p.includes("plan")) theme = "idea"
  else if (p.includes("cat") || p.includes("dog") || p.includes("mascot") || p.includes("pet") || p.includes("animal")) theme = "mascot"
  else if (p.includes("deadline") || p.includes("urgent") || p.includes("time") || p.includes("clock") || p.includes("late")) theme = "time"
  else if (p.includes("party") || p.includes("celebrate") || p.includes("win") || p.includes("kudos") || p.includes("cheer")) theme = "party"

  // Mood color accents
  let moodColor = "#10B981" // Happy - Emerald
  let eyeShape = `<circle cx="35" cy="40" r="6" fill="#1E293B"/><circle cx="65" cy="40" r="6" fill="#1E293B"/><circle cx="37" cy="38" r="2" fill="#FFFFFF"/><circle cx="67" cy="38" r="2" fill="#FFFFFF"/>`
  let mouthShape = `<path d="M 35 60 Q 50 75 65 60" fill="none" stroke="#1E293B" stroke-width="6" stroke-linecap="round"/>`

  if (mood === "Happy") {
    moodColor = "#10B981"
    mouthShape = `<path d="M 35 58 Q 50 75 65 58 Z" fill="#EF4444" stroke="#1E293B" stroke-width="4"/><path d="M 40 58 Q 50 68 60 58 Z" fill="#FFFFFF"/>`
  } else if (mood === "Tired") {
    moodColor = "#64748B"
    eyeShape = `<path d="M 30 42 Q 37 38 42 42" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/><path d="M 58 42 Q 65 38 70 42" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/><path d="M 30 48 L 40 48 M 60 48 L 70 48" stroke="#38BDF8" stroke-width="3"/>`
    mouthShape = `<path d="M 40 65 Q 50 60 60 65" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>`
  } else if (mood === "Confused") {
    moodColor = "#F59E0B"
    eyeShape = `<circle cx="35" cy="40" r="7" fill="#1E293B"/><circle cx="65" cy="40" r="4" fill="#1E293B"/><path d="M 60 28 Q 65 20 70 28" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>`
    mouthShape = `<path d="M 38 65 L 62 62" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>`
  } else if (mood === "Celebrate") {
    moodColor = "#8B5CF6"
    eyeShape = `<path d="M 30 40 L 40 34 L 35 44" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/><path d="M 70 40 L 60 34 L 65 44" fill="none" stroke="#1E293B" stroke-width="5" stroke-linecap="round"/>`
    mouthShape = `<path d="M 30 55 Q 50 80 70 55 Z" fill="#EC4899" stroke="#1E293B" stroke-width="4"/>`
  }

  // Base background and style wrappers
  let filterDef = ""
  let borderStroke = ""
  let bgFill = ""

  if (style === "Sticker") {
    filterDef = `<filter id="sticker"><feMorphology operator="dilate" radius="4" in="SourceGraphic" result="THICKNESS"/><feComposite operator="over" in="SourceGraphic" in2="THICKNESS"/></filter>`
    borderStroke = `stroke="#FFFFFF" stroke-width="8"`
  } else if (style === "Doodle") {
    borderStroke = `stroke="#1E293B" stroke-width="5" stroke-dasharray="8 4"`
  } else if (style === "Pixel") {
    borderStroke = `stroke="#000000" stroke-width="4" shape-rendering="crispEdges"`
  }

  // Generate specific theme object SVG
  let innerArt = ""
  let bgColor = "#FEF3C7"

  switch(theme) {
    case "coffee":
      bgColor = "#FEF3C7"
      innerArt = `
        <defs>
          <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#6366F1"/>
            <stop offset="100%" stop-color="#4F46E5"/>
          </linearGradient>
        </defs>
        <!-- Steam -->
        <path d="M40 22 Q45 12 50 22 T60 12" fill="none" stroke="#94A3B8" stroke-width="4" stroke-linecap="round" opacity="0.7" className="animate-pulse"/>
        <!-- Handle -->
        <path d="M 70 35 C 90 35 90 70 70 70" fill="none" stroke="#4F46E5" stroke-width="12" stroke-linecap="round"/>
        <!-- Cup Body -->
        <rect x="20" y="30" width="60" height="55" rx="12" fill="url(#cupGrad)" ${borderStroke}/>
        <ellipse cx="50" cy="30" rx="30" ry="8" fill="#E0E7FF"/>
        <ellipse cx="50" cy="30" rx="25" ry="5" fill="#78350F"/>
        <!-- Face -->
        <g transform="translate(0, 8)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    case "tech":
      bgColor = "#E0F2FE"
      innerArt = `
        <defs>
          <linearGradient id="macGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#CBD5E1"/>
            <stop offset="100%" stop-color="#94A3B8"/>
          </linearGradient>
        </defs>
        <!-- Screen -->
        <rect x="15" y="15" width="70" height="55" rx="6" fill="#0F172A" ${borderStroke}/>
        <rect x="20" y="20" width="60" height="45" rx="3" fill="#1E293B"/>
        <!-- Code lines -->
        <rect x="25" y="25" width="20" height="4" rx="2" fill="#38BDF8"/>
        <rect x="25" y="33" width="35" height="4" rx="2" fill="#A7F3D0"/>
        <rect x="25" y="41" width="15" height="4" rx="2" fill="#F43F5E"/>
        <!-- Base -->
        <path d="M 10 70 L 90 70 L 96 82 L 4 82 Z" fill="url(#macGrad)"/>
        <rect x="42" y="72" width="16" height="4" rx="2" fill="#64748B"/>
        <!-- Face on Screen -->
        <g transform="translate(0, 5)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    case "success":
      bgColor = "#F3E8FF"
      innerArt = `
        <defs>
          <linearGradient id="rocketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#E11D48"/>
          </linearGradient>
        </defs>
        <!-- Fins -->
        <path d="M 25 60 L 12 80 L 30 72 Z" fill="#881337"/>
        <path d="M 75 60 L 88 80 L 70 72 Z" fill="#881337"/>
        <!-- Flame -->
        <polygon points="40,80 50,98 60,80" fill="#F59E0B"/>
        <polygon points="44,80 50,90 56,80" fill="#FEF08A"/>
        <!-- Rocket Body -->
        <path d="M 50 10 Q 25 40 30 80 L 70 80 Q 75 40 50 10 Z" fill="url(#rocketGrad)" ${borderStroke}/>
        <!-- Window / Face -->
        <circle cx="50" cy="45" r="18" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="4"/>
        <g transform="translate(0, -5)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    case "idea":
      bgColor = "#FEF9C3"
      innerArt = `
        <defs>
          <radialGradient id="bulbGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#FDE047"/>
            <stop offset="100%" stop-color="#EAB308"/>
          </radialGradient>
        </defs>
        <!-- Rays -->
        <line x1="50" y1="5" x2="50" y2="12" stroke="#EAB308" stroke-width="4" stroke-linecap="round"/>
        <line x1="15" y1="20" x2="22" y2="27" stroke="#EAB308" stroke-width="4" stroke-linecap="round"/>
        <line x1="85" y1="20" x2="78" y2="27" stroke="#EAB308" stroke-width="4" stroke-linecap="round"/>
        <!-- Bulb Glass -->
        <path d="M 25 40 C 25 15 75 15 75 40 C 75 58 65 65 62 72 L 38 72 C 35 65 25 58 25 40 Z" fill="url(#bulbGrad)" ${borderStroke}/>
        <!-- Base -->
        <rect x="38" y="74" width="24" height="6" rx="2" fill="#94A3B8"/>
        <rect x="40" y="82" width="20" height="6" rx="2" fill="#64748B"/>
        <path d="M 46 90 L 54 90 L 50 96 Z" fill="#334155"/>
        <!-- Face -->
        <g transform="translate(0, 0)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    case "mascot":
      bgColor = "#FFEDD5"
      innerArt = `
        <defs>
          <linearGradient id="catGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FB923C"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
        </defs>
        <!-- Ears -->
        <polygon points="20,45 15,15 40,30" fill="#EA580C" stroke="#7C2D12" stroke-width="3"/>
        <polygon points="22,38 18,22 35,30" fill="#FED7AA"/>
        <polygon points="80,45 85,15 60,30" fill="#EA580C" stroke="#7C2D12" stroke-width="3"/>
        <polygon points="78,38 82,22 65,30" fill="#FED7AA"/>
        <!-- Head Body -->
        <circle cx="50" cy="55" r="35" fill="url(#catGrad)" ${borderStroke}/>
        <!-- Whiskers -->
        <line x1="8" y1="50" x2="22" y2="53" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/>
        <line x1="6" y1="58" x2="20" y2="58" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/>
        <line x1="92" y1="50" x2="78" y2="53" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/>
        <line x1="94" y1="58" x2="80" y2="58" stroke="#7C2D12" stroke-width="3" stroke-linecap="round"/>
        <!-- Headset (Workplace!) -->
        <path d="M 20 50 A 35 35 0 0 1 80 50" fill="none" stroke="#1E293B" stroke-width="6"/>
        <rect x="12" y="40" width="10" height="22" rx="5" fill="#3B82F6"/>
        <rect x="78" y="40" width="10" height="22" rx="5" fill="#3B82F6"/>
        <path d="M 20 55 Q 35 75 45 68" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round"/>
        <circle cx="45" cy="68" r="4" fill="#38BDF8"/>
        <!-- Face -->
        <g transform="translate(0, 10)">
          ${eyeShape}
          <polygon points="47,52 53,52 50,56" fill="#F43F5E"/>
          ${mouthShape}
        </g>
      `
      break
    case "time":
      bgColor = "#FCE7F3"
      innerArt = `
        <defs>
          <linearGradient id="clockGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#BE123C"/>
          </linearGradient>
        </defs>
        <!-- Bells -->
        <path d="M 20 28 A 15 15 0 0 1 40 18" fill="none" stroke="#BE123C" stroke-width="8" stroke-linecap="round"/>
        <path d="M 80 28 A 15 15 0 0 0 60 18" fill="none" stroke="#BE123C" stroke-width="8" stroke-linecap="round"/>
        <!-- Legs -->
        <line x1="28" y1="80" x2="20" y2="92" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
        <line x1="72" y1="80" x2="80" y2="92" stroke="#64748B" stroke-width="8" stroke-linecap="round"/>
        <!-- Clock Body -->
        <circle cx="50" cy="52" r="34" fill="url(#clockGrad)" ${borderStroke}/>
        <circle cx="50" cy="52" r="26" fill="#FFFFFF"/>
        <!-- Ticks -->
        <line x1="50" y1="29" x2="50" y2="33" stroke="#94A3B8" stroke-width="3"/>
        <line x1="70" y1="52" x2="74" y2="52" stroke="#94A3B8" stroke-width="3"/>
        <line x1="50" y1="71" x2="50" y2="75" stroke="#94A3B8" stroke-width="3"/>
        <line x1="26" y1="52" x2="30" y2="52" stroke="#94A3B8" stroke-width="3"/>
        <!-- Face -->
        <g transform="translate(0, 8)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    case "party":
      bgColor = "#ECFCCB"
      innerArt = `
        <defs>
          <linearGradient id="partyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#10B981"/>
            <stop offset="100%" stop-color="#059669"/>
          </linearGradient>
        </defs>
        <!-- Confetti pieces -->
        <circle cx="15" cy="25" r="4" fill="#F43F5E"/>
        <rect x="80" y="20" width="8" height="8" transform="rotate(25 80 20)" fill="#8B5CF6"/>
        <circle cx="85" cy="75" r="5" fill="#EAB308"/>
        <!-- Party Hat -->
        <polygon points="50,10 32,38 68,38" fill="#F59E0B" stroke="#D97706" stroke-width="3"/>
        <circle cx="50" cy="10" r="6" fill="#EF4444"/>
        <!-- Main Face Blob -->
        <circle cx="50" cy="62" r="32" fill="url(#partyGrad)" ${borderStroke}/>
        <g transform="translate(0, 15)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
    default:
      bgColor = "#E2E8F0"
      innerArt = `
        <defs>
          <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#3B82F6"/>
            <stop offset="100%" stop-color="#2563EB"/>
          </linearGradient>
        </defs>
        <!-- General Rounded Square Emoji -->
        <rect x="15" y="15" width="70" height="70" rx="24" fill="url(#genGrad)" ${borderStroke}/>
        <g transform="translate(0, 10)">
          ${eyeShape}
          ${mouthShape}
        </g>
      `
      break
  }

  // Adjust style modifiers
  let styleAdditions = ""
  if (style === "Pixel") {
    // Pixel overlay grid
    styleAdditions = `
      <g opacity="0.15">
        <rect x="10" y="10" width="80" height="80" fill="url(#pixelGrid)"/>
      </g>
      <defs>
        <pattern id="pixelGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#000000" stroke-width="1.5"/>
        </pattern>
      </defs>
    `
  } else if (style === "Doodle") {
    // Hand drawn decorative squiggles
    styleAdditions = `
      <path d="M 12 18 Q 20 12 28 18" fill="none" stroke="#64748B" stroke-width="2"/>
      <path d="M 72 82 Q 80 88 88 82" fill="none" stroke="#64748B" stroke-width="2"/>
    `
  }

  const fullSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
      ${filterDef}
      <g filter="${style === 'Sticker' ? 'url(#sticker)' : ''}">
        ${innerArt}
        ${styleAdditions}
      </g>
    </svg>
  `

  return { svg: fullSvg.trim(), bgColor }
}

export const SAMPLE_EMOJIS = [
  {
    id: "sample-1",
    prompt: "Coffee mug before morning standup",
    style: "Sticker" as StyleType,
    mood: "Tired" as MoodType,
    svgContent: generateEmojiSvg("Coffee mug before morning standup", "Sticker", "Tired").svg,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    bgColor: "#FEF3C7"
  },
  {
    id: "sample-2",
    prompt: "Rocket launch on deployment day",
    style: "Flat" as StyleType,
    mood: "Celebrate" as MoodType,
    svgContent: generateEmojiSvg("Rocket launch on deployment day", "Flat", "Celebrate").svg,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    bgColor: "#F3E8FF"
  },
  {
    id: "sample-3",
    prompt: "Cat wearing headset answering slack calls",
    style: "Mascot" as StyleType,
    mood: "Happy" as MoodType,
    svgContent: generateEmojiSvg("Cat wearing headset answering slack calls", "Mascot", "Happy").svg,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    bgColor: "#FFEDD5"
  },
  {
    id: "sample-4",
    prompt: "Confused laptop debugging production error",
    style: "Pixel" as StyleType,
    mood: "Confused" as MoodType,
    svgContent: generateEmojiSvg("Confused laptop debugging production error", "Pixel", "Confused").svg,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    bgColor: "#E0F2FE"
  },
  {
    id: "sample-5",
    prompt: "Lightbulb brilliant sprint idea",
    style: "Doodle" as StyleType,
    mood: "Happy" as MoodType,
    svgContent: generateEmojiSvg("Lightbulb brilliant sprint idea", "Doodle", "Happy").svg,
    isFavorite: false,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    bgColor: "#FEF9C3"
  },
  {
    id: "sample-6",
    prompt: "Panic alarm clock urgent deadline",
    style: "Sticker" as StyleType,
    mood: "Tired" as MoodType,
    svgContent: generateEmojiSvg("Panic alarm clock urgent deadline", "Sticker", "Tired").svg,
    isFavorite: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    bgColor: "#FCE7F3"
  }
]
