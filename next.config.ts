import type { NextConfig } from "next";

const securityHeaders = [
  // Impede que o browser adivinhe o tipo MIME — evita ataques de sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Bloqueia carregamento do app dentro de iframes de outros domínios
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Controla quais informações de referência são enviadas
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desativa funcionalidades sensíveis do browser que o app não usa
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Ativa DNS prefetch para melhorar performance
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
