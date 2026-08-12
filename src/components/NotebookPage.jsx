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
      <div className="formula-box" style={{ color: "#555", fontFamily: "monospace", fontSize: "0.8rem" }}>
        {latex}
      </div>
    );
  }
  return (
    <div
      className="formula-box"
      style={{ color: "#174A9C" }}
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
function getStickyPosition(n) {
  const p = [
    { bottom: "28px", right: "18px" },
    { top: "100px",  right: "14px" },
    { bottom: "28px", left: "20px" },
    { top: "130px",  right: "18px" },
    { bottom: "50px", right: "20px" },
    { top: "90px",   left: "20px"  },
  ];
  return p[n % p.length];
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
  const stickyPos   = getStickyPosition(slide.slide_number);
  const variant     = getLayoutVariant(slide);
  const bodySize    =
    variant === "text-heavy"    ? "1.2rem" :
    variant === "formula-heavy" ? "1.3rem" : "1.35rem";

  return (
    <div
      className={`page-container ${isFlipped ? "page-flipped" : ""}`}
      style={{ zIndex, pointerEvents: isVisualClone ? "none" : "auto" }}
    >
      {/* FRONT FACE */}
      <div className="page-face page-front notebook-paper">

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
                fontSize: variant === "text-heavy" ? "1.75rem" : "2.1rem",
                fontWeight: 700, color: "#1a1a1a",
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
                    <li key={bIdx} className="handwritten-text" style={{ display: "flex", gap: "10px", fontSize: bodySize, lineHeight: 1.65 }}>
                      <span style={{ color: "#174A9C", fontWeight: 700, flexShrink: 0, marginTop: "1px" }}>—</span>
                      <span style={{ flex: 1 }}><MarkdownRenderer content={bullet} /></span>
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
                    color: "#174A9C",
                    fontSize: variant === "diagram" ? "1.05rem" : "0.9rem",
                    lineHeight: 1.55, textAlign: "center", fontStyle: "italic", margin: 0,
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
              padding: "12px 14px 14px",
              transform: `rotate(${stickyRot}deg)`,
              maxWidth: "230px", minWidth: "140px",
              borderRadius: "1px", position: "relative",
            }}>
              <p className="handwritten-text" style={{
                fontSize: "1.05rem", color: "#1a1200",
                lineHeight: 1.55, whiteSpace: "pre-wrap", margin: 0,
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
