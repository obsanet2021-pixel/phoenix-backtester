import React, { useState, useEffect } from 'react'
import { Flame, Target, TrendingUp, ArrowRight, Sparkles, Zap } from 'lucide-react'

const HeroSection = ({ onStartNewSession, onContinueSession, currentStreak = 0 }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const slides = [
    {
      id: 1,
      title: "Rise from the Ashes",
      subtitle: "Your Phoenix Challenge Journey",
      description: "Master the Fixed Drawdown model and prove your trading discipline",
      gradient: "bg-gradient-phoenix-1",
      action: {
        text: "Start New Session",
        handler: onStartNewSession,
        primary: true
      }
    },
    {
      id: 2,
      title: "Track Your Progress",
      subtitle: "Every Trade Counts",
      description: "Build consistency with 269+ backtested trades and growing",
      gradient: "bg-gradient-phoenix-2",
      action: {
        text: "Continue Trading",
        handler: onContinueSession,
        primary: false
      }
    },
    {
      id: 3,
      title: "Join the Community",
      subtitle: "Connect with Fellow Traders",
      description: "Share strategies, learn from others, grow together",
      gradient: "bg-gradient-phoenix-3",
      action: {
        text: "View Leaderboard",
        handler: () => console.log('Navigate to leaderboard'),
        primary: false
      }
    }
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsTransitioning(false)
      }, 300)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const prevSlide = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
      setIsTransitioning(false)
    }, 300)
  }

  const goToSlide = (index) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setIsTransitioning(false)
    }, 300)
  }

  const currentSlideData = slides[currentSlide]

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-xl lg:h-96 mb-8">
      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 flex flex-col justify-between p-6 text-white transition-transform duration-500 sm:p-8 ${slide.gradient} ${
              index === currentSlide 
                ? 'translate-x-0' 
                : index < currentSlide 
                  ? '-translate-x-full' 
                  : 'translate-x-full'
            } ${isTransitioning && index !== currentSlide ? 'opacity-0' : 'opacity-100'}`}
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black mb-2">
                {slide.title}
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-4">
                {slide.subtitle}
              </p>
              <p className="text-sm sm:text-base text-white/70 max-w-md">
                {slide.description}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div className="flex items-center gap-4">
                {currentStreak > 0 && (
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-[20px] rounded-lg px-3 py-2">
                    <Flame className="w-4 h-4 fill-white" />
                    <span className="text-sm font-semibold">{currentStreak} day streak</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={slide.action.handler}
                className={`p-3 px-6 shadow-lg border border-white/20 backdrop-blur-[20px] rounded-lg transition-all duration-200 relative flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-80 hover:shadow-xl ${
                  slide.action.primary 
                    ? 'bg-gradient-button-main from-emerald/20 to-emerald/40 text-white hover:from-emerald/30 hover:to-emerald/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <span className="text-sm sm:text-base font-semibold">{slide.action.text}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
              <Sparkles className="w-full h-full text-white" />
            </div>
            <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 pointer-events-none">
              <Zap className="w-full h-full text-white" />
            </div>
          </div>
        ))}
      </div>

      {/* Navigation controls */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity text-white bg-black/20 backdrop-blur-sm rounded-full p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100 transition-opacity text-white bg-black/20 backdrop-blur-sm rounded-full p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
              index === currentSlide 
                ? 'bg-white scale-110' 
                : 'bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroSection
