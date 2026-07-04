import { useState, useEffect, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Presentation } from "../components/presentation";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/")({
  component: Report,
});

const stats = [
  { v: "4 939", l: "Aholi" },
  { v: "1 142", l: "Xonadon" },
  { v: "22", l: "Ko‘p qavatli uylar" },
  { v: "421", l: "Videokuzatuv" },
  { v: "52", l: "Qo‘riqlov" },
  { v: "210", l: "Ijarachi" },
];

const dynamicsData = [
  { year: "2023", umumiy: 6, oldini: 3, aniqlangan: 1 },
  { year: "2024", umumiy: 20, oldini: 18, aniqlangan: 2 },
  { year: "2025", umumiy: 7, oldini: 3, aniqlangan: 4 },
  { year: "2026", umumiy: 3, oldini: 4, aniqlangan: 3 },
];

const preventable = [
  { name: "O‘g‘irlik", value: 15 },
  { name: "Tan jarohati", value: 5 },
  { name: "T/v olib qochish", value: 3 },
  { name: "Nomusga tegish", value: 1 },
  { name: "Boshqa", value: 1 },
];
const detected = [
  { name: "Giyohvandlik", value: 5 },
  { name: "Pora", value: 3 },
  { name: "Priton", value: 2 },
  { name: "Qimorxona", value: 1 },
];

const supervised = [
  { name: "Ijarada yashovchilar", value: 210 },
  { name: "Profilaktik hisob", value: 30 },
  { name: "Ijtimoiy prof.", value: 25 },
  { name: "Probatsiya", value: 12 },
  { name: "Ovchilar", value: 3 },
  { name: "Ruhiy kasal", value: 3 },
];

const CHART_COLORS = [
  "oklch(0.55 0.18 255)",
  "oklch(0.66 0.16 150)",
  "oklch(0.78 0.16 85)",
  "oklch(0.58 0.22 25)",
  "oklch(0.5 0.14 295)",
  "oklch(0.7 0.12 200)",
];

const appeals = [
  ["Noto‘g‘ri parkovka", 81, 53],
  ["O‘zaro kelishmovchilik", 107, 74],
  ["Shovqin-suron", 11, 16],
  ["Janjal", 41, 17],
  ["Firibgarlik", 120, 65],
  ["Jamoat tartibi buzish", 12, 8],
  ["IIB xodimlarini so‘ragan", 36, 2],
  ["Boshqa", 85, 41],
] as const;

const actions = [
  { n: 1, t: "“Chilonzor tajribasi”", d: "Alohida toifadagi shaxslar bilan ishlash tizimi, mas’ullarni biriktirish, kunlik/haftalik/oylik baholash tizimini joriy etish." },
  { n: 2, t: "“Ijtimoiy profilaktika”", d: "Aniqlangan qo‘shimcha 31 ta shaxsga xulosalar berish, 22 ta tugatilgan xulosani qayta tiklash." },
  { n: 3, t: "“Rezina uylar” — Xostel / E-Ijara", d: "Rezina uylar 20 ta, ijarada yashovchilar 210 nafar. “E-Ijara” tizimini joriy etish va soliq organiga integratsiya." },
  { n: 4, t: "“Ishonch”, “Xazna” ilovalari", d: "SSVning ruhiy kasalliklar hamda nogironligi bo‘lgan shaxslar ro‘yxatiga integratsiya qilish." },
  { n: 5, t: "“ALIYEV” oltin savdo markazi", d: "Majmuaga shartnoma asosida doimiy xizmat ko‘rsatuvchi xodim biriktirish." },
  { n: 6, t: "“Bunyodkor ko‘chasi”", d: "“Xavfsiz ko‘cha” tamoyili: 1 km 700 m, 28 ta kamera (6 FID, 2 raqam aniqlash, 20 kuzatuv), 3 ta “SOS”, yo‘l belgilarini qayta ko‘rish." },
  { n: 7, t: "Jamoat tartibini saqlash", d: "JIB binosi atrofiga qo‘shimcha xodimlarni jalb etish." },
];

const dangerZones = [
  {
    name: "“ALIYEV” oltin savdo markazi",
    level: "Yuqori",
    tone: "danger" as const,
    text: "Jinoyat sodir etilishi ehtimoli yuqori. Aksariyat murojaatlar qimmatbaho buyumlar oldi-berdisi va tilla o‘g‘irligiga tegishli. Jami 13 ta jinoyat: 6 o‘g‘irlik, 5 firibgarlik, 2 bezorilik.",
  },
  {
    name: "“Bunyodkor ko‘chasi”",
    level: "O‘rta",
    tone: "warn" as const,
    text: "Serqatnov joy. Ko‘p qavatli uylarda sodir etilgan jinoyatlar va YTHlar. Tunda jamoat tartibi buzilishi mumkin. Jami 11 ta: 4 o‘g‘irlik, 3 YTH, 2 fohishaxona, 1 ugon.",
  },
  {
    name: "JIB sud binosi atrofi va “Chitir kafesi”",
    level: "O‘rta",
    tone: "warn" as const,
    text: "Sud binosiga har xil nizoli holatlar bo‘yicha ish ko‘riladi; ro‘parasidagi kafe tufayli tunda jamoat tartibi buzilishi mumkin.",
  },
];

