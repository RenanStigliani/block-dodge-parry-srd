declare global {
    interface Window {
        turnstile?: {
            reset: (widget?: string | HTMLElement) => void;
        };
    }
}

const WORKER_URL = import.meta.env.PUBLIC_WORKER_URL as string | undefined;

class ReportIssueWidget extends HTMLElement {
    constructor() {
        super();

        const trigger = this.querySelector<HTMLButtonElement>('.report-issue-trigger');
        const dialog = this.querySelector<HTMLDialogElement>('.report-issue-dialog');
        const form = this.querySelector<HTMLFormElement>('.report-issue-form');
        const titleInput = this.querySelector<HTMLInputElement>('input[name="title"]');
        const bodyInput = this.querySelector<HTMLTextAreaElement>('textarea[name="body"]');
        const cancelButton = this.querySelector<HTMLButtonElement>('.report-issue-cancel');
        const submitButton = this.querySelector<HTMLButtonElement>('.report-issue-submit');
        const status = this.querySelector<HTMLParagraphElement>('.report-issue-status');
        const turnstileEl = this.querySelector<HTMLElement>('.report-issue-turnstile');
        const pageTitle = this.dataset.pageTitle ?? document.title;

        if (!trigger || !dialog || !form || !titleInput || !bodyInput || !cancelButton || !submitButton || !status) {
            return;
        }

        const setStatus = (message: string, state?: 'error' | 'success') => {
            status.textContent = message;
            if (state) status.dataset.state = state;
            else delete status.dataset.state;
        };

        trigger.addEventListener('click', () => {
            const selection = window.getSelection()?.toString().trim() ?? '';
            titleInput.value = `Revisão De Texto > ${pageTitle}`;
            bodyInput.value = selection
                ? `Revise o texto abaixo:\n\n> ${selection.replace(/\n/g, '\n> ')}\n\n`
                : 'Revise o texto abaixo:\n\n';
            setStatus('');
            submitButton.disabled = false;
            if (turnstileEl) window.turnstile?.reset(turnstileEl);
            dialog.showModal();
            bodyInput.focus();
        });

        cancelButton.addEventListener('click', () => dialog.close());

        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) dialog.close();
        });

        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            if (!WORKER_URL) {
                setStatus('Envio indisponível no momento.', 'error');
                return;
            }

            const turnstileToken = new FormData(form).get('cf-turnstile-response');
            if (turnstileEl && !turnstileToken) {
                setStatus('Confirme que você não é um robô.', 'error');
                return;
            }

            submitButton.disabled = true;
            setStatus('Enviando...');

            try {
                const response = await fetch(WORKER_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: titleInput.value.slice(0, 200),
                        body: bodyInput.value.slice(0, 4000),
                        turnstileToken,
                    }),
                });

                if (!response.ok) throw new Error(`request failed with status ${response.status}`);

                setStatus('Obrigado! Problema reportado.', 'success');
                setTimeout(() => dialog.close(), 1500);
            } catch {
                setStatus('Não foi possível enviar. Tente novamente mais tarde.', 'error');
                submitButton.disabled = false;
            }
        });
    }
}

customElements.define('report-issue-widget', ReportIssueWidget);

export {};
