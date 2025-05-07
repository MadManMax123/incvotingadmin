import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/json').then(res => res.json()).then(setData);
  }, []);

  const save = async () => {
    setSaving(true);
    await fetch('/api/json', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setSaving(false);
  };

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1>Edit Question</h1>
      <label>Active</label>
      <select value={data.active} onChange={e => setData({ ...data, active: e.target.value === 'true' })}>
        <option value="true">True</option>
        <option value="false">False</option>
      </select>

      <label>Question</label>
      <textarea value={data.question} onChange={e => setData({ ...data, question: e.target.value })} />

      <label>Options</label>
      {data.options.map((opt, i) => (
        <input key={i} value={opt} onChange={e => {
          const newOpts = [...data.options];
          newOpts[i] = e.target.value;
          setData({ ...data, options: newOpts });
        }} />
      ))}

      <button onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
    </div>
  );
}
