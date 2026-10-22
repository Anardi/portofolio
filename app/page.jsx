import Link from "next/link";
import { modules, profile, skills } from "../data/lab";
import Typing from "./components/Typing";
import Spotlight from "./components/Spotlight";
import ModuleList from "./components/ModuleList";
import Skills from "./components/Skills";
import { phases } from "../data/phases";

export default function Home() {
  const links = [
    profile.github && ["GitHub", profile.github],
    profile.linkedin && ["LinkedIn", profile.linkedin],
    profile.email && ["Email", `mailto:${profile.email}`],
  ].filter(Boolean);
  const contacts = [
    profile.github && [
      "GitHub",
      profile.github.replace(/^https?:\/\//, ""),
      profile.github,
    ],
    profile.linkedin && [
      "LinkedIn",
      profile.linkedin.replace(/^https?:\/\//, ""),
      profile.linkedin,
    ],
    profile.email && ["Email", profile.email, `mailto:${profile.email}`],
    profile.phone && [
      "Telepon",
      profile.phone,
      `tel:${profile.phone.replace(/[^\d+]/g, "")}`,
    ],
  ].filter(Boolean);
  const initials = profile.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const allSkills = [...new Set(Object.values(skills).flat())];
  const items = modules.map((m, i) => ({
    id: m.id,
    n: i + 1,
    title: m.title,
    goal: m.goal,
    tags: skills[m.id] || [],
    c: m.steps.length,
  }));
  const nSteps = modules.reduce((a, m) => a + m.steps.length, 0);
  const nCmd = modules.reduce(
    (a, m) =>
      a +
      m.steps.reduce((b, s) => b + (s.cmd ? s.cmd.split("\n").length : 0), 0),
    0,
  );
  const groups = phases.map((p) => ({
    name: p.name,
    items: p.ids.flatMap((id) => {
      const i = modules.findIndex((m) => m.id === id);
      return (skills[id] || []).map((s) => ({
        s,
        id,
        n: i + 1,
        title: modules[i].title,
      }));
    }),
  }));
  const d = (ms) => ({ "--d": `${ms}ms` });

  return (
    <>
      <Spotlight>
        <div className="wrap hero-grid">
          <div>
            <p className="who rise" style={d(0)}>
              {profile.name} · {profile.role}
            </p>
            <h1 className="rise" style={d(80)}>
              Linux System Administration Lab
            </h1>
            <p className="sub rise" style={d(160)}>
              Ubuntu Server · VirtualBox
            </p>
            <p className="lead rise" style={d(240)}>
              Bangun server Linux virtual dan simulasikan tugas administrator.
              Setiap modul berisi perintah, hasil yang diharapkan, dan
              peringatan yang saya temui saat mengerjakannya.
            </p>
            <div className="cta rise" style={d(320)}>
              <Link className="btn pri" href={`/modul/${modules[0].id}`}>
                Mulai dari {modules[0].title}
              </Link>
              <Link className="btn sec" href="/modul/capstone">
                Lihat laporan insiden
              </Link>
            </div>
            <ul className="meta rise" style={d(400)}>
              <li>
                <b>{modules.length}</b>modul
              </li>
              <li>
                <b>{nSteps}</b>langkah
              </li>
              <li>
                <b>{nCmd}</b>baris perintah
              </li>
            </ul>
            {links.length > 0 && (
              <p className="links rise" style={d(460)}>
                {links.map(([n, h]) => (
                  <a key={n} href={h}>
                    {n}
                  </a>
                ))}
              </p>
            )}
          </div>
          <Typing />
        </div>
      </Spotlight>

      <main className="wrap">
        <section id="modul" aria-labelledby="mod">
          <h2 id="mod">Modul lab</h2>
          <ModuleList items={items} />
        </section>

        <section aria-labelledby="sk">
          <h2 id="sk">Keterampilan yang dilatih</h2>
          <p className="intro">
            {allSkills.length} keterampilan dari {modules.length} modul. Pilih
            salah satu untuk membuka modul tempat keterampilan itu dipraktikkan.
          </p>
          <Skills groups={groups} />
        </section>
      </main>

      <section className="cta-band" aria-labelledby="pf">
        <div className="wrap pf">
          <div>
            <span className="avatar" aria-hidden="true">
              {initials}
            </span>
            <h2 id="pf">{profile.name}</h2>
            <p className="pf-role">{profile.role}</p>
            <Link
              className="btn pri"
              href="/kontak"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi saya
            </Link>
          </div>
          {contacts.length > 0 && (
            <ul className="pf-list">
              {contacts.map(([l, t, h]) => (
                <li key={l}>
                  <span>{l}</span>
                  <a
                    href={h}
                    target={h.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                  >
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <footer className="wrap foot">
        <span>© {profile.name}</span>
        <span>
          Lab dikerjakan di VM Ubuntu Server. Gunakan snapshot sebelum mencoba
          modul yang merusak konfigurasi.
        </span>
      </footer>
    </>
  );
}
