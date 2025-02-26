import { useState, useTransition } from "react";
import { requestFormReset } from "react-dom";

interface FormState {
	success: boolean;
	message: string | null;
	errors: Record<string, string[]> | null;
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
	const [isPending, startTransition] = useTransition();

	const [formState, setFormState] = useState(
		initialState ?? {
			success: false,
			message: null,
			errors: null,
		},
	);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const form = event.currentTarget;
		const data = new FormData(form);

		startTransition(async () => {
			const state = await action(data);

			if (state.success === true && onSuccess) {
				await onSuccess();
				requestFormReset(form);
			}

			setFormState(state);
		});
	}

	return [formState, handleSubmit, isPending] as const;
}
