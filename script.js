fetch('link.json')
  .then(response => response.json())
  .then(links => {
      const urlParams = new URLSearchParams(window.location.search);
      const requestedLink = urlParams.get('link');
      if (requestedLink && links[requestedLink]) {
          window.location.href = links[requestedLink];
      }
  });
