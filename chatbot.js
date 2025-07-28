(function () {
  const chatbot = document.getElementById('chatbot');
  const toggleBtn = document.getElementById('chatbot-toggle');
  const messagesContainer = document.getElementById('chatbot-messages');
  const input = document.getElementById('chatbot-input');
  const sendBtn = document.getElementById('chatbot-send-btn');
  const closeBtn = document.getElementById('chatbot-close');

  const alphaVantageKey = '0I8GJF0A5M1PNCD8';
  const newsApiKey = '5c50e259f11a49b685c60a68410084a0';

  const tickerMap = {
    'tsla': 'TSLA', 'tesla': 'TSLA',
    'aapl': 'AAPL', 'apple': 'AAPL',
    'amzn': 'AMZN', 'amazon': 'AMZN',
    'googl': 'GOOGL', 'google': 'GOOGL',
    'msft': 'MSFT', 'microsoft': 'MSFT',
    'meta': 'META', 'facebook': 'META',
    'nvda': 'NVDA', 'nvidia': 'NVDA',
    'amd': 'AMD', 'intc': 'INTC',
    'ba': 'BA', 'dis': 'DIS', 'jpm': 'JPM',
    'bac': 'BAC', 'wmt': 'WMT', 't': 'T',
    'vz': 'VZ', 'pfe': 'PFE', 'mrna': 'MRNA',
    'xom': 'XOM', 'cvx': 'CVX', 'nke': 'NKE',
    'ko': 'KO', 'pep': 'PEP', 'mcd': 'MCD',
    'sbux': 'SBUX', 'adbe': 'ADBE', 'crm': 'CRM',
    'uber': 'UBER', 'lyft': 'LYFT'
  };

  toggleBtn.onclick = () => {
    chatbot.classList.toggle('open');
    if (chatbot.classList.contains('open') && messagesContainer.children.length === 0) {
      appendMessage("Hello! Ask me about stocks like TSLA, AAPL, AMZN...", 'bot');
    }
  };

  closeBtn.onclick = () => chatbot.classList.remove('open');

  function appendMessage(text, type = 'bot') {
    const msg = document.createElement('div');
    msg.className = 'chatbot-message ' + type;
    msg.textContent = text;
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  async function fetchStockPrice(ticker) {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${ticker}&apikey=${alphaVantageKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data["Global Quote"] && data["Global Quote"]["05. price"]) {
        return parseFloat(data["Global Quote"]["05. price"]).toFixed(2);
      } else {
        return null;
      }
    } catch (error) {
      console.error("FetchStockPrice error:", error);
      return null;
    }
  }

  async function fetchStockNews(ticker) {
    const url = `https://newsapi.org/v2/everything?q=${ticker}&language=en&sortBy=publishedAt&pageSize=3&apiKey=${newsApiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles && data.articles.length > 0) {
        return data.articles.map(a => ({
          title: a.title,
          url: a.url,
          source: a.source.name,
          publishedAt: new Date(a.publishedAt).toLocaleDateString()
        }));
      }
      return [];
    } catch (error) {
      console.error("FetchStockNews error:", error);
      return [];
    }
  }

  async function handleUserInput() {
    const text = input.value.trim().toLowerCase();
    if (!text) return;
    appendMessage(text, 'user');
    input.value = '';

    // match only full words (not substring)
   
    const words = text.split(/\W+/); // split by non-word characters
let ticker = null;
for (const word of words) {
  if (tickerMap[word]) {
    ticker = tickerMap[word];
    break;
  }
}

    if (ticker) {
      appendMessage(`Looking up info for ${ticker}...`, 'bot');

      const price = await fetchStockPrice(ticker);
      if (price) {
        appendMessage(`Current price of ${ticker} is $${price}.`, 'bot');
      } else {
        appendMessage(`Sorry, couldn't fetch price for ${ticker} right now.`, 'bot');
      }

      const news = await fetchStockNews(ticker);
      if (news.length > 0) {
        appendMessage(`Latest news for ${ticker}:`, 'bot');
        news.forEach(article => {
          appendMessage(`• ${article.title} (${article.source}, ${article.publishedAt})\n${article.url}`, 'bot');
        });
      } else {
        appendMessage(`No recent news found for ${ticker}.`, 'bot');
      }

    } else {
      // basic friendly replies
      if (text.includes("thanks")) {
        appendMessage("You're welcome! Let me know if you need stock info anytime 😊", 'bot');
      } else if (text.includes("hello") || text.includes("hi")) {
        appendMessage("Hi there! Ask me about a stock like Tesla or AAPL!", 'bot');
      } else {
        appendMessage("Hmm, I couldn’t match that to a stock. Try something like 'Tell me about Tesla'.", 'bot');
      }
    }
  }

  // ✅ FIXED: Event listeners placed OUTSIDE the function
  sendBtn.onclick = handleUserInput;
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleUserInput();
  });
})();
