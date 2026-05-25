import React, { useState, useEffect } from 'react';

const marketDataArray = [
  {
    target_asset: "White Teff (Quintal)",
    image_url: "/white_teff_grains_1779735686478.png",
    current_price: "10,500 ETB",
    market_trend: "UP",
    predicted_change_percent: "+2.9%",
    confidence_score: "88%",
    amharic_insight: "የነጭ ጤፍ ዋጋ በሚቀጥሉት 48 ሰዓታት ውስጥ የ2.9% ጭማሪ ያሳያል ተብሎ ይጠበቃል። ይህ የሆነው በበዓል ገበያ ምክንያት የፍላጎት መጠን በመጨመሩ ነው።",
    english_summary: "Holiday demand driving price up."
  },
  {
    target_asset: "Holiday Sheep / Beg",
    image_url: "/holiday_sheep_1779737081976.png",
    current_price: "12,000 ETB",
    market_trend: "UP",
    predicted_change_percent: "+8.5%",
    confidence_score: "95%",
    amharic_insight: "በበዓል ምክንያት የበግ ፍላጎት በከፍተኛ ሁኔታ ስለጨመረ ዋጋው እስከ 8.5% ሊጨምር እንደሚችል መረጃዎች ያሳያሉ።",
    english_summary: "Peak holiday demand for livestock."
  },
  {
    target_asset: "Spiced Butter / Niter Kibbeh (Kg)",
    image_url: "/ethiopian_butter_1779737395921.png",
    current_price: "1,100 ETB",
    market_trend: "UP",
    predicted_change_percent: "+4.1%",
    confidence_score: "90%",
    amharic_insight: "የንጥር ቅቤ አቅርቦት አነስተኛ በመሆኑ እና የፍላጎት መጨመር ዋጋውን ከፍ ሊያደርገው ችሏል።",
    english_summary: "Supply shortage increasing prices."
  },
  {
    target_asset: "Red Onions (Kilo)",
    image_url: "/red_onions_market_1779736200081.png",
    current_price: "95 ETB",
    market_trend: "DOWN",
    predicted_change_percent: "-5.2%",
    confidence_score: "85%",
    amharic_insight: "የቀይ ሽንኩርት አቅርቦት በገበያ ላይ በመጨመሩ ምክንያት ዋጋው በ5.2% ይቀንሳል ተብሎ ይገመታል።",
    english_summary: "Oversupply reducing retail prices."
  },
  {
    target_asset: "Roasted Coffee (Buna) - 1 Kg",
    image_url: "/roasted_coffee_beans_1779736142602.png",
    current_price: "1,200 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "0.0%",
    confidence_score: "92%",
    amharic_insight: "የቡና ዋጋ በአሁኑ ወቅት የተረጋጋ ሲሆን በሚቀጥሉት ቀናትም ምንም አይነት የዋጋ ለውጥ አይታይም ብለን እንጠብቃለን።",
    english_summary: "Export supply meeting local demand."
  },
  {
    target_asset: "Live Chicken / Doro",
    image_url: "/holiday_sheep_1779737081976.png", // fallback image
    current_price: "1,500 ETB",
    market_trend: "UP",
    predicted_change_percent: "+6.0%",
    confidence_score: "91%",
    amharic_insight: "የዶሮ ዋጋ በበዓል ገበያ ምክንያት መጠነኛ ጭማሪ በማሳየት ላይ ይገኛል።",
    english_summary: "High holiday demand."
  },
  {
    target_asset: "Fresh Eggs (1 unit)",
    image_url: "/ethiopian_butter_1779737395921.png", // fallback image
    current_price: "15 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "+0.5%",
    confidence_score: "80%",
    amharic_insight: "የእንቁላል ዋጋ የተረጋጋ ሁኔታ ላይ ይገኛል።",
    english_summary: "Stable market pricing."
  },
  {
    target_asset: "Garlic / Netch Shinkurt (Kg)",
    image_url: "/red_onions_market_1779736200081.png", // fallback image
    current_price: "350 ETB",
    market_trend: "UP",
    predicted_change_percent: "+2.1%",
    confidence_score: "84%",
    amharic_insight: "የነጭ ሽንኩርት አቅርቦት በመቀነሱ ምክንያት የዋጋ ጭማሪ ታይቷል።",
    english_summary: "Moderate price increase."
  },
  {
    target_asset: "Berbere Spice (Kg)",
    image_url: "/roasted_coffee_beans_1779736142602.png", // fallback image
    current_price: "750 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "0.0%",
    confidence_score: "89%",
    amharic_insight: "የበርበሬ ዋጋ ምንም ለውጥ ሳያሳይ እንደቀጠለ ነው።",
    english_summary: "Prices remain stable."
  },
  {
    target_asset: "Cooking Oil (5 Liters)",
    image_url: "/ethiopian_butter_1779737395921.png", // fallback image
    current_price: "1,150 ETB",
    market_trend: "DOWN",
    predicted_change_percent: "-1.5%",
    confidence_score: "82%",
    amharic_insight: "የዘይት አቅርቦት በገበያው ውስጥ በመሻሻሉ ዋጋው መጠነኛ ቅናሽ አሳይቷል።",
    english_summary: "Slight decrease in price."
  },
  {
    target_asset: "Wheat / Sende (Quintal)",
    image_url: "/white_teff_grains_1779735686478.png", // fallback image
    current_price: "7,500 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "+0.2%",
    confidence_score: "86%",
    amharic_insight: "የስንዴ ገበያ አሁን ላይ የተረጋጋ ነው።",
    english_summary: "Market is holding steady."
  },
  {
    target_asset: "Potatoes / Dinich (Kg)",
    image_url: "/red_onions_market_1779736200081.png", // fallback image
    current_price: "45 ETB",
    market_trend: "DOWN",
    predicted_change_percent: "-3.0%",
    confidence_score: "75%",
    amharic_insight: "የድንች ምርት በስፋት ወደ ገበያ በመግባቱ ዋጋው ቀንሷል።",
    english_summary: "Harvest season oversupply."
  },
  {
    target_asset: "Tomatoes / Timatim (Kg)",
    image_url: "/red_onions_market_1779736200081.png", // fallback image
    current_price: "85 ETB",
    market_trend: "UP",
    predicted_change_percent: "+5.5%",
    confidence_score: "88%",
    amharic_insight: "የቲማቲም አቅርቦት እጥረት ስለገጠመው ዋጋው በከፍተኛ ሁኔታ ጨምሯል።",
    english_summary: "Shortage pushing prices up."
  },
  {
    target_asset: "Macaroni / Pasta (Kg)",
    image_url: "/white_teff_grains_1779735686478.png", // fallback image
    current_price: "120 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "0.0%",
    confidence_score: "95%",
    amharic_insight: "የፓስታ እና ማካሮኒ ዋጋ የተረጋጋ ነው።",
    english_summary: "Stable supply chain."
  },
  {
    target_asset: "Sugar / Sikuar (Kg)",
    image_url: "/ethiopian_butter_1779737395921.png", // fallback image
    current_price: "110 ETB",
    market_trend: "UP",
    predicted_change_percent: "+1.2%",
    confidence_score: "81%",
    amharic_insight: "የስኳር ስርጭት በመዘግየቱ ምክንያት ትንሽ የዋጋ ለውጥ ታይቷል።",
    english_summary: "Minor distribution delays."
  },
  {
    target_asset: "Beef / Siga (Kg)",
    image_url: "/holiday_sheep_1779737081976.png", // fallback image
    current_price: "1,300 ETB",
    market_trend: "UP",
    predicted_change_percent: "+4.5%",
    confidence_score: "93%",
    amharic_insight: "በበዓል ምክንያት የስጋ ፍላጎት በከፍተኛ ሁኔታ ጨምሯል።",
    english_summary: "High demand for holiday."
  },
  {
    target_asset: "Pure Honey / Mar (Kg)",
    image_url: "/ethiopian_butter_1779737395921.png", // fallback image
    current_price: "850 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "0.0%",
    confidence_score: "87%",
    amharic_insight: "የማር ዋጋ በአሁኑ ወቅት ምንም አይነት ለውጥ አላሳየም።",
    english_summary: "Prices remain stable."
  },
  {
    target_asset: "Live Goat / Fiyel",
    image_url: "/holiday_sheep_1779737081976.png", // fallback image
    current_price: "9,000 ETB",
    market_trend: "UP",
    predicted_change_percent: "+7.0%",
    confidence_score: "92%",
    amharic_insight: "የፍየል ገበያም እንደ በግ ሁሉ በበዓል ሰሞን ዋጋው ንሯል።",
    english_summary: "Holiday season spike."
  },
  {
    target_asset: "Shiro Powder (Kg)",
    image_url: "/roasted_coffee_beans_1779736142602.png", // fallback image
    current_price: "450 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "0.0%",
    confidence_score: "90%",
    amharic_insight: "የሽሮ አቅርቦት በቂ በመሆኑ ዋጋው የተረጋጋ ነው።",
    english_summary: "Steady local supply."
  },
  {
    target_asset: "Lentils / Misir (Kg)",
    image_url: "/roasted_coffee_beans_1779736142602.png", // fallback image
    current_price: "220 ETB",
    market_trend: "STABLE",
    predicted_change_percent: "+0.8%",
    confidence_score: "85%",
    amharic_insight: "የምስር ዋጋ መጠነኛ ጭማሪ ቢያሳይም በአብዛኛው የተረጋጋ ነው።",
    english_summary: "Slight variation."
  }
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Cycle through items every 10 seconds (10000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setFade(false); // Trigger fade out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % marketDataArray.length);
        setFade(true); // Trigger fade in
      }, 500); // 500ms delay for fade transition
    }, 10000); 

    return () => clearInterval(timer);
  }, []);

  const data = marketDataArray[currentIndex];
  
  const trendColorHex = data.market_trend === 'UP' ? '#2ECC71' : 
                        data.market_trend === 'DOWN' ? '#E74C3C' : '#7F8C8D';

  const trendClass = data.market_trend === 'UP' ? 'trend-up' : 
                     data.market_trend === 'DOWN' ? 'trend-down' : 'trend-stable';

  return (
    <>
      <div className={`glass-panel main-carousel-card ${trendClass}`} style={{ position: 'relative' }}>
        
        <header className="dashboard-header" style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease' }}>
          <div className="dashboard-title">
            <h1>{data.target_asset}</h1>
            <p>Market Prediction Dashboard • Auto-updating ({currentIndex + 1} of {marketDataArray.length})</p>
          </div>
          <div className="summary-badge" style={{ color: trendColorHex }}>
            {data.english_summary}
          </div>
        </header>

        <div className="card-content-wrapper" style={{ opacity: fade ? 1 : 0, transition: 'opacity 0.5s ease', transform: fade ? 'translateX(0)' : 'translateX(-20px)' }}>
          
          {/* Photo Section */}
          <div className="image-section glass-panel" style={{ padding: 0 }}>
            <img src={data.image_url} alt={data.target_asset} />
          </div>

          {/* Data Section */}
          <div className="data-section">
            <div className="metrics-grid">
              <div className="metric-card glass-panel">
                <h3>Current Price</h3>
                <div className="value" style={{ color: 'var(--text-primary)', fontSize: '2rem' }}>
                  {data.current_price}
                </div>
              </div>
              <div className="metric-card glass-panel">
                <h3>Predicted Change</h3>
                <div className="value" style={{ color: trendColorHex }}>
                  {data.predicted_change_percent}
                </div>
              </div>
            </div>

            <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="metric-card glass-panel">
                <h3>Market Trend</h3>
                <div className="value" style={{ color: trendColorHex }}>
                  {data.market_trend}
                </div>
              </div>
              <div className="metric-card glass-panel">
                <h3>AI Confidence</h3>
                <div className="value" style={{ color: 'var(--text-primary)' }}>
                  {data.confidence_score}
                </div>
              </div>
            </div>

            <div className="insight-container glass-panel" style={{ flex: 1, justifyContent: 'center' }}>
              <div className="insight-header">
                <div className="insight-icon">
                  {data.market_trend === 'UP' ? '📈' : data.market_trend === 'DOWN' ? '📉' : '➖'}
                </div>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>AI Engine Insight</h2>
              </div>
              <div className="insight-content">
                <p className="amharic-text">{data.amharic_insight}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Indicators */}
        <div className="carousel-indicators" style={{ flexWrap: 'wrap' }}>
          {marketDataArray.map((_, idx) => (
            <div 
              key={idx} 
              className={`indicator ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setCurrentIndex(idx);
                  setFade(true);
                }, 500);
              }}
              title={marketDataArray[idx].target_asset}
            ></div>
          ))}
        </div>

      </div>
      
      <div className="system-status">
        <div className="status-dot active"></div>
        <span>AI Engine: Live Streaming {marketDataArray.length} Assets (ETB Market)</span>
      </div>
    </>
  );
}

export default App;
