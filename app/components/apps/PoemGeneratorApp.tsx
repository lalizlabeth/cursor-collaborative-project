"use client";

import { useState } from "react";

type PoemType = "sonnet" | "haiku" | "limerick";

interface WordInput {
  label: string;
  placeholder: string;
  key: string;
}

interface PoemTemplate {
  name: string;
  description: string;
  inputs: WordInput[];
  template: (words: Record<string, string>) => string[];
}

const poemTemplates: Record<PoemType, PoemTemplate> = {
  sonnet: {
    name: "Sonnet",
    description: "A 14-line poem with elegant rhyme",
    inputs: [
      { label: "Adjective", placeholder: "beautiful", key: "adj1" },
      { label: "Noun", placeholder: "moonlight", key: "noun1" },
      { label: "Verb (present)", placeholder: "dance", key: "verb1" },
      { label: "Adverb", placeholder: "gently", key: "adverb1" },
      { label: "Noun (plural)", placeholder: "dreams", key: "noun2" },
      { label: "Adjective", placeholder: "golden", key: "adj2" },
    ],
    template: (w) => [
      `Shall I compare thee to a ${w.adj1} day?`,
      `Thou art more lovely like the ${w.noun1} bright,`,
      `And ${w.noun2} do ${w.verb1} in their ${w.adj2} way,`,
      `While stars above ${w.adverb1} share their light.`,
      ``,
      `Sometimes too hot the eye of heaven shines,`,
      `And often is his ${w.adj1} complexion dimm'd;`,
      `But thy eternal ${w.noun1} never declines,`,
      `Nor lose possession of that fair thou own'st.`,
      ``,
      `So long as hearts can ${w.verb1} or eyes can see,`,
      `So long lives this, and this gives life to thee.`,
    ],
  },
  haiku: {
    name: "Haiku",
    description: "A Japanese poem with 5-7-5 syllables",
    inputs: [
      { label: "Adjective", placeholder: "ancient", key: "adj1" },
      { label: "Noun", placeholder: "pond", key: "noun1" },
      { label: "Animal", placeholder: "frog", key: "animal" },
      { label: "Verb (present)", placeholder: "leaps", key: "verb1" },
    ],
    template: (w) => [
      `An ${w.adj1} ${w.noun1} still—`,
      `A ${w.animal} ${w.verb1} into it,`,
      `The sound of water.`,
    ],
  },
  limerick: {
    name: "Limerick",
    description: "A humorous five-line poem",
    inputs: [
      { label: "Place", placeholder: "Nantucket", key: "place" },
      { label: "Person's Name", placeholder: "Lou", key: "name" },
      { label: "Adjective", placeholder: "peculiar", key: "adj1" },
      { label: "Noun", placeholder: "shoe", key: "noun1" },
      { label: "Verb (past)", placeholder: "flew", key: "verb1" },
    ],
    template: (w) => [
      `There once was a person from ${w.place},`,
      `Whose friend was named ${w.name}, what a case!`,
      `They found a ${w.adj1} ${w.noun1},`,
      `That suddenly ${w.verb1},`,
      `And left them with smiles on their face.`,
    ],
  },
};

export function PoemGeneratorApp() {
  const [selectedType, setSelectedType] = useState<PoemType>("haiku");
  const [words, setWords] = useState<Record<string, string>>({});
  const [generatedPoem, setGeneratedPoem] = useState<string[] | null>(null);

  const currentTemplate = poemTemplates[selectedType];

  const handleInputChange = (key: string, value: string) => {
    setWords((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    const filledWords: Record<string, string> = {};
    currentTemplate.inputs.forEach((input) => {
      filledWords[input.key] = words[input.key] || input.placeholder;
    });
    setGeneratedPoem(currentTemplate.template(filledWords));
  };

  const handleReset = () => {
    setWords({});
    setGeneratedPoem(null);
  };

  const handleTypeChange = (type: PoemType) => {
    setSelectedType(type);
    setWords({});
    setGeneratedPoem(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "100%", padding: 8 }}>
      {/* Poem Type Selector */}
      <div style={{ display: "flex", gap: 8 }}>
        {(Object.keys(poemTemplates) as PoemType[]).map((type) => (
          <button
            key={type}
            onClick={() => handleTypeChange(type)}
            style={{
              flex: 1,
              padding: "10px 12px",
              border: selectedType === type ? "2px solid var(--pastel-lavender)" : "1px solid rgba(0,0,0,0.1)",
              borderRadius: 8,
              background: selectedType === type ? "var(--pastel-lavender)" : "rgba(0,0,0,0.02)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: selectedType === type ? 600 : 400,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 14 }}>{poemTemplates[type].name}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
              {poemTemplates[type].description}
            </div>
          </button>
        ))}
      </div>

      {/* Word Inputs */}
      {!generatedPoem && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
            flex: 1,
            alignContent: "start",
          }}
        >
          {currentTemplate.inputs.map((input) => (
            <div key={input.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(0,0,0,0.7)",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {input.label}
              </label>
              <input
                type="text"
                placeholder={input.placeholder}
                value={words[input.key] || ""}
                onChange={(e) => handleInputChange(input.key, e.target.value)}
                style={{
                  padding: "10px 12px",
                  border: "1px solid rgba(0,0,0,0.15)",
                  borderRadius: 6,
                  fontSize: 14,
                  fontFamily: "inherit",
                  background: "white",
                  transition: "border-color 0.2s ease",
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Generated Poem Display */}
      {generatedPoem && (
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, var(--pastel-peach) 0%, var(--pastel-pink) 100%)",
            borderRadius: 12,
            padding: 20,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            overflow: "auto",
          }}
        >
          <div
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 16,
              lineHeight: 1.8,
              color: "rgba(0,0,0,0.85)",
              maxWidth: "100%",
            }}
          >
            {generatedPoem.map((line, index) => (
              <div key={index} style={{ minHeight: line ? "auto" : "1em" }}>
                {line || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        {!generatedPoem ? (
          <button
            onClick={handleGenerate}
            style={{
              flex: 1,
              padding: "12px 16px",
              border: "none",
              borderRadius: 8,
              background: "linear-gradient(135deg, var(--pastel-mint) 0%, var(--pastel-blue) 100%)",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 600,
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            ✨ Generate Poem
          </button>
        ) : (
          <>
            <button
              onClick={handleReset}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "1px solid rgba(0,0,0,0.15)",
                borderRadius: 8,
                background: "white",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Start Over
            </button>
            <button
              onClick={() => setGeneratedPoem(null)}
              style={{
                flex: 1,
                padding: "12px 16px",
                border: "none",
                borderRadius: 8,
                background: "linear-gradient(135deg, var(--pastel-yellow) 0%, var(--pastel-peach) 100%)",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Edit Words
            </button>
          </>
        )}
      </div>
    </div>
  );
}
