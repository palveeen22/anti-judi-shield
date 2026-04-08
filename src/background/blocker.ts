import { STATIC_DOMAINS, SUSPICIOUS_PATTERNS, URL_KEYWORD_PATTERNS } from "@/shared/constants/blacklist";
import { getSettings } from "@/shared/utils/storage";

const BLOCKED_PAGE_PATH = "/src/pages/blocked/index.html";

// Generate DNR dynamic rules from blacklist + custom domains
export async function initializeBlockingRules(): Promise<void> {
  const settings = await getSettings();
  if (!settings.protectionEnabled) return;

  const rules: chrome.declarativeNetRequest.Rule[] = [];
  let ruleId = 1;

  // Add static domain rules
  // Group domains in batches for requestDomains (max ~100 per rule for performance)
  const batchSize = 50;
  for (let i = 0; i < STATIC_DOMAINS.length; i += batchSize) {
    const batch = STATIC_DOMAINS.slice(i, i + batchSize);
    rules.push({
      id: ruleId++,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          extensionPath: `${BLOCKED_PAGE_PATH}?reason=domain_blacklist`,
        },
      },
      condition: {
        requestDomains: batch,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  }

  // Add custom blacklist domains
  if (settings.customBlacklist.length > 0) {
    rules.push({
      id: ruleId++,
      priority: 2,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          extensionPath: `${BLOCKED_PAGE_PATH}?reason=custom_blacklist`,
        },
      },
      condition: {
        requestDomains: settings.customBlacklist,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  }

  // Add whitelist (allow rules with higher priority)
  if (settings.customWhitelist.length > 0) {
    rules.push({
      id: ruleId++,
      priority: 10,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.ALLOW,
      },
      condition: {
        requestDomains: settings.customWhitelist,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  }

  // Add URL keyword pattern rules
  for (const pattern of URL_KEYWORD_PATTERNS) {
    rules.push({
      id: ruleId++,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          extensionPath: `${BLOCKED_PAGE_PATH}?reason=url_keywords`,
        },
      },
      condition: {
        regexFilter: pattern.source,
        isUrlFilterCaseSensitive: false,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  }

  // Add suspicious TLD pattern rules
  for (const pattern of SUSPICIOUS_PATTERNS) {
    rules.push({
      id: ruleId++,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
        redirect: {
          extensionPath: `${BLOCKED_PAGE_PATH}?reason=suspicious_domain`,
        },
      },
      condition: {
        regexFilter: pattern.source,
        isUrlFilterCaseSensitive: false,
        resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    });
  }

  // Block images/media from gambling domains
  const gamblingMediaDomains = STATIC_DOMAINS.slice(0, 100); // Top 100 domains
  for (let i = 0; i < gamblingMediaDomains.length; i += batchSize) {
    const batch = gamblingMediaDomains.slice(i, i + batchSize);
    rules.push({
      id: ruleId++,
      priority: 1,
      action: {
        type: chrome.declarativeNetRequest.RuleActionType.BLOCK,
      },
      condition: {
        requestDomains: batch,
        resourceTypes: [
          chrome.declarativeNetRequest.ResourceType.IMAGE,
          chrome.declarativeNetRequest.ResourceType.MEDIA,
        ],
      },
    });
  }

  // Remove existing dynamic rules and add new ones
  const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
  const existingIds = existingRules.map((r) => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: existingIds,
    addRules: rules,
  });

  console.log(`[Anti-Judi Shield] Initialized ${rules.length} blocking rules`);
}

export async function toggleProtection(enabled: boolean): Promise<void> {
  if (enabled) {
    await initializeBlockingRules();
  } else {
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingIds = existingRules.map((r) => r.id);
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: [],
    });
  }
}

export async function addDomainToBlacklist(domain: string): Promise<void> {
  const settings = await getSettings();
  if (!settings.customBlacklist.includes(domain)) {
    settings.customBlacklist.push(domain);
    await chrome.storage.sync.set({ settings });
    await initializeBlockingRules();
  }
}

export async function removeDomainFromBlacklist(domain: string): Promise<void> {
  const settings = await getSettings();
  settings.customBlacklist = settings.customBlacklist.filter((d) => d !== domain);
  await chrome.storage.sync.set({ settings });
  await initializeBlockingRules();
}
