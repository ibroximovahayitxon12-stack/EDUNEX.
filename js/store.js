(function () {
  const STORAGE_KEY = "edunex_kollej_db_v2";

  function createSeedState() {
    const collegeId = "col_tatk";
    return {
      theme: "light",
      session: null, // { userId, collegeId }
      rememberLogin: "",
      colleges: [
        {
          id: collegeId,
          name: "Toshkent Axborot Texnologiyalari Kolleji",
          shortName: "TATK",
          type: "Kollej",
          region: "Toshkent shahri",
          stir: "204819375",
          academicYear: "2026-2027 o'quv yili",
          semester: "1-semestr • 12-hafta",
          gradingSystem: "5 ballik tizim",
          departments: [
            "Dasturlash",
            "Kompyuter injiniringi",
            "Ma'lumotlar bazasi",
            "Kiberxavfsizlik",
            "Matematika va fizika",
            "Xorijiy tillar",
          ],
          baseStudentOffset: 1236, // 12 detailed + 1236 = 1,248 total college students
          baseTeacherOffset: 62,   // 6 detailed + 62 = 68 total teachers
          baseGroupOffset: 36,     // 6 detailed + 36 = 42 total groups
        },
      ],
      users: [
        // Director
        {
          id: "u_dir_1",
          collegeId,
          role: "director",
          fullName: "Dilshodjon Rahimov",
          login: "dilshod.rahimov",
          password: "Direktor@2026",
          phone: "+998 90 123 45 67",
          email: "director@tatk.uz",
          title: "Direktor",
          isNewDirector: false,
        },
        // Teachers
        {
          id: "u_tch_1",
          collegeId,
          role: "teacher",
          fullName: "Gulnora Karimova",
          login: "gulnora.karimova",
          password: "Oqtuvchi@2026",
          phone: "+998 91 234 56 78",
          department: "Dasturlash",
          subject: "Dasturlash",
          assignedGroups: ["KI-21", "KI-22", "DB-21"],
          status: "Faol",
        },
        {
          id: "u_tch_2",
          collegeId,
          role: "teacher",
          fullName: "Otabek Mirzayev",
          login: "otabek.mirzayev",
          password: "Oqtuvchi@2026",
          phone: "+998 93 411 22 33",
          department: "Matematika va fizika",
          subject: "Matematika",
          assignedGroups: ["KI-21", "AT-11", "MT-11"],
          status: "Faol",
        },
        {
          id: "u_tch_3",
          collegeId,
          role: "teacher",
          fullName: "Kamola Nazarova",
          login: "kamola.nazarova",
          password: "Oqtuvchi@2026",
          phone: "+998 94 555 12 90",
          department: "Ma'lumotlar bazasi",
          subject: "Ma'lumotlar bazasi",
          assignedGroups: ["KI-21", "DB-21"],
          status: "Faol",
        },
        {
          id: "u_tch_4",
          collegeId,
          role: "teacher",
          fullName: "Ulug'bek Rustamov",
          login: "ulugbek.rustamov",
          password: "Oqtuvchi@2026",
          phone: "+998 97 700 88 11",
          department: "Xorijiy tillar",
          subject: "Ingliz tili",
          assignedGroups: ["KI-21", "KI-22", "AT-12"],
          status: "Faol",
        },
        {
          id: "u_tch_5",
          collegeId,
          role: "teacher",
          fullName: "Shuhratjon Ergashev",
          login: "shuhrat.ergashev",
          password: "Oqtuvchi@2026",
          phone: "+998 99 301 44 55",
          department: "Matematika va fizika",
          subject: "Fizika",
          assignedGroups: ["KI-21", "AT-11"],
          status: "Faol",
        },
        {
          id: "u_tch_6",
          collegeId,
          role: "teacher",
          fullName: "Jamshidbek Qodirov",
          login: "jamshid.qodirov",
          password: "Oqtuvchi@2026",
          phone: "+998 95 612 30 09",
          department: "Kiberxavfsizlik",
          subject: "Tarmoq xavfsizligi",
          assignedGroups: ["AT-11", "AT-12"],
          status: "Faol",
        },
        // Students
        {
          id: "u_stu_1",
          collegeId,
          role: "student",
          fullName: "Sardorbek Alimov",
          login: "sardor.alimov",
          password: "Oquvchi@2026",
          groupCode: "KI-21",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 90 777 11 22",
          parentPhone: "+998 90 777 00 01",
          attendanceRate: 96,
          attendedLessons: 48,
          totalLessons: 50,
          rankInGroup: 2,
          groupSize: 28,
          studentIdNum: "TATK-2025-0142",
        },
        {
          id: "u_stu_2",
          collegeId,
          role: "student",
          fullName: "Madina Yusupova",
          login: "madina.yusupova",
          password: "Oquvchi@2026",
          groupCode: "KI-21",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 91 654 32 10",
          parentPhone: "+998 91 654 00 01",
          attendanceRate: 98,
          attendedLessons: 49,
          totalLessons: 50,
          rankInGroup: 1,
          groupSize: 28,
          studentIdNum: "TATK-2025-0108",
        },
        {
          id: "u_stu_3",
          collegeId,
          role: "student",
          fullName: "Jasurbek Toshmatov",
          login: "jasur.toshmatov",
          password: "Oquvchi@2026",
          groupCode: "KI-21",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 93 222 45 67",
          parentPhone: "+998 93 222 00 01",
          attendanceRate: 88,
          attendedLessons: 44,
          totalLessons: 50,
          rankInGroup: 9,
          groupSize: 28,
          studentIdNum: "TATK-2025-0165",
        },
        {
          id: "u_stu_4",
          collegeId,
          role: "student",
          fullName: "Shahnoza Abdullayeva",
          login: "shahnoza.abdullayeva",
          password: "Oquvchi@2026",
          groupCode: "KI-21",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 94 333 19 20",
          parentPhone: "+998 94 333 00 01",
          attendanceRate: 78,
          attendedLessons: 39,
          totalLessons: 50,
          rankInGroup: 14,
          groupSize: 28,
          studentIdNum: "TATK-2025-0171",
        },
        {
          id: "u_stu_5",
          collegeId,
          role: "student",
          fullName: "Azizbek Tursunov",
          login: "azizbek.tursunov",
          password: "Oquvchi@2026",
          groupCode: "DB-21",
          course: 2,
          direction: "Ma'lumotlar bazasi",
          phone: "+998 99 111 22 33",
          parentPhone: "+998 99 111 00 01",
          attendanceRate: 95,
          attendedLessons: 47,
          totalLessons: 50,
          rankInGroup: 1,
          groupSize: 26,
          studentIdNum: "TATK-2025-0204",
        },
        {
          id: "u_stu_6",
          collegeId,
          role: "student",
          fullName: "Nilufar Xolmatova",
          login: "nilufar.xolmatova",
          password: "Oquvchi@2026",
          groupCode: "AT-11",
          course: 1,
          direction: "Axborot texnologiyalari",
          phone: "+998 97 444 55 66",
          parentPhone: "+998 97 444 00 01",
          attendanceRate: 97,
          attendedLessons: 48,
          totalLessons: 50,
          rankInGroup: 1,
          groupSize: 30,
          studentIdNum: "TATK-2026-0032",
        },
        {
          id: "u_stu_7",
          collegeId,
          role: "student",
          fullName: "Boburmirzo Saidov",
          login: "bobur.saidov",
          password: "Oquvchi@2026",
          groupCode: "KI-22",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 90 888 41 12",
          parentPhone: "+998 90 888 00 01",
          attendanceRate: 92,
          attendedLessons: 46,
          totalLessons: 50,
          rankInGroup: 3,
          groupSize: 29,
          studentIdNum: "TATK-2025-0190",
        },
        {
          id: "u_stu_8",
          collegeId,
          role: "student",
          fullName: "Malika Normurodova",
          login: "malika.normurodova",
          password: "Oquvchi@2026",
          groupCode: "KI-22",
          course: 2,
          direction: "Kompyuter injiniringi",
          phone: "+998 91 520 33 11",
          parentPhone: "+998 91 520 00 01",
          attendanceRate: 94,
          attendedLessons: 47,
          totalLessons: 50,
          rankInGroup: 2,
          groupSize: 29,
          studentIdNum: "TATK-2025-0198",
        },
        {
          id: "u_stu_9",
          collegeId,
          role: "student",
          fullName: "Dostonbek Hakimov",
          login: "doston.hakimov",
          password: "Oquvchi@2026",
          groupCode: "AT-12",
          course: 1,
          direction: "Kiberxavfsizlik",
          phone: "+998 93 600 12 45",
          parentPhone: "+998 93 600 00 01",
          attendanceRate: 76,
          attendedLessons: 38,
          totalLessons: 50,
          rankInGroup: 18,
          groupSize: 27,
          studentIdNum: "TATK-2026-0089",
        },
        {
          id: "u_stu_10",
          collegeId,
          role: "student",
          fullName: "Zarina Olimova",
          login: "zarina.olimova",
          password: "Oquvchi@2026",
          groupCode: "DB-21",
          course: 2,
          direction: "Ma'lumotlar bazasi",
          phone: "+998 94 712 88 99",
          parentPhone: "+998 94 712 00 01",
          attendanceRate: 91,
          attendedLessons: 45,
          totalLessons: 50,
          rankInGroup: 4,
          groupSize: 26,
          studentIdNum: "TATK-2025-0219",
        },
        {
          id: "u_stu_11",
          collegeId,
          role: "student",
          fullName: "Shoxrux Ismoilov",
          login: "shoxrux.ismoilov",
          password: "Oquvchi@2026",
          groupCode: "MT-11",
          course: 1,
          direction: "Mobil texnologiyalar",
          phone: "+998 95 234 90 12",
          parentPhone: "+998 95 234 00 01",
          attendanceRate: 90,
          attendedLessons: 45,
          totalLessons: 50,
          rankInGroup: 5,
          groupSize: 28,
          studentIdNum: "TATK-2026-0115",
        },
        {
          id: "u_stu_12",
          collegeId,
          role: "student",
          fullName: "Sevara Xudoyberdiyeva",
          login: "sevara.xudoyberdiyeva",
          password: "Oquvchi@2026",
          groupCode: "AT-11",
          course: 1,
          direction: "Axborot texnologiyalari",
          phone: "+998 90 315 77 88",
          parentPhone: "+998 90 315 00 01",
          attendanceRate: 95,
          attendedLessons: 47,
          totalLessons: 50,
          rankInGroup: 3,
          groupSize: 30,
          studentIdNum: "TATK-2026-0041",
        },
      ],
      groups: [
        { id: "g_1", collegeId, code: "KI-21", course: 2, direction: "Kompyuter injiniringi", curatorId: "u_tch_1", weeklyAttendance: 86, monthlyAttendance: 90, studentTotal: 28 },
        { id: "g_2", collegeId, code: "KI-22", course: 2, direction: "Kompyuter injiniringi", curatorId: "u_tch_4", weeklyAttendance: 92, monthlyAttendance: 93, studentTotal: 29 },
        { id: "g_3", collegeId, code: "AT-11", course: 1, direction: "Axborot texnologiyalari", curatorId: "u_tch_2", weeklyAttendance: 95, monthlyAttendance: 94, studentTotal: 30 },
        { id: "g_4", collegeId, code: "AT-12", course: 1, direction: "Kiberxavfsizlik", curatorId: "u_tch_6", weeklyAttendance: 88, monthlyAttendance: 85, studentTotal: 27 },
        { id: "g_5", collegeId, code: "DB-21", course: 2, direction: "Ma'lumotlar bazasi", curatorId: "u_tch_3", weeklyAttendance: 94, monthlyAttendance: 95, studentTotal: 26 },
        { id: "g_6", collegeId, code: "MT-11", course: 1, direction: "Mobil texnologiyalar", curatorId: "u_tch_5", weeklyAttendance: 91, monthlyAttendance: 89, studentTotal: 28 },
      ],
      grades: [
        // Sardorbek Alimov (u_stu_1) — matches Student screenshot!
        { id: "gr_1", collegeId, studentId: "u_stu_1", subject: "Dasturlash", teacherId: "u_tch_1", scores: [5, 5, 4, 5], avg: 4.8 },
        { id: "gr_2", collegeId, studentId: "u_stu_1", subject: "Matematika", teacherId: "u_tch_2", scores: [4, 5, 4], avg: 4.3 },
        { id: "gr_3", collegeId, studentId: "u_stu_1", subject: "Ma'lumotlar bazasi", teacherId: "u_tch_3", scores: [5, 5, 5], avg: 5.0 },
        { id: "gr_4", collegeId, studentId: "u_stu_1", subject: "Ingliz tili", teacherId: "u_tch_4", scores: [4, 3, 5], avg: 4.0 },
        { id: "gr_5", collegeId, studentId: "u_stu_1", subject: "Fizika", teacherId: "u_tch_5", scores: [4, 4, 2], avg: 3.3 },
        // Madina Yusupova
        { id: "gr_6", collegeId, studentId: "u_stu_2", subject: "Dasturlash", teacherId: "u_tch_1", scores: [5, 5, 5], avg: 5.0 },
        { id: "gr_7", collegeId, studentId: "u_stu_2", subject: "Matematika", teacherId: "u_tch_2", scores: [5, 5, 5], avg: 5.0 },
        { id: "gr_8", collegeId, studentId: "u_stu_2", subject: "Ma'lumotlar bazasi", teacherId: "u_tch_3", scores: [5, 5, 4], avg: 4.7 },
        // Jasurbek Toshmatov
        { id: "gr_9", collegeId, studentId: "u_stu_3", subject: "Dasturlash", teacherId: "u_tch_1", scores: [4, 3, 4], avg: 3.7 },
        { id: "gr_10", collegeId, studentId: "u_stu_3", subject: "Matematika", teacherId: "u_tch_2", scores: [4, 4, 3], avg: 3.7 },
        // Shahnoza Abdullayeva
        { id: "gr_11", collegeId, studentId: "u_stu_4", subject: "Dasturlash", teacherId: "u_tch_1", scores: [5, 4, 2], avg: 3.7 },
        // Azizbek Tursunov
        { id: "gr_12", collegeId, studentId: "u_stu_5", subject: "Dasturlash", teacherId: "u_tch_1", scores: [5, 5, 4, 5], avg: 4.8 },
        { id: "gr_13", collegeId, studentId: "u_stu_5", subject: "Ma'lumotlar bazasi", teacherId: "u_tch_3", scores: [5, 5, 5], avg: 5.0 },
        // Nilufar Xolmatova
        { id: "gr_14", collegeId, studentId: "u_stu_6", subject: "Matematika", teacherId: "u_tch_2", scores: [5, 4, 5], avg: 4.7 },
        // Others
        { id: "gr_15", collegeId, studentId: "u_stu_7", subject: "Dasturlash", teacherId: "u_tch_1", scores: [4, 5, 4], avg: 4.3 },
        { id: "gr_16", collegeId, studentId: "u_stu_8", subject: "Dasturlash", teacherId: "u_tch_1", scores: [5, 4, 5], avg: 4.7 },
        { id: "gr_17", collegeId, studentId: "u_stu_9", subject: "Tarmoq xavfsizligi", teacherId: "u_tch_6", scores: [3, 4, 3], avg: 3.3 },
        { id: "gr_18", collegeId, studentId: "u_stu_10", subject: "Dasturlash", teacherId: "u_tch_1", scores: [4, 5, 4], avg: 4.3 },
        { id: "gr_19", collegeId, studentId: "u_stu_11", subject: "Matematika", teacherId: "u_tch_2", scores: [4, 4, 5], avg: 4.3 },
        { id: "gr_20", collegeId, studentId: "u_stu_12", subject: "Matematika", teacherId: "u_tch_2", scores: [5, 4, 4], avg: 4.3 },
      ],
      attendanceToday: {
        u_stu_1: "Keldi",
        u_stu_2: "Keldi",
        u_stu_3: "Keldi",
        u_stu_4: "Kelmadi",
        u_stu_5: "Keldi",
        u_stu_6: "Keldi",
        u_stu_7: "Keldi",
        u_stu_8: "Keldi",
        u_stu_9: "Kelmadi",
        u_stu_10: "Keldi",
        u_stu_11: "Keldi",
        u_stu_12: "Keldi",
      },
      schedule: [
        { id: "sch_1", collegeId, day: "Dushanba", time: "08:30 – 09:50", subject: "Matematika", groupCode: "KI-21", room: "204-xona", teacherId: "u_tch_2", status: "Rejada" },
        { id: "sch_2", collegeId, day: "Dushanba", time: "10:00 – 11:20", subject: "Dasturlash", groupCode: "KI-21", room: "304-xona", teacherId: "u_tch_1", status: "Rejada" },
        { id: "sch_3", collegeId, day: "Seshanba", time: "08:30 – 09:50", subject: "Dasturlash asoslari", groupCode: "KI-21", room: "304-xona", teacherId: "u_tch_1", status: "Faol" },
        { id: "sch_4", collegeId, day: "Seshanba", time: "10:00 – 11:20", subject: "Dasturlash asoslari", groupCode: "KI-22", room: "304-xona", teacherId: "u_tch_1", status: "Keyingi" },
        { id: "sch_5", collegeId, day: "Seshanba", time: "10:00 – 11:20", subject: "Ingliz tili", groupCode: "KI-21", room: "112-xona", teacherId: "u_tch_4", status: "Keyingi" },
        { id: "sch_6", collegeId, day: "Seshanba", time: "11:30 – 12:50", subject: "Ma'lumotlar bazasi", groupCode: "DB-21", room: "208-xona", teacherId: "u_tch_1", status: "Rejada" },
        { id: "sch_7", collegeId, day: "Chorshanba", time: "08:30 – 09:50", subject: "Ma'lumotlar bazasi", groupCode: "KI-21", room: "208-xona", teacherId: "u_tch_3", status: "Rejada" },
        { id: "sch_8", collegeId, day: "Chorshanba", time: "10:00 – 11:20", subject: "Fizika", groupCode: "KI-21", room: "105-xona", teacherId: "u_tch_5", status: "Rejada" },
        { id: "sch_9", collegeId, day: "Payshanba", time: "08:30 – 09:50", subject: "Matematika", groupCode: "KI-21", room: "204-xona", teacherId: "u_tch_2", status: "Rejada" },
        { id: "sch_10", collegeId, day: "Payshanba", time: "10:00 – 11:20", subject: "Ingliz tili", groupCode: "KI-21", room: "112-xona", teacherId: "u_tch_4", status: "Rejada" },
        { id: "sch_11", collegeId, day: "Juma", time: "08:30 – 09:50", subject: "Dasturlash", groupCode: "KI-21", room: "304-xona", teacherId: "u_tch_1", status: "Rejada" },
        { id: "sch_12", collegeId, day: "Juma", time: "10:00 – 11:20", subject: "Ma'lumotlar bazasi", groupCode: "KI-21", room: "208-xona", teacherId: "u_tch_3", status: "Rejada" },
        { id: "sch_13", collegeId, day: "Chorshanba", time: "11:30 – 12:50", subject: "Tarmoq xavfsizligi", groupCode: "AT-12", room: "401-xona", teacherId: "u_tch_6", status: "Rejada" },
      ],
      tasks: [
        {
          id: "t_1",
          collegeId,
          groupCode: "KI-21",
          subject: "Dasturlash",
          teacherId: "u_tch_1",
          title: "Sikl va massivlar (5 ta masala)",
          description: "5 ta amaliy masala: for/while sikllari va 1D massivlar bilan ishlash.",
          deadline: "2026-11-26",
          urgencyLabel: "Bugun tugaydi",
          urgencyType: "danger",
          submissions: [],
        },
        {
          id: "t_2",
          collegeId,
          groupCode: "KI-21",
          subject: "Matematika",
          teacherId: "u_tch_2",
          title: "Integral hisob",
          description: "12-mashq, 1–8-misollar",
          deadline: "2026-11-27",
          urgencyLabel: "Ertaga",
          urgencyType: "warning",
          submissions: [],
        },
        {
          id: "t_3",
          collegeId,
          groupCode: "KI-21",
          subject: "Ingliz tili",
          teacherId: "u_tch_4",
          title: "Esse yozish",
          description: "150 so'zli matn: 'My future IT career'",
          deadline: "2026-11-30",
          urgencyLabel: "4 kun bor",
          urgencyType: "success",
          submissions: [],
        },
        {
          id: "t_4",
          collegeId,
          groupCode: "DB-21",
          subject: "Ma'lumotlar bazasi",
          teacherId: "u_tch_1",
          title: "SQL JOIN so'rovlarini tuzish",
          description: "INNER JOIN, LEFT JOIN va GROUP BY bo'yicha 6 ta topshiriq.",
          deadline: "2026-11-29",
          urgencyLabel: "3 kun bor",
          urgencyType: "primary",
          submissions: [],
        },
      ],
      announcements: [
        {
          id: "a_1",
          collegeId,
          audience: "Barcha foydalanuvchilar",
          authorRole: "Direktorat",
          title: "Olimpiada saralash bosqichi",
          body: "Juma kuni soat 14:00 da Matematika va Dasturlash fanlaridan kollej bosqichi bo'lib o'tadi.",
          date: "24.11.2026",
          tag: "Tadbir",
        },
        {
          id: "a_2",
          collegeId,
          audience: "O'qituvchilar",
          authorRole: "Direktorat",
          title: "Pedagogik kengash yig'ilishi",
          body: "Seshanba kuni soat 15:30 da 2-qavat majlislar zalida chorak yakunlari muhokama qilinadi.",
          date: "22.11.2026",
          tag: "Muhim",
        },
        {
          id: "a_3",
          collegeId,
          audience: "O'quvchilar",
          authorRole: "Kutubxona",
          title: "Yangi darsliklar keldi",
          body: "Dasturlash va Ma'lumotlar bazasi bo'yicha yangi qo'llanmalarni kutubxonadan olishingiz mumkin.",
          date: "21.11.2026",
          tag: "Kutubxona",
        },
      ],
      library: [
        { id: "lib_1", title: "Python va Algoritmlar asoslari", author: "G. Karimova", category: "Dasturlash", pages: 240, year: 2026, format: "PDF • 4.8 MB", desc: "Sikl, massivlar, funksiyalar va OOP bo'yicha amaliy qo'llanma." },
        { id: "lib_2", title: "PostgreSQL va SQL JOIN sirlari", author: "K. Nazarova", category: "Ma'lumotlar bazasi", pages: 185, year: 2026, format: "PDF • 3.2 MB", desc: "Relyatsion ma'lumotlar bazasini loyihalash va optimallashtirish." },
        { id: "lib_3", title: "Oliy matematika: Integral va Differensial", author: "O. Mirzayev", category: "Matematika", pages: 310, year: 2025, format: "PDF • 6.1 MB", desc: "Kollej va texnikumlar uchun masalalar to'plami." },
        { id: "lib_4", title: "Technical English for IT Students", author: "U. Rustamov", category: "Xorijiy tillar", pages: 160, year: 2026, format: "PDF • 2.7 MB", desc: "IT terminologiya, esse yozish va suhbat ko'nikmalari." },
        { id: "lib_5", title: "Kompyuter tarmoqlari va Kiberxavfsizlik", author: "J. Qodirov", category: "Kiberxavfsizlik", pages: 220, year: 2026, format: "PDF • 5.4 MB", desc: "TCP/IP, Firewall va xavfsizlik auditiga kirish." },
      ],
      messages: [
        { id: "m_1", collegeId, fromId: "u_tch_1", toGroup: "KI-21", senderName: "Gulnora Karimova", text: "Bugungi Dasturlash darsi 304-xonada bo'ladi. Noutbuklaringizni tayyorlab qo'ying!", time: "08:15" },
        { id: "m_2", collegeId, fromId: "u_stu_1", toGroup: "KI-21", senderName: "Sardorbek Alimov", text: "Assalomu alaykum ustoz, sikl masalalarining 4-sini ham qo'shib yuborsak bo'ladimi?", time: "08:22" },
      ],
    };
  }

  let db = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.colleges)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Store load error:", e);
    }
    const seed = createSeedState();
    saveState(seed);
    return seed;
  }

  function saveState(state = db) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Store save error:", e);
    }
  }

  function uid(prefix = "id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  }

  function calcAvg(scores) {
    if (!scores || !scores.length) return 0;
    const sum = scores.reduce((a, b) => a + Number(b), 0);
    return Number((sum / scores.length).toFixed(1));
  }

  window.Store = {
    getState() {
      return db;
    },
    save() {
      saveState(db);
    },
    resetDemo() {
      db = createSeedState();
      saveState(db);
      return db;
    },
    setTheme(theme) {
      db.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      saveState(db);
    },
    getCurrentUser() {
      if (!db.session) return null;
      return db.users.find((u) => u.id === db.session.userId) || null;
    },
    getCurrentCollege() {
      const user = this.getCurrentUser();
      const cid = user ? user.collegeId : db.colleges[0]?.id;
      return db.colleges.find((c) => c.id === cid) || db.colleges[0];
    },
    login(login, password, role, remember) {
      const cleanLogin = login.trim().toLowerCase();
      const user = db.users.find(
        (u) => u.login.toLowerCase() === cleanLogin && u.password === password
      );
      if (!user) {
        return { ok: false, error: "Login yoki parol noto'g'ri!" };
      }
      if (role && user.role !== role) {
        const roleLabels = { director: "Direktor", teacher: "O'qituvchi", student: "O'quvchi" };
        return {
          ok: false,
          error: `Bu akkaunt "${roleLabels[user.role]}" roliga tegishli. Yuqoridan to'g'ri rolni tanlang.`,
        };
      }
      db.session = { userId: user.id, collegeId: user.collegeId };
      db.rememberLogin = remember ? user.login : "";
      saveState(db);
      return { ok: true, user };
    },
    logout() {
      db.session = null;
      saveState(db);
    },
    registerDirector(payload) {
      const cleanLogin = payload.login.trim().toLowerCase();
      if (db.users.some((u) => u.login.toLowerCase() === cleanLogin)) {
        return { ok: false, error: "Bu login band. Boshqa login tanlang." };
      }
      const collegeId = uid("col");
      const shortName = payload.collegeName
        .split(/\s+/)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 5) || "EDX";

      const newCollege = {
        id: collegeId,
        name: payload.collegeName.trim(),
        shortName,
        type: payload.collegeType || "Kollej",
        region: payload.region || "Toshkent shahri",
        stir: payload.stir || "300000000",
        academicYear: payload.academicYear || "2026-2027 o'quv yili",
        semester: "1-semestr • 1-hafta",
        gradingSystem: payload.gradingSystem || "5 ballik tizim",
        departments: payload.departments.length
          ? payload.departments
          : ["Dasturlash", "Kompyuter injiniringi"],
        baseStudentOffset: 0,
        baseTeacherOffset: 0,
        baseGroupOffset: 0,
      };
      db.colleges.push(newCollege);

      const directorUser = {
        id: uid("u_dir"),
        collegeId,
        role: "director",
        fullName: payload.fullName.trim(),
        login: cleanLogin,
        password: payload.password,
        phone: payload.phone.trim(),
        email: payload.email.trim(),
        title: "Direktor",
        isNewDirector: true,
      };
      db.users.push(directorUser);

      // Starter setup if requested
      if (payload.withStarterData) {
        const starterTeacherId = uid("u_tch");
        db.users.push({
          id: starterTeacherId,
          collegeId,
          role: "teacher",
          fullName: "Aziza Toshpo'latova",
          login: `${shortName.toLowerCase()}.teacher`,
          password: "Oqtuvchi@2026",
          phone: "+998 90 500 10 20",
          department: newCollege.departments[0],
          subject: newCollege.departments[0],
          assignedGroups: ["GURUH-101"],
          status: "Faol",
        });
        db.groups.push({
          id: uid("g"),
          collegeId,
          code: "GURUH-101",
          course: 1,
          direction: newCollege.departments[0],
          curatorId: starterTeacherId,
          weeklyAttendance: 94,
          monthlyAttendance: 92,
          studentTotal: 24,
        });
        const starterStudentId = uid("u_stu");
        db.users.push({
          id: starterStudentId,
          collegeId,
          role: "student",
          fullName: "Kamronbek Vohidov",
          login: `${shortName.toLowerCase()}.student`,
          password: "Oquvchi@2026",
          groupCode: "GURUH-101",
          course: 1,
          direction: newCollege.departments[0],
          phone: "+998 91 400 20 30",
          parentPhone: "+998 91 400 00 01",
          attendanceRate: 96,
          attendedLessons: 24,
          totalLessons: 25,
          rankInGroup: 1,
          groupSize: 24,
          studentIdNum: `${shortName}-2026-0001`,
        });
        db.grades.push({
          id: uid("gr"),
          collegeId,
          studentId: starterStudentId,
          subject: newCollege.departments[0],
          teacherId: starterTeacherId,
          scores: [5, 5, 4],
          avg: 4.7,
        });
        db.attendanceToday[starterStudentId] = "Keldi";
      }

      db.announcements.unshift({
        id: uid("a"),
        collegeId,
        audience: "Barcha foydalanuvchilar",
        authorRole: "Direktorat",
        title: `${newCollege.name} tizimga ulandi!`,
        body: `Direktor ${directorUser.fullName} tomonidan EDUNEX elektron ta'lim tizimi ishga tushirildi.`,
        date: "25.11.2026",
        tag: "Yangilik",
      });

      db.session = { userId: directorUser.id, collegeId };
      saveState(db);
      return { ok: true, user: directorUser, college: newCollege };
    },
    getUsersByRole(collegeId, role) {
      return db.users.filter((u) => u.collegeId === collegeId && u.role === role);
    },
    getGroups(collegeId) {
      return db.groups.filter((g) => g.collegeId === collegeId);
    },
    getStudentGrades(studentId) {
      return db.grades.filter((g) => g.studentId === studentId);
    },
    getStudentOverallAvg(studentId) {
      const list = this.getStudentGrades(studentId);
      if (!list.length) return 4.5;
      const sum = list.reduce((acc, g) => acc + g.avg, 0);
      return Number((sum / list.length).toFixed(1));
    },
    addQuickGrade(collegeId, studentId, subject, teacherId, score) {
      let record = db.grades.find(
        (g) => g.studentId === studentId && g.subject === subject
      );
      if (!record) {
        record = {
          id: uid("gr"),
          collegeId,
          studentId,
          subject,
          teacherId,
          scores: [],
          avg: 0,
        };
        db.grades.push(record);
      }
      record.scores.push(Number(score));
      record.avg = calcAvg(record.scores);
      saveState(db);
      return record;
    },
    removeGradeAt(gradeId, index) {
      const record = db.grades.find((g) => g.id === gradeId);
      if (!record) return;
      record.scores.splice(index, 1);
      record.avg = calcAvg(record.scores);
      saveState(db);
    },
    toggleAttendance(studentId, status) {
      const order = ["Keldi", "Kelmadi", "Sababli"];
      const current = db.attendanceToday[studentId] || "Keldi";
      const next = status || order[(order.indexOf(current) + 1) % order.length];
      db.attendanceToday[studentId] = next;
      const stu = db.users.find((u) => u.id === studentId);
      if (stu) {
        if (next === "Keldi") {
          stu.attendanceRate = Math.min(100, (stu.attendanceRate || 90) + 1);
        } else if (next === "Kelmadi") {
          stu.attendanceRate = Math.max(50, (stu.attendanceRate || 90) - 2);
        }
      }
      saveState(db);
      return next;
    },
    addGroup(collegeId, data) {
      const g = {
        id: uid("g"),
        collegeId,
        code: data.code.trim().toUpperCase(),
        course: Number(data.course) || 1,
        direction: data.direction.trim(),
        curatorId: data.curatorId || "",
        weeklyAttendance: 95,
        monthlyAttendance: 94,
        studentTotal: 0,
      };
      db.groups.push(g);
      saveState(db);
      return g;
    },
    addTeacher(collegeId, data) {
      const cleanLogin = data.login.trim().toLowerCase();
      if (db.users.some((u) => u.login.toLowerCase() === cleanLogin)) {
        return { ok: false, error: "Bunday login allaqachon mavjud." };
      }
      const t = {
        id: uid("u_tch"),
        collegeId,
        role: "teacher",
        fullName: data.fullName.trim(),
        login: cleanLogin,
        password: data.password || "Oqtuvchi@2026",
        phone: data.phone.trim(),
        department: data.department,
        subject: data.subject.trim(),
        assignedGroups: data.assignedGroups || [],
        status: "Faol",
      };
      db.users.push(t);
      saveState(db);
      return { ok: true, user: t };
    },
    addStudent(collegeId, data) {
      const cleanLogin = data.login.trim().toLowerCase();
      if (db.users.some((u) => u.login.toLowerCase() === cleanLogin)) {
        return { ok: false, error: "Bunday login allaqachon mavjud." };
      }
      const college = db.colleges.find((c) => c.id === collegeId);
      const stu = {
        id: uid("u_stu"),
        collegeId,
        role: "student",
        fullName: data.fullName.trim(),
        login: cleanLogin,
        password: data.password || "Oquvchi@2026",
        groupCode: data.groupCode,
        course: Number(data.course) || 1,
        direction: data.direction || "Kompyuter injiniringi",
        phone: data.phone.trim(),
        parentPhone: data.parentPhone?.trim() || "+998 90 000 00 00",
        attendanceRate: 100,
        attendedLessons: 10,
        totalLessons: 10,
        rankInGroup: 1,
        groupSize: 28,
        studentIdNum: `${college?.shortName || "EDX"}-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      };
      db.users.push(stu);
      db.attendanceToday[stu.id] = "Keldi";
      const grp = db.groups.find((g) => g.collegeId === collegeId && g.code === data.groupCode);
      if (grp) grp.studentTotal = (grp.studentTotal || 0) + 1;
      saveState(db);
      return { ok: true, user: stu };
    },
    addTask(collegeId, data) {
      const t = {
        id: uid("t"),
        collegeId,
        groupCode: data.groupCode,
        subject: data.subject,
        teacherId: data.teacherId,
        title: data.title.trim(),
        description: data.description?.trim() || "O'qituvchi tomonidan berilgan amaliy topshiriq",
        deadline: data.deadline,
        urgencyLabel: "Yangi",
        urgencyType: "primary",
        submissions: [],
      };
      db.tasks.unshift(t);
      saveState(db);
      return t;
    },
    submitTask(taskId, studentId, studentName, answerText) {
      const task = db.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const existing = task.submissions.find((s) => s.studentId === studentId);
      if (existing) {
        existing.answer = answerText;
        existing.submittedAt = "Hozirgina";
      } else {
        task.submissions.push({
          studentId,
          studentName,
          answer: answerText,
          submittedAt: "Hozirgina",
          grade: null,
        });
      }
      saveState(db);
    },
    addAnnouncement(collegeId, data) {
      const now = new Date();
      const dateStr = `${String(now.getDate()).padStart(2, "0")}.${String(now.getMonth() + 1).padStart(2, "0")}.${now.getFullYear()}`;
      const a = {
        id: uid("a"),
        collegeId,
        audience: data.audience,
        authorRole: data.authorRole || "Direktorat",
        title: data.title.trim(),
        body: data.body.trim(),
        date: dateStr,
        tag: data.tag || "E'lon",
      };
      db.announcements.unshift(a);
      saveState(db);
      return a;
    },
    deleteAnnouncement(id) {
      db.announcements = db.announcements.filter((a) => a.id !== id);
      saveState(db);
    },
    addScheduleSlot(collegeId, data) {
      const slot = {
        id: uid("sch"),
        collegeId,
        day: data.day,
        time: data.time,
        subject: data.subject.trim(),
        groupCode: data.groupCode,
        room: data.room.trim(),
        teacherId: data.teacherId,
        status: "Rejada",
      };
      db.schedule.push(slot);
      saveState(db);
      return slot;
    },
    addMessage(collegeId, fromId, toGroup, senderName, text) {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      db.messages.push({
        id: uid("m"),
        collegeId,
        fromId,
        toGroup,
        senderName,
        text: text.trim(),
        time,
      });
      saveState(db);
    },
  };
})();
