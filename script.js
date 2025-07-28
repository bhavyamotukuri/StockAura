function analyzeSentiment() {
  const ticker = document.getElementById('ticker-select').value;
  const out = document.getElementById('sentiment-result');
  if (!ticker) {
    out.innerHTML = '<p style="color:#d32f2f">Please select a stock.</p>';
    return;
  }
  out.innerHTML = '<p>Analyzing...</p>';
  setTimeout(() => {
    const p = (Math.random()*100).toFixed(1);
    const n = (Math.random()*(100-p)).toFixed(1);
    const u = (100 - p - n).toFixed(1);
    out.innerHTML = `
      <div class="result">
        <h3>Sentiment for ${ticker}</h3>
        <p style="color:#4caf50">Positive: ${p}%</p>
        <p style="color:#f44336">Negative: ${n}%</p>
        <p style="color:#ffb300">Neutral: ${u}%</p>
      </div>`;
  }, 800);
}
