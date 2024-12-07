import React, { useState, useEffect, useCallback } from "react";
import { AlertCircle, Download, RefreshCw, SaveIcon, Trash2 } from "lucide-react";

function DownloadCalculator() {
  const [totalContent, setTotalContent] = useState("");
  const [downloaded, setDownloaded] = useState("");
  const [speed, setSpeed] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => {
    try {
      // Safely parse localStorage with fallback
      const savedHistory = localStorage.getItem("downloadHistory");
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error("Error parsing download history:", error);
      return [];
    }
  });
  const [speedUnit, setSpeedUnit] = useState("Mbps");
  const [contentUnit, setContentUnit] = useState("GB");

  // Memoized function to save history to localStorage.
  const saveHistoryToLocalStorage = useCallback((newHistory) => {
    try {
      localStorage.setItem("downloadHistory", JSON.stringify(newHistory));
    } catch (error) {
      console.error("Error saving download history:", error);
    }
  }, []);

  // Effect to save history to localStorage whenever it changes.
  useEffect(() => {
    saveHistoryToLocalStorage(history);
  }, [history, saveHistoryToLocalStorage]);

  // Conversion functions remain the same as in the original code.
  const convertSpeed = (value, from, to) => {
    const conversionMap = {
      Mbps: {
        Kbps: (val) => val * 1000,
        Gbps: (val) => val / 1000,
      },
      Kbps: {
        Mbps: (val) => val / 1000,
        Gbps: (val) => val / 1000000,
      },
      Gbps: {
        Mbps: (val) => val * 1000,
        Kbps: (val) => val * 1000000,
      },
    };

    if (from === to) return value;
    return conversionMap[from][to](parseFloat(value));
  };

  const convertContent = (value, from, to) => {
    const conversionMap = {
      GB: {
        MB: (val) => val * 1024,
        TB: (val) => val / 1024,
      },
      MB: {
        GB: (val) => val / 1024,
        TB: (val) => val / (1024 * 1024),
      },
      TB: {
        GB: (val) => val * 1024,
        MB: (val) => val * 1024 * 1024,
      },
    };

    if (from === to) return value;
    return conversionMap[from][to](parseFloat(value));
  };

  const calculateDownloadTime = () => {
    // Convert inputs to numbers with current units.
    const total = convertContent(parseFloat(totalContent), contentUnit, "GB");
    const down = convertContent(parseFloat(downloaded), contentUnit, "GB");
    const speedMbps = convertSpeed(parseFloat(speed), speedUnit, "Mbps");

    // Validate inputs.
    if (isNaN(total) || isNaN(down) || isNaN(speedMbps)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }

    // Calculate remaining content.
    const remainingContent = total - down;

    // Convert download speed.
    const speedMBps = speedMbps / 8;
    const speedGBps = speedMBps / 1024;

    // Calculate time.
    const timeSeconds = remainingContent / speedGBps;
    const timeMinutes = timeSeconds / 60;
    const timeHours = timeMinutes / 60;

    const newResult = {
      remainingContent: remainingContent.toFixed(2),
      timeSeconds: Math.round(timeSeconds),
      timeMinutes: Math.round(timeMinutes),
      timeHours: timeHours.toFixed(2),
      totalContentGB: total.toFixed(2),
      downloadedGB: down.toFixed(2),
      speedMbps: speedMbps.toFixed(2),
    };

    setResult(newResult);

    // Save to history.
    const historyEntry = {
      ...newResult,
      timestamp: new Date().toLocaleString(),
      id: Date.now(),
      contentUnit,
      speedUnit,
    };

    // Limit history to 10 entries and avoid duplicates.
    setHistory((prevHistory) => {
      const updatedHistory = [historyEntry, ...prevHistory]
        .filter(
          (entry, index, self) =>
            index ===
            self.findIndex(
              (t) =>
                t.totalContentGB === entry.totalContentGB &&
                t.downloadedGB === entry.downloadedGB &&
                t.speedMbps === entry.speedMbps
            )
        )
        .slice(0, 10);

      return updatedHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("downloadHistory");
  };

  const removeHistoryItem = (idToRemove) => {
    setHistory((prevHistory) =>
      prevHistory.filter((entry) => entry.id !== idToRemove)
    );
  };

  const resetCalculator = () => {
    setTotalContent("");
    setDownloaded("");
    setSpeed("");
    setResult(null);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6"
      role="region"
      aria-labelledby="calculator-heading"
    >
      <h2 id="calculator-heading" className="sr-only">
        Download Time Calculator Input
      </h2>
      <div className="space-y-4">
        {/* Total Content Input */}
        <div>
          <label
            htmlFor="total-content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Total Content
          </label>
          <div className="flex">
            <input
              id="total-content"
              type="number"
              value={totalContent}
              onChange={(e) => setTotalContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter total content size"
              aria-describedby="total-content-help"
              required
            />
            <select
              value={contentUnit}
              onChange={(e) => setContentUnit(e.target.value)}
              className="px-2 py-2 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="GB">GB</option>
              <option value="MB">MB</option>
              <option value="TB">TB</option>
            </select>
          </div>
          <p
            id="total-content-help"
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            Total size of content to be downloaded
          </p>
        </div>

        {/* Downloaded Content Input */}
        <div>
          <label
            htmlFor="downloaded-content"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Downloaded Content
          </label>
          <div className="flex">
            <input
              id="downloaded-content"
              type="number"
              value={downloaded}
              onChange={(e) => setDownloaded(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter downloaded content size"
              aria-describedby="downloaded-content-help"
              required
            />
            <select
              value={contentUnit}
              onChange={(e) => setContentUnit(e.target.value)}
              className="px-2 py-2 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="GB">GB</option>
              <option value="MB">MB</option>
              <option value="TB">TB</option>
            </select>
          </div>
          <p
            id="downloaded-content-help"
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            Amount of content already downloaded
          </p>
        </div>

        {/* Download Speed Input */}
        <div>
          <label
            htmlFor="download-speed"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Download Speed
          </label>
          <div className="flex">
            <input
              id="download-speed"
              type="number"
              value={speed}
              onChange={(e) => setSpeed(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:text-gray-100"
              placeholder="Enter download speed"
              aria-describedby="download-speed-help"
              required
            />
            <select
              value={speedUnit}
              onChange={(e) => setSpeedUnit(e.target.value)}
              className="px-2 py-2 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-100 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="Mbps">Mbps</option>
              <option value="Kbps">Kbps</option>
              <option value="Gbps">Gbps</option>
            </select>
          </div>
          <p
            id="download-speed-help"
            className="mt-1 text-xs text-gray-500 dark:text-gray-400"
          >
            Your current download speed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={calculateDownloadTime}
            className="flex-1 flex items-center justify-center bg-brand-blue text-white py-2 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            aria-label="Calculate Download Time"
          >
            <Download className="mr-2 w-5 h-5" />
            Calculate
          </button>
          <button
            onClick={resetCalculator}
            className="flex-1 flex items-center justify-center bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            aria-label="Reset Calculator"
          >
            <RefreshCw className="mr-2 w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Calculation Results */}
        {result && (
          <div
            className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md"
            aria-live="polite"
          >
            {result.error ? (
              <p
                className="text-red-500 dark:text-red-400 flex items-center"
                role="alert"
              >
                <AlertCircle className="mr-2 w-5 h-5" />
                {result.error}
              </p>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2 dark:text-gray-200">
                  Download Estimation
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Total Content:</span>{" "}
                    {result.totalContentGB} GB
                  </p>
                  <p>
                    <span className="font-medium">Downloaded:</span>{" "}
                    {result.downloadedGB} GB
                  </p>
                  <p>
                    <span className="font-medium">Remaining:</span>{" "}
                    {result.remainingContent} GB
                  </p>
                  <p>
                    <span className="font-medium">Download Speed:</span>{" "}
                    {result.speedMbps} Mbps
                  </p>
                  <p>
                    <span className="font-medium">Estimated Time:</span>
                    {result.timeHours > 1
                      ? ` ${result.timeHours} hours`
                      : ` ${result.timeMinutes} minutes`}
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* Download History */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold dark:text-gray-200">
              Download History
            </h3>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="text-sm text-red-500 dark:text-red-400 hover:underline flex items-center"
                aria-label="Clear all download history"
              >
                <Trash2 className="mr-1 w-4 h-4" />
                Clear History
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recent downloads
            </p>
          ) : (
            <div className="max-h-48 overflow-y-auto">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="relative bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md p-3 mb-2 text-sm group"
                >
                  <button
                    onClick={() => removeHistoryItem(entry.id)}
                    className="absolute top-1 right-1 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove this history entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{entry.timestamp}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {entry.totalContentGB} {entry.contentUnit || "GB"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <p>
                      Remaining: {entry.remainingContent}{" "}
                      {entry.contentUnit || "GB"}
                    </p>
                    <p>
                      Speed: {entry.speedMbps} {entry.speedUnit || "Mbps"}
                    </p>
                    <p>
                      Time:{" "}
                      {entry.timeHours > 1
                        ? `${entry.timeHours} hours`
                        : `${entry.timeMinutes} minutes`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* How to Calculate*/}
      <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md text-sm">
        <h4 className="font-semibold mb-2 text-brand-blue dark:text-brand-blue/80">
          How to Calculate
        </h4>
        <ol className="list-decimal list-inside space-y-1 dark:text-gray-300">
          <li>Enter the total content size</li>
          <li>Select the content size unit (GB/MB/TB)</li>
          <li>Enter the amount already downloaded</li>
          <li>Enter your download speed</li>
          <li>Select the speed unit (Mbps/Kbps/Gbps)</li>
          <li>Click "Calculate Download Time"</li>
        </ol>
      </div>
    </div>
  );
}

export default DownloadCalculator;