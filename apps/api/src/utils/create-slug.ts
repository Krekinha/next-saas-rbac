export function createSlug(text: string): string {
	// Remove acentos
	const from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç";
	const to = "aaaaaeeeeeiiiiooooouuuunc";
	const regex = new RegExp(from.split("").join("|"), "g");
	const normalizedText = text
		.toLowerCase()
		.replace(regex, (c) => to.charAt(from.indexOf(c)));

	// Remove caracteres especiais e substituir espaços por hífens
	const slug = normalizedText
		.replace(/[^a-z0-9\s-]/g, "") // Remove caracteres especiais
		.replace(/\s+/g, "-") // Substitui espaços por hífens
		.replace(/-+/g, "-"); // Remove hífens duplicados

	return slug;
}
