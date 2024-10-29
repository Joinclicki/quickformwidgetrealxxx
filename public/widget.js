// Clicki Referrals Widget
(function() {
  // Create root container if it doesn't exist
  let widgetContainer = document.getElementById('clicki-referral-widget');
  if (!widgetContainer) {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'clicki-referral-widget';
    document.body.appendChild(widgetContainer);
  }

  // Initialize widget after all dependencies are loaded
  function initializeWidget() {
    const WidgetComponent = window.ClickiReferralWidget;
    if (!WidgetComponent) {
      console.error('Widget component not found');
      return;
    }

    const root = ReactDOM.createRoot(widgetContainer);
    root.render(React.createElement(WidgetComponent, { 
      config: window.ClickiReferral.config 
    }));
  }

  // Load required styles
  const styles = [
    'https://curious-fenglisu-21c267.netlify.app/index.css'
  ];

  // Load required scripts in order
  const scripts = [
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://curious-fenglisu-21c267.netlify.app/app.js'
  ];

  // Load styles
  styles.forEach(href => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  });

  // Helper function to load scripts sequentially
  async function loadScriptsInOrder(scripts) {
    for (const src of scripts) {
      if (!document.querySelector(`script[src="${src}"]`)) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = src;
          script.async = true;
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }
    }
  }

  // Load all scripts and initialize
  loadScriptsInOrder(scripts)
    .then(() => {
      // Wait a brief moment to ensure all scripts are properly initialized
      setTimeout(initializeWidget, 100);
    })
    .catch(error => {
      console.error('Error loading Clicki Referral widget:', error);
    });
})();