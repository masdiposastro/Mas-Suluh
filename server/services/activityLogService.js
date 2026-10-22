const activityLogs = [];

export function createActivityLog({ user_id, action, entity_type, entity_id, metadata = {} }) {
  const entry = {
    id: `log-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    user_id: user_id ?? null,
    action,
    entity_type: entity_type ?? 'unknown',
    entity_id: entity_id ?? null,
    metadata,
    created_at: new Date().toISOString(),
  };

  activityLogs.push(entry);
  return entry;
}

export function listActivityLogs(filters = {}) {
  let result = [...activityLogs];

  if (filters.user_id) {
    result = result.filter((item) => item.user_id === filters.user_id);
  }

  if (filters.entity_type) {
    result = result.filter((item) => item.entity_type === filters.entity_type);
  }

  if (filters.action) {
    result = result.filter((item) => item.action === filters.action);
  }

  return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

export function getActivityLogCount() {
  return activityLogs.length;
}
