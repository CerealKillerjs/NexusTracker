const { withSentryConfig } = require("@sentry/nextjs");
const config = require("../config");

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    styledComponents: true,
  },

  // Configuración de runtime config para Next.js 15
  env: {
    SQ_SITE_NAME: config.envs.SQ_SITE_NAME,
    SQ_SITE_DESCRIPTION: config.envs.SQ_SITE_DESCRIPTION,
    SQ_CUSTOM_THEME: JSON.stringify(config.envs.SQ_CUSTOM_THEME),
    SQ_ALLOW_REGISTER: config.envs.SQ_ALLOW_REGISTER,
    SQ_ALLOW_ANONYMOUS_UPLOADS: config.envs.SQ_ALLOW_ANONYMOUS_UPLOADS.toString(),
    SQ_MINIMUM_RATIO: config.envs.SQ_MINIMUM_RATIO.toString(),
    SQ_MAXIMUM_HIT_N_RUNS: config.envs.SQ_MAXIMUM_HIT_N_RUNS.toString(),
    SQ_TORRENT_CATEGORIES: JSON.stringify(config.envs.SQ_TORRENT_CATEGORIES),
    SQ_BP_EARNED_PER_GB: config.envs.SQ_BP_EARNED_PER_GB.toString(),
    SQ_BP_EARNED_PER_FILLED_REQUEST: config.envs.SQ_BP_EARNED_PER_FILLED_REQUEST.toString(),
    SQ_BP_COST_PER_INVITE: config.envs.SQ_BP_COST_PER_INVITE.toString(),
    SQ_BP_COST_PER_GB: config.envs.SQ_BP_COST_PER_GB.toString(),
    SQ_SITE_WIDE_FREELEECH: config.envs.SQ_SITE_WIDE_FREELEECH.toString(),
    SQ_ALLOW_UNREGISTERED_VIEW: config.envs.SQ_ALLOW_UNREGISTERED_VIEW.toString(),
    SQ_EXTENSION_BLACKLIST: JSON.stringify(config.envs.SQ_EXTENSION_BLACKLIST),
    SQ_SITE_DEFAULT_LOCALE: config.envs.SQ_SITE_DEFAULT_LOCALE,
    SQ_BASE_URL: config.envs.SQ_BASE_URL,
    SQ_API_URL: config.envs.SQ_API_URL,
    SQ_ENABLE_LAST_SEEN: config.envs.SQ_ENABLE_LAST_SEEN.toString(),
    SQ_DEFAULT_TIMEZONE: config.envs.SQ_DEFAULT_TIMEZONE,
    SQ_ENABLE_PROTECTED_TORRENTS: config.envs.SQ_ENABLE_PROTECTED_TORRENTS.toString(),
    SQ_VERSION: "1.8.1",
  },
  serverRuntimeConfig: {
    ...config.envs,
    ...config.secrets,
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  errorHandler: (err, invokeErr, compilation) => {
    compilation.warnings.push("Sentry CLI Plugin: " + err.message);
  },
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
