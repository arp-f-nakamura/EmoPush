import React, { useState, useEffect } from "react";
import { getTodayCount, updateCount } from "../services/gasApi";

const EmoPush = () => {
  const [counts, setCounts] = useState({
    happy: 0,
    done: 0,
    fire: 0,
    scream: 0,
    coffee: 0,
    clown: 0,
  });
  const [activeEmoji, setActiveEmoji] = useState(null);
  const [particles, setParticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const emojis = [
    { id: "happy", emoji: "🌼", color: "yellow" },
    { id: "done", emoji: "🙌", color: "green" },
    { id: "fire", emoji: "🔥", color: "orange" },
    { id: "scream", emoji: "😱", color: "purple" },
    { id: "coffee", emoji: "☕️", color: "amber" },
    { id: "clown", emoji: "🤡", color: "pink" },
  ];

  // 初回ロード時にGASからデータを取得
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getTodayCount();
      if (data && data.emojis && Array.isArray(data.emojis)) {
        const newCounts = {};
        data.emojis.forEach((item) => {
          newCounts[item.id] = item.count;
        });
        setCounts(newCounts);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getScale = (count) => {
    const maxCount = Math.max(...Object.values(counts), 1);
    const minScale = 0.7;
    const maxScale = 1.3;
    const ratio = count / maxCount;
    return minScale + ratio * (maxScale - minScale);
  };

  const getGradientStyle = (color) => {
    const gradients = {
      yellow:
        "linear-gradient(to bottom right, rgb(253 224 71), rgb(234 179 8))",
      green:
        "linear-gradient(to bottom right, rgb(74 222 128), rgb(34 197 94))",
      orange:
        "linear-gradient(to bottom right, rgb(251 146 60), rgb(239 68 68))",
      purple:
        "linear-gradient(to bottom right, rgb(192 132 252), rgb(236 72 153))",
      amber: "linear-gradient(to bottom right, rgb(217 119 6), rgb(146 64 14))",
      pink: "linear-gradient(to bottom right, rgb(248 113 113), rgb(236 72 153))",
    };
    return gradients[color] || gradients.yellow;
  };

  const handleEmojiClick = async (emojiId, emoji, event) => {
    setCounts((prev) => ({
      ...prev,
      [emojiId]: prev[emojiId] + 1,
    }));

    setActiveEmoji(emojiId);
    setTimeout(() => setActiveEmoji(null), 300);

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const containerRect = button
      .closest(".card-container")
      .getBoundingClientRect();
    const centerX = rect.left - containerRect.left + rect.width / 2;
    const centerY = rect.top - containerRect.top + rect.height / 2;

    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      emoji: emoji,
      angle: (360 / 16) * i + Math.random() * 15 - 7.5,
      distance: 100 + Math.random() * 80,
      rotation: Math.random() * 1080 - 540,
      startX: centerX,
      startY: centerY,
      delay: Math.random() * 0.1,
    }));
    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id))
      );
    }, 1000);

    const result = await updateCount(emojiId);
    if (result && result.emojis && Array.isArray(result.emojis)) {
      const newCounts = {};
      result.emojis.forEach((item) => {
        newCounts[item.id] = item.count;
      });
      setCounts(newCounts);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    const options = { year: "numeric", month: "long", day: "numeric" };
    return today.toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(to bottom right, rgb(224 231 255), rgb(243 232 255), rgb(252 231 243))",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "rgb(147 51 234)",
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right, rgb(224 231 255), rgb(243 232 255), rgb(252 231 243))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
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
        .button-hover:hover {
          transform: scale(1.1);
          box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }
        .button-active:active {
          transform: scale(0.95);
        }
      `}</style>
      <div style={{ maxWidth: "42rem", width: "100%" }}>
        {/* ヘッダー */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1
            style={{
              fontSize: "3rem",
              fontWeight: "bold",
              background:
                "linear-gradient(to right, rgb(147 51 234), rgb(219 39 119))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "0.75rem",
            }}
          >
            EmoPush
          </h1>
        </div>

        {/* メインカード */}
        <div
          className="card-container"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "1.5rem",
            boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
            padding: "2rem",
            position: "relative",
          }}
        >
          {/* 背景の装飾 */}
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "8rem",
              height: "8rem",
              background:
                "linear-gradient(to bottom right, rgb(233 213 255), rgb(251 207 232))",
              borderRadius: "50%",
              filter: "blur(3rem)",
              opacity: 0.3,
              marginRight: "-4rem",
              marginTop: "-4rem",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "8rem",
              height: "8rem",
              background:
                "linear-gradient(to top right, rgb(191 219 254), rgb(224 231 255))",
              borderRadius: "50%",
              filter: "blur(3rem)",
              opacity: 0.3,
              marginLeft: "-4rem",
              marginBottom: "-4rem",
            }}
          ></div>

          {/* パーティクルコンテナ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 20,
              overflow: "visible",
            }}
          >
            {particles.map((particle) => (
              <span
                key={particle.id}
                style={{
                  position: "absolute",
                  fontSize: "2.25rem",
                  left: `${particle.startX}px`,
                  top: `${particle.startY}px`,
                  animation: "particle-burst 1s ease-out forwards",
                  animationDelay: `${particle.delay}s`,
                  "--angle": `${particle.angle}deg`,
                  "--distance": `${particle.distance}px`,
                  "--rotation": `${particle.rotation}deg`,
                }}
              >
                {particle.emoji}
              </span>
            ))}
          </div>

          {/* 絵文字ボタングリッド */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1rem",
              marginBottom: "2rem",
              position: "relative",
              zIndex: 10,
            }}
          >
            {emojis.map((item) => {
              const scale = getScale(counts[item.id]);
              return (
                <button
                  key={item.id}
                  onClick={(e) => handleEmojiClick(item.id, item.emoji, e)}
                  className="button-hover button-active"
                  style={{
                    position: "relative",
                    background: getGradientStyle(item.color),
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    transform: `scale(${scale})`,
                    transition: "all 0.3s",
                    border: "none",
                    cursor: "pointer",
                    ...(activeEmoji === item.id && {
                      transform: `scale(${scale * 0.95})`,
                    }),
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "2.25rem",
                        transition: "transform 0.3s",
                      }}
                    >
                      {item.emoji}
                    </div>
                    <div
                      style={{
                        background: "rgba(255, 255, 255, 0.3)",
                        backdropFilter: "blur(4px)",
                        borderRadius: "9999px",
                        padding: "0.25rem 0.75rem",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "0.875rem",
                      }}
                    >
                      {counts[item.id]}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 統計情報 */}
          <div
            style={{
              background:
                "linear-gradient(to right, rgb(250 245 255), rgb(252 231 243))",
              borderRadius: "1rem",
              padding: "1.5rem",
              position: "relative",
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "rgb(31 41 55)",
                }}
              >
                {getTodayDate()} EmoPush
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  background:
                    "linear-gradient(to right, rgb(147 51 234), rgb(219 39 119))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {Object.values(counts).reduce((a, b) => a + b, 0)}
              </span>
              <span style={{ color: "rgb(75 85 99)" }}>pushes</span>
            </div>
          </div>

          {/* フッター */}
          <div
            style={{
              marginTop: "1.5rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "rgb(156 163 175)",
            }}
          >
            毎日 0:00 にリセットされます
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmoPush;
