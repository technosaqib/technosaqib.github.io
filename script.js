fetch('link.json')
  .then(response => {
      if (!response.ok) {
          throw new Error("Failed to load link.json");
      }
      return response.json();
  })
  .then(links => {
      const params = new URLSearchParams(window.location.search);
      const key = params.get('link');

      if (key && links[key]) {
          console.log("Redirecting to:", links[key]); // Debugging log
          window.location.href = links[key]; // Use href instead of replace
      } else {
          document.body.innerHTML = "<h2 style='color: red; text-align: center;'>Invalid or missing link!</h2>";
      }
  })
  .catch(error => {
      console.error("Error fetching link.json:", error);
      document.body.innerHTML = "<h2 style='color: red; text-align: center;'>Error loading links.</h2>";
  });
