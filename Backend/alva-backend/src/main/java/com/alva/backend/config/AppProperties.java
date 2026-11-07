package com.alva.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Agrupa, de forma tipada, as variáveis de ambiente relacionadas à
 * aplicação (JWT, CORS). Os valores reais vêm do application.properties,
 * que por sua vez lê das variáveis de ambiente (ver .env.example).
 *
 * Nenhum valor sensível fica hardcoded aqui — tudo é injetado em runtime.
 */
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private final Jwt jwt = new Jwt();
    private final Cors cors = new Cors();

    public Jwt getJwt() {
        return jwt;
    }

    public Cors getCors() {
        return cors;
    }

    public static class Jwt {
        private String secret;
        private long expirationMs;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public long getExpirationMs() {
            return expirationMs;
        }

        public void setExpirationMs(long expirationMs) {
            this.expirationMs = expirationMs;
        }
    }

    public static class Cors {
        private String allowedOrigins;

        public String getAllowedOrigins() {
            return allowedOrigins;
        }

        public void setAllowedOrigins(String allowedOrigins) {
            this.allowedOrigins = allowedOrigins;
        }

        public String[] getAllowedOriginsAsArray() {
            if (allowedOrigins == null || allowedOrigins.isBlank()) {
                return new String[0];
            }
            return allowedOrigins.split(",");
        }
    }
}
