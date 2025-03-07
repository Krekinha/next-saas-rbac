import { defineConfig } from "tsup";

// Configurações que serão chamadas na build pelo tsup
export default defineConfig({
	entry: ["src"], //  Ajustar se o ponto de entrada for diferente
	splitting: false,
	outDir: "dist", //  Já está no package.json, mas incluído para clareza
	sourcemap: true, // Dismyfica o código js
	clean: true, // Sempre que uma nova build for gerada, apaga a build anterior
	loader: { ".http": "text" }, // Trata arquivos .http como texto
	noExternal: ["@saas/auth", "@saas/env"],
});
