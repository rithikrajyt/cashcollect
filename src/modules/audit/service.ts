import { v4 as uuidv4 } from 'uuid';
import { store } from '@/lib/db/store';
import type { AuditEvent } from '@/lib/db/types';

export interface CreateAuditEventInput {
  actor_type: 'user' | 'mcp' | 'system';
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id: string;
  before_data?: unknown;
  after_data?: unknown;
  request_id?: string;
}

export function createAuditEvent(
  orgId: string,
  data: CreateAuditEventInput
): AuditEvent {
  const event: AuditEvent = {
    id: uuidv4(),
    organization_id: orgId,
    actor_type: data.actor_type,
    actor_id: data.actor_id ?? null,
    action: data.action,
    entity_type: data.entity_type,
    entity_id: data.entity_id,
    before_data: data.before_data ?? null,
    after_data: data.after_data ?? null,
    request_id: data.request_id ?? null,
    created_at: new Date().toISOString(),
  };

  store.auditEvents.set(event.id, event);
  return { ...event };
}

export function listAuditEvents(
  orgId: string,
  entityType?: string,
  entityId?: string
): AuditEvent[] {
  const events = Array.from(store.auditEvents.values())
    .filter((e) => e.organization_id === orgId)
    .filter((e) => (!entityType || e.entity_type === entityType))
    .filter((e) => (!entityId || e.entity_id === entityId))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

  return events.map((e) => ({ ...e }));
}
