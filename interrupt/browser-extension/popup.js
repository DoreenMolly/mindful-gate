function pad(n) { return String(n).padStart(2, "0"); }

// Local date-time like 2026-11-15T21:47:05 (no timezone suffix)
function localIso(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
         `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Wrap every value in quotes and escape any quotes inside it
function csvCell(v) { return `"${String(v).replace(/"/g, '""')}"`; }

// Show how many events exist when the popup opens
chrome.storage.local.get({ events: [] }, ({ events }) => {
  document.getElementById("count").textContent =
    `${events.length} events recorded`;
});

document.getElementById("export").onclick = () => {
  chrome.storage.local.get({ events: [] }, ({ events }) => {
    const header = "timestamp_utc,local_timestamp,app,event";
    const rows = events.map(e =>
      [e.timestamp, localIso(new Date(e.timestamp)), e.app, e.event]
        .map(csvCell)
        .join(",")
    );
    const csv = [header, ...rows].join("\n");

    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `mindful_gate_events_${localIso(new Date()).slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  });
};