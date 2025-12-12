import React, { useState, useEffect } from 'react';
import { getTodayCount, updateCount } from '../services/gasApi';

const EmoPush = () => {
  const [counts, setCounts] = useState({
    happy: 0,
    done: 0,
    fire: 0,
    scream: 0,
    coffee: 0,
    clown: 0
  });
  const [activeEmoji, setActiveEmoji] = useState(null);
  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const emojis = [
    { id: 'happy', emoji: '🌼', color: 'from-yellow-300 to-yellow-500' },
    { id: 'done', emoji: '🙌', color: 'from-green-400 to-emerald-500' },
    { id: 'fire', emoji: '🔥', color: 'from-orange-400 to-red-500' },
    { id: 'scream', emoji: '😱', color: 'from-purple-400 to-pink-500' },
    { id: 'coffee', emoji: '☕️', color: 'from-amber-600 to-amber-800' },
    { id: 'clown', emoji: '🤡', color: 'from-red-400 to-pink-600' }
  ];

  // 初回ロード時にGASからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTodayCount();
      if (data && data.counts) {
        setCounts(data.counts);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // カウント数に応じた相対的なスケール計算
  const getScale = (count) => {
    const maxCount = Math.max(...Object.values(counts), 1);
    const minScale = 0.7;
    const maxScale = 1.3;
    const ratio = count / maxCount;
    return minScale + (ratio * (maxScale - minScale));
  };

  const handleEmojiClick = async (emojiId, emoji, event) => {
    // UIを即座に更新
    setCounts(prev => ({
      ...prev,
      [emojiId]: prev[emojiId] + 1
    }));

    setActiveEmoji(emojiId);
    setTimeout(() => setActiveEmoji(null), 300);

    // クリックされたボタンの位置を取得
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const containerRect = button.closest('.bg-white').getBoundingClientRect();
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;

    // パーティクルエフェクト（パーンと弾ける）
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emoji,
      angle: (360 / 16) * i + Math.random() * 15 - 7.5,
      distance: 100 + Math.random() * 80,
      rotation: Math.random() * 1080 - 540,
      startX: centerX,
      startY: centerY,
      delay: Math.random() * 0.1
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);

    // GASにデータを送信（バックグラウンドで）
    const result = await updateCount(emojiId);
    if (result && result.counts) {
      // サーバーから返ってきた正確なデータで更新
      setCounts(result.counts);
    }
  };

  // 今日の日付を英語形式で取得
  const getTodayDate = () => {
    const today = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return today.toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-purple-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-8">
      <style>{`
        @keyframes particle-burst {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          20% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(var(--distance) * -1)) rotate(var(--rotation)) scale(0.2);
            opacity: 0;
          }
        }
      `}</style>
      <div className="max-w-2xl w-full">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            EmoPush
          </h1>
        </div>

        {/* メインカード */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 backdrop-blur-lg bg-opacity-90 relative">
          {/* 背景の装飾 */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-200 to-indigo-200 rounded-full blur-3xl opacity-30 -ml-16 -mb-16"></div>

          {/* パーティクルコンテナ（ボタンの外に表示） */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-visible">
            {particles.map(particle => (
              <span
                key={particle.id}
                className="absolute text-4xl"
                style={{
                  left: `${particle.startX}px`,
                  top: `${particle.startY}px`,
                  animation: 'particle-burst 1s ease-out forwards',
                  animationDelay: `${particle.delay}s`,
                  '--angle': `${particle.angle}deg`,
                  '--distance': `${particle.distance}px`,
                  '--rotation': `${particle.rotation}deg`
                }}
              >
                {particle.emoji}
              </span>
            ))}
          </div>

          {/* 絵文字ボタングリッド */}
          <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
            {emojis.map((item) => {
              const scale = getScale(counts[item.id]);
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleEmojiClick(item.id, item.emoji, e)}
                  className={`group relative bg-gradient-to-br ${item.color} rounded-2xl p-6 
                    transform transition-all duration-300 hover:scale-110 hover:shadow-xl
                    ${activeEmoji === item.id ? 'scale-95' : ''}
                    active:scale-95`}
                  style={{
                    transform: `scale(${scale})`
                  }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-4xl transform group-hover:scale-110 transition-transform">
                      {item.emoji}
                    </div>
                    <div className="bg-white bg-opacity-30 backdrop-blur-sm rounded-full px-3 py-1 text-white font-bold text-sm">
                      {counts[item.id]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 統計情報 */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 relative z-10">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{getTodayDate()} EmoPush</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {Object.values(counts).reduce((a, b) => a + b, 0)}
              </span>
              <span className="text-gray-600">pushes</span>
            </div>
          </div>

          {/* フッター */}
          <div className="mt-6 text-center text-sm text-gray-400">
            毎日 0:00 にリセットされます
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmoPush;