import React from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import katex from "katex";

// Direct KaTeX renderer — bypasses react-markdown/prose pipeline entirely.
// Root fix for formula duplication: react-markdown@10 + remark-math@6
// emits both a raw-text paragraph AND a rendered math node inside the prose div.
function FormulaBlock({ latex }) {
  let html = "";
  try {
    html = katex.renderToString(latex.trim(), {
      displayMode: true,
      throwOnError: false,
      output: "html",
      trust: false,
    });
  } catch (_) {
    return (
      <div className="formula-box" style={{ color: "#174A9C", fontSize: "1.1rem" }}>
        <MarkdownRenderer content={latex} />
      </div>
    );
  }
  return (
    <div
      className="formula-box math-typography"
      style={{ color: "#1a1a1a" }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Deterministic helpers — same slide number always produces same result
function getStickyRotation(n) {
  const r = [-1.5, 1.2, -0.8, 1.8, -1.1, 0.9, -1.6, 1.4];
  return r[n % r.length];
}
function getStickyColor(n) {
  const c = ["#F5D76E", "#B5D5F5", "#F9C0C0", "#E8F0C8"];
  return c[n % c.length];
}
function getStickyPosition(n, variant) {
  // Deterministic positions that avoid covering content based on layout variant
  if (variant === "text-heavy") {
    // Pushed to bottom right to avoid dense text
    return { bottom: "-10px", right: "20px" };
  } else if (variant === "formula-heavy") {
    // Pushed to bottom left to avoid centered formula boxes
    return { bottom: "10px", left: "15px" };
  } else if (variant === "diagram") {
    // Top right margin, typically empty for diagrams
    return { top: "40px", right: "-10px" };
  } else {
    // Balanced: alternate left/right in lower region
    return n % 2 === 0 ? { bottom: "25px", right: "15px" } : { bottom: "35px", left: "15px" };
  }
}
function getLayoutVariant(slide) {
  const hasF = slide.formulas && slide.formulas.length > 0;
  const hasD = !!slide.figure;
  const b    = slide.bullets ? slide.bullets.length : 0;
  if (hasD && !hasF)  return "diagram";
  if (hasF && b <= 2) return "formula-heavy";
  if (b >= 5)         return "text-heavy";
  return "balanced";
}

export default function NotebookPage({ slide, lecture, isFlipped, zIndex, isVisualClone = false }) {
  const stickyRot   = getStickyRotation(slide.slide_number);
  const stickyColor = getStickyColor(slide.slide_number);
  const variant     = getLayoutVariant(slide);
  const stickyPos   = getStickyPosition(slide.slide_number, variant);
  const bodySize    =
    variant === "text-heavy"    ? "1.2rem" :
    variant === "formula-heavy" ? "1.3rem" : "1.35rem";

  return (
    <div
      className={`page-container ${isFlipped ? "page-flipped" : ""}`}
      style={{ zIndex, pointerEvents: isVisualClone ? "none" : "auto" }}
    >
      {/* FRONT FACE */}
      <div className="page-face page-front notebook-paper" style={{ overflow: "visible" }}>

        {/* Left red margin line */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "46px",
          width: "1.5px", background: "rgba(210,60,60,0.30)",
          pointerEvents: "none", zIndex: 1
        }} />

        {/* SCROLLABLE CONTENT — sticky note is NOT inside this */}
        <div
          className={isVisualClone ? "" : "custom-scrollbar"}
          style={{
            position: "absolute", inset: 0,
            overflowY: isVisualClone ? "hidden" : "auto",
            overflowX: "hidden",
          }}
        >
          <div style={{
            paddingLeft: "58px", paddingRight: "22px",
            paddingTop: "16px",
            paddingBottom: slide.notes ? "150px" : "32px",
            minHeight: "100%", boxSizing: "border-box",
          }}>

            {/* Page label */}
            <div className="handwritten-blue" style={{ textAlign: "right", marginBottom: "4px", opacity: 0.7 }}>
              Wk {lecture.week} · pg {slide.slide_number}
            </div>

            {/* Title */}
            <h2
              className="handwritten-text"
              style={{
                fontSize: variant === "text-heavy" ? "2.2rem" : "2.6rem",
                fontWeight: 600, color: "#1a1a1a",
                lineHeight: 1.2, marginBottom: 0,
              }}
            >
              {slide.title}
            </h2>

            {/* Hand-drawn underline */}
            <div style={{
              height: "2px",
              background: "linear-gradient(to right, #174A9C 65%, transparent)",
              opacity: 0.45, marginTop: "6px",
              marginBottom: variant === "formula-heavy" ? "14px" : "20px",
              transform: "rotate(-0.2deg)", transformOrigin: "left center",
              borderRadius: "1px",
            }} />

            {/* Content blocks */}
            <div style={{ display: "flex", flexDirection: "column", gap: variant === "formula-heavy" ? "14px" : "20px" }}>

              {/* Bullets */}
              {slide.bullets && slide.bullets.length > 0 && (
                <ul style={{
                  listStyle: "none", padding: 0, margin: 0,
                  display: "flex", flexDirection: "column", gap: "8px",
                }}>
                  {slide.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="handwritten-text" style={{ display: "flex", gap: "12px", fontSize: "1.3rem", lineHeight: 1.6 }}>
                      <span style={{ color: "#1a1a1a", flexShrink: 0, marginTop: "2px" }}>•</span>
                      <span style={{ flex: 1 }} className="math-typography"><MarkdownRenderer content={bullet} /></span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Figure */}
              {slide.figure && (
                <div style={{
                  border: "1.5px dashed rgba(23,74,156,0.28)", borderRadius: "2px",
                  background: "rgba(248,243,236,0.6)",
                  padding: variant === "diagram" ? "28px 20px" : "14px 18px",
                }}>
                  <p className="handwritten-text" style={{
                    color: "#1a1a1a",
                    fontSize: variant === "diagram" ? "1.2rem" : "1.1rem",
                    lineHeight: 1.5, textAlign: "center", fontStyle: "italic", margin: 0,
                  }}>
                    [ {slide.figure.description} ]
                  </p>
                </div>
              )}

              {/* Formulas — exactly one FormulaBlock per formula, no duplication */}
              {slide.formulas && slide.formulas.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
                  {slide.formulas.map((f, fIdx) => (
                    <FormulaBlock key={fIdx} latex={f} />
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>

        {/* STICKY NOTE — absolute sibling of scroll area, child of page-face.
            page-face overflow:hidden keeps it inside the page boundary.
            scroll area overflow:auto cannot clip it because it's outside that element. */}
        {slide.notes && (
          <div style={{
            position: "absolute", ...stickyPos,
            zIndex: 30,
            pointerEvents: isVisualClone ? "none" : "auto",
            overflow: "visible",
          }}>
            {/* Tape */}
            <div className="tape-strip" style={{
              position: "absolute", top: "-11px", left: "50%",
              transform: `translateX(-50%) rotate(${-stickyRot * 1.1}deg)`,
              width: "2.2rem", height: "0.95rem", borderRadius: "1px", zIndex: 5,
            }} />
            {/* Note */}
            <div className="sticky-note-physical" style={{
              backgroundColor: stickyColor,
              padding: "16px 20px 20px",
              transform: `rotate(${stickyRot}deg)`,
              maxWidth: "260px", minWidth: "160px",
              borderRadius: "1px", position: "relative",
            }}>
              <p className="handwritten-text" style={{
                fontSize: "1.3rem", color: "#1a1a1a",
                lineHeight: 1.5, whiteSpace: "pre-wrap", margin: 0,
              }}>
                {slide.notes}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* BACK FACE — warm paper underside */}
      <div
        className="page-face page-back"
        style={{
          background: "#EDE0CB",
          backgroundImage: "linear-gradient(rgba(150,120,85,0.14) 1px, transparent 1px)",
          backgroundSize: "100% 30px",
        }}
      >
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0, width: "10px",
          background: "linear-gradient(to left, rgba(0,0,0,0.07), transparent)",
        }} />
      </div>
    </div>
  );
}
