import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import "./index.css";

const onboarding = [
  {
    number: "01",
    title: "Plan your life",
    text: "Keep your days, plans and little moments beautifully organized.",
    visual: "calendar",
  },
  {
    number: "02",
    title: "Grow with you",
    text: "Build better habits, reach your goals and make progress your way.",
    visual: "growth",
  },
  {
    number: "03",
    title: "Meet your AI",
    text: "Your little intelligent companion for studying, planning and everyday life.",
    visual: "ai",
  },
];

function App() {
  const [screen, setScreen] = useState("splash");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScreen("onboarding");
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setScreen("home");
      }
    };

    checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setScreen("home");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const nextSlide = () => {
    if (slide < onboarding.length - 1) {
      setSlide(slide + 1);
    } else {
      setScreen("signup");
    }
  };

  const handleGoogleLogin = async () => {
    console.log("Google button clicked");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    console.log("Google OAuth response:", { data, error });

    if (error) {
      console.error("Google login error:", error);
      alert(`Google login error: ${error.message}`);
    }
  };

  if (screen === "splash") {
    return <Splash />;
  }

  if (screen === "onboarding") {
    return (
      <Onboarding
        slide={slide}
        nextSlide={nextSlide}
        skip={() => setScreen("signup")}
      />
    );
  }

  if (screen === "signup") {
    return (
      <Signup
        goHome={() => setScreen("home")}
        onGoogleLogin={handleGoogleLogin}
      />
    );
  }

  return <Home />;
}

/* ==============================
   SPLASH
============================== */

function Splash() {
  return (
    <main className="splash">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <div className="sparkle sparkle-1">✦</div>
      <div className="sparkle sparkle-2">✧</div>
      <div className="sparkle sparkle-3">·</div>

      <div className="splash-inner">
        <p className="tiny-brand">A LITTLE SPACE FOR</p>

        <h1 className="brand-logo">Lifely</h1>

        <div className="brand-line">
          <span />
          <i>♡</i>
          <span />
        </div>

        <p className="brand-subtitle">
          your life, beautifully organized
        </p>

        <div className="loading">
          <span />
        </div>
      </div>
    </main>
  );
}

/* ==============================
   ONBOARDING
============================== */

function Onboarding({ slide, nextSlide, skip }) {
  const item = onboarding[slide];

  return (
    <main className="onboarding">
      <header className="onboarding-header">
        <div className="mini-logo">L</div>

        <button className="skip" onClick={skip}>
          Skip
        </button>
      </header>

      <div className="onboarding-art">
        <Art type={item.visual} />

        <div className="art-orb orb-one" />
        <div className="art-orb orb-two" />

        <span className="floating-flower flower-one">✿</span>
        <span className="floating-flower flower-two">✧</span>
      </div>

      <section className="onboarding-text">
        <div className="slide-number">
          <strong>{item.number}</strong>
          <span>/ 03</span>
        </div>

        <h2>{item.title}</h2>

        <p>{item.text}</p>
      </section>

      <footer className="onboarding-footer">
        <div className="progress">
          {onboarding.map((_, index) => (
            <span
              key={index}
              className={index === slide ? "active" : ""}
            />
          ))}
        </div>

        <button className="next-button" onClick={nextSlide}>
          <span>{slide === 2 ? "Get started" : "Continue"}</span>
          <b>↗</b>
        </button>
      </footer>
    </main>
  );
}

/* ==============================
   ART
============================== */

