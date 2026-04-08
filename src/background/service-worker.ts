import { initializeBlockingRules, toggleProtection, addDomainToBlacklist, removeDomainFromBlacklist } from "./blocker";
import { setupAnalytics, recordContentBlock } from "./analytics";
import { notifyAccountabilityPartner } from "./accountability";
import { setupRuleUpdater, setupPeriodicRefresh } from "./rule-updater";
import { createMessageListener } from "@/shared/utils/messaging";
import { getSettings, updateSettings, getStats, getStreak, updateStreak } from "@/shared/utils/storage";
import { verifyPassword } from "@/shared/utils/hash";
import { getToday, daysBetween } from "@/shared/utils/date";

// First install / update handler
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    // Open onboarding page
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/pages/onboarding/index.html"),
    });
    // Initialize blocking rules
    initializeBlockingRules();
  } else if (details.reason === "update") {
    // Re-initialize rules on update
    initializeBlockingRules();
  }
});

// Service worker startup
chrome.runtime.onStartup.addListener(() => {
  initializeBlockingRules();
  checkStreak();
});

// Setup all listeners
setupAnalytics();
setupRuleUpdater();
setupPeriodicRefresh();

// Daily streak check alarm
chrome.alarms.create("streak-check", {
  periodInMinutes: 60,
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "streak-check") {
    checkStreak();
  }
});

// Detect extension disable attempts
chrome.management.onDisabled.addListener((info) => {
  if (info.id === chrome.runtime.id) {
    notifyAccountabilityPartner("disable_attempt");
    // Try to re-enable (may not work if fully disabled)
    chrome.management.setEnabled(info.id, true);
  }
});

// Message handler
createMessageListener({
  GET_PROTECTION_STATUS: async () => {
    const settings = await getSettings();
    return {
      active: settings.protectionEnabled,
      level: settings.protectionLevel,
    };
  },

  TOGGLE_PROTECTION: async (data) => {
    const settings = await getSettings();

    // If strict mode and trying to disable, require password
    if (settings.strictMode && settings.protectionEnabled && settings.passwordHash && settings.passwordSalt) {
      if (!data.password) {
        await notifyAccountabilityPartner("disable_attempt");
        return { success: false, error: "Password diperlukan untuk menonaktifkan perlindungan" };
      }

      const valid = await verifyPassword(data.password, settings.passwordHash, settings.passwordSalt);
      if (!valid) {
        await notifyAccountabilityPartner("disable_attempt");
        return { success: false, error: "Password salah" };
      }
    }

    const newState = !settings.protectionEnabled;
    await updateSettings({ protectionEnabled: newState });
    await toggleProtection(newState);

    if (!newState) {
      await notifyAccountabilityPartner("disable_attempt");
    }

    return { success: true };
  },

  GET_STATS: async () => {
    return getStats();
  },

  REPORT_GAMBLING_CONTENT: async (data) => {
    await recordContentBlock(
      data.url,
      data.score,
      data.matches,
      data.confidence,
      data.detectionMethods,
    );
  },

  ADD_TO_BLACKLIST: async (data) => {
    await addDomainToBlacklist(data.domain);
    return { success: true };
  },

  REMOVE_FROM_BLACKLIST: async (data) => {
    await removeDomainFromBlacklist(data.domain);
    return { success: true };
  },

  BYPASS_ATTEMPT: async (data) => {
    await notifyAccountabilityPartner("bypass_attempt");
    await recordContentBlock(data.url, 0, ["user_bypass"]);
  },

  GET_SETTINGS: async () => {
    return getSettings();
  },

  UPDATE_SETTINGS: async (data) => {
    await updateSettings(data);
    return { success: true };
  },
});

// Streak management
async function checkStreak(): Promise<void> {
  const settings = await getSettings();
  const streak = await getStreak();
  const today = getToday();

  if (settings.protectionEnabled) {
    const daysSinceStart = daysBetween(streak.startDate, today);
    const newStreak = daysSinceStart + 1;

    const updates: Partial<typeof streak> = {
      currentStreak: newStreak,
    };

    if (newStreak > streak.longestStreak) {
      updates.longestStreak = newStreak;
    }

    // Check milestones
    const newMilestones = streak.milestones.filter(
      (m) => newStreak >= m && !streak.achievedMilestones.includes(m),
    );

    if (newMilestones.length > 0) {
      updates.achievedMilestones = [
        ...streak.achievedMilestones,
        ...newMilestones,
      ];

      // Notify about new milestones
      for (const milestone of newMilestones) {
        chrome.notifications.create(`milestone-${milestone}`, {
          type: "basic",
          iconUrl: chrome.runtime.getURL("public/icons/icon-128.png"),
          title: "Anti-Judi Shield - Pencapaian!",
          message: `Selamat! Kamu sudah ${milestone} hari terlindungi!`,
          priority: 1,
        });
      }
    }

    await updateStreak(updates);
  }
}

console.log("[Anti-Judi Shield] Background service worker started");
