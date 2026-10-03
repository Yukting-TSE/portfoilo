/** Instantly pin the window at the top. CSS `scroll-behavior: smooth` is ignored. */
export function jumpToTop() {
  const html = document.documentElement;
  const prevInline = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = prevInline;
}
