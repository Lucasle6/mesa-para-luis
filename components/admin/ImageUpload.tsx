'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export function ImageUpload({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError('');
    try {
      const supabase = createClient();
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('images')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from('images').getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir la imagen');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-4">
        <label className="cursor-pointer rounded-full border border-line bg-surface px-4 py-2 font-mono text-[0.7rem] uppercase tracking-label text-ink transition-colors hover:border-ink/40">
          {busy ? 'Subiendo…' : value ? 'Cambiar imagen' : 'Subir imagen'}
          <input
            type="file"
            accept="image/*"
            onChange={onFile}
            disabled={busy}
            className="sr-only"
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="cursor-pointer font-mono text-[0.7rem] uppercase tracking-label text-ember hover:text-ember-dark"
          >
            Quitar
          </button>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-ember">{error}</p>}
      {value && (
        <div className="relative mt-3 aspect-[16/9] w-full max-w-sm overflow-hidden rounded-xl border border-line bg-line">
          <Image src={value} alt="" fill className="object-cover" sizes="384px" />
        </div>
      )}
    </div>
  );
}
