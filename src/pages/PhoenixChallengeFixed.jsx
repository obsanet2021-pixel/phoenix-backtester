import React, { useState, useEffect } from 'react';
import './PhoenixChallengeFixed.css';

const PhoenixChallengeFixed = () => {
  const [activeChallenge, setActiveChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState({
    totalTrades: 0,
    winRate: 0,
    profitLoss: 0,
    challengesCompleted: 0,
    currentStreak: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Demo challenges for new users
  const challenges = [
    {
      id: 1,
      title: "First Trade Challenge",
      description: "Place your first trade and learn the basics",
      difficulty: "Beginner",
      requirements: {
        trades: 1,
        profit: 0
      },
      reward: "100 XP",
      icon: "🎯",
      status: "available"
    },
    {
      id: 2,
      title: "Risk Management Master",
      description: "Complete 10 trades with maximum 2% risk per trade",
      difficulty: "Intermediate",
      requirements: {
        trades: 10,
        maxRisk: 2
      },
      reward: "250 XP",
      icon: "🛡️",
      status: userProgress.totalTrades >= 5 ? "available" : "locked"
    },
    {
      id: 3,
      title: "Profit Target Pro",
      description: "Achieve $500 profit in a single trading session",
      difficulty: "Advanced",
      requirements: {
        profit: 500,
        trades: 5
      },
      reward: "500 XP",
      icon: "💰",
      status: userProgress.totalTrades >= 20 ? "available" : "locked"
    },
    {
      id: 4,
      title: "Consistency King",
      description: "Maintain 60% win rate over 50 trades",
      difficulty: "Expert",
      requirements: {
        trades: 50,
        winRate: 60
      },
      reward: "1000 XP",
      icon: "👑",
      status: userProgress.totalTrades >= 50 ? "available" : "locked"
    }
  ];

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('phoenixChallengeProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (newProgress) => {
    setUserProgress(newProgress);
    localStorage.setItem('phoenixChallengeProgress', JSON.stringify(newProgress));
  };

  const startChallenge = (challenge) => {
    if (challenge.status === 'locked') {
      alert('This challenge is locked! Complete previous challenges first.');
      return;
    }

    setActiveChallenge(challenge);
    setIsLoading(true);
    
    // Simulate challenge start
    setTimeout(() => {
      setIsLoading(false);
      alert(`Started: ${challenge.title}\n\n${challenge.description}\n\nGood luck! 🚀`);
    }, 1000);
  };

  const updateProgress = (tradeData) => {
    const newProgress = {
      ...userProgress,
      totalTrades: userProgress.totalTrades + 1,
      winRate: userProgress.totalTrades > 0 ? 
        ((userProgress.winRate * userProgress.totalTrades + (tradeData.profit > 0 ? 100 : 0)) / (userProgress.totalTrades + 1)) : 0,
      profitLoss: userProgress.profitLoss + tradeData.profit,
      currentStreak: tradeData.profit > 0 ? userProgress.currentStreak + 1 : 0
    };

    // Check challenge completion
    challenges.forEach(challenge => {
      if (challenge.status === 'available' || challenge.status === 'active') {
        let completed = false;
        
        if (challenge.id === 1 && newProgress.totalTrades >= challenge.requirements.trades) {
          completed = true;
        }
        if (challenge.id === 2 && newProgress.totalTrades >= challenge.requirements.trades) {
          completed = true;
        }
        if (challenge.id === 3 && newProgress.profitLoss >= challenge.requirements.profit) {
          completed = true;
        }
        if (challenge.id === 4 && newProgress.totalTrades >= challenge.requirements.trades && newProgress.winRate >= challenge.requirements.winRate) {
          completed = true;
        }

        if (completed) {
          challenge.status = 'completed';
          newProgress.challengesCompleted += 1;
          alert(`🎉 Challenge Completed: ${challenge.title}\n+${challenge.reward}`);
        }
      }
    });

    saveProgress(newProgress);
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      const resetData = {
        totalTrades: 0,
        winRate: 0,
        profitLoss: 0,
        challengesCompleted: 0,
        currentStreak: 0
      };
      saveProgress(resetData);
      
      // Reset challenge statuses
      challenges.forEach(challenge => {
        if (challenge.id === 1) {
          challenge.status = 'available';
        } else {
          challenge.status = 'locked';
        }
      });
    }
  };

  return (
    <div className="challenge-container">
      <div className="challenge-header">
        <h1>🔥 Phoenix Trading Challenges</h1>
        <p>Complete challenges to earn XP and unlock advanced features!</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.totalTrades}</div>
            <div className="stat-label">Total Trades</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.winRate.toFixed(1)}%</div>
            <div className="stat-label">Win Rate</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">${userProgress.profitLoss.toFixed(2)}</div>
            <div className="stat-label">Total P&L</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">{userProgress.challengesCompleted}</div>
            <div className="stat-label">Challenges</div>
          </div>
        </div>
      </div>

      <div className="challenges-grid">
        {challenges.map(challenge => (
          <div 
            key={challenge.id} 
            className={`challenge-card ${challenge.status}`}
            onClick={() => startChallenge(challenge)}
          >
            <div className="challenge-header">
              <div className="challenge-icon">{challenge.icon}</div>
              <div className="challenge-title">{challenge.title}</div>
              <div className="challenge-difficulty">{challenge.difficulty}</div>
            </div>
            
            <div className="challenge-description">{challenge.description}</div>
            
            <div className="challenge-requirements">
              <h4>Requirements:</h4>
              <ul>
                {Object.entries(challenge.requirements).map(([key, value]) => (
                  <li key={key}>
                    {key === 'trades' && `${value} trades`}
                    {key === 'profit' && `$${value} profit`}
                    {key === 'winRate' && `${value}% win rate`}
                    {key === 'maxRisk' && `Max ${value}% risk`}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="challenge-footer">
              <div className="challenge-reward">🎁 {challenge.reward}</div>
              <div className="challenge-status">
                {challenge.status === 'completed' && '✅ Completed'}
                {challenge.status === 'available' && '▶️ Start'}
                {challenge.status === 'locked' && '🔒 Locked'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="challenge-actions">
        <button className="reset-btn" onClick={resetProgress}>
          🔄 Reset Progress
        </button>
        <button className="simulate-btn" onClick={() => updateProgress({ profit: Math.random() > 0.5 ? 25 : -15 })}>
          🎲 Simulate Trade
        </button>
      </div>

      {activeChallenge && (
        <div className="active-challenge-modal">
          <div className="modal-content">
            <h3>🚀 Active Challenge</h3>
            <h2>{activeChallenge.title}</h2>
            <p>{activeChallenge.description}</p>
            {isLoading && <div className="loading-spinner">Loading...</div>}
            <button onClick={() => setActiveChallenge(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoenixChallengeFixed;
