import { getSettings } from "@/shared/utils/storage";

export async function notifyAccountabilityPartner(
  action: "disable_attempt" | "bypass_attempt",
): Promise<void> {
  const settings = await getSettings();
  if (!settings.accountabilityEmail) return;

  const messages = {
    disable_attempt: {
      title: "Anti-Judi Shield - Peringatan",
      message: "Seseorang mencoba menonaktifkan perlindungan Anti-Judi Shield.",
    },
    bypass_attempt: {
      title: "Anti-Judi Shield - Peringatan",
      message: "Seseorang mencoba mengakses situs yang diblokir.",
    },
  };

  const { title, message } = messages[action];

  // Show local notification
  await chrome.notifications.create(`accountability-${Date.now()}`, {
    type: "basic",
    iconUrl: chrome.runtime.getURL("public/icons/icon-128.png"),
    title,
    message: `${message}\nPartner: ${settings.accountabilityEmail}`,
    priority: 2,
  });

  // Future: send email/WhatsApp via backend API
  console.log(
    `[Anti-Judi Shield] Accountability notification: ${action} → ${settings.accountabilityEmail}`,
  );
}
