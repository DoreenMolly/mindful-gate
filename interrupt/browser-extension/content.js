const IMAGES = ["images/1.JPG", "images/2.JPG", "images/3.JPG", "images/4.JPG", "images/5.JPG","images/6.JPG","images/7.JPG","images/8.JPG","images/9.JPG","images/10.JPG","images/11.JPG","images/12.JPG"]; 
const COUNTDOWN_SECONDS = 10;

function log(event) {
  chrome.storage.local.get({ events: [] }, ({ events }) => {
    events.push({
      timestamp: new Date().toISOString(),
      app: location.hostname,
      event,
    });
    chrome.storage.local.set({ events });
  });
}

function showGate() {
  const overlay = document.createElement("div");
  overlay.id = "mindful-gate";

  const img = document.createElement("img");
  const pick = IMAGES[Math.floor(Math.random() * IMAGES.length)];
  img.src = chrome.runtime.getURL(pick);

  const msg = document.createElement("p");
  msg.textContent = "Are you getting closer or further from this dream?";

  const buttons = document.createElement("div");
  buttons.className = "buttons";

  const closeBtn = document.createElement("button");
  closeBtn.className = "close";
  closeBtn.textContent = "FURTHER!";
  closeBtn.onclick = () => {
    log("closed");
    chrome.runtime.sendMessage({ type: "close" });
  };

  const contBtn = document.createElement("button");
  contBtn.className = "continue";
  contBtn.disabled = true;

  let remaining = COUNTDOWN_SECONDS;
  contBtn.textContent = `CLOSER, Please continue <3 (${remaining})`;
  const timer = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      contBtn.textContent = `ClOSER, Please continue <3 (${remaining})`;
    } else {
      clearInterval(timer);
      contBtn.textContent = "CLOSER, Please continue <3";
      contBtn.disabled = false;
    }
  }, 1000);

  contBtn.onclick = () => {
    log("continued");
    overlay.remove();
    document.documentElement.style.overflow = "";
  };

  buttons.append(closeBtn, contBtn);
  overlay.append(img, msg, buttons);
  document.documentElement.appendChild(overlay);
  document.documentElement.style.overflow = "hidden";
  log("shown");
}

showGate();