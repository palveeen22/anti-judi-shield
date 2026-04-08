import { initializeBlockingRules } from "./blocker";

// Re-initialize rules when settings change
export function setupRuleUpdater(): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.settings) {
      initializeBlockingRules();
    }
  });
}

// Periodic rule refresh via alarms
export function setupPeriodicRefresh(): void {
  chrome.alarms.create("refresh-rules", {
    periodInMinutes: 60, // Refresh every hour
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "refresh-rules") {
      initializeBlockingRules();
    }
  });
}
