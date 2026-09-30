import "./Help.css";

function Help() {
  return (
    <div className="help-page">

      {/* Header */}
      <div className="help-header">
        <div>
          <h1>Help & Support</h1>
          <p>We're here to help you on your career journey.</p>
        </div>

        <div className="help-icon">
          💬
        </div>
      </div>

      {/* Search */}
      <div className="help-search">
        <span>🔍</span>
        <input
          type="text"
          placeholder="Search for help..."
        />
      </div>

      {/* Help Cards */}
      <div className="help-grid">

        <div className="help-card">
          <div className="help-card-icon">📚</div>
          <h2>Getting Started</h2>
          <p>
            Learn how to use AI Career Mentor and begin your career journey.
          </p>
          <button>Learn More →</button>
        </div>

        <div className="help-card">
          <div className="help-card-icon">🎯</div>
          <h2>Career Guidance</h2>
          <p>
            Get help with your skills, career roadmap and career goals.
          </p>
          <button>Explore →</button>
        </div>

        <div className="help-card">
          <div className="help-card-icon">📄</div>
          <h2>Resume Help</h2>
          <p>
            Learn how to create and improve your professional resume.
          </p>
          <button>Get Help →</button>
        </div>

        <div className="help-card">
          <div className="help-card-icon">💼</div>
          <h2>Job Opportunities</h2>
          <p>
            Find opportunities and understand how to prepare for jobs.
          </p>
          <button>Explore Jobs →</button>
        </div>

      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-item">
          <h3>How does AI Career Mentor work?</h3>
          <p>
            AI Career Mentor helps you understand your skills, explore career
            options and create a personalized career roadmap.
          </p>
        </div>

        <div className="faq-item">
          <h3>How can I update my profile?</h3>
          <p>
            Go to My Profile from the sidebar and update your personal and
            career information.
          </p>
        </div>

        <div className="faq-item">
          <h3>How can I improve my skills?</h3>
          <p>
            Visit the Skills section to view your current skills and discover
            skills that you should learn next.
          </p>
        </div>
      </div>

      {/* Contact */}
      <div className="contact-box">
        <div>
          <h2>Still need help?</h2>
          <p>
            Our support team is ready to help you.
          </p>
        </div>

        <button>Contact Support</button>
      </div>

    </div>
  );
}

export default Help;