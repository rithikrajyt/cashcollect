/**
 * Environment variable validation and typed configuration.
 * Supports DEMO_MODE=true for local testing without Supabase.
 */

function getEnvVar(name: string, required: boolean = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value ?? '';
}

function getBoolEnv(name: string, defaultValue: boolean = false): boolean {
  const value = process.env[name];
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

export interface EnvConfig {
  // Supabase
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey: string;

  // MCP
  mcpDemoBearerToken: string;
  mcpDemoOrganizationId: string;

  // App
  appUrl: string;
  demoMode: boolean;

  // Flags
  hasSupabase: boolean;
}

let _env: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (_env) return _env;

  const demoMode = getBoolEnv('DEMO_MODE', false);
  const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] ?? '';
  const supabaseAnonKey = process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ?? '';
  const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

  if (!demoMode && !hasSupabase) {
    throw new Error(
      'Either set DEMO_MODE=true or provide NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }

  _env = {
    supabaseUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey: process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '',
    mcpDemoBearerToken: getEnvVar('MCP_DEMO_BEARER_TOKEN', !demoMode),
    mcpDemoOrganizationId:
      process.env['MCP_DEMO_ORGANIZATION_ID'] ?? '00000000-0000-0000-0000-000000000001',
    appUrl: process.env['NEXT_PUBLIC_APP_URL'] ?? 'http://localhost:3000',
    demoMode,
    hasSupabase,
  };

  return _env;
}

/** Reset cached env (for tests). */
export function resetEnvCache(): void {
  _env = null;
}
