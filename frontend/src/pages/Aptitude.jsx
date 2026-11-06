import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getCurrentUserEmail, getAptitudeStats, saveAptitudeStats } from "../utils/auth";
import { API_ENDPOINTS } from "../utils/api";

function Aptitude() {
  const email = getCurrentUserEmail();
  const token = localStorage.getItem("careerMentorToken");

  // Local fallback stats
  const localStats = getAptitudeStats(email);
  const [stats, setStats] = useState(localStats);
  const [categoryStats, setCategoryStats] = useState({
    Quantitative: { attempted: 0, correct: 0, accuracy: 0 },
    Logical: { attempted: 0, correct: 0, accuracy: 0 },
    Verbal: { attempted: 0, correct: 0, accuracy: 0 },
  });

  // Test session state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [testLength, setTestLength] = useState(10);
  const [sessionActive, setSessionActive] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionId]: selectedOption }
  const [testResult, setTestResult] = useState(null); // Result payload from backend
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch real statistics from MongoDB backend on mount
  useEffect(() => {
    async function fetchStats() {
      if (!token) return;
      try {
        const res = await fetch(API_ENDPOINTS.APTITUDE.STATS, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.stats) {
            setStats(data.stats);
            saveAptitudeStats(email, data.stats);
          }
          if (data && data.categoryStats) {
            setCategoryStats(data.categoryStats);
          }
        }
      } catch (err) {
        console.warn("Could not fetch remote aptitude stats, using local cache:", err.message);
      }
    }
    fetchStats();
  }, [token, email]);

  const overallAccuracy =
    stats && stats.attempted > 0 ? Math.round(((stats.correct || 0) / stats.attempted) * 100) : 0;

  // Start test session
  const handleStartPractice = async () => {
    setErrorMsg("");
    setLoadingQuestions(true);
    setTestResult(null);
    setUserAnswers({});
    setCurrentIndex(0);

    try {
      const url =
        selectedCategory && selectedCategory !== "All"
          ? `${API_ENDPOINTS.APTITUDE.QUESTIONS}?category=${encodeURIComponent(selectedCategory)}`
          : API_ENDPOINTS.APTITUDE.QUESTIONS;

      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!res.ok) {
        throw new Error("Failed to load aptitude questions from server.");
      }

      const data = await res.json();
      if (data && Array.isArray(data.questions) && data.questions.length > 0) {
        let qList = [...data.questions];
        if (testLength && testLength < qList.length) {
          qList = qList.slice(0, testLength);
        }
        setQuestions(qList);
        setSessionActive(true);
      } else {
        throw new Error("No questions available for the selected category.");
      }
    } catch (err) {
      console.error("Error loading questions:", err);
      setErrorMsg(err.message || "Failed to start practice test. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const startPracticeSession = handleStartPractice;

  // Question navigation
  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Select an option (supports both handleSelectOption(opt) and handleSelectOption(qId, opt))
  const handleSelectOption = (qIdOrOpt, maybeOpt) => {
    const currentQ = questions[currentIndex];
    const qId = maybeOpt !== undefined ? qIdOrOpt : currentQ?.id;
    const option = maybeOpt !== undefined ? maybeOpt : qIdOrOpt;
    if (!qId) return;
    setUserAnswers((prev) => ({
      ...prev,
      [qId]: option,
    }));
  };

  // Submit test to backend
  const handleSubmitTest = async () => {
    if (questions.length === 0) return;
    setSubmittingTest(true);
    setErrorMsg("");

    try {
      const payloadAnswers = questions.map((q) => ({
        questionId: q.id,
        selectedAnswer: userAnswers[q.id] || null,
      }));

      const res = await fetch(API_ENDPOINTS.APTITUDE.SUBMIT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit test. Please check connection and try again.");
      }

      const data = await res.json();
      if (data && data.success) {
        setTestResult(data);
        if (data.stats) {
          setStats(data.stats);
          saveAptitudeStats(email, data.stats);
        }
        if (data.categoryStats) {
          setCategoryStats(data.categoryStats);
        }
        setSessionActive(false);
      } else {
        throw new Error(data.message || "Failed to score test.");
      }
    } catch (err) {
      console.error("Test submission error:", err);
      setErrorMsg(err.message || "Could not submit test. Please try again.");
    } finally {
      setSubmittingTest(false);
    }
  };

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <Layout>
      <div className="page-header">
        <div>
          <p className="eyebrow">BASE PAPER MODULE</p>
          <h1>Aptitude Practice</h1>
          <p>Quantitative, logical and verbal aptitude preparation.</p>
        </div>
      </div>

      {/* INTERACTIVE PRACTICE CARD (Adaptive Practice placed above Statistics) */}
      <div className="dashboard-card" id="aptitude-practice-card" style={{ marginBottom: "24px" }}>
        {errorMsg && (
          <div
            style={{
              padding: "10px 14px",
              background: "#fee2e2",
              color: "#991b1b",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "14px",
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* 1. NOT ACTIVE & NO RESULT: SETUP / START */}
        {!sessionActive && !testResult && (
          <div>
            <h3>Adaptive Practice</h3>
            <p style={{ color: "#6b7280", margin: "8px 0 16px", lineHeight: "1.5" }}>
              Practice from our bank of 30 curated questions covering Quantitative Aptitude,
              Logical Reasoning, and Verbal Ability. Questions are evaluated securely on the backend.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Select Category:
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {["All", "Quantitative", "Logical", "Verbal"].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={selectedCategory === cat ? "primary-btn" : "secondary-btn"}
                    style={{
                      padding: "8px 16px",
                      fontSize: "13px",
                    }}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                Number of Questions:
              </label>
              <div style={{ display: "flex", gap: "10px" }}>
                {[5, 10, 15, 30].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={testLength === num ? "primary-btn" : "secondary-btn"}
                    style={{
                      padding: "6px 14px",
                      fontSize: "13px",
                    }}
                    onClick={() => setTestLength(num)}
                  >
                    {num} Qs
                  </button>
                ))}
              </div>
            </div>

            <button
              className="primary-btn"
              onClick={startPracticeSession}
              disabled={loadingQuestions}
            >
              {loadingQuestions ? "Loading Questions..." : "Start Adaptive Practice →"}
            </button>
          </div>
        )}

        {/* 2. ACTIVE TEST IN PROGRESS */}
        {sessionActive && currentQuestion && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                paddingBottom: "12px",
                borderBottom: "1px solid #e5e7eb",
              }}
            >
              <div>
                <span className="eyebrow">
                  {currentQuestion.category.toUpperCase()} • {currentQuestion.difficulty}
                </span>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#374151", margin: 0 }}>
                  Question {currentIndex + 1} of {questions.length}
                </p>
              </div>

              <button
                type="button"
                className="secondary-btn"
                style={{ padding: "6px 12px", fontSize: "12px" }}
                onClick={() => {
                  if (window.confirm("Are you sure you want to exit? Your progress in this test will not be saved.")) {
                    setSessionActive(false);
                  }
                }}
              >
                Exit Test
              </button>
            </div>

            {/* Question Text */}
            <h3 style={{ fontSize: "17px", fontWeight: "600", color: "#111827", lineHeight: "1.5", marginBottom: "20px" }}>
              {currentQuestion.text}
            </h3>

            {/* Options List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentQuestion.id] === opt;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      textAlign: "left",
                      padding: "12px 16px",
                      borderRadius: "8px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #d1d5db",
                      background: isSelected ? "#eff6ff" : "#ffffff",
                      color: isSelected ? "#1d4ed8" : "#374151",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: isSelected ? "600" : "400",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        border: isSelected ? "2px solid #2563eb" : "1px solid #9ca3af",
                        marginRight: "12px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background: isSelected ? "#2563eb" : "transparent",
                        color: isSelected ? "#ffffff" : "#6b7280",
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {/* Navigation & Submission Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <button
                type="button"
                className="secondary-btn"
                disabled={currentIndex === 0}
                onClick={handlePrevQuestion}
                style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
              >
                ← Previous
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                {!isLastQuestion ? (
                  <button type="button" className="primary-btn" onClick={handleNextQuestion}>
                    Next Question →
                  </button>
                ) : (
                  <button
                    type="button"
                    className="primary-btn"
                    style={{ background: "#10b981", borderColor: "#10b981" }}
                    onClick={handleSubmitTest}
                    disabled={submittingTest}
                  >
                    {submittingTest ? "Submitting..." : "Submit Test & View Results"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 3. TEST COMPLETED: REVIEW RESULTS & EXPLANATIONS */}
        {testResult && testResult.submission && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <div>
                <span className="eyebrow">TEST COMPLETED</span>
                <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#111827", marginTop: "4px" }}>
                  Your Practice Results
                </h2>
              </div>
              <span className="score-pill" style={{ fontSize: "16px", padding: "6px 14px" }}>
                Score: {testResult.submission.score} pts ({testResult.submission.accuracy}%)
              </span>
            </div>

            {/* Result Stats Grid */}
            <div
              className="coding-stats"
              style={{ background: "#f9fafb", padding: "16px", borderRadius: "10px", marginBottom: "24px" }}
            >
              <div>
                <strong>{testResult.submission.totalQuestions}</strong>
                <span>Total Questions</span>
              </div>
              <div>
                <strong>{testResult.submission.attempted}</strong>
                <span>Attempted</span>
              </div>
              <div>
                <strong style={{ color: "#10b981" }}>{testResult.submission.correct}</strong>
                <span>Correct</span>
              </div>
              <div>
                <strong style={{ color: "#ef4444" }}>{testResult.submission.incorrect}</strong>
                <span>Incorrect</span>
              </div>
              <div>
                <strong>{testResult.submission.accuracy}%</strong>
                <span>Accuracy</span>
              </div>
            </div>

            {/* Detailed Question Review with Explanations */}
            <h4 style={{ fontSize: "15px", fontWeight: "600", color: "#374151", marginBottom: "14px" }}>
              Question-by-Question Review with Explanations:
            </h4>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              {testResult.results.map((res, rIdx) => (
                <div
                  key={rIdx}
                  style={{
                    padding: "14px",
                    borderRadius: "8px",
                    border: res.isCorrect ? "1px solid #a7f3d0" : "1px solid #fecaca",
                    background: res.isCorrect ? "#f0fdf4" : "#fef2f2",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#6b7280" }}>
                      Q{rIdx + 1} • {res.category}
                    </span>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: "700",
                        color: res.isCorrect ? "#059669" : "#dc2626",
                      }}
                    >
                      {res.isCorrect ? "✓ Correct (+10 pts)" : "✗ Incorrect"}
                    </span>
                  </div>

                  <p style={{ fontSize: "14px", fontWeight: "500", color: "#111827", margin: "0 0 8px" }}>
                    {res.text}
                  </p>

                  <div style={{ fontSize: "13px", color: "#4b5563", marginBottom: "4px" }}>
                    <strong>Your Answer:</strong>{" "}
                    <span style={{ color: res.isCorrect ? "#059669" : "#dc2626" }}>
                      {res.selectedAnswer || "Not Answered"}
                    </span>
                  </div>

                  {!res.isCorrect && (
                    <div style={{ fontSize: "13px", color: "#059669", marginBottom: "6px" }}>
                      <strong>Correct Answer:</strong> {res.correctAnswer}
                    </div>
                  )}

                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 12px",
                      background: "#ffffff",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "#374151",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <strong>Explanation:</strong> {res.explanation}
                  </div>
                </div>
              ))}
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setTestResult(null);
                setSessionActive(false);
              }}
            >
              Practice Again →
            </button>
          </div>
        )}
      </div>

      {/* OVERALL STATS */}
      <div className="dashboard-card">
        <div className="card-heading">
          <div>
            <h3>Your Aptitude Statistics</h3>
            <p>Actual activity — updates as you practice</p>
          </div>
          <span className="score-pill">{overallAccuracy}%</span>
        </div>

        <div className="coding-stats">
          <div>
            <strong id="apt-attempted-count">{stats.attempted}</strong>
            <span>Attempted</span>
          </div>

          <div>
            <strong>{stats.completed}</strong>
            <span>Completed</span>
          </div>

          <div>
            <strong style={{ color: "#10b981" }}>{stats.correct}</strong>
            <span>Correct</span>
          </div>

          <div>
            <strong style={{ color: "#ef4444" }}>{stats.incorrect}</strong>
            <span>Incorrect</span>
          </div>

          <div>
            <strong>{overallAccuracy}%</strong>
            <span>Accuracy</span>
          </div>
        </div>

        {stats.attempted === 0 && (
          <p className="zero-stat-note">
            No attempts yet. Start an aptitude test to track your performance.
          </p>
        )}
      </div>

      {/* CATEGORY BREAKDOWN */}
      <div className="module-dashboard-grid">
        <div className="dashboard-card">
          <span className="module-label">QUANTITATIVE</span>
          <h2>{categoryStats?.Quantitative?.accuracy ?? 0}%</h2>
          <p>
            {categoryStats?.Quantitative?.correct ?? 0} / {categoryStats?.Quantitative?.attempted ?? 0} correct
          </p>
          <div className="progress-bar">
            <div style={{ width: `${categoryStats?.Quantitative?.accuracy ?? 0}%` }}></div>
          </div>
        </div>

        <div className="dashboard-card">
          <span className="module-label">LOGICAL</span>
          <h2>{categoryStats?.Logical?.accuracy ?? 0}%</h2>
          <p>
            {categoryStats?.Logical?.correct ?? 0} / {categoryStats?.Logical?.attempted ?? 0} correct
          </p>
          <div className="progress-bar">
            <div style={{ width: `${categoryStats?.Logical?.accuracy ?? 0}%` }}></div>
          </div>
        </div>

        <div className="dashboard-card">
          <span className="module-label">VERBAL</span>
          <h2>{categoryStats?.Verbal?.accuracy ?? 0}%</h2>
          <p>
            {categoryStats?.Verbal?.correct ?? 0} / {categoryStats?.Verbal?.attempted ?? 0} correct
          </p>
          <div className="progress-bar">
            <div style={{ width: `${categoryStats?.Verbal?.accuracy ?? 0}%` }}></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Aptitude;
