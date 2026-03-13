import http from 'http';

const data = JSON.stringify({
  model: 'gpt-oss:120b',
  prompt: `I am building a Next.js App Router e-commerce site for a Techwear brand named "VOLT".
Current features:
- Global state with Zustand (Cart, User Session, Points, Clearance Levels)
- Dark/Light mode toggle (default is Dark Mode "Black Site" aesthetic)
- The Black Site: A highly restricted member vault where products are visually encrypted and locked based on user's Volt points clearance level.
- Terminal Toasts: Intercept-style animated notifications.
- Custom Tactical Cursor (mix-blend-difference targeting interactive elements).
- Home page with "New Arrivals".
- Shop page with categories (Outerwear, Bottoms, Tops, Footwear).
- Merch page (Accessories, Collectibles).
- Dynamic Product Detail Pages with "Related Assets" rendering loops.
- DALL-E generated cyberpunk/techwear branded product images.
- A WebGL Canvas background shader showing a drifting particle network that reacts to the theme (Volt green / Cyber red in dark mode, stark greys in light mode).
- Framer Motion page transitions and scroll animations.

Give me your brutally honest opinion. What is good? What is missing? What specific features or adjustments should I add next to take it from a polished portfolio piece to a completed, god-tier techwear storefront? Do not sugarcoat it.`,
  stream: false
});

const options = {
  hostname: '127.0.0.1',
  port: 11434,
  path: '/api/generate',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let responseData = '';

  res.on('data', (chunk) => {
    responseData += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(responseData);
      console.log(parsed.response);
    } catch (e) {
      console.error('Error parsing response:', e);
      console.log('Raw response:', responseData);
    }
  });
});

req.on('error', (error) => {
  console.error('Error connecting to Ollama:', error);
});

req.write(data);
req.end();
