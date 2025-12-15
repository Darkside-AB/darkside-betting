export default function Spinner() {
  return (
    <div style={{ textAlign: "center", padding: "2rem" }}>
      <div
        style={{
          width: 40,
          height: 40,
          border: "4px solid #ccc",
          borderTop: "4px solid #09f",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto",
        }}
      />
      <p>Loading…</p>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
