const COPIED_MS = 1600;

export function startCopyEmail(button: HTMLButtonElement, status: HTMLElement) {
  const email = button.dataset.email ?? "";
  const copiedText = button.dataset.tip ?? "";
  let timer = 0;

  button.addEventListener("click", async () => {
    let copied = true;
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      copied = false;
    }
    button.dataset.tip = copied ? copiedText : email;
    button.classList.add("is-copied");
    button.classList.toggle("is-refused", !copied);
    status.textContent = copied ? copiedText : email;
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.classList.remove("is-copied");
      status.textContent = "";
    }, COPIED_MS);
  });
}
