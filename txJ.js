/* Kişisel gökyüzü, Ay ritüelleri (Yeni Ay / Dolunay / tutulma), 21 günlük manifest serisi ve ruh hali metinleri. Özgün metinler. */
var TX = (typeof TX !== 'undefined') ? TX : {};
TX.KISI = {
  // Transit Ay'ın natal evdeki günü
  MOONH: [
    'Ay bugün 1. evinden geçiyor: duyguların yüzünde, enerjin sende. Kendine zaman ayırmak ve kendi ihtiyacını öne koymak için doğru gün.',
    'Ay 2. evinde: güven ve değer duygusu öne çıkıyor. Para, beden konforu ve sahip olduklarınla ilgili kararlar duygusal bir ton taşıyabilir.',
    'Ay 3. evinde: zihnin hareketli, iletişimin canlı. Mesajlar, kısa yollar, kardeşler ve komşular günün gündeminde.',
    'Ay 4. evinde: içe dönüş ve yuva günü. Evinde, ailende ya da kendi köklerinde huzur arıyorsun.',
    'Ay 5. evinde: kalbin oyun istiyor. Yaratıcılık, aşk, çocuklar ve keyif veren uğraşlar ruhunu besliyor.',
    'Ay 6. evinde: günlük düzen ve beden bakımı öncelikte. Küçük işleri toparlamak ve sağlıklı bir rutine dönmek sana iyi gelir.',
    'Ay 7. evinde: ilişkiler merkezde. Partnerin, yakın dostun ya da iş ortağınla duygusal bir yakınlık ya da yüzleşme mümkün.',
    'Ay 8. evinde: duygular derin ve yoğun. Mahremiyet, ortak kaynaklar ve içsel dönüşüm gündemde; yüzeysel olan seni doyurmaz.',
    'Ay 9. evinde: ufkunu genişletme isteği. Öğrenmek, inançlarını düşünmek ya da uzaklara dair plan yapmak sana iyi gelir.',
    'Ay 10. evinde: görünürlük ve sorumluluk. İş hayatında ya da toplum önünde duygularının fark edilmesi mümkün; özenli ol.',
    'Ay 11. evinde: dostluklar ve gelecek hayalleri. Bir grup, topluluk ya da arkadaş sohbeti moralini yükseltir.',
    'Ay 12. evinde: dinlenme ve iç sessizlik zamanı. Enerjin düşük olabilir; rüyalar, sezgiler ve yalnız kalmak şifa verir.'
  ],
  MANI: [
    'Kendimi önceliklendiriyorum; ihtiyaçlarım önemli.', 'Değerimi biliyorum; güvende ve yeterliyim.', 'Sözlerim berrak ve şefkatli.', 'Kalbim evimdir; içimde huzur var.',
    'Neşeye ve yaratıcılığa izin veriyorum.', 'Bedenime ve günüme özenle bakıyorum.', 'İlişkilerimde hem kendime hem sevdiğime yer açıyorum.', 'Bırakmam gerekeni bırakıyor, dönüşüyorum.',
    'Yeni ufuklara ve anlamlara açığım.', 'Emeğim görülüyor; yolumda sağlam adımlarla ilerliyorum.', 'Beni destekleyen insanlarla çevriliyim.', 'Sessizlikte rehberliğimi buluyorum.'
  ]
};
TX.AYRIT = {
  // Yeni Ay ritüelleri (Ay'ın burcuna göre): [başlık, odak, adımlar]
  NM: [
    ['Cesaret tohumu', 'yeni başlangıçlar, cesaret, kendin için adım', 'Bir kâğıda “Bu ay cesaretle başlatıyorum:” diye yaz ve tek bir hedef ekle. Ayakta, göğsünü açarak üç kez yüksek sesle oku. Hedef için bu hafta atacağın ilk adımı takvimine koy.'],
    ['Bereket kavanozu', 'para, değer, beden ve güven', 'Küçük bir kavanoza bir avuç pirinç, bir bozuk para ve kendine yazdığın bir değer notu koy. Kapağı kapatırken “Hak ettiğim bolluğa açığım” de. Kavanozu mutfakta görebileceğin bir yere yerleştir.'],
    ['Niyet mektubu', 'öğrenme, iletişim, yeni fikirler', 'Kendine bir mektup yaz: bu ay öğrenmek ve söylemek istediklerini sırala. Mektubu bir zarfa koy, üzerine bir sonraki Yeni Ay’ın tarihini yaz ve o güne kadar açma.'],
    ['Yuva kutsaması', 'ev, aile, duygusal güven', 'Evinin girişinde bir mum yak, odaları dolaşarak her birine bir dilek bırak. Son olarak bir bardak su iç ve “Kalbim ve evim güvenli bir liman” de.'],
    ['Işık niyeti', 'yaratıcılık, aşk, kendini ifade', 'Aynanın karşısında bir mum yak. Kendine gözlerinin içine bakarak üç takdir cümlesi söyle. Bu ay yaratmak istediğin bir şeyi yaz ve kâğıdı aynanın kenarına iliştir.'],
    ['Arınma ve düzen', 'sağlık, rutin, iş düzeni', 'Bir çekmeceyi ya da masanı temizle; sonra bu ay başlatacağın tek bir sağlıklı alışkanlığı yaz. Otuz gün takip edebileceğin küçük bir çizelge hazırla.'],
    ['Uyum dileği', 'ilişkiler, denge, güzellik', 'Masana iki mum koy: biri sen, biri sevdiklerin için. Aralarına bir çiçek yerleştir. İlişkilerinde görmek istediğin üç niteliği yaz ve “Önce kendimle uyumdayım” cümlesiyle bitir.'],
    ['Dönüşüm tohumu', 'derin değişim, bırakma, güç', 'Bir kâğıdın bir yüzüne bırakmak istediğin bir kalıbı, arka yüzüne onun yerine koyacağın yeni hâli yaz. Kalıbı karalayıp yeni hâli yüksek sesle oku; kâğıdı bir bitki saksısının dibine göm.'],
    ['Ufuk haritası', 'eğitim, yolculuk, anlam, inanç', 'Bir harita ya da boş bir sayfaya bu yıl gitmek, öğrenmek ya da deneyimlemek istediğin üç yeri/şeyi çiz. Her birinin yanına ilk küçük adımı yaz.'],
    ['Temel taşı', 'kariyer, hedef, sorumluluk', 'Düz bir taş bul ya da bir kâğıda taş çiz; üzerine bu ayın kariyer hedefini tek kelimeyle yaz. Hedefi üç somut adıma böl ve ilk adımın tarihini belirle.'],
    ['Gelecek mektubu', 'dostluk, topluluk, hayaller', 'Bir yıl sonraki kendine, hayallerinin gerçekleştiği bir günü anlatan kısa bir mektup yaz. Destek isteyebileceğin iki kişinin adını ekle.'],
    ['Rüya tohumu', 'sezgi, maneviyat, şifa', 'Yatmadan önce bir kâğıda niyetini yaz ve yastığının altına koy. Uyurken bir rüya rehberliği iste; sabah ilk hatırladığın imgeyi not et.']
  ],
  // Dolunay ritüelleri (Ay'ın burcuna göre)
  FM: [
    ['Öfkeyi dönüştürme', 'sabırsızlık, öfke, aceleci tepkiler', 'Seni öfkelendiren şeyleri hızlıca bir kâğıda yaz. On dakika tempolu yürü ya da dans et; döndüğünde kâğıdı yırt ve “Enerjimi yaratmak için kullanıyorum” de.'],
    ['Şükran sofrası', 'sahiplenme, bolluk, beden', 'Basit ama özenli bir yemek hazırla. Yemekten önce hayatındaki on bolluğu tek tek say. Artık ihtiyacın olmayan bir eşyayı ihtiyacı olana vermek üzere ayır.'],
    ['Zihin boşaltma', 'kafa karışıklığı, dedikodu, yarım işler', 'Zamanlayıcıyı beş dakikaya kur ve aklından geçen her şeyi durmadan yaz. Sonra listeden üç yarım işi seç; birini bu hafta bitirmeye söz ver.'],
    ['Duygu banyosu', 'eski duygular, aile kalıpları', 'Ilık suya bir avuç tuz ekle (banyo ya da ayak banyosu). Gözlerini kapatıp taşıdığın eski bir kırgınlığın suya karıştığını hayal et. Kurulanırken “Kendime şefkat gösteriyorum” de.'],
    ['Kalp kutlaması', 'gurur, ilgi beklentisi, yaratıcı tıkanıklık', 'En sevdiğin şarkıyı aç ve tek başına dans et. Ardından son altı ayda başardığın beş şeyi yaz ve kendine yüksek sesle oku.'],
    ['Mükemmeliyetçiliği bırakma', 'kaygı, eleştiri, aşırı kontrol', 'Kendine dair eleştirel bir cümleyi yaz, altına onu bir dostuna söyleyeceğin şefkatli versiyonunu ekle. Eleştirel cümleyi karala.'],
    ['Denge terazisi', 'ilişkide dengesizlik, kendinden vazgeçme', 'İki sütun aç: “Verdiklerim” ve “Aldıklarım”. Dürüstçe doldur. Dengeyi kurmak için söylemen gereken cümleyi yaz ve bu hafta söyle.'],
    ['Gölge bırakışı', 'kıskançlık, kontrol, eski yaralar', 'Karanlık bir odada bir mum yak. Bırakmak istediğin duyguyu fısılda ve mumu üfleyerek söndür. Işıkları açınca bir bardak su içerek yeniden başla.'],
    ['İnanç temizliği', 'sınırlayıcı inançlar, abartı', 'Seni sınırlayan üç inancı yaz (“Ben … yapamam”). Her birini yeni bir cümleyle değiştir (“Ben … öğreniyorum”). Yenileri yüksek sesle oku.'],
    ['Yük bırakma', 'aşırı sorumluluk, işkoliklik', 'Taşıdığın sorumlulukları liste hâlinde yaz. Sana ait olmayanların üzerini çiz. Kendine bu hafta için bir dinlenme saati ayır ve takvime koy.'],
    ['Bağ temizliği', 'tükenmiş dostluklar, kopukluk', 'Enerjini besleyen ve tüketen ilişkileri iki listeye ayır. Besleyen listesinden birine teşekkür mesajı gönder; tüketenler için sınır cümleni hazırla.'],
    ['Şifa suyu', 'kaçış, yorgunluk, sınırsızlık', 'Bir kâseye su koy, Dolunay ışığına (ya da pencere önüne) bırak. Suya bakarak bırakmak istediğini düşün; sonra suyu bir bitkiye dök.']
  ],
  ECL: {
    solar: 'Güneş tutulması: güçlü bir Yeni Ay. Kader kapıları aralanır; ama tutulma günü büyük niyetler yerine gözlem ve sessizlik önerilir. Niyetini tutulmadan birkaç gün sonra yaz.',
    lunar: 'Ay tutulması: güçlü bir Dolunay. Ani farkındalıklar ve kapanışlar yaşanabilir. Tutulma saatinde dinlen, önemli kararları birkaç gün ertele, bırakma ritüelini tutulmadan sonra yap.'
  }
};
TX.SERI = [
  // 1. hafta: Bırakmak ve alan açmak
  { t: 'Başlangıç', g: 'Bu 21 günde hayatına davet etmek istediğin tek bir niyeti yaz. Kısa, olumlu ve şimdiki zamanda olsun.', a: 'Kendime yeni bir sayfa açıyorum.' },
  { t: 'Fark etmek', g: 'Niyetinin önündeki üç engeli yaz. Yargılamadan sadece fark et.', a: 'Gördüğüm şeyi dönüştürebilirim.' },
  { t: 'Bırakmak', g: 'Artık sana hizmet etmeyen bir düşünceyi yaz ve üzerini çiz.', a: 'Bana ağır geleni sevgiyle bırakıyorum.' },
  { t: 'Affetmek', g: 'Kendini ya da birini affetmek istediğin bir durumu yaz. Sadece “Seni affetmeye hazırlanıyorum” demen yeterli.', a: 'Affettikçe hafifliyorum.' },
  { t: 'Alan açmak', g: 'Evinde ya da telefonunda küçük bir alanı temizle; yeni gelecek olana yer aç.', a: 'Hayatımda yeniye yer var.' },
  { t: 'Beden', g: 'Bedeninin niyetini nasıl hissettiğini fark et. Beş dakika yürü ya da esne.', a: 'Bedenim niyetimin evidir.' },
  { t: 'Haftalık bakış', g: 'İlk haftanı değerlendir: ne değişti, ne zorladı? Üç cümle yaz.', a: 'Her adımım değerli.' },
  // 2. hafta: Niyeti güçlendirmek
  { t: 'Netlik', g: 'Niyetini daha net yaz: gerçekleştiğinde ne göreceksin, ne hissedeceksin?', a: 'Ne istediğimi açıkça biliyorum.' },
  { t: 'Görselleştirme', g: 'Gözlerini kapat ve niyetinin gerçekleştiği bir günü üç dakika boyunca ayrıntılarıyla hayal et.', a: 'Hayal ettiğim gerçekliğe adım adım yaklaşıyorum.' },
  { t: 'Söz', g: 'Niyetini tek bir güçlü cümleye dönüştür ve telefonunun ekranına yaz.', a: 'Sözlerim yolumu çiziyor.' },
  { t: 'Şükran', g: 'Niyetin gerçekleşmiş gibi, şimdiden şükrettiğin üç şeyi yaz.', a: 'Şükran bolluğun kapısını açıyor.' },
  { t: 'Destek', g: 'Niyetini destekleyebilecek bir kişiyi düşün; ona bir mesaj gönder ya da sohbet et.', a: 'Desteği kabul etmeye açığım.' },
  { t: 'Sezgi', g: 'Bugün aldığın küçük sezgisel işaretleri (bir söz, bir şarkı, bir tesadüf) not et.', a: 'Evren benimle konuşuyor; dinliyorum.' },
  { t: 'Haftalık bakış', g: 'İkinci haftayı değerlendir: niyetin sana nasıl daha yakın hissettiriyor?', a: 'Niyetim içimde kök saldı.' },
  // 3. hafta: Eyleme ve almaya geçmek
  { t: 'İlk somut adım', g: 'Niyetin için bugün yapabileceğin en küçük somut adımı at.', a: 'Harekete geçtiğimde yol açılıyor.' },
  { t: 'Cesaret', g: 'Ertelediğin, seni biraz korkutan bir adımı seç ve yarısını da olsa yap.', a: 'Korkuma rağmen yürüyorum.' },
  { t: 'Almaya açılmak', g: 'Bugün sana sunulan bir iyiliği, iltifatı ya da yardımı geri çevirmeden kabul et.', a: 'Almayı da hak ediyorum.' },
  { t: 'Cömertlik', g: 'Karşılık beklemeden birine küçük bir iyilik yap.', a: 'Verdikçe bolluk akıyor.' },
  { t: 'Sabır', g: 'Henüz gerçekleşmemiş olanla barış; zamanlamaya güvendiğini yaz.', a: 'Her şey doğru zamanda geliyor.' },
  { t: 'Kutlama', g: 'Bu 21 günde değişen her şeyi, en küçüğünü bile listele ve kendini kutla.', a: 'Kendimle gurur duyuyorum.' },
  { t: 'Mühür', g: 'Niyetini son kez oku, yeni bir niyet için ilham notu yaz ve bu döngüyü teşekkürle kapat.', a: 'Döngüyü şükranla tamamlıyorum; yeni başlangıçlara hazırım.' }
];
TX.MOODS = [['mutlu', '😊', 'Mutlu'], ['huzurlu', '😌', 'Huzurlu'], ['umutlu', '🌱', 'Umutlu'], ['enerjik', '⚡', 'Enerjik'], ['duygusal', '🌊', 'Duygusal'], ['huzursuz', '🌀', 'Huzursuz'], ['kaygili', '😟', 'Kaygılı'], ['yorgun', '😴', 'Yorgun'], ['uzgun', '😢', 'Üzgün'], ['ofkeli', '😤', 'Öfkeli']];
