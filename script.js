fetch('link.json')
  .then(response => response.json())
  .then(links => {
      const params = new URLSearchParams(window.location.search);
      const key = params.get('link');

      if (key && links[key]) {
          window.location.replace(links[key]);  // Redirect to the correct link
      } else {
          document.body.innerHTML = "<h2 style='color: red; text-align: center;'>Invalid or missing link!</h2>";
      }
  })
  .catch(error => {
      console.error("Error fetching link.json:", error);
      document.body.innerHTML = "<h2 style='color: red; text-align: center;'>Error loading links.</h2>";
  });
