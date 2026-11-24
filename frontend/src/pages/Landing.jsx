import { ArrowRight, Mic, Quote, Sparkles } from 'lucide-react';
import Button from '../components/Button.jsx';
import ScoreCircle from '../components/ScoreCircle.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import { FEATURES, STEPS, TESTIMONIALS } from '../data/landingContent.js';
import { getInitials } from '../utils/format.js';

export default function Landing() {
  return (
    <div id="top">
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <FinalCta />
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            Practice Smarter.
            <br />
            <span className="hero__title-accent">Interview Better.</span>
          </h1>
          <p className="hero__subtitle">
            AI-powered mock interviews that analyze your answers, identify weaknesses, and help you become interview-ready.
          </p>
          <div className="hero__actions">
            <Button to="/register" variant="light" size="lg">
              Start Free Interview <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button href="#features" variant="outline-light" size="lg">
              Explore Features
            </Button>
          </div>
          <dl className="hero__facts">
            <div>
              <dt>Curated questions</dt>
              <dd>160+</dd>
            </div>
            <div>
              <dt>Interview tracks</dt>
              <dd>9</dd>
            </div>
            <div>
              <dt>Feedback on every answer</dt>
              <dd>Instant</dd>
            </div>
          </dl>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

// A static mock of the interview screen, shown on the right of the hero.
function HeroPreview() {
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview__window">
        <div className="preview__bar">
          <span>Java Interview</span>
          <span>Question 3 of 10</span>
        </div>
        <ProgressBar value={30} size="sm" />
        <p className="preview__question">What is inheritance in Java?</p>
        <div className="preview__answer">
          <p>Inheritance lets a class reuse the fields and methods of another class using the extends keyword...</p>
          <div className="preview__recording">
            <Mic size={14} />
            <span>Recording 00:24</span>
            <span className="preview__wave">
              {Array.from({ length: 14 }).map((_, i) => (
                <i key={i} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </span>
          </div>
        </div>
      </div>

      <div className="preview__score">
        <ScoreCircle score={82} size={88} strokeWidth={8} caption="score" />
        <div className="preview__score-bars">
          <ProgressBar label="Relevance" value={90} showValue tone="auto" size="sm" />
          <ProgressBar label="Accuracy" value={85} showValue tone="auto" size="sm" />
          <ProgressBar label="Completeness" value={75} showValue tone="auto" size="sm" />
        </div>
      </div>

      
    </div>
  );
}

function Features() {
  return (
    <section id="features" className="section">
      <div className="container">
        <div className="section__heading">
          <h2>Everything you need to prepare with confidence</h2>
          <p>One place to practice, get honest feedback, and track your progress.</p>
        </div>
        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <article key={title} className="feature-card">
              <span className="feature-card__icon">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="section section--tinted">
      <div className="container">
        <div className="section__heading">
          <h2>How it works</h2>
          <p>From first question to interview-ready in four simple steps.</p>
        </div>
        <ol className="steps">
          {STEPS.map((step, index) => (
            <li key={step.title} className="step">
              <span className="step__number">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="section">
      <div className="container">
        <div className="section__heading">
          <h2>Loved by people preparing for their next role</h2>
        </div>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((item) => (
            <figure key={item.name} className="testimonial">
              <Quote size={22} className="testimonial__mark" aria-hidden="true" />
              <blockquote>{item.quote}</blockquote>
              <figcaption>
                <span className="avatar avatar--sm" aria-hidden="true">
                  {getInitials(item.name)}
                </span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.role}</small>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="container cta-wrap">
      <div className="cta">
        <h2>Ready to become interview-ready?</h2>
        <p>Create a free account and complete your first mock interview today.</p>
        <Button to="/register" variant="light" size="lg">
          Get Started <ArrowRight size={18} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
