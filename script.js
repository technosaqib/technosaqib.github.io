fetch('link.json')
  .then(response => response.json())
  .then(data => {
    const params = new URLSearchParams(window.location.search);
    const linkKey = params.get('link');

    if (linkKey && data[linkKey]) {
      window.location.href = data[linkKey]; // Redirect
    } else {
      document.body.innerHTML = "<h2>Invalid Link</h2>";
    }
  })
  .catch(error => console.error('Error loading links:', error));
