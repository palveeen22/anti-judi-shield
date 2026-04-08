export interface BlockRule {
  id: number;
  priority: number;
  action: {
    type: "redirect" | "block";
    redirect?: {
      extensionPath: string;
    };
  };
  condition: {
    urlFilter?: string;
    regexFilter?: string;
    resourceTypes: chrome.declarativeNetRequest.ResourceType[];
    requestDomains?: string[];
  };
}
