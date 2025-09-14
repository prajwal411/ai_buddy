"use client"

import { useState, useEffect } from "react"

// Mood detection patterns for text analysis
export const useMoodDetection = () => {
  // Mood patterns and their respective scores (1-10) and categories
  const moodPatterns = {
    // Anxiety patterns (medium to high scores)
    anxious: {
      regex: /\b(anxious|anxiety|nervous|worry|worried|panic|stress(ed)?|overwhelm(ed|ing)?|fear(ful)?|scared|terrified|dread|on edge|uneasy|restless|tense)\b/gi,
      score: (matches: RegExpMatchArray | null) => matches ? Math.min(4 + matches.length, 8) : 0,
      category: "anxious"
    },
    
    // Depression patterns (medium to high scores)
    depressed: {
      regex: /\b(depress(ed|ion)?|sad|hopeless|worthless|empty|numb|meaningless|alone|lonely|tired|exhausted|fatigue|no energy|don't care|whatever|pointless|useless|no point|no use)\b/gi,
      score: (matches: RegExpMatchArray | null) => matches ? Math.min(4 + matches.length, 8) : 0,
      category: "sad"
    },
    
    // Panic/crisis patterns (high scores)
    panic: {
      regex: /\b(can't (take|handle|cope|deal)|too much|crisis|emergency|desperate|help me|save me|dying|unbearable|no way out|trapped|suffocating|drowning|explode|breakdown|breaking down|kill|suicid(e|al)|harm(ing)? myself|hurt(ing)? myself|end (it|my life|everything))\b/gi,
      score: (matches: RegExpMatchArray | null) => matches ? Math.min(7 + matches.length, 10) : 0,
      category: "panic"
    },
    
    // Calm/positive patterns (low scores)
    calm: {
      regex: /\b(calm|peaceful|relaxed|content|happy|joy(ful)?|grateful|thankful|appreciate|blessed|good|fine|okay|ok|alright|better|improving|hopeful|positive|optimistic)\b/gi,
      score: (matches: RegExpMatchArray | null) => matches ? Math.max(3 - matches.length, 1) : 5, // Default neutral is 5
      category: "calm"
    }
  }

  // Analyze text and return mood information
  const analyzeMood = (text: string) => {
    let highestScore = 0
    let category = "neutral"
    let emoji = "😐"
    
    // Default neutral if no text
    if (!text || text.trim().length === 0) {
      return { score: 5, category: "neutral", emoji: "😐" }
    }
    
    // Check each pattern category
    Object.entries(moodPatterns).forEach(([key, pattern]) => {
      const matches = text.match(pattern.regex)
      const score = pattern.score(matches)
      
      if (score > highestScore) {
        highestScore = score
        category = pattern.category
      }
    })
    
    // Assign emoji based on category and score
    if (category === "anxious") {
      emoji = highestScore >= 8 ? "😰" : highestScore >= 6 ? "😟" : "😬"
    } else if (category === "sad") {
      emoji = highestScore >= 8 ? "😭" : highestScore >= 6 ? "😢" : "😔"
    } else if (category === "panic") {
      emoji = highestScore >= 9 ? "🆘" : highestScore >= 7 ? "😨" : "😧"
    } else if (category === "calm") {
      emoji = highestScore <= 2 ? "😊" : highestScore <= 3 ? "🙂" : "😌"
    }
    
    return { score: highestScore, category, emoji }
  }
  
  // Detect risk level based on text
  const detectRisk = (text: string) => {
    // High risk patterns
    const highRiskPatterns = [
      /\b(suicid(e|al)|kill (myself|myself|me)|end (my life|it all)|don'?t want to (live|be alive)|can'?t go on|better off dead|no reason to live)\b/gi,
      /\b(harm(ing)? myself|hurt(ing)? myself|self harm|cut(ting)? myself|injur(e|ing) myself)\b/gi,
      /\b(plan(ned|ning) to (die|end))\b/gi
    ]
    
    // Medium risk patterns
    const mediumRiskPatterns = [
      /\b(want to die|wish I was dead|rather not be here|rather not exist|no hope|hopeless|can'?t see a future|everything is pointless)\b/gi,
      /\b(no one (cares|would notice|would mind)|nobody (cares|would notice|would mind))\b/gi
    ]
    
    // Check for high risk
    for (const pattern of highRiskPatterns) {
      if (pattern.test(text)) {
        return "high"
      }
    }
    
    // Check for medium risk
    for (const pattern of mediumRiskPatterns) {
      if (pattern.test(text)) {
        return "medium"
      }
    }
    
    // Check if general mood score is high enough to be concerning
    const { score, category } = analyzeMood(text)
    if ((category === "sad" || category === "panic") && score >= 8) {
      return "medium"
    }
    
    return "low"
  }
  
  return { analyzeMood, detectRisk }
}

export default useMoodDetection
