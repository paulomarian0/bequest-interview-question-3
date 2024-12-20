import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

function App() {
  const [data, setData] = useState<string>("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const response = await fetch(API_URL);
    const json = await response.json();
    setData(json.data || "");
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const recoverData = async () => {
    const response = await fetch(`${API_URL}/recover`);
    const json = await response.json();
    setData(json.data || "");
  };

  const verifyData = async () => {
    const response = await fetch(`${API_URL}/verify`, {
      method: "POST",
      body: JSON.stringify({ data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    setVerificationStatus(result.status);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data}
        onChange={(e) => {
          setData(e.target.value);
          setVerificationStatus("");
        }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button type="button" style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button type="button" style={{ fontSize: "20px" }} onClick={verifyData}>
          Verify Data
        </button>
        <button
          type="button"
          style={{ fontSize: "20px" }}
          onClick={recoverData}
        >
          Recovery Data
        </button>
      </div>

      {verificationStatus && (
        <div style={{ marginTop: "20px", fontSize: "20px" }}>
          {verificationStatus}
        </div>
      )}
    </div>
  );
}

export default App;
