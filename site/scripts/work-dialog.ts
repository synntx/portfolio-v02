import { wireChapters } from "./chapters";
import { drawCurve } from "./curve";
import { tenure } from "./timeline";

function wire(body: HTMLElement) {
  const fold = body.querySelector<HTMLElement>(".fold");
  const emptyCard = fold?.classList.contains("is-empty")
    ? fold.querySelector<HTMLElement>(".fold-card")
    : null;
  if (emptyCard) drawCurve(emptyCard);
  else if (fold) wireChapters(fold);
  const when = body.querySelector<HTMLElement>("[data-joined]");
  if (when?.dataset.joined) when.textContent = tenure(when.dataset.joined);
}

export function startWorkDialog(dialog: HTMLDialogElement) {
  const panels = new Map(
    [
      ...document.querySelectorAll<HTMLTemplateElement>("template[data-panel]"),
    ].map((template) => [template.dataset.panel ?? "", template]),
  );
  let openedByPush = false;
  let openId: string | null = null;

  const open = (id: string, { fromHistory = false } = {}) => {
    const template = panels.get(id);
    if (!template) return;
    const wasOpen = dialog.open;
    openId = id;
    dialog.replaceChildren(template.content.cloneNode(true));
    if (!wasOpen) dialog.showModal();
    const body = dialog.querySelector<HTMLElement>(".panel-body");
    if (!body) return;
    if (wasOpen) body.focus();
    wire(body);
    body.getBoundingClientRect();
    body.classList.add("is-ready");
    if (fromHistory || location.hash === `#${id}`) return;
    if (wasOpen) {
      history.replaceState(null, "", `#${id}`);
      return;
    }
    history.pushState(null, "", `#${id}`);
    openedByPush = true;
  };

  dialog.addEventListener("close", () => {
    const lostFocus =
      document.activeElement === document.body ||
      dialog.contains(document.activeElement);
    if (lostFocus)
      document
        .querySelector<HTMLElement>(`button[data-job="${openId}"]`)
        ?.focus();
    if (!location.hash) return;
    if (openedByPush) {
      openedByPush = false;
      history.back();
    } else {
      history.replaceState(null, "", location.pathname + location.search);
    }
  });
  dialog.addEventListener("click", (event) => {
    const target = event.target as Element;
    if (target === dialog || target.closest(".panel-close")) {
      dialog.close();
      return;
    }
    const go = target.closest<HTMLElement>("[data-go]");
    if (go?.dataset.go) open(go.dataset.go);
  });
  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);
    if (panels.has(id)) {
      open(id, { fromHistory: true });
    } else if (dialog.open) {
      openedByPush = false;
      dialog.close();
    }
  });
  document
    .querySelectorAll<HTMLButtonElement>("button[data-job]")
    .forEach((row) => {
      row.addEventListener("click", () => open(row.dataset.job ?? ""));
    });

  const initial = location.hash.slice(1);
  if (panels.has(initial)) open(initial, { fromHistory: true });
}
