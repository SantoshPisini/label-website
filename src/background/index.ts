import { LabelModel } from "../types";

console.log("BG script loaded");

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get("LABEL_WEBSITE", (data) => {
    if (data.LABEL_WEBSITE) {
      console.log(data.LABEL_WEBSITE);
    } else {
      chrome.storage.sync.set({ LABEL_WEBSITE: [] }, () => {});
    }
  });
});

let activeTabId: number,
  lastUrl: string | undefined,
  lastTitle: string | undefined;

async function setBanner(item: LabelModel, tabId: number) {
  await chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (label: string, color: string, textColor: string) => {
      document.getElementById("label-website-banner")?.remove();
      const banner = document.createElement("div");
      banner.id = "label-website-banner";
      banner.style.top = "0px";
      banner.style.left = "0px";
      banner.style.width = "100%";
      banner.style.height = "28px";
      banner.style.padding = "2px";
      banner.style.zIndex = "99999";
      banner.style.fontSize = "large";
      banner.style.color = textColor;
      banner.style.textAlign = "center";
      banner.style.position = "fixed";
      banner.style.backgroundColor = color;
      banner.innerText = label;
      document.body.insertBefore(banner, document.body.firstChild);
      document.body.style.paddingTop = `calc(${document.body.style.paddingTop}+24px)`;
    },
    args: [item.label, item.labelColor, item.textColor],
  });
}

function setBannerIfEnabled(tabId: number) {
  chrome.tabs.get(tabId, function (tab) {
    if (lastUrl != tab.url || lastTitle != tab.title) {
      lastUrl = tab.url;
      lastTitle = tab.title;
      chrome.storage.sync.get(["LABEL_WEBSITE"]).then((result) => {
        const mathingInfo = (result.LABEL_WEBSITE as LabelModel[]).filter((x) =>
          lastUrl!.startsWith(x.url)
        );
        if (mathingInfo.length > 0) {
          setBanner(
            mathingInfo.sort((a, b) => b.url.length - a.url.length)[0],
            tabId
          );
        }
      });
    }
  });
}

chrome.tabs.onActivated.addListener(function (activeInfo) {
  setBannerIfEnabled((activeTabId = activeInfo.tabId));
});

chrome.tabs.onUpdated.addListener(function (tabId) {
  if (activeTabId == tabId) {
    setBannerIfEnabled(tabId);
  }
});

chrome.storage.onChanged.addListener(async (value) => {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const mathingInfo = (value.LABEL_WEBSITE.newValue as LabelModel[]).filter(
    (x) => lastUrl!.startsWith(x.url)
  );
  if (mathingInfo.length > 0) {
    setBanner(
      mathingInfo.sort((a, b) => b.url.length - a.url.length)[0],
      tab.id!
    );
  }
});
