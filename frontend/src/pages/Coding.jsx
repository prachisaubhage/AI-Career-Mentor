import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getCurrentUserEmail, getCodingStats, saveCodingStats } from "../utils/auth";
import { API_ENDPOINTS } from "../utils/api";

function Coding() {
  const email = getCurrentUserEmail();
  const token = localStorage.getItem("careerMentorToken");

  // Local fallback stats
  const localStats = getCodingStats(email);
  const [stats, setStats] = useState(localStats);

  // Problem bank & selection state
  const [problems, setProblems] = useState([]);
  const [loadingProblems, setLoadingProblems] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeProblem, setActiveProblem] = useState(null);

  // Editor and submission state
  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showHints, setShowHints] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch real statistics from MongoDB backend on mount
  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const res = await fetch(API_ENDPOINTS.CODING.STATS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.stats) {
            setStats(data.stats);
            saveCodingStats(email, data.stats);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote coding stats, using local cache:", err.message);
      }
    }
    fetchStats();
  }, [token, email]);

  // Fetch problem bank
  const fetchProblems = async () => {
    setLoadingProblems(true);
    setErrorMsg("");
    try {
      const res = await fetch(API_ENDPOINTS.CODING.PROBLEMS, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to load coding problem bank.");
      const data = await res.json();
      if (data && Array.isArray(data.problems)) {
        setProblems(data.problems);
      }
    } catch (err) {
      console.error("Error loading coding problems:", err);
      setErrorMsg(err.message || "Could not load coding problems. Please try again.");
    } finally {
      setLoadingProblems(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [token]);

  // Blank/template starters per language — no completed solutions are shown
  const getBlankStarter = (prob, lang) => {
    if (!prob) return "";
    // Use language-specific template if provided in the problem data
    const templates = prob.starterTemplate || {};
    if (templates[lang]) return templates[lang];
    // Fallback minimal templates
    if (lang === "cpp") {
      return `#include <bits/stdc++.h>\nusing namespace std;\n\n// Implement your solution below\n\nint main() {\n    // Test your solution here\n    return 0;\n}`;
    }
    if (lang === "c") {
      return `#include <stdio.h>\n#include <stdlib.h>\n\n// Implement your solution below\n\nint main() {\n    // Test your solution here\n    return 0;\n}`;
    }
    if (lang === "python") {
      return `# Write your solution below\n\ndef solution():\n    pass\n`;
    }
    // javascript
    return `// Write your solution below\n\nfunction solution() {\n  \n}\n`;
  };

  // Select problem to solve
  const handleSelectProblem = (prob) => {
    setActiveProblem(prob);
    setSubmissionResult(null);
    setShowHints(false);
    setErrorMsg("");
    // Always start with a blank/template — never a completed solution
    setCode(getBlankStarter(prob, language));
  };

  // Change language — update template, do not replace user code unexpectedly
  const handleLanguageChange = (newLang) => {
    const oldLang = language;
    setLanguage(newLang);
    // Only reset editor if switching FROM a language whose template is still showing
    // (i.e., user has not typed anything beyond the initial template)
    const currentTemplate = getBlankStarter(activeProblem, oldLang);
    if (!code || code.trim() === currentTemplate.trim() || code.trim() === "") {
      setCode(getBlankStarter(activeProblem, newLang));
    }
    setSubmissionResult(null);
  };

  // Submit solution to backend
  const handleSubmitCode = async () => {
    if (!activeProblem || !code.trim()) return;
    setSubmitting(true);
    setErrorMsg("");
    setSubmissionResult(null);

    try {
      const res = await fetch(API_ENDPOINTS.CODING.SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          problemId: activeProblem.id,
          code,
          language,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to evaluate code. Please check your submission and try again.");
      }

      const data = await res.json();
      if (data && data.success) {
        setSubmissionResult(data);
        if (data.stats) {
          setStats(data.stats);
          saveCodingStats(email, data.stats);
        }
      } else {
        throw new Error(data.message || "Failed to evaluate code.");
      }
    } catch (err) {
      console.error("Code evaluation error:", err);
      setErrorMsg(err.message || "Failed to run test cases. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const accuracy =
    stats && stats.attempted > 0 ? Math.round(((stats.solved || 0) / stats.attempted) * 100) : 0;

  // Filter problems by topic and difficulty safely
  const filteredProblems = Array.isArray(problems)
    ? problems.filter((p) => {
        if (!p) return false;
        const topic = p.topic || "";
        const diff = p.difficulty || "";
        const matchTopic = selectedTopic === "All" || topic.toLowerCase() === selectedTopic.toLowerCase();
        const matchDiff = selectedDifficulty === "All" || diff.toLowerCase() === selectedDifficulty.toLowerCase();
        return matchTopic && matchDiff;
      })
    : [];

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">BASE PAPER MODULE</p>
          <h1>Coding Practice</h1>
          <p>Technical problem-solving and coding preparation.</p>
        </div>
      </div>

      {/* OVERALL STATS */}
      <div className="dashboard-card">
        <div className="card-heading">
          <div>
            <h3>Your Coding Statistics</h3>
            <p>Actual activity — resets only when you solve or attempt problems</p>
          </div>
          <span className="score-pill">{accuracy}%</span>
        </div>

        <div className="coding-stats">
          <div>
            <strong id="coding-solved-count">{stats?.solved ?? 0}</strong>
            <span>Problems Solved</span>
          </div>

          <div>
            <strong id="coding-attempted-count">{stats?.attempted ?? 0}</strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>{accuracy}%</strong>
            <span>Accuracy</span>
          </div>

          <div>
            <strong style={{ color: "#10b981" }}>{stats?.easy ?? 0}</strong>
            <span>Easy</span>
          </div>

          <div>
            <strong style={{ color: "#f59e0b" }}>{stats?.medium ?? 0}</strong>
            <span>Medium</span>
          </div>

          <div>
            <strong style={{ color: "#ef4444" }}>{stats?.hard ?? 0}</strong>
            <span>Hard</span>
          </div>
        </div>

        {(!stats || stats.attempted === 0) && (
          <p className="zero-stat-note">
            No coding attempts yet. Start coding practice to track your performance.
          </p>
        )}
      </div>

      {errorMsg && (
        <div
          style={{
            padding: "12px 16px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "8px",
            marginBottom: "16px",
            fontSize: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <span>{errorMsg}</span>
          <button
            type="button"
            className="secondary-btn"
            style={{ padding: "4px 10px", fontSize: "12px" }}
            onClick={fetchProblems}
          >
            Retry Loading Problems ↻
          </button>
        </div>
      )}

      {/* ACTIVE PROBLEM SOLVER VIEW */}
      {activeProblem ? (
        <div className="dashboard-card" id="coding-editor-view">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: "12px",
              marginBottom: "16px",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div>
              <button
                type="button"
                className="secondary-btn"
                style={{ padding: "4px 10px", fontSize: "12px", marginRight: "10px" }}
                onClick={() => setActiveProblem(null)}
              >
                ← Back to Problem List
              </button>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  background:
                    activeProblem.difficulty === "Easy"
                      ? "#dcfce7"
                      : activeProblem.difficulty === "Medium"
                      ? "#fef3c7"
                      : "#fee2e2",
                  color:
                    activeProblem.difficulty === "Easy"
                      ? "#15803d"
                      : activeProblem.difficulty === "Medium"
                      ? "#b45309"
                      : "#b91c1c",
                  marginRight: "8px",
                }}
              >
                {activeProblem.difficulty}
              </span>
              <span style={{ fontSize: "13px", color: "#6b7280" }}>
                Topic: <strong>{activeProblem.topic}</strong>
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>Language:</label>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  border: "1px solid #d1d5db",
                  fontSize: "13px",
                  background: "#ffffff",
                }}
              >
                <option value="cpp">C++ (Syntax only — no compiler)</option>
                <option value="c">C (Syntax only — no compiler)</option>
                <option value="python">Python (Syntax only — no interpreter)</option>
                <option value="javascript">JavaScript (Sandboxed evaluation)</option>
              </select>
            </div>
          </div>

          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            {activeProblem.title}
          </h2>

          <p style={{ color: "#374151", fontSize: "14px", lineHeight: "1.6", marginBottom: "16px" }}>
            {activeProblem.statement}
          </p>

          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              fontSize: "13px",
              lineHeight: "1.5",
            }}
          >
            <strong>Constraints:</strong>
            <pre style={{ margin: "4px 0 0", fontFamily: "inherit", whiteSpace: "pre-wrap", color: "#4b5563" }}>
              {activeProblem.constraints}
            </pre>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div style={{ background: "#f3f4f6", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>
              <strong style={{ color: "#374151" }}>Sample Input:</strong>
              <div style={{ fontFamily: "monospace", marginTop: "4px", color: "#1f2937" }}>
                {activeProblem.sampleInput}
              </div>
            </div>
            <div style={{ background: "#f3f4f6", padding: "10px 14px", borderRadius: "8px", fontSize: "13px" }}>
              <strong style={{ color: "#374151" }}>Sample Output:</strong>
              <div style={{ fontFamily: "monospace", marginTop: "4px", color: "#1f2937" }}>
                {activeProblem.sampleOutput}
              </div>
            </div>
          </div>

          {/* Hints Toggle */}
          {activeProblem.hints && activeProblem.hints.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <button
                type="button"
                className="text-btn"
                style={{ fontSize: "13px" }}
                onClick={() => setShowHints((prev) => !prev)}
              >
                {showHints ? "Hide Hints ▲" : "Show Hints 💡"}
              </button>
              {showHints && (
                <ul
                  style={{
                    margin: "8px 0 0 20px",
                    fontSize: "13px",
                    color: "#4b5563",
                    lineHeight: "1.5",
                  }}
                >
                  {activeProblem.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* CODE EDITOR TEXTAREA */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "6px" }}>
              Code Implementation ({language === "cpp" ? "C++" : language === "c" ? "C" : language === "python" ? "Python" : "JavaScript"}):
              {language !== "javascript" && (
                <span style={{ fontWeight: "400", color: "#f59e0b", marginLeft: "8px", fontSize: "12px" }}>
                  ⚠ Only JavaScript is sandboxed-evaluated. C++, C and Python submissions are stored but not compiled/run on the server.
                </span>
              )}
            </label>
            <textarea
              rows={12}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                width: "100%",
                fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                fontSize: "13px",
                lineHeight: "1.5",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                background: "#1e293b",
                color: "#f8fafc",
              }}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {language === "javascript"
                ? "Evaluated against test cases in an isolated JavaScript sandbox."
                : "Submission stored. Full C++/C/Python execution requires a containerised judge — not yet configured on this server."}
            </span>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setActiveProblem(null)}
              >
                Back to List
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={handleSubmitCode}
                disabled={submitting}
              >
                {submitting ? "Running Test Cases..." : "Run & Submit Code 🚀"}
              </button>
            </div>
          </div>

          {/* TEST RESULTS FEEDBACK */}
          {submissionResult && (
            <div
              style={{
                marginTop: "24px",
                borderTop: "1px solid #e5e7eb",
                paddingTop: "16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "700",
                      background: submissionResult.passed ? "#10b981" : "#ef4444",
                      color: "#ffffff",
                    }}
                  >
                    {submissionResult.passed ? "✓ Accepted / Solved" : "✕ Test Cases Failed"}
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>
                    Score: {submissionResult.score} pts
                  </span>
                </div>
              </div>

              {submissionResult.testResults && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {submissionResult.testResults.map((tr, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "10px 14px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        border: "1px solid",
                        borderColor: tr.passed ? "#a7f3d0" : "#fecaca",
                        background: tr.passed ? "#f0fdf4" : "#fef2f2",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <strong>Test Case #{tr.testCase || i + 1}</strong>
                        <span style={{ color: tr.passed ? "#059669" : "#dc2626", fontWeight: "700" }}>
                          {tr.passed ? "PASSED ✓" : "FAILED ✕"}
                        </span>
                      </div>
                      {tr.input && (
                        <div>
                          Input: <code>{JSON.stringify(tr.input)}</code>
                        </div>
                      )}
                      {tr.expected !== undefined && (
                        <div>
                          Expected: <code>{JSON.stringify(tr.expected)}</code>
                        </div>
                      )}
                      {tr.actual !== undefined && (
                        <div>
                          Actual Output: <code>{JSON.stringify(tr.actual)}</code>
                        </div>
                      )}
                      {tr.error && (
                        <div style={{ color: "#b91c1c" }}>
                          Execution Error: <code>{tr.error}</code>
                        </div>
                      )}
                      {tr.message && <div style={{ color: "#4b5563" }}>{tr.message}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* PROBLEM BANK LIST VIEW */
        <div className="dashboard-card">
          <div className="card-heading">
            <div>
              <h3>Coding Problem Bank ({filteredProblems.length} Problems)</h3>
              <p>Practice technical problems across core data structures and algorithms</p>
            </div>
          </div>

          {/* FILTERS */}
          <div
            style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "14px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginRight: "8px" }}>
                Filter Topic:
              </span>
              <div style={{ display: "inline-flex", gap: "6px", flexWrap: "wrap" }}>
                {["All", "Arrays", "Strings", "Searching", "Sorting", "Linked Lists", "Stacks", "Queues"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTopic(t)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: selectedTopic === t ? "#6366f1" : "#d1d5db",
                      background: selectedTopic === t ? "#6366f1" : "#ffffff",
                      color: selectedTopic === t ? "#ffffff" : "#374151",
                      fontSize: "12px",
                      fontWeight: selectedTopic === t ? "600" : "500",
                      cursor: "pointer",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280", marginRight: "8px" }}>
                Difficulty:
              </span>
              <div style={{ display: "inline-flex", gap: "6px" }}>
                {["All", "Easy", "Medium", "Hard"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setSelectedDifficulty(d)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "6px",
                      border: "1px solid",
                      borderColor: selectedDifficulty === d ? "#6366f1" : "#d1d5db",
                      background: selectedDifficulty === d ? "#6366f1" : "#ffffff",
                      color: selectedDifficulty === d ? "#ffffff" : "#374151",
                      fontSize: "12px",
                      fontWeight: selectedDifficulty === d ? "600" : "500",
                      cursor: "pointer",
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* PROBLEMS TABLE / LIST */}
          {loadingProblems ? (
            <p style={{ color: "#6b7280", padding: "20px 0" }}>Loading problem bank...</p>
          ) : filteredProblems.length === 0 ? (
            <p style={{ color: "#6b7280", padding: "20px 0" }}>No problems found matching selected filters.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {filteredProblems.map((prob) => (
                <div
                  key={prob.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    background: "#ffffff",
                    transition: "0.15s ease",
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "700",
                          background:
                            prob.difficulty === "Easy"
                              ? "#dcfce7"
                              : prob.difficulty === "Medium"
                              ? "#fef3c7"
                              : "#fee2e2",
                          color:
                            prob.difficulty === "Easy"
                              ? "#15803d"
                              : prob.difficulty === "Medium"
                              ? "#b45309"
                              : "#b91c1c",
                        }}
                      >
                        {prob.difficulty}
                      </span>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          background: "#e0e7ff",
                          color: "#4338ca",
                          fontWeight: "600",
                        }}
                      >
                        {prob.topic}
                      </span>
                      <strong style={{ fontSize: "14px", color: "#1f2937" }}>{prob.title}</strong>
                    </div>
                    <p style={{ fontSize: "12px", color: "#6b7280", margin: 0, maxWidth: "600px" }}>
                      {prob.statement.slice(0, 110)}...
                    </p>
                  </div>

                  <button
                    className="primary-btn small-btn"
                    onClick={() => handleSelectProblem(prob)}
                  >
                    Solve Problem →
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RECOMMENDED TOPICS CARD */}
      <div className="dashboard-card">
        <h3>Recommended Topics</h3>
        <div className="topic-tags">
          <span>Arrays</span>
          <span>Strings</span>
          <span>Linked Lists</span>
          <span>Stacks</span>
          <span>Queues</span>
          <span>Searching</span>
          <span>Sorting</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "10px" }}>
          Master foundational data structures and algorithms to boost technical interview readiness.
        </p>
      </div>
    </Layout>
  );
}

export default Coding;