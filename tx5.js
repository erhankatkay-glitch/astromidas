/* Yorum metinleri 5: asteroitler, sabit yıldızlar, Vedik, gezegen saatleri */
Object.assign(TX.P, {
  Chiron: { n: 'Kiron', g: '⚷', k: 'yara, şifa, öğretmenlik', f: 'Kiron, derinden hissedilen bir yarayı ve o yaradan doğan şifa yeteneğini gösterir. Bulunduğu alanda kendinizi eksik hissedebilirsiniz; ama başkalarına en çok burada yardım edersiniz.' },
  Ceres: { n: 'Ceres', g: '⚳', k: 'besleme, bakım, kayıp ve geri dönüş', f: 'Ceres, nasıl beslendiğinizi ve nasıl beslediğinizi, bakım verme biçiminizi ve kayıp-yeniden kavuşma döngülerini anlatır.' },
  Pallas: { n: 'Pallas', g: '⚴', k: 'strateji, bilgelik, örüntü görme', f: 'Pallas Athena, stratejik zekâyı, örüntüleri görme yeteneğini ve yaratıcı problem çözmeyi temsil eder.' },
  Juno: { n: 'Juno', g: '⚵', k: 'evlilik, bağlılık, eşitlik', f: 'Juno, uzun süreli bağlılıkta aradığınız şeyi, evlilik beklentilerinizi ve ilişkide eşitlik ihtiyacını gösterir.' },
  Vesta: { n: 'Vesta', g: '⚶', k: 'adanmışlık, odak, kutsal ateş', f: 'Vesta, kendinizi tamamen adadığınız alanı, odaklanma gücünüzü ve içsel kutsal ateşi gösterir.' },
  Pholus: { n: 'Pholus', g: '⯛', k: 'küçük nedenden büyük sonuç', f: 'Pholus, küçük bir tetikleyicinin büyük bir zincirleme etki başlattığı alanları gösterir.' }
});
// Geleneksel (Batlamyus) doğaları ve yorum özeti — özgün ifadelerle
TX.STAR = {
  Alpheratz: ['Jüpiter/Venüs', 'bağımsızlık, hareket, sosyal kabul ve onur'], Algenib: ['Mars/Merkür', 'keskin zihin, kararlılık, söz gücü'], Mirach: ['Venüs', 'güzellik, sanat, sevgiyle kabul görmek'], Hamal: ['Mars/Satürn', 'inat, girişkenlik, kontrol edilmesi gereken öfke'], Menkar: ['Satürn', 'kolektif kaderle karşılaşma, hastalık ve kayıp temaları'],
  Algol: ['Satürn/Jüpiter', 'yoğun tutku ve öfke, krizler; bastırılan gücü yapıcı biçimde kullanmak'], Alcyone: ['Ay/Mars', 'vizyon, içgörü, keder ve sezgi; Ülker’in en parlak yıldızı'], Aldebaran: ['Mars', 'dürüstlük, cesaret, onur ve başarı; doğruluktan sapmamak şartıyla'], Rigel: ['Jüpiter/Satürn', 'eğitim, teknik beceri, kalıcı başarı'], Capella: ['Mars/Merkür', 'merak, öğrenme, özgürlük ve onur'], Bellatrix: ['Mars/Merkür', 'hızlı başarı, savaşçı ruh, ani kayıplara dikkat'], Elnath: ['Mars', 'tarafsızlık, şans, mücadele'], Alnilam: ['Jüpiter/Satürn', 'kısa süreli şöhret, kamusal görünürlük'], Mintaka: ['Satürn/Merkür', 'şans, uyum, iyi talih'], Alnitak: ['Jüpiter/Satürn', 'ayrım gücü, sabır'],
  Betelgeuse: ['Mars/Merkür', 'başarı, şans, kalıcı onur'], Polaris: ['Satürn/Venüs', 'yön bulma, rehberlik, odak'], Sirius: ['Jüpiter/Mars', 'parlaklık, şöhret, sadakat ve koruyuculuk'], Canopus: ['Satürn/Jüpiter', 'yolculuk, rehberlik, eğitim'], Castor: ['Merkür', 'zekâ, yazı, ani kazanç ve kayıplar'], Pollux: ['Mars', 'cesaret, rekabet, keskin dil'], Procyon: ['Merkür/Mars', 'ani yükseliş ve düşüş, hareketlilik'], Acubens: ['Satürn/Merkür', 'saklanma, korunma ihtiyacı'], Alphard: ['Satürn/Venüs', 'tutku, duygusal yoğunluk, sanatsal derinlik'],
  Regulus: ['Mars/Jüpiter', 'liderlik, krallık, büyük başarı; intikamdan kaçınma şartıyla'], Zosma: ['Satürn/Venüs', 'mağduriyet temaları, başkalarının yükünü taşıma'], Denebola: ['Satürn/Venüs', 'toplumdan farklı düşünme, sıra dışı yol'], Vindemiatrix: ['Satürn/Merkür', 'hasat, işi zamanında yapmak, kayıp korkusu'], Algorab: ['Mars/Satürn', 'gizli düşmanlar, yıkıcılık; dürüst kalmak'], Spica: ['Venüs/Mars', 'yetenek, koruma, armağan; en hayırlı yıldızlardan'], Arcturus: ['Jüpiter/Mars', 'yeni yollar açmak, öncülük, refah'],
  Zubenelgenubi: ['Satürn/Mars', 'adalet, sosyal reform, bedel ödemek'], Unukalhai: ['Satürn/Mars', 'zorluklar, mücadele, dayanıklılık'], Agena: ['Venüs/Jüpiter', 'saygınlık, ahlak, arkadaşlık'], Toliman: ['Venüs/Jüpiter', 'dostluk, nezaket, saygınlık'], 'Rigil Kentaurus': ['Venüs/Jüpiter', 'dostluk, nezaket, saygınlık'], Alphecca: ['Venüs/Merkür', 'sanat, sevgi, onur'], Acrux: ['Jüpiter', 'maneviyat, tören, adalet'], Antares: ['Mars/Jüpiter', 'tutku, cesaret, savaşçı ruh; aşırılıklardan kaçınmak'],
  Rasalhague: ['Satürn/Venüs', 'şifa, bilgelik, uzmanlık'], 'Ras Algethi': ['Mars/Venüs', 'güç, karizma'], Lesath: ['Merkür/Mars', 'tehlike, aciliyet, hızlı tepki'], Aculeus: ['Mars/Ay', 'görme, sezgi'], Acumen: ['Mars/Ay', 'görme, sezgi'], Sabik: ['Satürn/Venüs', 'dürüstlük, doğruluk'], Nunki: ['Jüpiter/Merkür', 'doğruluk, iyimserlik, yolculuk'], 'Kaus Australis': ['Jüpiter/Mars', 'hedef, kararlılık'], Facies: ['Güneş/Mars', 'odak, keskin bakış'], Vega: ['Venüs/Merkür', 'sanat, müzik, karizma'],
  'Deneb Algedi': ['Satürn/Jüpiter', 'hukuk, adalet, bilgelik ve kayıp'], Altair: ['Mars/Jüpiter', 'cesaret, kararlılık, ani yükseliş'], Sadalsuud: ['Satürn/Merkür', 'şans, iyi haber'], Sadalmelik: ['Satürn/Merkür', 'şans, kazanç'], Fomalhaut: ['Venüs/Merkür', 'ideal, şöhret, büyülü yetenek; saflık şartıyla'], Deneb: ['Venüs/Merkür', 'idealizm, sanat'], 'Deneb Adige': ['Venüs/Merkür', 'idealizm, sanat'], Achernar: ['Jüpiter', 'başarı, mevki, din'], Markab: ['Mars/Merkür', 'onur, zenginlik, kesici sözler'], Scheat: ['Mars/Merkür', 'bağımsız düşünce, zorluklara karşı direnç'], Thuban: ['Satürn/Venüs', 'koruma, gizli hazineler']
};
TX.NAKTXT = ['Hız, şifa ve yeni başlangıçlar (Aşvinler)', 'Taşımak, dönüştürmek, yaşam-ölüm döngüsü (Yama)', 'Keskinlik, arınma, ateş (Agni)', 'Bereket, büyüme, çekicilik (Brahma)', 'Arayış, merak, nazik keşif (Soma)', 'Fırtına, dönüşüm, zihinsel güç (Rudra)', 'Geri dönüş, yenilenme, iyimserlik (Aditi)', 'Besleme, koruma, manevi gelişim (Brihaspati)', 'Sarmalayan güç, sezgi, hipnotizma (Nagalar)', 'Atalar, soy, onur ve taht (Pitrular)', 'Keyif, yaratıcılık, dinlenme (Bhaga)', 'Sözleşme, dostluk, cömertlik (Aryaman)', 'El becerisi, zanaat, ustalık (Savitar)', 'Parlaklık, tasarım, mimari (Vişvakarma)', 'Bağımsızlık, esneklik, ticaret (Vayu)', 'Hedefe kilitlenmek, kararlılık (İndra-Agni)', 'Dostluk, bağlılık, iş birliği (Mitra)', 'Kıdem, koruma, güç (İndra)', 'Kök, öz, köklü arayış (Nirriti)', 'Yenilmezlik, arınma, inanç (Apas)', 'Nihai zafer, dürüstlük (Vişvadevalar)', 'Dinlemek, öğrenmek, bilgelik (Vişnu)', 'Zenginlik, ritim, müzik (Vasular)', 'Şifa, gizem, yüz şifacı (Varuna)', 'Yoğun dönüşüm, tutkulu idealizm (Aja Ekapada)', 'Derinlik, sabır, bilgelik (Ahir Budhnya)', 'Yolculuk, koruma, tamamlanma (Puşan)'];
TX.DASHATXT = {
  Ketu: 'Ketu dönemi: içe dönüş, kopuş, maneviyat ve beklenmedik değişimler.',
  Venus: 'Venüs dönemi: ilişkiler, konfor, sanat, maddi kazanç ve keyif.',
  Sun: 'Güneş dönemi: otorite, görünürlük, baba ve devletle ilgili konular, öz-güven.',
  Moon: 'Ay dönemi: duygular, aile, anne, ev ve halkla ilişkiler.',
  Mars: 'Mars dönemi: enerji, mücadele, mülk, kardeşler ve cesaret.',
  Rahu: 'Rahu dönemi: hırs, yabancı ve sıra dışı olanla karşılaşma, ani yükseliş ve kafa karışıklığı.',
  Jupiter: 'Jüpiter dönemi: büyüme, bilgelik, çocuklar, eğitim ve şans.',
  Saturn: 'Satürn dönemi: sorumluluk, emek, sabır, gecikme ve kalıcı yapı kurma.',
  Mercury: 'Merkür dönemi: eğitim, ticaret, iletişim, yazı ve zekâ.'
};
TX.HOURTXT = {
  Sun: 'Otorite, görünürlük, yöneticilerle görüşme ve önemli başlangıçlar için uygun.',
  Moon: 'Ev işleri, aile, halkla ilişkiler, seyahat ve duygusal konular için uygun.',
  Mars: 'Cesaret gerektiren işler, spor, cerrahi, rekabet için; tartışmaya açık bir saat.',
  Mercury: 'Yazışma, sözleşme, öğrenme, ticaret ve kısa yolculuklar için uygun.',
  Jupiter: 'Hukuk, eğitim, finans, dua ve büyüme hedefli işler için en hayırlı saatlerden.',
  Venus: 'Aşk, sanat, güzellik, alışveriş ve uzlaşma için uygun.',
  Saturn: 'Disiplin, uzun vadeli planlama, toprak ve emlak işleri için; yeni başlangıç için ağır bir saat.'
};
TX.PLANETTR = { Sun: 'Güneş', Moon: 'Ay', Mercury: 'Merkür', Venus: 'Venüs', Mars: 'Mars', Jupiter: 'Jüpiter', Saturn: 'Satürn', Rahu: 'Rahu', Ketu: 'Ketu' };
