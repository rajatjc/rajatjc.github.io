import Cursor from "./components/Cursor";

export default function NotFound() {
  return (
    <main className="contact" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <Cursor />
      <div className="wrap">
        <p className="eyebrow">404 · key not found</p>
        <h1 className="h2">Bloom filter says no.</h1>
        <p className="lede">This page doesn&apos;t exist, or it was compacted away.</p>
        <a className="btn btn-primary" href="/">
          Back home
        </a>
      </div>
    </main>
  );
}
