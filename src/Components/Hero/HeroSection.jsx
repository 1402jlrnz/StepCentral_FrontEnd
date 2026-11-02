import React from 'react'

const HeroSection = () => {
    return (
        <section className="hero" aria-label="Step Central brand showcase">
            {/* Animated background layers */}
            <div className="hero-bg-base" />
            <div className="hero-bg-noise" />
            <div className="hero-bg-curves" />

            {/* Split typography behind */}
            <div className="hero-headline" aria-hidden="true">
                <span className="hero-word hero-word--accent">STEP</span>
                <span className="hero-word hero-word--white">CENTRAL</span>
            </div>

            {/* Large ghost brand text in background */}
            <div className="hero-brand-ghost" aria-hidden="true">SC</div>

            {/* Decorative sneaker silhouette */}
            <div className="hero-silhouette" aria-hidden="true">
                <svg viewBox="0 0 400 250" fill="currentColor">
                    {/* Sole */}
                    <path d="M60,210 L350,210 C370,210 380,220 380,235 C380,245 370,250 350,250 L90,250 C60,250 50,240 50,210 C50,190 60,180 80,170 Z" />
                    {/* Midsole stripe */}
                    <path d="M60,195 L360,195 C370,195 375,200 375,205 C375,212 368,215 350,215 L80,215 C68,215 62,208 62,200 Z" opacity="0.9" />
                    {/* Upper */}
                    <path d="M80,170 C95,150 130,145 150,130 C170,115 200,105 230,115 C260,125 290,155 330,165 C355,170 375,175 375,185 L375,195 L60,195 C60,185 65,175 80,170 Z" />
                    {/* Laces detail */}
                    <path d="M150,125 L185,135 M160,115 L195,130 M170,105 L205,122 M180,100 L215,115" stroke="currentColor" strokeWidth="3" fill="none" opacity="0.5" />
                    {/* Swoosh-like accent */}
                    <path d="M90,180 C150,165 220,145 300,135 C320,133 340,138 355,150 C340,140 320,138 300,142 C230,152 160,170 100,185 Z" opacity="0.8" />
                </svg>
            </div>

            {/* Scroll indicator */}
            <div className="scroll-indicator" aria-hidden="true">
                <span className="scroll-text">EXPLORE</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
            </div>
        </section>
    )
}

export default HeroSection