const aliyevCrimes = [
  "2023-yil 10-fevral, soat 11:40. “Pink-Diamond” do‘konidan Sh.Sh.Ibragimovaga tegishli 15 300 000 so‘mlik tilla taqinchoqlar o‘g‘irlangan. (JK 169-m. 2-q.)",
  "2023-yil 1-oktabr. “Karona lyuks” MChJ vitrinasidan 10 dona 39,15 gr, 26 000 000 so‘mlik tilla taqinchoqlar yo‘qolgan. (JK 169-m. 2-q.)",
  "2023-yil 15-noyabr, 14:30. Q.R.Sabirov tilla olib beraman deb 5 000 AQSH dollarini o‘zlashtirgan. (JK 168-m. 2-q.)",
  "2024-yil 20-aprel, 14:30. “Nilu” do‘konida N.B.Abdirahimova chalg‘iganidan foydalanib 15 850 AQSH dollarlik tilla o‘g‘irlangan. (JK 169-m. 2-q.)",
  "2025-yil 21-mart. “Gulsaraya gold” do‘koni egasidan 72,86 gr, 5 683 AQSH dollarlik tilla taqinchoqlar o‘zlashtirilgan. (JK 168-m. 2-q.)",
];
const bunyodkorCrimes = [
  "2023-yil 23-noyabrdan 5-dekabrgacha. Bunyodkor ko‘chasi 18-uyda 756 AQSH dollarlik 63 dona parda o‘g‘irlangan. (JK 169-m. 2-q.)",
  "2023-yil 6-mart. “Spark” avtomashinasi orqaga harakatlanib piyodani urib yuborgan. (JK 266-m. 1-q.)",
  "2024-yil 14-mart, 18:30. “Uztelekom” oldida turgan “Lasetti-2” eshiklari ochiq va kaliti ilingan holatda olib qochilgan. (JK 267-m. 1-q.)",
  "2024-yil 24-may. Ko‘chma butkada elektr hisoblagichsiz 22 056 147 so‘mlik elektr resursi o‘g‘irlangan. (JK 169-m. 1-q.)",
  "2025-yil 10-iyul. “Neksiya-2” bilan “MAN” avtobusi o‘zaro to‘qnashgan. (JK 266-m. 1-q.)",
];



