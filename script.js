async function redirect() {
    const response = await fetch('links.json');
    const links = await response.json();
    const path = window.location.pathname.replace("/", "");
    window.location.href = links[path] || links["default"];
}
redirect();
