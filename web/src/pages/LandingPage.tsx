import { useNavigate } from 'react-router-dom'
import { PenTool, Zap, TrendingUp, Shield, BookOpen, Settings2 } from 'lucide-react'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing-page">
            <section className="landing-hero">
                <div className="landing-hero__content">
                    <h1 className="landing-hero__title">
                        <PenTool size={40} style={{ color: 'var(--color-accent)' }} />
                        <span>WriterIQ</span>
                    </h1>
                    <p className="landing-hero__tagline">
                        The AI-powered writing assistant that crafts publication-ready content — from blog posts and emails to books and scripts.
                    </p>
                    <div className="landing-hero__actions">
                        <button className="btn btn--primary btn--lg" onClick={() => navigate('/app')}>
                            ✍️ Start Writing
                        </button>
                        <button className="btn btn--secondary btn--lg" onClick={() => navigate('/pricing')}>
                            View Plans
                        </button>
                    </div>
                </div>
            </section>

            <section className="landing-features">
                <h2 className="landing-section__title">How It Works</h2>
                <div className="landing-features__grid">
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><Settings2 size={32} /></div>
                        <h3>Choose Your Format</h3>
                        <p>Blog posts, emails, essays, stories, social media, ad copy, speeches, poems, scripts — and more.</p>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><PenTool size={32} /></div>
                        <h3>Set Tone & Style</h3>
                        <p>Professional, casual, humorous, persuasive — pick your voice and let AI adapt perfectly.</p>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><BookOpen size={32} /></div>
                        <h3>Get Publication-Ready Content</h3>
                        <p>Receive polished, formatted content that requires minimal editing — ready to publish.</p>
                    </div>
                </div>
            </section>

            <section className="landing-features">
                <h2 className="landing-section__title">Enterprise Ready</h2>
                <div className="landing-features__grid">
                    <div className="landing-feature">
                        <Shield size={28} style={{ color: 'var(--color-accent)' }} />
                        <h3>Secure by Default</h3>
                        <p>Authentication, authorization, and audit logging built in.</p>
                    </div>
                    <div className="landing-feature">
                        <Zap size={28} style={{ color: 'var(--color-warm-amber)' }} />
                        <h3>Lightning Fast</h3>
                        <p>Real-time serverless backend ensures instant content generation.</p>
                    </div>
                    <div className="landing-feature">
                        <TrendingUp size={28} style={{ color: 'var(--color-neon-emerald)' }} />
                        <h3>Stripe Billing</h3>
                        <p>Subscription management with Stripe checkout and portal.</p>
                    </div>
                </div>
            </section>

            <section className="landing-cta">
                <h2>Ready to write better, faster?</h2>
                <p>Join today and let AI handle the heavy lifting of content creation.</p>
                <button className="btn btn--primary btn--lg" onClick={() => navigate('/login')}>
                    🚀 Sign Up Free
                </button>
            </section>
        </div>
    )
}
