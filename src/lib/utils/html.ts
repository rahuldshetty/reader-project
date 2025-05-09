export const cleanHTML = (content:string, url:string) => {
  const div = document.createElement("div");
  div.innerHTML = content;

  div.querySelectorAll("a").forEach((a) => {
    a.removeAttribute("href");
    a.style.pointerEvents = "none";
    a.style.cursor = "default";
    a.style.color = "inherit";
    a.style.textDecoration = "none";
  })

    // Replace above with below code to use redirect when user clicks on link
//   div.querySelectorAll("a").forEach((a) => {
//     a.setAttribute("target", "_blank");
//     a.setAttribute("rel", "noopener noreferrer");
//   });

  return div.innerHTML;
}

