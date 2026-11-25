# EDUNEX — Elektron Ta'lim va Kollej Kundaligi Tizimi

**EDUNEX** — kollej, texnikum va o'quv markazlari uchun mo'ljallangan zamonaviy elektron boshqaruv va kundalik platformasi.

## Asosiy imkoniyatlar

- **Kirish va Direktor Ro'yxatdan O'tishi**: 3 bosqichli muassasa yaratish ustasi (shaxsiy ma'lumotlar, muassasa rekvizitlari, kafedralar va baholash tizimi).
- **Direktor Paneli**: KPI statistika, haftalik/oylik davomat diagrammasi, eng yaxshi o'quvchilar reytingi, guruhlar/o'qituvchilar/o'quvchilar boshqaruvi, dars jadvali tuzish, nazorat tahlili, e'lonlar va CSV eksport.
- **O'qituvchi Paneli**: Bugungi darslar, tezkor `+5/+4/+3/+2` baholash jurnali, davomat belgilash, uyga vazifa biriktirish va guruh chati.
- **O'quvchi Paneli**: Fanlar bo'yicha baholar, guruh reytingi, haftalik dars jadvali, uyga vazifa topshirish, **Elektron kutubxona**, guruh chati va **Elektron talaba guvohnomasi**.
- **UI/UX**: Light / Dark (`Tungi rejim`), responsiv mobil menyu, silliq animatsiyalar va `localStorage` orqali ma'lumotlarni saqlash.

## Tuzilishi

```text
EDUNEX/
├── index.html
├── README.md
├── .gitignore
├── css/
│   └── styles.css
└── js/
    ├── app.js
    ├── auth.js
    ├── components.js
    ├── icons.js
    ├── store.js
    └── views/
        ├── director.js
        ├── teacher.js
        └── student.js
```

## Ishga tushirish

Hech qanday server yoki qo'shimcha kutubxona talab qilinmaydi — `index.html` faylini istalgan zamonaviy brauzerda oching.

### Demo akkauntlar
| Rol | Login | Parol |
|---|---|---|
| Direktor | `dilshod.rahimov` | `Direktor@2026` |
| O'qituvchi | `gulnora.karimova` | `Oqtuvchi@2026` |
| O'quvchi | `sardor.alimov` | `Oquvchi@2026` |
