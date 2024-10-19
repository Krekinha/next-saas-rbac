import { useState, useTransition } from "react";

interface FormState {
	success: boolean;
	message: string | null;
	fieldErrors: Record<string, string[]> | null;
}
/**
 * Hook para gerenciar o estado do formulário e lidar com submissões.
 *
 * @param action - Função assíncrona que processa os dados do formulário e retorna o estado.
 * @param onSuccess - Função opcional chamada quando a submissão é bem-sucedida.
 * @param initialState - Estado inicial opcional do formulário.
 * @returns Um array contendo o estado atual, um booleano indicando se está pendente, e uma função para submeter o formulário.
 */

export function useFormState(
	action: (data: FormData) => Promise<FormState>,
	onSuccess?: () => void | Promise<void>,
	initialState?: FormState,
) {
	const [state, setState] = useState<FormState>(
		initialState ?? {
			success: false,
			message: null,
			fieldErrors: null,
		},
	);

	async function formAction(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const formData = new FormData(event.currentTarget);
		startTransition(async () => {
			const response = await action(formData);
			setState(response);
			if (response.success) {
				await onSuccess?.();
			}
		});
	}

	const [isPending, startTransition] = useTransition();
	return [state, isPending, formAction] as const;
}