function Report() {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const personStats = [
    {
      value: "14",
      label: "Erkaklar",
      surnames: [
        "Karimov",
        "Soliyev",
        "Rasulov",
        "Nazarov",
        "Yusupov",
        "Murodov",
        "Toshmatov",
        "Akbarov",
        "Rahmonov",
        "Tojiboyev",
        "Jalilov",
        "Ismoilov",
        "Bozorov",
        "Qodirov",
      ],
    },
    {
      value: "9",
      label: "Ayollar",
      surnames: [
        "Toshpulatova",
        "Rahimova",
        "Iskandarova",
        "Mamatova",
        "Sodiqova",
        "Abdurahmonova",
        "Xolmatova",
        "Qurbonova",
        "Yusupova",
      ],
    },
    {
      value: "2",
      label: "Sudlangan",
      surnames: ["Abdullayev", "Ibrohimov"],
    },
    {
      value: "2",
      label: "Mast holatda",
      surnames: ["Sultonov", "Nabiev"],
    },
    {
      value: "3",
      label: "Ishsiz",
      surnames: ["Yusupov", "Murodov", "Nazarov"],
    },
    {
      value: "4",
      label: "Boshqa hudud",
      surnames: ["Mansurov", "Toshpulatov", "Qosimov", "Ergashev"],
    },
    {
      value: "4",
      label: "Yoshlar",
      surnames: ["Aminov", "Soliyev", "Jabbarov", "Mirzayev"],
    },
    {
      value: "4",
      label: "Voyaga yetmagan",
      surnames: ["Abdullayev", "Xolmatov", "Nurmuhamedov", "Boboyev"],
    },
    {
      value: "5",
      label: "Ijarachi",
      surnames: ["Sattorov", "Tursunov", "Karimova", "Nabieva", "Raximov"],
    },
  ] as const;

  const selectedDetails = personStats.find((item) => item.label === selectedPerson);

  const slides = [
    <Hero />,

    <Section id="tahlil" kicker="I bo‘lim" title="Tahliliy ma’lumotlar">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 mb-10">
          {stats.map((s) => (
            <div key={s.l} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
              <div className="text-3xl font-bold text-[color:var(--brand)]">{s.v}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Jinoyatlar dinamikasi (2023–2026)">
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={dynamicsData}>
                  <XAxis dataKey="year" stroke="currentColor" />
                  <YAxis stroke="currentColor" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="umumiy" name="Umumiy" fill={CHART_COLORS[0]} />
                  <Bar dataKey="oldini" name="Oldini olish" fill={CHART_COLORS[3]} />
                  <Bar dataKey="aniqlangan" name="Aniqlangan" fill={CHART_COLORS[1]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex gap-6 text-sm text-muted-foreground">
              <span><b className="text-foreground">36</b> umumiy</span>
              <span><b className="text-foreground">28</b> oldini olish</span>
              <span><b className="text-foreground">10</b> aniqlangan</span>
            </div>
          </Card>

          <Card title="Jinoyat turlari">
            <div className="grid grid-cols-2 gap-3">
              <MiniPie title="Oldini olish mumkin (28 ta)" data={preventable} />
              <MiniPie title="Aniqlanadigan (10 ta)" data={detected} />
            </div>
          </Card>

          <Card title="Sodir etgan shaxslar (23 ta)">
            <div className="grid grid-cols-3 gap-3 text-sm">
              {personStats.map((item) => {
                const isInteractive = Boolean(item.surnames);
                const isActive = selectedPerson === item.label;

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      if (!isInteractive) return;
                      setSelectedPerson(isActive ? null : item.label);
                    }}
                    className={`rounded-lg border p-3 text-center transition ${isInteractive ? "cursor-pointer hover:border-[color:var(--brand)] hover:bg-secondary/80" : "cursor-default"} ${isActive ? "border-[color:var(--brand)] bg-secondary" : "bg-secondary"}`}
                  >
                    <div className="text-xl font-bold text-[color:var(--brand)]">{item.value}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{item.label}</div>
                  </button>
                );
              })}
            </div>

            {selectedDetails?.surnames && (
              <div className="mt-4 rounded-lg border bg-background/70 p-4">
                <div className="mb-3 text-sm font-semibold text-foreground">
                  {selectedDetails.label}ning familiyalari ({selectedDetails.surnames.length} ta):
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {selectedDetails.surnames.map((surname) => (
                    <div key={surname} className="rounded-md border border-border bg-card px-3 py-2 text-sm">
                      {surname}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>

          <Card title="Joy va vaqt (3 yil, 25 ta)">
            <ul className="space-y-2 text-sm">
              {[["Xonadon", 13], ["Ko‘chada", 5], ["Tashkilot", 4], ["Transport", 3]].map(([k, v]) => (
                <li key={String(k)} className="flex items-center gap-3">
                  <span className="w-28 text-muted-foreground">{k}</span>
                  <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full bg-[color:var(--brand-2)]" style={{ width: `${(Number(v) / 13) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right font-semibold">{v}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 rounded-lg bg-secondary p-3 text-sm text-muted-foreground">
              Vaqt bo‘yicha: 00–08, 08–16, 16–24 — <b className="text-foreground">24/7</b> nazorat.
            </div>
          </Card>

          <Card title="Murojaatlar (1 yil 6 oy) — 769">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground border-b">
                  <th className="text-left py-2 font-medium">Turi</th>
                  <th className="text-right py-2 font-medium">2025</th>
                  <th className="text-right py-2 font-medium">2026</th>
                </tr>
              </thead>
              <tbody>
                {appeals.map(([k, a, b]) => (
                  <tr key={k} className="border-b last:border-0">
                    <td className="py-2">{k}</td>
                    <td className="py-2 text-right font-medium">{a}</td>
                    <td className="py-2 text-right font-medium">{b}</td>
                  </tr>
                ))}
                <tr className="font-bold text-[color:var(--brand)]">
                  <td className="py-2">Jami</td><td className="py-2 text-right">493</td><td className="py-2 text-right">276</td>
                </tr>
              </tbody>
            </table>
          </Card>

          <Card title="Hisobdagi shaxslar — 29 + boshqalar">
            <ul className="space-y-2 text-sm">
              {[
                ["Profilaktik hisob", "29 nafar"],
                ["Probatsiya hisobi", "12 nafar"],
                ["Spirtli ichimlikka ruju qo‘ygan", "8 nafar"],
                ["Giyohvand", "3 nafar"],
                ["Ruhiy kasal", "3 nafar"],
                ["Ov qurolli shaxs", "3 nafar"],
                ["Ijtimoiy prof. obyektlari", "148 ta"],
              ].map(([k, v]) => (
                <li key={k} className="flex justify-between border-b border-border last:border-0 py-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="font-semibold">{v}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>,

      <Section id="ishlar" kicker="II bo‘lim" title="Amalga oshirilgan ishlar" tone="dark">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { t: "Jalb etilgan shaxsiy tarkib", items: ["3 nafar professor-o‘qituvchi", "1 nafar magistr tinglovchi", "5 nafar kursant", "JAMI: 9 nafar"] },
            { t: "Uslubiy yordam", items: ["24 banddan iborat namunaviy reja", "Mahalla rejalari tekshirildi", "“Ijtimoiy profilaktika obyektlarini aniqlash” master-klassi"] },
            { t: "Targ‘ibot va profilaktika", items: ["128-maktabda fakultativ (82 nafar 10–11 sinf)", "114 xonadon bilan manzilli suhbat", "387 nafar shaxs mahalla yettiligiga biriktirildi", "132 dona targ‘ibot materiali"] },
            { t: "Jinoyatlar tahlili", items: ["2023–2026: 36 jinoyat ro‘yxati", "3 ta “jinoyat o‘chog‘i” aniqlandi", "55 ta ijtimoiy profilaktika obyekti qayta tuzildi"] },
            { t: "Jinoyatchilikni jilovlash", items: ["7 ta taklif va tavsiya kiritildi", "4 ta taqdimnoma belgilanadi"] },
            { t: "Kiberjinoyatlar profilaktikasi", items: ["18 targ‘ibot, 215 nafar qamrov", "320+ ikki bosqichli himoya tizimi", "380 “Cyber_102” integratsiyasi", "400 kreditni cheklash faollashtirildi", "1500+ individual tushuntirish"] },
          ].map((b) => (
            <div key={b.t} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-lg font-semibold text-white mb-3">{b.t}</h3>
              <ul className="space-y-2 text-sm text-white/80">
                {b.items.map((i) => <li key={i} className="flex gap-2"><span className="text-[color:var(--warn)]">▸</span>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </Section>,

      <Section id="toifa" kicker="III bo‘lim" title="Xonadonlar toifasi bo‘yicha hisobot">
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <CategoryCard tone="danger" name="Qizil toifa" count="45 ta" pct="4.0%" note="29 shaxs" />
          <CategoryCard tone="warn" name="Sariq toifa" count="59 ta" pct="5.0%" note="295 shaxs" />
          <CategoryCard tone="safe" name="Yashil toifa" count="1 038 ta" pct="91.0%" note="Barqaror" />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-10">
          <MetaCard label="Hududi" value="16 gektar" />
          <MetaCard label="Jami xonadon" value="1 142 ta" />
          <MetaCard label="Aholi" value="4 939 nafar" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <TagList
            tone="danger"
            title="Qizil toifa — 29 shaxs"
            items={[
              ["Muqaddam qotillik, tan jarohati, bezorilik, bosqinchilik", 4],
              ["Nizoli yer-joy, mol-mulk, pul masalasi", 4],
              ["Qimorbozlar", 1],
              ["Spirtli ichimlikka ruju qo‘ygan", 8],
              ["Giyohvandlikka chalingan", 7],
              ["Tajovuzkor ruhiy kasallar", 2],
              ["Notinch oilalar", 1],
              ["Oilaviy zo‘ravonlik qurboni ayollar", 2],
              ["Ajrim yoqasidagi oilalar", 6],
              ["Probatsiya hisobidagilar", 8],
              ["Alimyent bo‘yicha nizosi bor", 3],
              ["Sudlarda nizolashayotgan oilalar", 3],
              ["Agressiv xulqli shaxslar", 4],
            ]}
          />
          <TagList
            tone="warn"
            title="Sariq toifa — 295 shaxs"
            items={[
              ["Yakka yolg‘iz qariyalar", 27],
              ["Noqonuniy birga yashovchilar", 2],
              ["Turmushdan ajraganlar", 9],
              ["Ishsizlar", 26],
              ["Ov qurolli shaxslar", 3],
              ["Ijarada yashovchilar", 210],
              ["Huquqbuzarlikka moyillar", 16],
              ["Turmush o‘rtog‘i uzoq ketgan yolg‘iz ayollar", 2],
            ]}
          />
        </div>
      </Section>,

      <Section id="shaxslar" kicker="IV bo‘lim" title="Kriminogen vaziyatga ta’sir qiluvchi shaxslar">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div>
            <div className="text-6xl font-bold text-[color:var(--brand)]">283</div>
            <div className="text-lg text-muted-foreground mt-1">jami nazoratdagilar</div>
            <div className="mt-6 space-y-3">
              {supervised.map((s, i) => {
                const pct = ((s.value / 283) * 100).toFixed(1);
                return (
                  <div key={s.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{s.name}</span>
                      <span className="text-muted-foreground">{s.value} — {pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full" style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={supervised} dataKey="value" nameKey="name" innerRadius={70} outerRadius={130} paddingAngle={2}>
                  {supervised.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Section>,

      <Section id="joylar" kicker="V bo‘lim" title="Xavfli joylar ro‘yxati" tone="muted">
        <div className="grid gap-5 md:grid-cols-3">
          {dangerZones.map((z) => (
            <div key={z.name} className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
              <RiskBadge tone={z.tone}>{z.level}</RiskBadge>
              <h3 className="mt-4 text-lg font-semibold">{z.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{z.text}</p>
            </div>
          ))}
        </div>
      </Section>,

      <Section id="rejalar" kicker="VI bo‘lim" title="Amalga oshirilishi lozim ishlar">
        <div className="grid gap-4 md:grid-cols-2">
          {actions.map((a) => (
            <div key={a.n} className="flex gap-4 rounded-xl border bg-card p-5">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[color:var(--brand)] text-primary-foreground font-bold">{a.n}</div>
              <div>
                <h3 className="font-semibold">{a.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.d}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>,

      <Section id="jinoyatlar" kicker="VII bo‘lim" title="Sodir etilgan jinoyatlar (3 yil)" tone="muted">
        <div className="grid gap-8 lg:grid-cols-2">
          <CrimeList title="“ALIYEV” oltin savdo markazi" tone="danger" items={aliyevCrimes} />
          <CrimeList title="Bunyodkor ko‘chasi bo‘ylab" tone="warn" items={bunyodkorCrimes} />
        </div>
      </Section>,

      <Section id="prognoz" kicker="Xulosa" title="Sabab, taklif va kriminologik prognoz" tone="dark">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-white font-semibold mb-4">Sabab va sharoitlar</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {["Jinoyatchi uchun qulay vaziyat va imkoniyat mavjudligi", "Kuch va vositalar noto‘g‘ri taqsimlanganligi", "Fuqarolar firibgarlikdan ogohlantirilmaganligi, nazorat sustligi", "Jamoatchilik nazoratining sustligi"].map((s) => (
                <li key={s} className="flex gap-2"><span className="text-[color:var(--danger)]">■</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-white font-semibold mb-4">Takliflar</h3>
            <ul className="space-y-3 text-sm text-white/80">
              {["“Novza” metrosidagi “Oltin markaz” oldiga Security Room (24/7)", "“Ishonch”, “Xazna” ilovalarini SSV axborot tizimlariga integratsiya", "VMK 754-son qarordagi “Mahalla yettiligi” talablarini O‘RQ-371 qonuniga kiritish", "“Rezina uylar”ni Xostel/Ijara uyi sifatida rasmiylashtirish va E-Ijara"].map((s) => (
                <li key={s} className="flex gap-2"><span className="text-[color:var(--warn)]">◆</span>{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-white font-semibold mb-4">Kriminologik prognoz</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex gap-2"><span className="text-[color:var(--danger)]">↑</span>Ijarachilar sonining ko‘payishi</li>
              <li className="flex gap-2"><span className="text-[color:var(--danger)]">↑</span>Uyushmagan yoshlar ko‘payishi</li>
              <li className="flex gap-2"><span className="text-[color:var(--danger)]">↑</span>Savdo va xizmat obyektlari atrofida nazoratning zaiflashishi</li>
              <li className="flex gap-2 pt-3 border-t border-white/10 mt-3"><span className="text-[color:var(--safe)]">↓</span>Taklif etilgan tizimlarni joriy etish orqali jinoyatchilikni kamaytirish mumkin</li>
            </ul>
          </div>
        </div>
      </Section>,

      <InteractiveMapSection />,
  ];

  return <Presentation slides={slides} />;
}

/* ---------- primitives ---------- */

function Hero() {
  return (
    <header className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 text-primary-foreground">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-4 py-1.5 text-xs font-medium uppercase tracking-wider">
          Chilonzor tumani IIB · Tahliliy hisobot
        </div>
        <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-4xl">
          Beshqurgon mahallasida xavfsiz muhitni yaratish tizimini takomillashtirish
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/80">
          Tahliliy ma’lumotlar, xonadonlar toifasi, kriminogen vaziyatga ta’sir qiluvchi shaxs va joylar, hamda amalga oshirilishi lozim bo‘lgan chora-tadbirlar.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-4 max-w-2xl text-white">
          <HeroStat v="36" l="Jinoyat (3 yil)" />
          <HeroStat v="283" l="Nazoratda" />
          <HeroStat v="769" l="Murojaat" />
        </div>
      </div>
    </header>
  );
}

function HeroStat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur p-4">
      <div className="text-3xl md:text-4xl font-bold">{v}</div>
      <div className="text-sm text-white/70 mt-1">{l}</div>
    </div>
  );
}

function Nav() {
  const scrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScroll = (dir: "up" | "down", speed: "slow" | "fast") => {
    const step = speed === "fast" ? 30 : 10;
    scrollRef.current = setInterval(() => {
      window.scrollBy(0, dir === "down" ? step : -step);
    }, 16);
  };

  const stopScroll = () => {
    if (scrollRef.current) {
      clearInterval(scrollRef.current);
      scrollRef.current = null;
    }
  };

  useEffect(() => () => stopScroll(), []);

  const btn = (label: string, dir: "up" | "down", speed: "slow" | "fast") => (
    <button
      onMouseDown={() => startScroll(dir, speed)}
      onMouseUp={stopScroll}
      onMouseLeave={stopScroll}
      onTouchStart={() => startScroll(dir, speed)}
      onTouchEnd={stopScroll}
      className="flex items-center justify-center w-14 h-14 rounded-2xl bg-card/80 backdrop-blur border shadow-lg hover:bg-[color:var(--brand)] hover:text-primary-foreground hover:border-[color:var(--brand)] active:scale-95 transition-all text-2xl select-none"
    >
      {label}
    </button>
  );

  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
      {btn("⤊", "up", "fast")}
      {btn("↑", "up", "slow")}
      {btn("↓", "down", "slow")}
      {btn("⤋", "down", "fast")}
    </div>
  );
}

function Section({ id, kicker, title, tone, children }: { id: string; kicker: string; title: string; tone?: "dark" | "muted"; children: React.ReactNode }) {
  const bg = tone === "dark"
    ? "bg-[color:var(--brand)] text-primary-foreground"
    : tone === "muted" ? "bg-secondary/40" : "bg-background";
  return (
    <section id={id} className={`${bg} scroll-mt-16`}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className={`mb-10 ${tone === "dark" ? "text-white" : ""}`}>
          <div className={`text-xs font-semibold tracking-[0.2em] uppercase ${tone === "dark" ? "text-white/60" : "text-[color:var(--brand-2)]"}`}>{kicker}</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}

function MiniPie({ title, data }: { title: string; data: { name: string; value: number }[] }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground text-center mb-2">{title}</div>
      <div className="h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" outerRadius={70} label={{ fontSize: 10 }}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function CategoryCard({ tone, name, count, pct, note }: { tone: "danger" | "warn" | "safe"; name: string; count: string; pct: string; note: string }) {
  const color = tone === "danger" ? "var(--danger)" : tone === "warn" ? "var(--warn)" : "var(--safe)";
  return (
    <div className="rounded-xl border bg-card p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-1 w-full" style={{ background: color }} />
      <div className="flex items-baseline justify-between">
        <h3 className="text-lg font-semibold">{name}</h3>
        <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}>{pct}</span>
      </div>
      <div className="mt-4 text-4xl font-bold" style={{ color }}>{count}</div>
      <div className="mt-2 text-sm text-muted-foreground">{note}</div>
    </div>
  );
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-card px-5 py-4 flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

function TagList({ tone, title, items }: { tone: "danger" | "warn"; title: string; items: [string, number][] }) {
  const color = tone === "danger" ? "var(--danger)" : "var(--warn)";
  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-3">
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map(([k, v]) => (
          <li key={k} className="flex justify-between py-1.5 border-b border-border last:border-0">
            <span className="text-muted-foreground pr-4">{k}</span>
            <span className="font-semibold flex-none">{v}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskBadge({ tone, children }: { tone: "danger" | "warn"; children: React.ReactNode }) {
  const color = tone === "danger" ? "var(--danger)" : "var(--warn)";
  return (
    <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider" style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}>
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      Xavf: {children}
    </span>
  );
}

function CrimeList({ title, tone, items }: { title: string; tone: "danger" | "warn"; items: string[] }) {
  const color = tone === "danger" ? "var(--danger)" : "var(--warn)";
  return (
    <div>
      <h3 className="text-xl font-semibold mb-5 flex items-center gap-3">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        {title}
      </h3>
      <ol className="space-y-4">
        {items.map((t, i) => (
          <li key={i} className="rounded-lg border bg-card p-4 flex gap-4">
            <span className="flex-none font-bold text-lg text-[color:var(--brand-2)]">{i + 1}.</span>
            <span className="text-sm leading-relaxed text-muted-foreground">{t}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- interactive map ---------- */

interface MapPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  risk: "high" | "mid" | "low";
}

interface PersonPoint extends MapPoint {
  type: "person";
  fio: string;
  age: string;
  category: string;
  address: string;
  desc: string;
  photo?: string;
}

interface PlacePoint extends MapPoint {
  type: "place";
  objectName: string;
  address: string;
  objectType: string;
  reason: string;
  photo?: string;
  recommendation: string;
}

interface TaskPoint extends MapPoint {
  type: "task";
  taskName: string;
  desc: string;
  executor: string;
  deadline: string;
  status: string;
  priority: string;
}

type MapMarker = PersonPoint | PlacePoint | TaskPoint;

const LAYER_PEOPLE: PersonPoint[] = [
  { id: "p1", x: 28, y: 22, label: "Исмоилов", risk: "high", type: "person", fio: "Исмоилов Жаҳонгир Акрам ўғли", age: "34", category: "Муқаддам судланган", address: "Бешқўрғон кўчаси, 15-уй", desc: "2023 йилда оғир тан жароҳати етказиш моддаси бўйича судланган. Ҳозирда пробация ҳисобида турибди." },
  { id: "p2", x: 55, y: 35, label: "Раҳимова", risk: "mid", type: "person", fio: "Раҳимова Нилуфар Баҳодир қизи", age: "28", category: "Ижтимоий профилактика", address: "Навбаҳор кўчаси, 8-уй", desc: "Оилавий зўравонлик қурбони. Психологик ёрдам олмоқда." },
  { id: "p3", x: 72, y: 18, label: "Каримов", risk: "high", type: "person", fio: "Каримов Ботиржон Ҳакимович", age: "45", category: "Гиёҳвандлик", address: "Янгиҳаёт кўчаси, 22-уй", desc: "Гиёҳванд моддалар савдоси билан шуғулланган. 2024 йилда қўлга олинган." },
  { id: "p4", x: 40, y: 55, label: "Солиев", risk: "mid", type: "person", fio: "Солиев Умиджон Абдурашидович", age: "31", category: "Ишсиз", address: "Чилонзор кўчаси, 5-уй", desc: "Узоқ вақт ишсиз. Маҳалла томонидан иш билан таъминлаш чоралари кўрилмоқда." },
  { id: "p5", x: 15, y: 68, label: "Тошматова", risk: "low", type: "person", fio: "Тошматова Гулнора Эркиновна", age: "52", category: "Якка яшовчи", address: "Боғистон кўчаси, 3-уй", desc: "Якка яшовчи фуқаро. Маҳалла ёрдамида назоратга олинган." },
  { id: "p6", x: 80, y: 50, label: "Назаров", risk: "high", type: "person", fio: "Назаров Рустам Шуҳратович", age: "39", category: "Қиморбоз", address: "Дўстлик кўчаси, 12-уй", desc: "Қимор ўйинлари ташкил қилишда гумонланиб, тергов қилинмоқда." },
];

const LAYER_PLACES: PlacePoint[] = [
  { id: "l1", x: 30, y: 25, label: "Олтин маркази", risk: "high", type: "place", objectName: "ALIYEV олтин савдо маркази", address: "Бешқўрғон кўчаси, 1-тупик", objectType: "Саҳдо маркази", reason: "13 та жиноят (6 ўғирлик, 5 фирибгарлик, 2 безорилик)", recommendation: "Security Room 24/7 ташкил қилиш" },
  { id: "l2", x: 65, y: 40, label: "Бунёдкор кўчаси", risk: "mid", type: "place", objectName: "Бунёдкор кўчаси бўйлаб", address: "Бунёдкор кўчаси", objectType: "Кўча/Ҳудуд", reason: "11 та жиноят (4 ўғирлик, 3 ЙТҲ, 2 фоҳишахона, 1 уғон)", recommendation: "28 та камера (6 FID, 2 рақам аниқлаш, 20 кузатув) ўрнатиш" },
  { id: "l3", x: 45, y: 65, label: "Суд биноси", risk: "mid", type: "place", objectName: "ЖИБ суд биноси ва Читир кафеси", address: "Бешқўрғон кўчаси, 7-уй", objectType: "Жамоат жойи", reason: "Тунги вақтда жамоат тартиби бузилиш эҳтимоли", recommendation: "Кўча ёритишни кучайтириш ва навбатчиликни жорий этиш" },
  { id: "l4", x: 18, y: 40, label: "128-мактаб", risk: "low", type: "place", objectName: "128-сонли мактаб", address: "Боғистон кўчаси, 2-уй", objectType: "Таълим муассасаси", reason: "Ўқувчилар орасида ҳуқуқбузарлик профилактикаси зарур", recommendation: "Факультатив дарслар ва психологик хизматни кучайтириш" },
  { id: "l5", x: 85, y: 72, label: "Новза метроси", risk: "mid", type: "place", objectName: "Novza метроси атрофи", address: "Новза метро бекати", objectType: "Транспорт тугуни", reason: "Кўплаб мурожаатлар ва жиноятлар содир этилиш хавфи", recommendation: "Метро олдига Security Room (24/7) ўрнатиш" },
];

const LAYER_TASKS: TaskPoint[] = [
  { id: "t1", x: 35, y: 30, label: "Чилонзор тажрибаси", risk: "high", type: "task", taskName: "Чилонзор тажрибаси", desc: "Алоҳида тоифадаги шахслар билан ишлаш тизимини жорий этиш", executor: "ИИБ профилактика бўлими", deadline: "2026-12-31", status: "Бажарилмоқда", priority: "Юқори" },
  { id: "t2", x: 60, y: 55, label: "Е-Ижара", risk: "mid", type: "task", taskName: "Е-Ижара тизими", desc: "Ижара шартномаларини рақамлаштириш ва солиқ органыга интеграция", executor: "МФЙ раиси + ИИБ", deadline: "2026-10-01", status: "Тайёргарлик", priority: "Юқори" },
  { id: "t3", x: 75, y: 25, label: "Хавфсиз кўча", risk: "mid", type: "task", taskName: "Хавфсиз кўча тамойили", desc: "Бунёдкор кўчаси бўйлаб 1,7 км йўлакка 28 та камера ўрнатиш", executor: "Ҳокимлик + ИИБ", deadline: "2026-09-15", status: "Бажарилмоқда", priority: "Юқори" },
  { id: "t4", x: 20, y: 50, label: "Ишонч иловаси", risk: "low", type: "task", taskName: "Ишонч ва Хазна иловалари", desc: "ССВ руҳий касалликлар рўйхатыга интеграция қилиш", executor: "Ахборот технологиялари бўлими", deadline: "2026-11-01", status: "Тайёргарлик", priority: "Ўрта" },
  { id: "t5", x: 50, y: 78, label: "Маҳалла ёрдами", risk: "low", type: "task", taskName: "Маҳалла ёрдами", desc: "Ишсизларни иш билан таъминлаш ва ижтимоий қўллаб-қувватлаш", executor: "Маҳалла фаоллари", deadline: "2026-12-31", status: "Жорий", priority: "Ўрта" },
];

const LAYER_CONFIG = {
  people: { label: "Криминоген вазиятга таъсир қилувчи шахслар", icon: "👤", data: LAYER_PEOPLE as MapMarker[], color: "var(--danger)" },
  places: { label: "Криминоген вазиятга таъсир қилувчи жойлар", icon: "📍", data: LAYER_PLACES as MapMarker[], color: "var(--warn)" },
  tasks: { label: "Амалга оширилиши лозим бўлган ишлар", icon: "✓", data: LAYER_TASKS as MapMarker[], color: "var(--brand)" },
};

type LayerId = keyof typeof LAYER_CONFIG;

function InteractiveMapSection() {
  const [activeLayer, setActiveLayer] = useState<LayerId | null>(null);
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const toggleLayer = (id: LayerId) => {
    setActiveLayer((prev) => (prev === id ? null : id));
    setSelected(null);
  };

  const handleMarkerClick = (m: MapMarker) => {
    setSelected((prev) => (prev?.id === m.id ? null : m));
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "IMG") {
      setSelected(null);
    }
  };

  const markers = activeLayer ? LAYER_CONFIG[activeLayer].data : [];
  const config = activeLayer ? LAYER_CONFIG[activeLayer] : null;

  return (
    <section className="bg-secondary/40 border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="mb-10">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-[color:var(--brand-2)]">Xarita</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">Beshqurgon MFY xaritasi</h2>
        </div>

        <div className="flex gap-6">
          <div className="flex flex-col gap-3 w-64 shrink-0">
            {(Object.keys(LAYER_CONFIG) as LayerId[]).map((id) => {
              const c = LAYER_CONFIG[id];
              const isOn = activeLayer === id;
              return (
                <button
                  key={id}
                  onClick={() => toggleLayer(id)}
                  className={`flex items-center gap-3 rounded-xl border px-5 py-4 text-left transition-all duration-300 ${
                    isOn
                      ? "border-[color:var(--brand)] bg-card shadow-lg scale-[1.02]"
                      : "bg-card/60 hover:bg-card hover:shadow border-border"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0 transition-all ${
                      isOn ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                    style={{ background: isOn ? "var(--brand)" : "var(--secondary)" }}
                  >
                    {c.icon}
                  </span>
                  <span className={`text-xs font-semibold leading-tight ${isOn ? "text-foreground" : "text-muted-foreground"}`}>
                    {c.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 relative">
            <div
              ref={mapRef}
              className="relative rounded-xl overflow-hidden border shadow-[var(--shadow-card)] bg-card select-none"
              onClick={handleMapClick}
            >
              <img src="/map.png" alt="Beshqurgon MFY xaritasi" className="w-full h-auto block" draggable={false} />

              {markers.map((m) => (
                <button
                  key={m.id}
                  onClick={(e) => { e.stopPropagation(); handleMarkerClick(m); }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${
                    selected?.id === m.id ? "z-20 scale-125" : "hover:scale-110"
                  }`}
                  style={{ left: `${m.x}%`, top: `${m.y}%` }}
                >
                  <span
                    className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-white shadow-md text-[10px] font-bold text-white transition-transform duration-300"
                    style={{
                      background: m.risk === "high" ? "var(--danger)" : m.risk === "mid" ? "var(--warn)" : "var(--safe)",
                    }}
                  >
                    {m.type === "person" ? "P" : m.type === "place" ? "L" : "T"}
                  </span>
                </button>
              ))}

              {selected && config && (
                <div
                  className="absolute z-30 w-72 animate-in fade-in zoom-in duration-200"
                  style={{
                    left: `${Math.min(selected.x + 10, 85)}%`,
                    top: `${Math.max(selected.y - 5, 5)}%`,
                  }}
                >
                  <PopupContent marker={selected} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border/50 mt-12">
        <div className="mx-auto max-w-7xl px-6 py-6 text-sm text-muted-foreground flex flex-wrap justify-between gap-4">
          <div>Chilonzor tumani IIB · BESHQURGON MFY</div>
          <div>Podpolkovnik F.Soriyev · Katta leytenant X.Allanov</div>
        </div>
      </footer>
    </section>
  );
}

function PopupContent({ marker }: { marker: MapMarker }) {
  if (marker.type === "person") return <PersonPopup m={marker} />;
  if (marker.type === "place") return <PlacePopup m={marker} />;
  return <TaskPopup m={marker} />;
}

function PersonPopup({ m }: { m: PersonPoint }) {
  const color = m.risk === "high" ? "var(--danger)" : m.risk === "mid" ? "var(--warn)" : "var(--safe)";
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xl text-sm" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg font-bold text-muted-foreground shrink-0">
          {m.fio.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{m.fio}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{m.age} ёш · {m.category}</div>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Манзил:</span> {m.address}</div>
        <div><span className="font-medium text-foreground">Тавсиф:</span> {m.desc}</div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          {m.risk === "high" ? "Юқори хавф" : m.risk === "mid" ? "Ўрта хавф" : "Паст хавф"}
        </span>
        <button className="text-xs font-medium text-[color:var(--brand)] hover:underline">Батафсил</button>
      </div>
    </div>
  );
}

function PlacePopup({ m }: { m: PlacePoint }) {
  const color = m.risk === "high" ? "var(--danger)" : m.risk === "mid" ? "var(--warn)" : "var(--safe)";
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xl text-sm" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0"
          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)` }}
        >
          📍
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{m.objectName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{m.objectType}</div>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Манзил:</span> {m.address}</div>
        <div><span className="font-medium text-foreground">Сабаб:</span> {m.reason}</div>
        <div><span className="font-medium text-foreground">Тавсия:</span> {m.recommendation}</div>
      </div>
    </div>
  );
}

function TaskPopup({ m }: { m: TaskPoint }) {
  const color = m.priority === "Юқори" ? "var(--danger)" : "var(--warn)";
  return (
    <div className="rounded-xl border bg-card p-4 shadow-xl text-sm" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
        >
          ✓
        </div>
        <div className="min-w-0">
          <div className="font-semibold leading-tight">{m.taskName}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{m.status}</div>
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Тавсиф:</span> {m.desc}</div>
        <div><span className="font-medium text-foreground">Ижрочи:</span> {m.executor}</div>
        <div><span className="font-medium text-foreground">Муддат:</span> {m.deadline}</div>
      </div>
      <div className="mt-3">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
          style={{ background: `color-mix(in oklab, ${color} 15%, transparent)`, color }}
        >
          {m.priority} устуворлик
        </span>
      </div>
    </div>
  );
}