function Art({ type }) {
  if (type === "calendar") {
    return (
      <div className="calendar-art">
        <div className="calendar-shadow" />

        <div className="calendar-card">
          <div className="calendar-top">
            <span>SEPTEMBER</span>
            <b>2026</b>
          </div>

          <div className="calendar-title">My little plans</div>

          <div className="calendar-grid">
            {[
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
              "13",
              "14",
              "15",
              "16",
              "17",
              "18",
              "19",
              "20",
              "21",
              "22",
              "23",
              "24",
              "25",
              "26",
              "27",
              "28",
              "29",
              "30",
            ].map((day) => (
              <span
                key={day}
                className={day === "23" ? "today" : ""}
              >
                {day}
              </span>
            ))}
          </div>

          <div className="calendar-note">
            <i>♡</i>
            make time for yourself
          </div>
        </div>
      </div>
    );
  }

  if (type === "growth") {
    return (
      <div className="growth-art">
        <div className="growth-card main-growth">
          <span className="growth-label">TODAY</span>

          <div className="ring">
            <div>
              <strong>72%</strong>
              <small>progress</small>
            </div>
          </div>

          <p>
            Little steps
            <br />
            still count.
          </p>
        </div>

        <div className="growth-card habit-card">
          <span>♡</span>

          <div>
            <strong>Morning walk</strong>
            <small>Completed</small>
          </div>
        </div>

        <div className="growth-card goal-card">
          <span>✦</span>

          <div>
            <strong>New goal</strong>
            <small>Keep going</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-art">
      <div className="ai-glow" />

      <div className="ai-orb">
        <div className="ai-core">
          <span>✦</span>
        </div>
      </div>

      <div className="chat-bubble bubble-one">
        Can you help me plan my day?
      </div>

      <div className="chat-bubble bubble-two">
        Of course ♡
      </div>

      <div className="ai-spark spark-a">✦</div>
      <div className="ai-spark spark-b">✧</div>
    </div>
  );
}

/* ==============================
   SIGN UP
============================== */
function Signup({ goHome, onGoogleLogin }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email || !password) {
      setMessage("Please enter your email and password.");
      return;
    }

    if (mode === "signup" && !name) {
      setMessage("Please enter your name.");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
     const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: window.location.origin,
    data: {
      full_name: name,
    },
  },
});

      setLoading(false);

      if (error) {
        console.error("Signup error:", error);
        setMessage(error.message);
        return;
      }

      if (data.session) {
        goHome();
      } else {
        setMessage(
          "Account created! Check your email to confirm your account."
        );
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setLoading(false);

      if (error) {
        console.error("Login error:", error);
        setMessage(error.message);
        return;
      }

      if (data.session) {
        goHome();
      }
    }
  };

  return (
    <main className="auth">
      <div className="auth-decoration">
        <span>✦</span>
        <span>♡</span>
        <span>✧</span>
      </div>

      <div className="auth-logo">Lifely</div>

      <section className="auth-box">
        <p className="eyebrow">
          {mode === "signup" ? "YOUR SPACE AWAITS" : "WELCOME BACK"}
        </p>

        <h1>
          {mode === "signup" ? (
            <>
              Let's make life
              <br />
              feel a little lighter.
            </>
          ) : (
            <>
              Welcome
              <br />
              back to Lifely.
            </>
          )}
        </h1>

        <p className="auth-description">
          {mode === "signup"
            ? "Create your personal space for everything that matters to you."
            : "Your little space is waiting for you."}
        </p>

        {mode === "signup" && (
          <button
            className="google-button"
            onClick={onGoogleLogin}
            type="button"
          >
            <span className="google-logo">G</span>
            <span>Continue with Google</span>
          </button>
        )}

        {mode === "signup" && (
          <div className="auth-divider">
            <span />
            <small>or continue with email</small>
            <span />
          </div>
        )}

        {mode === "login" && (
          <button
            className="google-button"
            onClick={onGoogleLogin}
            type="button"
          >
            <span className="google-logo">G</span>
            <span>Continue with Google</span>
          </button>
        )}

        {mode === "login" && (
          <div className="auth-divider">
            <span />
            <small>or continue with email</small>
            <span />
          </div>
        )}

        {mode === "signup" && (
          <div className="form-field">
            <label>Your name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="What should we call you?"
            />
          </div>
        )}

        <form onSubmit={handleEmailAuth}>
          <div className="form-field">
            <label>Email address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="form-field">
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
            />
          </div>

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}

          <button
            className="create-button"
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create my space"
                : "Log in"}

            <span>↗</span>
          </button>
        </form>

        <p className="login-text">
          {mode === "signup"
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setMessage("");
            }}
          >
            {mode === "signup" ? "Log in" : "Create account"}
          </button>
        </p>
      </section>
    </main>
  );
}

/* ==============================
   HOME
============================== */

function Home() {
  return (
    <main className="home">
      <header className="home-header">
        <div>
          <p className="home-date">
            WEDNESDAY · SEPTEMBER 23
          </p>

          <h1>
            Good morning,
            <br />
            <em>beautiful.</em>
          </h1>
        </div>

        <div className="avatar">A</div>
      </header>

      <section className="day-card">
        <div className="day-card-content">
          <p>YOUR DAY</p>

          <h2>
            Make today
            <br />
            feel lighter.
          </h2>

          <button>
            Open my planner
            <span>↗</span>
          </button>
        </div>

        <div className="day-decoration">
          <div>23</div>
          <span>SEP</span>
        </div>
      </section>

      <div className="section-heading">
        <h3>Quick space</h3>
        <button>See all</button>
      </div>

      <section className="quick-space">
        <QuickCard
          icon="✓"
          title="My tasks"
          text="3 things today"
          type="pink"
        />

        <QuickCard
          icon="✦"
          title="AI Assistant"
          text="Ask Lifely"
          type="lavender"
        />

        <QuickCard
          icon="♡"
          title="Wellbeing"
          text="Check in with you"
          type="cream"
        />

        <QuickCard
          icon="↗"
          title="Career"
          text="Keep growing"
          type="peach"
        />
      </section>

      <section className="motivation-card">
        <div>
          <span>DAILY NOTE</span>

          <h3>
            You don't have to
            <br />
            do everything today.
          </h3>

          <p>Small steps are still progress. ♡</p>
        </div>

        <div className="motivation-flower">✿</div>
      </section>

      <nav className="bottom-navigation">
        <button className="nav-active">
          <span>⌂</span>
          Home
        </button>

        <button>
          <span>✓</span>
          Tasks
        </button>

        <button className="ai-button">✦</button>

        <button>
          <span>♡</span>
          Wellness
        </button>

        <button>
          <span>○</span>
          Profile
        </button>
      </nav>
    </main>
  );
}

function QuickCard({ icon, title, text, type }) {
  return (
    <article className={`quick-card ${type}`}>
      <div className="quick-icon">{icon}</div>

      <strong>{title}</strong>

      <small>{text}</small>

      <span className="card-arrow">↗</span>
    </article>
  );
}

export default App;